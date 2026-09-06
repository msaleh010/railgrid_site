# Copyright (c) 2026, RailGrid Technologies Limited
"""Shared handling for website submissions: notify the team, acknowledge the sender,
and push the enquiry into the ERPNext CRM as a Lead.

Everything here is best-effort: a failure to send email or create a Lead is logged
(Error Log) but never stops the submission itself from being saved."""

import frappe
from frappe import _
from frappe.utils import cstr, escape_html, get_url_to_form, validate_email_address

SETTINGS = "RailGrid Website Settings"


def get_settings():
	return frappe.get_cached_doc(SETTINGS)


def split_emails(text):
	out = []
	for line in cstr(text).replace(",", "\n").replace(";", "\n").splitlines():
		line = line.strip()
		if line and validate_email_address(line):
			out.append(line)
	return out


def process_submission(doc, kind):
	"""Called from after_insert of both website doctypes.
	`kind` is "enquiry" or "registration"."""
	settings = get_settings()

	_safe(create_or_update_lead, doc, kind, settings)
	_safe(notify_team, doc, kind, settings)
	_safe(acknowledge_sender, doc, kind, settings)


def _safe(fn, *args):
	try:
		fn(*args)
	except Exception:
		frappe.log_error(title=f"RailGrid website: {fn.__name__} failed")


# --------------------------------------------------------------------------- email


def _rows(doc, fields):
	rows = []
	for fieldname, label in fields:
		value = doc.get(fieldname)
		if value in (None, "", 0):
			continue
		if isinstance(value, int) and doc.meta.get_field(fieldname).fieldtype == "Check":
			value = "Yes"
		value = escape_html(cstr(value)).replace("\n", "<br>")
		rows.append(
			f'<tr><td style="padding:6px 12px 6px 0;color:#555;vertical-align:top;white-space:nowrap">{escape_html(label)}</td>'
			f'<td style="padding:6px 0;vertical-align:top">{value}</td></tr>'
		)
	return "".join(rows)


ENQUIRY_FIELDS = [
	("full_name", "Name"),
	("email", "Email"),
	("company", "Company"),
	("phone", "Phone"),
	("topic", "They would like to"),
	("message", "Message"),
]

REGISTRATION_FIELDS = [
	("organisation", "Organisation"),
	("sector", "Sector"),
	("country", "Country"),
	("employees", "Employees"),
	("contact_name", "Contact"),
	("job_title", "Job title"),
	("email", "Email"),
	("phone", "Phone"),
	("audiences", "Audiences"),
	("tracks", "Tracks"),
	("format", "Format"),
	("participants", "Participants"),
	("timing", "Timing"),
	("source", "Heard about us via"),
	("goal", "Goal"),
	("consent", "Consent"),
]


def _describe(doc, kind):
	if kind == "registration":
		who = doc.contact_name
		org = doc.organisation
		subject = f"Capacity-building registration: {org} ({who})"
		fields = REGISTRATION_FIELDS
		headline = "New capacity-building registration from railgrid.co.tz"
	else:
		who = doc.full_name
		org = doc.company
		subject = f"Website enquiry: {who}" + (f" – {org}" if org else "") + (f" · {doc.topic}" if doc.topic else "")
		fields = ENQUIRY_FIELDS
		headline = "New enquiry from railgrid.co.tz"
	return who, org, subject, fields, headline


