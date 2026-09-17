#!/usr/bin/env python3
"""Build the legal pages (privacy, terms, cookies, refunds) from one shared shell.

The head, header and footer are copied from www/privacy/index.html at build time so the
legal pages always match the rest of the site. Edit the BODIES below, then run:

    python3 tools/legal_pages.py

Effective date: change EFFECTIVE when the text changes materially.
"""
import pathlib, re

HERE = pathlib.Path(__file__).resolve().parent
WWW = HERE.parent / "railgrid_site" / "www"
EFFECTIVE = "17 September 2026"

COMPANY = "RailGrid Technologies Limited"
EMAIL = "info@railgrid.co.tz"
PHONE = "+255 795 300 400"
PHONE_TEL = "+255795300400"

LEGAL_NAV = (
    '<nav class="legal-nav" aria-label="Legal documents">'
    '<a href="/privacy/">Privacy notice</a><a href="/terms/">Terms &amp; conditions</a>'
    '<a href="/cookies/">Cookie policy</a><a href="/refunds/">Refund &amp; cancellation policy</a></nav>'
)

PAGES = {}

# ----------------------------------------------------------------------------- privacy
PAGES["privacy"] = dict(
    title="Privacy Notice",
    description="What RailGrid Technologies collects when you use railgrid.co.tz or contact us, the legal basis, where it is held, how long we keep it and your rights under Tanzania's Personal Data Protection Act, 2022.",
    lead="What we collect when you use this site or contact us, why we hold it, where it is held, and your rights under the Personal Data Protection Act, 2022.",
    body=f"""
<h2>1. Who we are</h2>
<p>{COMPANY} ("RailGrid", "we", "us") is a company incorporated in the United Republic of Tanzania, based in Dar es Salaam. We are the data controller for personal data collected through this website, railgrid.co.tz (the "Site"). Questions about this notice or about data we hold about you go to <a href="mailto:{EMAIL}">{EMAIL}</a> or <a href="tel:{PHONE_TEL}">{PHONE}</a>.</p>

<h2>2. The law this notice follows</h2>
<p>We process personal data under the Personal Data Protection Act, 2022 (Act No. 11 of 2022) and the Personal Data Protection (Personal Data Collection and Processing) Regulations, 2023, overseen by the Personal Data Protection Commission of Tanzania (PDPC). Where visitors from other countries use the Site, we apply the same standards.</p>

<h2>3. What we collect, and why</h2>
<h3>3.1 When you send a form</h3>
<p>The enquiry form and the Capacity Building registration form collect only what is needed to answer you: your name, work email address, and what you tell us in the message. Company, job title, telephone number, sector, country, organisation size, audiences, tracks, format, participant numbers, timing and how you heard of us are asked where they help us prepare, and most are optional. We do not ask for identity numbers, dates of birth, payment details or any special category of personal data, and we ask you not to include them in free‑text fields.</p>
<p>With each submission we also record the page you sent it from and the IP address of the connection, purely to detect spam and abuse of the form. A hidden "honeypot" field, invisible to people, discards automated submissions.</p>
<p><strong>Legal basis:</strong> your consent, given by ticking the consent box on the form, and our legitimate interest in responding to a business enquiry you initiated. You may withdraw consent at any time (section 8).</p>
<h3>3.2 When you simply browse</h3>
<p>We run no analytics, advertising or tracking scripts on the Site. The web server keeps standard access logs (IP address, time, page requested, browser type) for security and fault‑finding, held by our hosting provider for a limited period. The Site uses a small number of technically necessary cookies and one browser preference (your chosen language); see the <a href="/cookies/">Cookie policy</a>.</p>
<h3>3.3 What we do not do</h3>
<p>We do not sell personal data. We do not share it with third parties for their own marketing. We do not add you to a mailing list because you sent an enquiry: the quarterly briefings are sent only to people who chose "Receive the quarterly briefings" or asked for them, and every briefing carries an unsubscribe route.</p>

<h2>4. Where your data is held, and transfers outside Tanzania</h2>
<p>Form submissions are stored in RailGrid's own ERPNext system, hosted for us by Frappe Technologies Pvt. Ltd. on Frappe Cloud in its Cape Town, South Africa region, and readable only by authorised RailGrid staff who are signed in. A copy of each submission is emailed to {EMAIL}, and an acknowledgement is sent to the address you gave, through Frappe's email delivery service, which processes messages on our instruction only. Because this hosting is outside Tanzania, submitting a form is a transfer of your personal data outside the country; we ask for your explicit consent to that on the form, and we rely on the contractual and security commitments of our hosting provider to protect it. If you would rather not have your details transferred, email or telephone us instead of using the form.</p>
<p>Fonts on the Site are loaded from Google Fonts, which means your browser sends its request (including your IP address) to Google when a page loads. Google states it does not use these requests to set cookies or track users; its privacy policy applies to that request.</p>

<h2>5. Who can see it</h2>
<p>Authorised RailGrid staff handling enquiries and sales; our hosting and email providers named above, as processors acting on our instructions; and, where the law requires, a court, regulator or law‑enforcement body with lawful authority. Nobody else.</p>

<h2>6. How long we keep it</h2>
<p>Enquiry and registration records are kept while the enquiry is open and for up to 24 months after our last contact with you, so that we can pick up a conversation you restart, after which they are deleted or anonymised. If an enquiry becomes a contract, the records move to our client files and are kept for the life of the contract plus the period Tanzanian tax and company law requires (currently five years). Server access logs are retained by our hosting provider for a short rolling period. Spam‑detection data (IP address and page of origin) is deleted with the record it belongs to.</p>

<h2>7. Security</h2>
<p>The Site is served over HTTPS only. Submissions are held in a system with role‑based access, audit logs and encrypted backups. No method of transmission or storage is perfectly secure; if we become aware of a breach affecting your personal data we will notify the PDPC and, where the breach is likely to cause you harm, you, as the Act requires.</p>

<h2>8. Your rights</h2>
<p>Under the Personal Data Protection Act you may ask us to confirm what personal data we hold about you and receive a copy; to correct anything inaccurate or incomplete; to delete data we no longer need or that you withdraw consent for; to object to processing, including any direct marketing; and to withdraw consent at any time without affecting what was done before. Write to <a href="mailto:{EMAIL}">{EMAIL}</a> with "Data request" in the subject. We will confirm your identity where necessary and respond within the period the Act allows. If you are not satisfied with our answer you may complain to the Personal Data Protection Commission (<a href="https://www.pdpc.go.tz" rel="noopener">pdpc.go.tz</a>).</p>

<h2>9. Children</h2>
<p>The Site is aimed at organisations and their staff. We do not knowingly collect personal data from anyone under 18; if you believe a child has sent us details, tell us and we will delete them.</p>

<h2>10. Links to other sites</h2>
<p>Links to other websites (for example Frappe, ERPNext or the PDPC) lead to sites we do not control. Their own privacy notices apply.</p>

<h2>11. Changes</h2>
<p>We will post any change to this notice on this page with a new effective date. Material changes to how we use data you have already given us will be notified to the email address you provided.</p>

<h2>12. Contact</h2>
<p>{COMPANY}, Dar es Salaam, United Republic of Tanzania · <a href="mailto:{EMAIL}">{EMAIL}</a> · <a href="tel:{PHONE_TEL}">{PHONE}</a></p>
""",
)

