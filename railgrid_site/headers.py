# Copyright (c) 2026, RailGrid Technologies Limited
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
