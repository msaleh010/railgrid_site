# Copyright (c) 2026, RailGrid Technologies Limited

from frappe.model.document import Document

from railgrid_site.enquiries import process_submission


class WebsiteEnquiry(Document):
	def after_insert(self):
		process_submission(self, "enquiry")
