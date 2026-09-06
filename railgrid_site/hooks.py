app_name = "railgrid_site"
app_title = "RailGrid Site"
app_publisher = "RailGrid Technologies Limited"
app_description = "RailGrid Technologies public website (railgrid.co.tz) with enquiry capture into ERPNext"
app_email = "info@railgrid.co.tz"
app_license = "mit"
required_apps = ["frappe", "erpnext"]

# Serve the static site from www/ as the website home page.
home_page = "index"

# Website-level redirects (old URLs and file-style paths -> folder-style routes).
website_redirects = [
	{"source": r"/index\.html", "target": "/"},
	{"source": r"/home", "target": "/"},
	{"source": r"/about", "target": "/"},
	{"source": r"/products", "target": "/editions/"},
	{"source": r"/solutions", "target": "/editions/"},
	{"source": r"/services", "target": "/platform/"},
	{"source": r"/contact\.html", "target": "/contact/"},
	{"source": r"/contact-us", "target": "/contact/"},
]

after_install = "railgrid_site.install.after_install"
after_migrate = "railgrid_site.install.after_migrate"

# Keep the enquiry email settings out of the standard fixtures export; they are created in install.py