def notify_team(doc, kind, settings):
	recipients = split_emails(settings.notification_recipients)
	if not recipients:
		frappe.log_error(title="RailGrid website: no notification recipients configured")
		return
	cc = split_emails(settings.cc_recipients)
	who, org, subject, fields, headline = _describe(doc, kind)

	link = get_url_to_form(doc.doctype, doc.name)
	lead_link = ""
	if doc.get("lead"):
		lead_link = f'<p style="margin:12px 0 0"><a href="{get_url_to_form("Lead", doc.lead)}">Open the CRM Lead {escape_html(doc.lead)}</a></p>'

	message = f"""
<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#1a1a1a">
  <h2 style="margin:0 0 4px;font-size:18px;color:#012256">{escape_html(headline)}</h2>
  <p style="margin:0 0 16px;color:#555">Reference {escape_html(doc.name)} · received {frappe.utils.format_datetime(doc.creation)}</p>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">{_rows(doc, fields)}</table>
  <p style="margin:20px 0 0"><a href="{link}" style="background:#012256;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Open {escape_html(doc.name)}</a></p>
  {lead_link}
  <p style="margin:20px 0 0;color:#777;font-size:13px">Reply to this email to answer {escape_html(who)} directly.</p>
</div>"""

	frappe.sendmail(
		recipients=recipients,
		cc=cc or None,
		subject=subject,
		message=message,
		reply_to=doc.email,
		reference_doctype=doc.doctype,
		reference_name=doc.name,
		delayed=True,
		retry=3,
	)
	doc.db_set("notification_sent", 1, update_modified=False)


def acknowledge_sender(doc, kind, settings):
	if not settings.send_acknowledgement or not doc.email:
		return
	if not validate_email_address(doc.email):
		return
	who, org, subject, fields, headline = _describe(doc, kind)
	context = {
		"name": who,
		"email": doc.email,
		"company": org or "",
		"topic": doc.get("topic") or doc.get("format") or "",
		"doc": doc,
	}
	body = frappe.render_template(settings.acknowledgement_message or "", context)
	frappe.sendmail(
		recipients=[doc.email],
		subject=settings.acknowledgement_subject or _("Thank you for contacting RailGrid Technologies"),
		message=body,
		reply_to=(split_emails(settings.notification_recipients) or [None])[0],
		reference_doctype=doc.doctype,
		reference_name=doc.name,
		delayed=True,
		retry=3,
	)
	doc.db_set("acknowledgement_sent", 1, update_modified=False)


# --------------------------------------------------------------------------- CRM


def _split_name(full_name):
	parts = cstr(full_name).strip().split()
	if not parts:
		return "", ""
	return parts[0], " ".join(parts[1:])


def _ensure_lead_source(name="Website"):
	if not frappe.db.exists("Lead Source", name):
		frappe.get_doc({"doctype": "Lead Source", "source_name": name}).insert(ignore_permissions=True)
	return name


def create_or_update_lead(doc, kind, settings):
	if not settings.create_leads or "erpnext" not in frappe.get_installed_apps():
		return
	if not frappe.db.exists("DocType", "Lead"):
		return

	who, org, subject, fields, headline = _describe(doc, kind)
	email = cstr(doc.email).strip().lower()
	note_html = f"<p><b>{escape_html(headline)}</b> – {escape_html(doc.name)}</p><table>{_rows(doc, fields)}</table>"

	existing = frappe.db.get_value("Lead", {"email_id": email}, "name") if email else None
	if existing:
		lead = frappe.get_doc("Lead", existing)
		_add_note(lead, note_html)
		lead.flags.ignore_permissions = True
		lead.save()
	else:
		first, last = _split_name(who)
		lead = frappe.new_doc("Lead")
		lead.update(
			{
				"first_name": first or who,
				"last_name": last,
				"company_name": org,
				"email_id": email,
				"phone": doc.get("phone"),
				"mobile_no": doc.get("phone"),
				"job_title": doc.get("job_title"),
				"source": _ensure_lead_source(),
				"status": "Lead",
				"request_type": "Product Enquiry" if kind == "enquiry" else "Request for Information",
				"lead_owner": settings.lead_owner or None,
				"website": "railgrid.co.tz",
			}
		)
		country = doc.get("country")
		if country and frappe.db.exists("Country", country):
			lead.country = country
		_add_note(lead, note_html)
		lead.flags.ignore_permissions = True
		lead.flags.ignore_mandatory = True
		lead.insert()

	doc.db_set("lead", lead.name, update_modified=False)


def _add_note(lead, note_html):
	if lead.meta.has_field("notes"):
		lead.append("notes", {"note": note_html, "added_by": "Administrator", "added_on": frappe.utils.now_datetime()})
