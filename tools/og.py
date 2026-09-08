#!/usr/bin/env python3
"""Generate 1200x630 Open Graph cards for every page into public/img/og/.
Re-run after adding a page:  python3 tools/og.py
Fonts: uses DejaVu Sans Bold if Manrope is not installed locally
(drop Manrope-ExtraBold.ttf next to this script to use the brand face)."""
import pathlib, re, textwrap
from PIL import Image, ImageDraw, ImageFont

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent / "railgrid_site"
OUT = ROOT / "public/img/og"
OUT.mkdir(parents=True, exist_ok=True)
NAVY, CYAN, INK2, WHITE = (1, 34, 86), (1, 178, 222), (169, 184, 207), (255, 255, 255)


def font(size, bold=True):
    for cand in (HERE / "Manrope-ExtraBold.ttf", HERE / "Manrope-Bold.ttf",
                 pathlib.Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")):
        if cand.exists():
            return ImageFont.truetype(str(cand), size)
    return ImageFont.load_default()


CARDS = {  # route -> (eyebrow, headline)
    "/": ("RailGrid Technologies", "Enterprise ERP, implemented and supported in East Africa."),
    "/platform/": ("The platform", "Everything an institution runs on, in one audited system."),
    "/editions/": ("Sector editions", "ERPNext preconfigured for the institutions Africa runs on."),
    "/editions/hcmos/": ("HCMOS™ · Human capital & payroll", "One audited workforce system, from the gate to the approval chain."),
    "/editions/icdos/": ("ICDOS™ · Inland container depots", "Every gate movement becomes a charge. Every charge becomes a ledger entry."),
    "/editions/wmos/": ("WMOS™ · Warehouse operations", "Inbound to dispatch, under one operating system."),
    "/deployment/": ("Deployment & hosting", "Run it where your policy says it must run."),
    "/capacity-building/": ("Capacity building", "Build the capability to specify, govern and get value from technology."),
    "/insights/": ("Insights", "Research, analysis and advisory on infrastructure governance."),
    "/insights/tour-de-france-moving-grid/": ("Insights · Infrastructure", "The Moving Grid: what the Tour de France teaches about infrastructure."),
    "/clients/": ("Clients", "Taifa Mining & Civils: 1,050 employees, 6 sites, one auditable system."),
    "/contact/": ("Contact", "Book a working session with the team that implements and supports the system."),
    "/privacy/": ("Privacy notice", "What we collect, why we hold it, and how to have it removed."),
}


def draw(route, eyebrow, headline):
    im = Image.new("RGB", (1200, 630), NAVY)
    d = ImageDraw.Draw(im)
    # subtle grid texture
    for x in range(0, 1200, 60):
        d.line([(x, 0), (x, 630)], fill=(6, 42, 100), width=1)
    for y in range(0, 630, 60):
        d.line([(0, y), (1200, y)], fill=(6, 42, 100), width=1)
    d.rectangle([(0, 0), (1200, 8)], fill=CYAN)
    logo = Image.open(ROOT / "public/img/logo-white.png").convert("RGBA")
    logo.thumbnail((220, 165))
    im.paste(logo, (72, 56), logo)
    d.text((72, 250), eyebrow.upper(), font=font(24), fill=CYAN)
    size = 58
    while True:
        f = font(size)
        lines = textwrap.wrap(headline, width=int(1060 / (size * 0.52)))
        if len(lines) <= 3 or size <= 36:
            break
        size -= 4
    y = 296
    for line in lines:
        d.text((72, y), line, font=f, fill=WHITE)
        y += int(size * 1.22)
    d.text((72, 560), "railgrid.co.tz", font=font(26), fill=INK2)
    d.text((1200 - 72 - d.textlength("ERPNext · Tanzania · East Africa", font=font(22)), 562),
           "ERPNext · Tanzania · East Africa", font=font(22), fill=INK2)
    name = "home" if route == "/" else route.strip("/").replace("/", "-")
    im.save(OUT / f"{name}.png", optimize=True)
    return name


if __name__ == "__main__":
    for r, (e, h) in CARDS.items():
        print(draw(r, e, h))
