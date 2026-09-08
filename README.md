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

## Language switch (English / Kiswahili)

`public/js/railgrid-i18n.js` adds the EN | SW toggle to the header and holds the Kiswahili dictionary
(English string as rendered → Kiswahili). Keys are matched exactly after whitespace is collapsed, so
when you change English copy, change the matching key too or the string falls back to English.
In the browser console `RailGridI18n.missing()` lists untranslated strings on the current page.
Add `data-i18n-skip` to any element that must never be translated. `?lang=sw` on any URL opens the
Kiswahili version; the choice is remembered in the visitor's browser.

`public/css/railgrid-justify.css` justifies running text (paragraphs, leads, lists) with hyphenation
and styles the switch. Headings, buttons, labels and tables stay left-aligned.

Phase two (recommended once the copy settles): move the dictionary into Frappe's translation system
(`{{ _("…") }}` in the templates + `translations/sw.csv`) and serve `/sw/` routes, so search engines
index the Kiswahili pages with their own URLs and `hreflang` tags.

## Open Graph cards

`tools/og.py` renders a 1200×630 card per page into `public/img/og/`. Re-run it after adding a page
(add the route and headline to `CARDS`). Drop `Manrope-ExtraBold.ttf` into `tools/` to render the
cards in the brand face instead of DejaVu Sans.

## Sitemap, 404 and security headers

Each page has an `index.py` with `sitemap = 1` so Frappe lists it in `/sitemap.xml`. `www/404.html`
is the branded not-found page. `headers.py` (wired through the `after_request` hook) adds a
Content-Security-Policy and related headers to public pages only; the Desk and API are untouched.
If you add a third-party script (analytics, chat), extend `CSP` in `headers.py`.

## Self-hosting the font

The pages load Manrope from Google Fonts. To remove that third-party request, download the 500/600/700/800
woff2 files (e.g. from the `@fontsource/manrope` npm package), put them in `public/fonts/`, add the
`@font-face` rules to `site.css` and delete the two `fonts.googleapis.com` links from the page heads.

## License

MIT

## Cache-busting

Frappe serves `/assets/...` with a one-year cache. After changing `site.css` or `site.js`, run
`python3 stamp_assets.py` before committing: it rewrites the `?v=` hash on the asset links in every page.