# ----------------------------------------------------------------------------- terms
PAGES["terms"] = dict(
    title="Terms and Conditions",
    description="Terms for using railgrid.co.tz: who we are, permitted use, intellectual property, accuracy of content, third-party trademarks, liability and governing law (Tanzania).",
    lead="The terms on which railgrid.co.tz is made available. Using the Site means you accept them.",
    body=f"""
<h2>1. Who we are and what these terms cover</h2>
<p>This website, railgrid.co.tz (the "Site"), is operated by {COMPANY} ("RailGrid", "we", "us"), a company incorporated in the United Republic of Tanzania, based in Dar es Salaam, reachable at <a href="mailto:{EMAIL}">{EMAIL}</a> and <a href="tel:{PHONE_TEL}">{PHONE}</a>. These terms govern your use of the Site and the information on it. They do not govern the supply of software, implementation, hosting, support or training services: those are supplied only under a written agreement signed by both parties, which prevails over anything on this Site.</p>

<h2>2. Using the Site</h2>
<p>You may browse the Site, and print or download pages for your own or your organisation's internal, non‑commercial reference. You may not copy, republish, scrape, frame or redistribute the Site's content; attempt to gain unauthorised access to the Site, its server or any connected system; interfere with the Site's operation; or use the enquiry forms to send spam, malicious content or anything unlawful. The Site's forms are for genuine business enquiries about RailGrid's services.</p>

<h2>3. Information on the Site is not an offer</h2>
<p>Descriptions of the platform, sector editions, hosting models, timelines and outcomes describe capabilities in general terms. They are an invitation to discuss, not a quotation, warranty or contractual commitment. Scope, deliverables, prices, timelines and service levels for any engagement are set only in the written agreement for that engagement. Screens, dashboards and figures shown on the Site are illustrative; where a client outcome is described, the client's identity is withheld under a confidentiality agreement, figures are rounded and results depend on the client's own circumstances.</p>

<h2>4. Accuracy and changes</h2>
<p>We take care to keep the Site accurate and current, but we do not promise that it is free of errors or omissions, and we may change or remove content, features or availability at any time without notice. Statements about Tanzanian statutory rules (PAYE, NSSF, WCF, SDL, TRA e‑invoicing and similar) describe what the platform is configured to support at the time of writing; they are not tax, legal or accounting advice and you should confirm your own obligations with the relevant authority or adviser.</p>

<h2>5. Intellectual property</h2>
<p>The Site, its text, design, graphics, logos and the names RailGrid, ICDOS™, HCMOS™ and WMOS™ are the property of {COMPANY} or are used with permission, and are protected by the Copyright and Neighbouring Rights Act and the Trade and Service Marks Act of Tanzania and by international treaties. Nothing on the Site grants you any licence to them beyond the use permitted in section 2.</p>
<p>ERPNext and Frappe are trademarks of Frappe Technologies Pvt. Ltd. RailGrid implements and supports ERPNext, which is published under the GNU General Public License v3; RailGrid is an independent company and the Site is not endorsed by Frappe Technologies. Other product names mentioned (for example Exact, Sage, Tally) belong to their respective owners and are used only to identify those products.</p>

<h2>6. Enquiries and personal data</h2>
<p>Personal data you send through the Site is handled as set out in our <a href="/privacy/">Privacy notice</a>. By ticking the consent box on a form you confirm you have read it. Please do not send confidential business information through the forms; we are glad to sign a non‑disclosure agreement before any detailed discussion.</p>

<h2>7. Links</h2>
<p>The Site links to third‑party websites for convenience. We do not control them and are not responsible for their content, availability or privacy practices. A link is not an endorsement.</p>

<h2>8. Liability</h2>
<p>The Site is provided "as is" for general information. To the fullest extent the law allows, RailGrid excludes all warranties about the Site and accepts no liability for any loss or damage, direct or indirect, arising from use of or reliance on the Site or its content, or from inability to use it. Nothing in these terms excludes liability that cannot lawfully be excluded, including for death or personal injury caused by negligence or for fraud. Liability under any services agreement is governed by that agreement, not by these terms.</p>

<h2>9. Governing law and disputes</h2>
<p>These terms and any dispute arising from the Site are governed by the laws of the United Republic of Tanzania, and the courts of Tanzania have exclusive jurisdiction. If any provision is found unenforceable, the rest continues to apply.</p>

<h2>10. Changes to these terms</h2>
<p>We may update these terms from time to time. The version on this page, with its effective date, is the one that applies. Continued use of the Site after a change means you accept the updated terms.</p>

<h2>11. Contact</h2>
<p>{COMPANY}, Dar es Salaam, United Republic of Tanzania · <a href="mailto:{EMAIL}">{EMAIL}</a> · <a href="tel:{PHONE_TEL}">{PHONE}</a></p>
""",
)

