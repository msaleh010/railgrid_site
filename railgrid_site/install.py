# Copyright (c) 2026, RailGrid Technologies Limited
"""One-time site configuration so the static site is the public face of the Frappe site."""

import frappe

ROBOTS = """User-agent: *
Allow: /
Disallow: /app
Disallow: /login
Disallow: /api/
Sitemap: https://railgrid.co.tz/sitemap.xml
"""


def after_install():
	setup_website_settings()
	setup_enquiry_settings()
	grant_sales_roles()
	frappe.db.commit()


def after_migrate():
	# Keep the public pages as the home page even if another app resets it.
	setup_website_settings(only_home_page=True)
	grant_sales_roles()


def setup_website_settings(only_home_page=False):
	ws = frappe.get_doc("Website Settings")
	changed = False
	if ws.home_page != "index":
		ws.home_page = "index"
		changed = True
	if not only_home_page:
		ws.title_prefix = "RailGrid Technologies"
		ws.disable_signup = 1
		ws.hide_footer_signup = 1
		ws.robots_txt = ROBOTS
		ws.app_name = "RailGrid Technologies"
		ws.favicon = "/assets/railgrid_site/img/favicon-32.png"
		ws.copyright = "RailGrid Technologies Limited"
		changed = True
	if changed:
		ws.flags.ignore_permissions = True
		ws.save()


def setup_enquiry_settings():
	settings = frappe.get_doc("RailGrid Website Settings")
	if not settings.notification_recipients:
		settings.notification_recipients = "info@railgrid.co.tz"
	settings.flags.ignore_permissions = True
	settings.save()

	if "erpnext" in frappe.get_installed_apps() and not frappe.db.exists("Lead Source", "Website"):
		frappe.get_doc({"doctype": "Lead Source", "source_name": "Website"}).insert(ignore_permissions=True)


def grant_sales_roles():
	"""Let ERPNext sales roles work the enquiry lists (roles only exist when ERPNext is installed)."""
	from frappe.permissions import add_permission, update_permission_property

	for role, can_delete in (("Sales Manager", 1), ("Sales User", 0)):
		if not frappe.db.exists("Role", role):
			continue
		for doctype in ("Website Enquiry", "Capacity Building Registration"):
			if frappe.db.exists("Custom DocPerm", {"parent": doctype, "role": role}):
				continue
			add_permission(doctype, role, 0)
			for ptype in ("write", "create", "email", "export", "print", "report", "share"):
				update_permission_property(doctype, role, 0, ptype, 1)
			if can_delete:
				update_permission_property(doctype, role, 0, "delete", 1)
