#!/usr/bin/env python3
"""One-off edits from the September 2026 site audit. Each step is idempotent.
Usage: python3 tools/fix.py <step>   (steps listed at the bottom)"""
import json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent / "railgrid_site"
WWW = ROOT / "www"
PAGES = sorted(WWW.glob("**/*.html"))
SITE = "https://railgrid.co.tz"


def route_of(page):
    rel = page.relative_to(WWW).with_suffix("")
    parts = [p for p in rel.parts if p != "index"]
    return "/" + "/".join(parts) + ("/" if parts else "")


def rw(page, fn):
    s = page.read_text()
    t = fn(s)
    if t != s:
        page.write_text(t)
        print("  edited", page.relative_to(ROOT))


# ---------------------------------------------------------------- 1. sitemap
def step_sitemap():
    for page in PAGES:
        if page.name in ("404.html",):
            continue
        py = page.with_suffix(".py")
        if not py.exists():
            py.write_text(
                "# Website page controller: include this route in Frappe's generated /sitemap.xml\n"
                "sitemap = 1\n"
            )
            print("  created", py.relative_to(ROOT))


# ---------------------------------------------------------------- 2. Taifa figures
STATS_OLD = re.compile(
    r'<div class="stat"><span class="stat__value">\[N\]</span><span class="small muted">employees on the system</span></div>\s*'
    r'<div class="stat"><span class="stat__value">\[N\]</span><span class="small muted">sites and camps</span></div>\s*'
    r'<div class="stat"><span class="stat__value">\[N\] weeks</span><span class="small muted">from kick‑off to go‑live</span></div>\s*'
    r'<div class="stat"><span class="stat__value">\[N\] days</span><span class="small muted">payroll cycle, down from \[N\]</span></div>'
)
STATS_NEW = (
    '<div class="stat"><span class="stat__value">1,050</span><span class="small muted">employees on the system</span></div>\n'
    '        <div class="stat"><span class="stat__value">6</span><span class="small muted">sites and camps</span></div>\n'
    '        <div class="stat"><span class="stat__value">Live</span><span class="small muted">attendance, leave and shift rosters in production</span></div>\n'
    '        <div class="stat"><span class="stat__value">GPS</span><span class="small muted">geofenced clock‑in from every site</span></div>'
)


def step_figures():
    def home(s):
        s = STATS_OLD.sub(STATS_NEW, s)
        s = s.replace(
            "now run on the HCMOS™ edition of ERPNext, with payroll posted to Exact and a mobile self‑service app for staff in the field.",
            "now run on the HCMOS™ edition of ERPNext, with GPS‑verified clock‑in, shift rosters and a mobile self‑service app for staff in the field. Statutory payroll and the Exact posting follow as the next phase.",
        )
        return s

    def clients(s):
        s = STATS_OLD.sub(STATS_NEW, s)
        s = s.replace("One workforce system, from the gate to the payroll posting.", "One workforce system, from the gate to the approval chain.")
        s = s.replace(
            "After: every employee event captured once, approved through a defined chain, and posted to Exact with a full audit trail.",
            "After: every employee event captured once, approved through a defined chain, and recorded with a full audit trail. Statutory payroll and the Exact posting are the next phase.",
        )
        s = s.replace(
            '<div class="row"><span>Payroll August – Exact journal</span><span class="pill pill--cyan">Posted</span></div>',
            '<div class="row"><span>Shift roster – Site B, September</span><span class="pill pill--cyan">Published</span></div>',
        )
        s = s.replace(
            "Payroll journals posted to Exact, statutory returns, and the migration of historical records from spreadsheets.",
            "Migration of historical records from spreadsheets, reconciled before go‑live; statutory returns and the payroll posting to Exact are scheduled as the next phase.",
        )
        return s

    def hcmos(s):
        s = s.replace("<span>Payroll posted to Exact</span>", "<span>GPS clock‑in across 6 sites</span>")
        s = s.replace(
            "Payroll journals posted to Exact each cycle, with the audit trail back to every employee record.",
            "Built to post payroll journals to Exact each cycle, with the audit trail back to every employee record – Taifa's next phase.",
        )
        return s

    rw(WWW / "index.html", home)
    rw(WWW / "clients/index.html", clients)
    rw(WWW / "editions/hcmos/index.html", hcmos)