# ----------------------------------------------------------------------------- cookies
PAGES["cookies"] = dict(
    title="Cookie Policy",
    description="The cookies and browser storage railgrid.co.tz uses: technically necessary session cookies set by the Frappe framework and a language preference. No analytics, advertising or tracking.",
    lead="This Site sets only technically necessary cookies and remembers your language choice. It runs no analytics, advertising or tracking, so no consent banner is shown.",
    body=f"""
<h2>1. What cookies are</h2>
<p>Cookies are small text files a website stores in your browser. Some are needed for a site to work at all; others track behaviour or serve advertising. Related technologies such as <em>localStorage</em> keep small settings in the browser without sending them to a server.</p>

<h2>2. What this Site uses</h2>
<p>railgrid.co.tz is built on the open‑source Frappe framework, which sets a small set of technical cookies on every visit so that pages, forms and the server can work together. None of them identifies you as a person unless you sign in to an account, and this public Site offers no sign‑up.</p>
<table>
<thead><tr><th scope="col">Name</th><th scope="col">Set by</th><th scope="col">Purpose</th><th scope="col">Type / lifetime</th></tr></thead>
<tbody>
<tr><td>sid</td><td>Frappe framework (railgrid.co.tz)</td><td>Session identifier. For visitors it holds the value "Guest" and lets the server accept a form submission from the page that showed it (protection against forged requests).</td><td>Necessary · session, cleared when you close the browser or after a period of inactivity</td></tr>
<tr><td>system_user, full_name, user_id, user_image</td><td>Frappe framework</td><td>Framework housekeeping that records whether a signed‑in user exists. For visitors these are empty or "Guest".</td><td>Necessary · session</td></tr>
<tr><td>rg_lang</td><td>This Site (browser localStorage, not a cookie)</td><td>Remembers whether you chose English or Kiswahili so the next page loads in the same language.</td><td>Preference · stays until you clear site data</td></tr>
</tbody>
</table>
<p>We set no analytics cookies (there is no Google Analytics or similar), no advertising or social‑media cookies, and no cross‑site tracking. If that ever changes, we will update this policy and ask for your consent before any non‑essential cookie is set.</p>

<h2>3. Third‑party requests</h2>
<p>Page fonts are loaded from Google Fonts. That request carries your IP address to Google but sets no cookie. No other third‑party resources, embeds, videos or widgets are loaded.</p>

<h2>4. Why there is no cookie banner</h2>
<p>Tanzania's Personal Data Protection Act, 2022 requires a lawful basis and transparency for personal data processing; it does not require a pop‑up for cookies that are strictly necessary to run a site or for a preference you set yourself. Because that is all this Site uses, we tell you here instead of interrupting you. Visitors from jurisdictions with specific cookie‑consent rules (for example the EU/UK ePrivacy rules) are likewise not asked, since only exempt, strictly necessary cookies are used.</p>

<h2>5. Managing cookies</h2>
<p>You can block or delete cookies and site data in your browser settings at any time. Blocking the "sid" cookie will stop the enquiry forms from submitting; the rest of the Site will still read normally. Clearing site data resets your language choice to your browser's default.</p>

<h2>6. Contact</h2>
<p>Questions about cookies or this policy: <a href="mailto:{EMAIL}">{EMAIL}</a>. See also our <a href="/privacy/">Privacy notice</a>.</p>
""",
)

