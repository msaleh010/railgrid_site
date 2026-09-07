# RailGrid Site

The public website of RailGrid Technologies (https://railgrid.co.tz), packaged as a Frappe app so it
can be hosted on Frappe Cloud next to ERPNext.

- `railgrid_site/www/` – the pages (served at `/`, `/platform`, `/editions/icdos`, …)
- `railgrid_site/public/` – CSS, JS and images (served at `/assets/railgrid_site/...`)
- `railgrid_site/api.py` – the guest endpoint the contact and capacity-building forms post to
- `Website Enquiry`, `Capacity Building Registration` – where submissions are stored (`/app/website-enquiry`)
- `RailGrid Website Settings` – who gets notified, acknowledgement email, CRM Lead creation

Every submission is saved, emailed to the configured mailbox, acknowledged to the sender and pushed
into ERPNext CRM as a Lead (existing Leads with the same email get a note instead of a duplicate).

## Updating the pages

Edit `src/pages/*.html` in the design source, run `ASSET_BASE=/assets/railgrid_site python3 build.py`,
copy `dist/**/index.html` into `railgrid_site/www/` and `dist/assets/*` into `railgrid_site/public/`,
commit, push, and deploy the bench on Frappe Cloud.

## License

MIT

## Cache-busting

Frappe serves `/assets/...` with a one-year cache. After changing `site.css` or `site.js`, run
`python3 stamp_assets.py` before committing: it rewrites the `?v=` hash on the asset links in every page.