# ---------------------------------------------------------------- 3. a11y & links
def step_a11y():
    def fn(s):
        s = s.replace(
            "info@railgrid.co.tz · +255 787 772 012</p>",
            '<a href="mailto:info@railgrid.co.tz">info@railgrid.co.tz</a> · <a href="tel:+255787772012">+255 787 772 012</a></p>',
        )
        if 'class="skip-link"' not in s:
            s = s.replace("<body>\n", '<body>\n<a class="skip-link" href="#main">Skip to content</a>\n', 1)
        s = s.replace("<main>", '<main id="main">', 1)
        s = s.replace('<img src="/assets/railgrid_site/img/logo-white.png" alt="RailGrid Technologies" width="180" height="135">',
                      '<img src="/assets/railgrid_site/img/logo-white.png" alt="RailGrid Technologies" width="180" height="135" loading="lazy" decoding="async">')
        return s

    for p in PAGES:
        rw(p, fn)

    # heading order on the editions index: the three live-edition cards were h3 between the h1 and h2s
    def ed(s):
        for name in ("HCMOS™", "ICDOS™", "WMOS™"):
            s = s.replace(f"<h3>{name} Edition</h3>", f"<h2 class=\"h3\">{name} Edition</h2>")
        return s
    rw(WWW / "editions/index.html", ed)

    css = ROOT / "public/css/site.css"
    s = css.read_text()
    if ".skip-link" not in s:
        s += (
            "\n/* Accessibility: keyboard skip link (audit, Sep 2026) */\n"
            ".skip-link { position: absolute; left: 8px; top: -48px; z-index: 1000; padding: 10px 14px; background: var(--navy); color: #fff; border-radius: var(--radius-sm); font-weight: 700; }\n"
            ".skip-link:focus { top: 8px; outline: 2px solid var(--cyan); }\n"
            "/* h2 styled as a card heading so the outline stays h1 > h2 */\n"
            ".card h2.h3 { font-size: 17px; margin: 0 0 8px; }\n"
            ".footer p a { color: inherit; text-decoration: underline; text-decoration-color: rgba(255,255,255,.35); display: inline; }\n"
            ".footer p a:hover { text-decoration-color: #fff; }\n"
        )
        css.write_text(s)
        print("  edited public/css/site.css")


# ---------------------------------------------------------------- 4. structured data + OG
ORG = {
    "@type": "Organization",
    "@id": SITE + "/#organization",
    "name": "RailGrid Technologies Limited",
    "alternateName": "RailGrid",
    "url": SITE + "/",
    "logo": {"@type": "ImageObject", "url": SITE + "/assets/railgrid_site/img/logo-color@2x.png"},
    "email": "info@railgrid.co.tz",
    "telephone": "+255787772012",
    "address": {"@type": "PostalAddress", "addressLocality": "Dar es Salaam", "addressCountry": "TZ"},
    "areaServed": ["TZ", "KE", "UG", "RW", "ZM", "CD", "AE"],
    "contactPoint": [{"@type": "ContactPoint", "contactType": "sales", "email": "info@railgrid.co.tz",
                      "telephone": "+255787772012", "availableLanguage": ["en", "sw"]}],
    "knowsAbout": ["ERPNext", "Frappe", "ERP implementation", "Tanzanian statutory payroll", "Inland container depot operations"],
}

EDITIONS = {
    "/editions/hcmos/": ("HCMOS™ Edition", "Human Capital Management Operating System – ERPNext HR and payroll configured for multi‑site workforces, Tanzanian statutory rules and an employee self‑service app."),
    "/editions/icdos/": ("ICDOS™ Edition", "Inland Container Depot Operating System – ERPNext configured for gate and yard operations, tariff and charge linking, revenue assurance, agent portal and TRA‑compliant invoicing."),
    "/editions/wmos/": ("WMOS™ Edition", "Warehouse Management Operating System – ERPNext configured for ASN receiving, putaway, bin, batch and serial control, cycle counts, picking, packing and dispatch."),
}