# ----------------------------------------------------------------------------- refunds
PAGES["refunds"] = dict(
    title="Refund and Cancellation Policy",
    description="How cancellations, refunds and withdrawal work for RailGrid's implementation, hosting, support and capacity-building services, which are contracted in writing and never sold through this website.",
    lead="Nothing is sold or paid for through this Site. This policy explains how cancellation and refunds work for services contracted with RailGrid, so you know what to expect before you sign.",
    body=f"""
<h2>1. Scope</h2>
<p>{COMPANY} supplies ERPNext implementation, data migration, hosting and managed support, advisory and capacity‑building (training) services to organisations. The Site takes no orders and no payments: every engagement is agreed in a written proposal, statement of work or service agreement signed by both parties (the "Agreement"), which sets the exact scope, fees, payment schedule and cancellation terms. Where the Agreement and this page differ, the Agreement applies. This page describes our standard approach.</p>

<h2>2. Before anything is invoiced</h2>
<p>An enquiry, walkthrough, scoping conversation or Capacity Building registration through this Site commits you to nothing and costs nothing. You may withdraw at any point before signing an Agreement by emailing <a href="mailto:{EMAIL}">{EMAIL}</a>; we will close the enquiry and, on request, delete your details as described in the <a href="/privacy/">Privacy notice</a>.</p>

<h2>3. Implementation, migration and advisory services</h2>
<p>Fees are invoiced against milestones or time as set out in the Agreement. Work completed and accepted, and costs already incurred on your instruction (for example third‑party licences or hosting commitments made on your behalf), are not refundable. Either party may end an engagement on the notice period in the Agreement (our standard is 30 days in writing); on termination you pay for work performed and unavoidable committed costs up to the end of the notice period, and any prepaid fees for work not yet performed are refunded within 30 days. Deliverables paid for are yours.</p>

<h2>4. Hosting, support and maintenance agreements</h2>
<p>Hosting and managed support are provided under an annual agreement covering hosting, helpdesk, statutory updates and upgrades, invoiced in advance for the period agreed. If you cancel during a paid period, hosting continues to the end of that period so that your data remains available, and no refund is due for the remainder unless the Agreement says otherwise. If RailGrid ends the agreement other than for your breach, the unused portion of prepaid fees is refunded pro rata. Before a hosting agreement ends we provide a complete export of your data and configuration; ERPNext is open source, so nothing prevents you from continuing elsewhere.</p>

<h2>5. Training and capacity‑building sessions</h2>
<p>Scheduled briefings, workshops and programmes may be rescheduled once free of charge with at least 10 working days' notice. Cancellation with 10 or more working days' notice is refunded in full, less any non‑recoverable venue or travel costs incurred on your behalf. Cancellation with less notice, or non‑attendance, is charged in full. If RailGrid cancels a session, you may choose a new date or a full refund.</p>

<h2>6. Faults and service credits</h2>
<p>If a service under a support agreement falls short of the agreed service levels, remedies are the service credits and escalation steps in that agreement. If work delivered under a statement of work does not meet its acceptance criteria, we correct it at our cost within the acceptance period set in the Agreement.</p>

<h2>7. How refunds are paid</h2>
<p>Approved refunds are paid by bank transfer to the account the fees were paid from, in the same currency, within 30 days of agreement, net of any bank charges outside our control. Tanzanian VAT already remitted is refunded in line with the Tanzania Revenue Authority's rules on credit notes.</p>

<h2>8. Your statutory rights</h2>
<p>Nothing in this policy limits rights you have under the laws of the United Republic of Tanzania, including the Electronic Transactions Act, 2015 and the consumer‑protection provisions of the Fair Competition Act, 2003, or under the law of any other country that applies to you and cannot be excluded.</p>

<h2>9. Contact</h2>
<p>Cancellation and refund requests: <a href="mailto:{EMAIL}">{EMAIL}</a> · <a href="tel:{PHONE_TEL}">{PHONE}</a> · {COMPANY}, Dar es Salaam, United Republic of Tanzania. Please quote your proposal or invoice number.</p>
""",
)


