# Copyright (c) 2026, RailGrid Technologies Limited
"""Public endpoint used by the website forms (assets/js/site.js).

POST /api/method/railgrid_site.api.submit
    form: "contact-enquiry" | "capacity-building-registration"
    data: JSON object of field name -> value (checkbox groups arrive as lists)
"""

import json

import frappe
from frappe import _
from frappe.rate_limiter import rate_limit
from frappe.utils import cstr, strip_html, validate_email_address

MAX_LEN = {"message": 4000, "goal": 2000}

FORMS = {
	"contact-enquiry": {
		"doctype": "Website Enquiry",
		"kind": "enquiry",
		"fields": ["full_name", "email", "company", "phone", "topic", "message"],
		"required": ["full_name", "email", "message"],
	},
	"capacity-building-registration": {
		"doctype": "Capacity Building Registration",
		"kind": "registration",
		"fields": [
			"organisation", "sector", "country", "employees", "contact_name", "job_title", "email", "phone",
			"audiences", "tracks", "format", "participants", "timing", "source", "goal", "consent",
		],
		"required": ["organisation", "contact_name", "email"],
	},
}


def _clean(value, limit=250):
	if isinstance(value, (list, tuple)):
		value = ", ".join(cstr(v).strip() for v in value if cstr(v).strip())
	value = strip_html(cstr(value)).strip()
	return value[:limit]


@frappe.whitelist(allow_guest=True, methods=["POST"])
@rate_limit(limit=20, seconds=60 * 60)
def submit(form, data):
	spec = FORMS.get(cstr(form))
	if not spec:
		frappe.throw(_("Unknown form"), frappe.ValidationError)

	if isinstance(data, str):
		try:
			data = json.loads(data)
		except ValueError:
			frappe.throw(_("Invalid form data"), frappe.ValidationError)
	if not isinstance(data, dict):
		frappe.throw(_("Invalid form data"), frappe.ValidationError)

	# Honeypot: real users never see or fill the "website" field. Pretend success.
	if cstr(data.get("website")).strip():
		return {"ok": True, "name": None}

	values = {}
	for fieldname in spec["fields"]:
		raw = data.get(fieldname)
		if raw is None:
			continue
		if fieldname == "consent":
			values[fieldname] = 1 if cstr(raw).lower() in ("on", "1", "true", "yes") else 0
		elif fieldname == "participants":
			try:
				values[fieldname] = int(float(cstr(raw))) if cstr(raw).strip() else None
			except ValueError:
				values[fieldname] = None
		else:
			values[fieldname] = _clean(raw, MAX_LEN.get(fieldname, 250))

	missing = [f for f in spec["required"] if not values.get(f)]
	if missing:
		frappe.throw(_("Please fill in the required fields."), frappe.MandatoryError)

	if not validate_email_address(values.get("email")):
		frappe.throw(_("Please enter a valid email address."), frappe.ValidationError)

	doc = frappe.new_doc(spec["doctype"])
	doc.update(values)
	doc.source_url = cstr(frappe.get_request_header("Referer"))[:250]
	doc.ip_address = cstr(frappe.local.request_ip)[:100]
	doc.flags.ignore_permissions = True
	doc.insert()
	frappe.db.commit()

	return {"ok": True, "name": doc.name}