BREADCRUMB_NAMES = {
    "platform": "Platform", "editions": "Sector editions", "deployment": "Deployment & hosting",
    "capacity-building": "Capacity building", "insights": "Insights", "contact": "Contact", "clients": "Clients",
    "privacy": "Privacy notice", "hcmos": "HCMOS™", "icdos": "ICDOS™", "wmos": "WMOS™",
    "tour-de-france-moving-grid": "The Moving Grid",
}


def jsonld_for(route, title, desc):
    graph = [ORG]
    if route == "/":
        graph.append({"@type": "WebSite", "@id": SITE + "/#website", "url": SITE + "/", "name": "RailGrid Technologies",
                      "publisher": {"@id": SITE + "/#organization"}, "inLanguage": ["en", "sw"]})
    else:
        parts = [p for p in route.strip("/").split("/")]
        items = [{"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"}]
        acc = ""
        for i, p in enumerate(parts):
            acc += "/" + p
            items.append({"@type": "ListItem", "position": i + 2, "name": BREADCRUMB_NAMES.get(p, p.title()), "item": SITE + acc + "/"})
        graph.append({"@type": "BreadcrumbList", "itemListElement": items})
    if route in EDITIONS:
        name, d = EDITIONS[route]
        graph.append({"@type": "SoftwareApplication", "name": name, "description": d, "url": SITE + route,
                      "applicationCategory": "BusinessApplication", "operatingSystem": "Web, Android, iOS",
                      "isBasedOn": "https://erpnext.com", "provider": {"@id": SITE + "/#organization"},
                      "offers": {"@type": "Offer", "price": "0", "priceCurrency": "TZS",
                                 "description": "No per‑user licence fees. Implementation, hosting and support quoted per engagement."}})
    if route.startswith("/insights/") and route != "/insights/":
        graph.append({"@type": "Article", "headline": title.split(" | ")[0].split(" — ")[0], "description": desc,
                      "url": SITE + route, "datePublished": "2026-07-23", "dateModified": "2026-07-23",
                      "inLanguage": "en", "wordCount": 650,
                      "author": {"@type": "Person", "name": "Mohammed Saleh", "jobTitle": "Founder and Chief Technology Officer",
                                 "worksFor": {"@id": SITE + "/#organization"}},
                      "publisher": {"@id": SITE + "/#organization"},
                      "image": SITE + "/assets/railgrid_site/img/og" + (route.rstrip("/").replace("/", "-") or "-home") + ".png",
                      "mainEntityOfPage": SITE + route})
    if route == "/contact/":
        graph.append({"@type": "ContactPage", "url": SITE + route, "name": "Contact RailGrid Technologies"})
    return {"@context": "https://schema.org", "@graph": graph}


def og_name(route):
    return "home" if route == "/" else route.strip("/").replace("/", "-")


def step_seo():
    for p in PAGES:
        route = route_of(p)
        s = p.read_text()
        title = re.search(r"<title>(.*?)</title>", s, re.S).group(1)
        desc = re.search(r'<meta name="description" content="(.*?)">', s).group(1).replace("&#x27;", "'").replace("&amp;", "&")
        ld = json.dumps(jsonld_for(route, title, desc), ensure_ascii=False, separators=(",", ":"))
        block = '<script type="application/ld+json">' + ld + "</script>"
        if 'type="application/ld+json"' in s:
            s = re.sub(r'<script type="application/ld\+json">.*?</script>', block, s, flags=re.S)
        else:
            s = s.replace("</head>", block + "\n</head>", 1)
        og = f"{SITE}/assets/railgrid_site/img/og/{og_name(route)}.png"
        s = re.sub(r'<meta property="og:image" content="[^"]*">',
                   f'<meta property="og:image" content="{og}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n'
                   f'<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:image" content="{og}">', s)
        # de-duplicate if run twice
        s = re.sub(r'(<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:image" content="[^"]*">\n)(?=\1)', "", s)
        if 'property="og:locale"' not in s:
            s = s.replace('<meta property="og:type"', '<meta property="og:locale" content="en_GB">\n<meta property="og:site_name" content="RailGrid Technologies">\n<meta property="og:type"', 1)
        if s != p.read_text():
            p.write_text(s)
            print("  edited", p.relative_to(ROOT))