def shell():
    src = (WWW / "privacy" / "index.html").read_text()
    head_end = src.index("</head>")
    head = src[: head_end + len("</head>")]
    header = src[src.index("<body>") : src.index("<main id=\"main\">")]
    footer = src[src.index("</main>") :]
    return head, header, footer


def build():
    head, header, footer = shell()
    for slug, page in PAGES.items():
        route = f"/{slug}/"
        h = head
        h = re.sub(r"<title>.*?</title>", f"<title>{page['title']} | RailGrid Technologies</title>", h, flags=re.S)
        h = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{page["description"]}">', h)
        h = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="https://railgrid.co.tz{route}">', h)
        h = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{page["title"]} | RailGrid Technologies">', h)
        h = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{page["description"]}">', h)
        h = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="https://railgrid.co.tz{route}">', h)
        h = re.sub(r'(og/)[a-z0-9-]+(\.png)', rf"\g<1>{slug}\2", h)
        main = f"""<main id="main">
<section class="page-hero">
  <div class="container">
    <span class="eyebrow">Legal</span>
    <h1>{page['title']}</h1>
    <p class="lead">{page['lead']}</p>
    <p class="meta mt-16 small muted">Effective {EFFECTIVE} · {COMPANY}</p>
    {LEGAL_NAV}
  </div>
</section>

<section class="section">
  <div class="container legal" data-i18n-skip>
{page['body'].strip()}
  </div>
</section>

"""
        out = WWW / slug
        out.mkdir(exist_ok=True)
        (out / "index.html").write_text(h + "\n" + header + main + footer)
        py = out / "index.py"
        if not py.exists():
            py.write_text("# Website page controller: include this route in Frappe's generated /sitemap.xml\nsitemap = 1\n")
        print("built", route)


if __name__ == "__main__":
    build()
