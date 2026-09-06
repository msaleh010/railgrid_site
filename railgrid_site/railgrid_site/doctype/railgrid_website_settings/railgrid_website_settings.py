# Copyright (c) 2026, RailGrid Technologies Limited

import frappe
from frappe import _
from frappe.model.document import Document


class RailGridWebsiteSettings(Document):
	def validate(self):
		from railgrid_site.enquiries import split_emails

		if not split_emails(self.notification_recipients):
			frappe.throw(_("Enter at least one valid notification email address."))