# ---------------------------------------------------------------- 5. drop-in assets
ASSET_LINKS = (
    '<link rel="stylesheet" href="/assets/railgrid_site/css/railgrid-justify.css">',
    '<script src="/assets/railgrid_site/js/railgrid-i18n.js" defer></script>',
)


def step_assets():
    for p in PAGES:
        def fn(s):
            if "railgrid-justify.css" not in s:
                s = re.sub(r'(<link rel="stylesheet" href="/assets/railgrid_site/css/site\.css[^"]*">)', r"\1\n" + ASSET_LINKS[0], s, 1)
            if "railgrid-i18n.js" not in s:
                s = re.sub(r'(<script src="/assets/railgrid_site/js/site\.js[^"]*"></script>)', r"\1\n" + ASSET_LINKS[1], s, 1)
            return s
        rw(p, fn)


# ---------------------------------------------------------------- 6. editions status + CTA
def step_editions():
    def ed(s):
        s = s.replace('<div class="card__top"><span class="card__label">Logistics &amp; Trade</span></div>',
                      '<div class="card__top"><span class="card__label">Logistics &amp; Trade</span><span class="pill pill--cyan">Available</span></div>')
        s = s.replace('<div class="card__top"><span class="card__label">Industrial Operations</span></div>',
                      '<div class="card__top"><span class="card__label">Industrial Operations</span><span class="pill pill--cyan">Available</span></div>')
        for sector, key in (("Government &amp; Public Sector", "public"), ("Banking &amp; Financial Services", "banking"), ("Energy &amp; Utilities", "utilities")):
            old = f'<span class="eyebrow">{sector}</span>'
            new = (f'<div class="card__top" style="justify-content:flex-start;gap:12px"><span class="eyebrow">{sector}</span>'
                   f'<span class="pill pill--amber">Anchor client sought</span></div>')
            s = s.replace(old, new)
        # CTA after each of the three lists: find the </ul>\n  </div>\n</section> of those sections
        for key, label in (("public", "Government & Public Sector"), ("banking", "Banking & Financial Services"), ("utilities", "Energy & Utilities")):
            sec_re = re.compile(r'(<section class="section[^"]*" id="' + key + r'">.*?</ul>)(\s*</div>\s*</section>)', re.S)
            def add(m):
                if "anchor-cta" in m.group(1):
                    return m.group(0)
                cta = (f'\n    <p class="anchor-cta" style="grid-column:1/-1;margin-top:8px">'
                       f'<a class="btn btn--ghost" href="/contact/?topic=anchor&amp;sector={key}">Be the anchor client in this sector →</a>'
                       f'<span class="small muted" style="margin-left:14px">Deploy first, shape the edition\'s roadmap, set the standard.</span></p>')
                return m.group(1) + cta + m.group(2)
            s = sec_re.sub(add, s)
        return s
    rw(WWW / "editions/index.html", ed)

    def home(s):
        s = s.replace('<div class="card__top"><span class="card__label">Logistics &amp; Trade</span></div>',
                      '<div class="card__top"><span class="card__label">Logistics &amp; Trade</span><span class="pill pill--dark">Available</span></div>')
        s = s.replace('<div class="card__top"><span class="card__label">Industrial Operations</span></div>',
                      '<div class="card__top"><span class="card__label">Industrial Operations</span><span class="pill pill--dark">Available</span></div>')
        for sector in ("Government &amp; Public Sector", "Banking &amp; Financial Services", "Energy &amp; Utilities"):
            s = s.replace(f'<div class="card__top"><span class="card__label">{sector}</span></div>',
                          f'<div class="card__top"><span class="card__label">{sector}</span><span class="pill pill--dark">Anchor client sought</span></div>')
        return s
    rw(WWW / "index.html", home)


