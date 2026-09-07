#!/usr/bin/env python3
"""Append ?v=<content hash> to the site CSS/JS URLs in every www page, so browsers
re-fetch them after a deploy despite Frappe's long-lived asset cache.
Run after copying new pages/assets in:  python3 stamp_assets.py"""
import hashlib, pathlib, re
ROOT = pathlib.Path(__file__).parent / "railgrid_site"
def h(p): return hashlib.sha1(p.read_bytes()).hexdigest()[:8]
versions = {"css/site.css": h(ROOT / "public/css/site.css"), "js/site.js": h(ROOT / "public/js/site.js")}
for page in ROOT.glob("www/**/*.html"):
    s = page.read_text()
    for rel, v in versions.items():
        s = re.sub(rf"(/assets/railgrid_site/{re.escape(rel)})(\?v=[0-9a-f]+)?", rf"\1?v={v}", s)
    page.write_text(s)
print(versions)