# ---------------------------------------------------------------- 7. insights
def step_insights():
    def idx(s):
        return s.replace('<span class="small muted">Full article coming to this site</span>',
                         '<span class="pill pill--amber" style="align-self:flex-start">In preparation</span>')
    rw(WWW / "insights/index.html", idx)

    def art(s):
        s = s.replace('<p class="small muted mt-16">Infrastructure · 23 July 2026 · 8 min read</p>',
                      '<p class="small muted mt-16">Infrastructure · <time datetime="2026-07-23">23 July 2026</time> · 8 min read</p>')
        if 'class="byline"' not in s:
            s = s.replace('</h1>\n  </div>\n</section>',
                          '</h1>\n    <p class="byline mt-16"><span class="byline__avatar" aria-hidden="true">MS</span><span><strong>Mohammed Saleh</strong><br><span class="small muted">Founder and Chief Technology Officer, RailGrid Technologies</span></span></p>\n  </div>\n</section>', 1)
        if 'class="share"' not in s:
            share = ('\n<section class="section section--white" style="padding-top:0"><div class="container article">'
                     '<div class="share" data-no-justify"><span class="small muted">Share this article</span>'
                     '<a class="btn btn--ghost btn--sm" href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Frailgrid.co.tz%2Finsights%2Ftour-de-france-moving-grid%2F" rel="noopener" target="_blank">LinkedIn</a>'
                     '<a class="btn btn--ghost btn--sm" href="https://wa.me/?text=The%20Moving%20Grid%20%E2%80%93%20https%3A%2F%2Frailgrid.co.tz%2Finsights%2Ftour-de-france-moving-grid%2F" rel="noopener" target="_blank">WhatsApp</a>'
                     '<button class="btn btn--ghost btn--sm" type="button" data-copy-link>Copy link</button>'
                     '</div></div></section>\n')
            share = share.replace('data-no-justify"', 'data-no-justify')
            s = s.replace("\n</main>", share + "</main>", 1)
        return s
    rw(WWW / "insights/tour-de-france-moving-grid/index.html", art)

    css = ROOT / "public/css/site.css"
    s = css.read_text()
    if ".byline" not in s:
        s += ("\n/* Article byline and share row (audit, Sep 2026) */\n"
              ".byline { display: flex; align-items: center; gap: 12px; font-size: 15px; color: var(--ink); }\n"
              ".byline__avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--navy); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; flex: none; }\n"
              ".share { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; padding: 20px 0; border-top: 1px solid var(--line); }\n"
              ".post-card .pill { margin-top: auto; }\n")
        css.write_text(s)
        print("  edited public/css/site.css")


# ---------------------------------------------------------------- 8. 404 page
def step_404():
    src = (WWW / "contact/index.html").read_text()
    head = src.split("<main")[0]
    foot = "<footer" + src.split("<footer", 1)[1]
    head = re.sub(r"<title>.*?</title>", "<title>Page not found | RailGrid Technologies</title>", head, flags=re.S)
    head = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="The page you were looking for is not here. Find the platform, sector editions, deployment options and contact details for RailGrid Technologies.">', head)
    head = re.sub(r'<link rel="canonical" href="[^"]*">\n', "", head)
    head = re.sub(r'<meta property="og:[^"]*" content="[^"]*">\n', "", head)
    head = re.sub(r'<meta property="og:image:(width|height)" content="[^"]*">\n', "", head)
    head = re.sub(r'<meta name="twitter:[^"]*" content="[^"]*">\n', "", head)
    head = re.sub(r'<script type="application/ld\+json">.*?</script>\n', "", head, flags=re.S)
    head = head.replace("</head>", '<meta name="robots" content="noindex">\n</head>')
    body = '''<main id="main">
<section class="page-hero">
  <div class="container">
    <span class="eyebrow">Error 404</span>
    <h1>That page is not here.</h1>
    <p class="lead">The address may have changed, or the link you followed is out of date. Everything on the site is one click away below.</p>
    <div class="btn-wrap mt-24"><a class="btn btn--primary" href="/">Go to the home page</a><a class="btn btn--ghost" href="/contact/">Talk to RailGrid</a></div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="grid grid--3">
      <a class="card card--link" href="/platform/"><div class="card__top"><span class="card__label">Platform</span></div><h2 class="h3">Every capability</h2><p>Finance, HR and payroll, inventory, procurement, projects, assets and reporting in one audited system.</p><span class="card__more">Explore the platform →</span></a>
      <a class="card card--link" href="/editions/"><div class="card__top"><span class="card__label">Sector editions</span></div><h2 class="h3">Preconfigured for your sector</h2><p>HCMOS™, ICDOS™, WMOS™ and editions for government, banking and utilities.</p><span class="card__more">See the editions →</span></a>
      <a class="card card--link" href="/deployment/"><div class="card__top"><span class="card__label">Deployment</span></div><h2 class="h3">Run it where policy says</h2><p>Frappe Cloud, a private cloud in Tanzania, or on‑premise at a remote site.</p><span class="card__more">Compare hosting →</span></a>
    </div>
  </div>
</section>
</main>
'''
    (WWW / "404.html").write_text(head + body + foot)
    (WWW / "404.py").write_text("# Branded not-found page; Frappe renders the www/404 route for missing pages.\nno_cache = 1\n")
    print("  created www/404.html")


# ---------------------------------------------------------------- 9. security headers hook
HEADERS_PY = '''# Copyright (c) 2026, RailGrid Technologies Limited
"""Security headers for the public website (after_request hook).

Applied only to website routes. The Desk (/app), the API and asset routes are
left to Frappe's own defaults so nothing in ERPNext is affected.
"""

import frappe

SKIP_PREFIXES = ("/app", "/api", "/assets", "/files", "/private", "/login", "/desk", "/socket.io", "/printview", "/update-password")

CSP = "; ".join([
	"default-src 'self'",
	"script-src 'self'",
	"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
	"font-src 'self' https://fonts.gstatic.com data:",
	"img-src 'self' data:",
	"connect-src 'self'",
	"frame-ancestors 'self'",
	"base-uri 'self'",
	"form-action 'self'",
	"object-src 'none'",
	"upgrade-insecure-requests",
])


def after_request(response, request):
	try:
		path = request.path or "/"
	except Exception:
		return
	if path.startswith(SKIP_PREFIXES):
		return
	if not (response.mimetype or "").startswith("text/html"):
		return
	h = response.headers
	h.setdefault("X-Content-Type-Options", "nosniff")
	h.setdefault("X-Frame-Options", "SAMEORIGIN")
	h.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
	h.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()")
	h.setdefault("Content-Security-Policy", CSP)
'''


def step_headers():
    (ROOT / "headers.py").write_text(HEADERS_PY)
    hooks = ROOT / "hooks.py"
    s = hooks.read_text()
    if "after_request" not in s:
        s = s.replace('after_install = "railgrid_site.install.after_install"',
                      '# Security headers on public pages (see headers.py)\nafter_request = ["railgrid_site.headers.after_request"]\n\nafter_install = "railgrid_site.install.after_install"')
        hooks.write_text(s)
    print("  wrote headers.py, hooks.py")


STEPS = {
    "sitemap": step_sitemap, "figures": step_figures, "a11y": step_a11y, "seo": step_seo,
    "assets": step_assets, "editions": step_editions, "insights": step_insights, "404": step_404, "headers": step_headers,
}

if __name__ == "__main__":
    for name in sys.argv[1:]:
        print("==", name)
        STEPS[name]()
