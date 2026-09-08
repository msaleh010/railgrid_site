/* ------------------------------------------------------------------
   RailGrid — English / Kiswahili language switch (no dependencies)
   Drop-in: load AFTER site.js
   <script src="/assets/railgrid_site/js/railgrid-i18n.js" defer></script>

   How it works
   • Every visible text node is snapshotted on load (the English original).
   • Switching to Kiswahili looks each string up in the SW dictionary
     (exact match after whitespace normalisation) and swaps it in place.
     Strings without a translation stay in English, so partial coverage
     never breaks a page.
   • Placeholders, aria-labels, <title>, meta description and the
     dynamic strings site.js writes ("Sending...", the character counter)
     are handled as well.
   • Choice is remembered in localStorage (rg_lang) and honoured on every
     page. ?lang=sw in the URL also works (useful for sharing a link).
   • Add data-i18n-skip to any element that must never be translated
     (product names, code samples, quotes).
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  var STORAGE_KEY = 'rg_lang';
  var LANGS = { en: 'English', sw: 'Kiswahili' };

  /* ================================================================
     DICTIONARY  —  English (as rendered)  →  Kiswahili
     Keys are matched after collapsing whitespace. Keep product names
     (ERPNext, HCMOS™, PAYE, NSSF …) as they are.
     ================================================================ */
  var SW = {
    /* ---------- Header / navigation / footer ---------- */
    'Platform': 'Jukwaa',
    'Sector editions': 'Matoleo ya sekta',
    'Deployment': 'Usambazaji',
    'Capacity building': 'Kujenga uwezo',
    'Insights': 'Maarifa',
    'Contact': 'Wasiliana nasi',
    'Book a walkthrough': 'Omba maonyesho',
    'Open menu': 'Fungua menyu',
    'Close menu': 'Funga menyu',
    'Primary': 'Menyu kuu',
    'RailGrid Technologies home': 'Ukurasa wa mwanzo wa RailGrid Technologies',
    'Strengthening the institutions Africa already runs on – evolution, not revolution.': 'Kuimarisha taasisi ambazo Afrika tayari inazitegemea – mageuzi ya taratibu, si mapinduzi.',
    'RailGrid Technologies Limited · Dar es Salaam, Tanzania': 'RailGrid Technologies Limited · Dar es Salaam, Tanzania',
    'RailGrid implements and supports ERPNext, an open-source product of Frappe Technologies. ERPNext and Frappe are trademarks of Frappe Technologies Pvt. Ltd. ICDOS™, HCMOS™ and WMOS™ are RailGrid sector editions built on ERPNext.': 'RailGrid inasimika na kuhudumia ERPNext, bidhaa huria (open-source) ya Frappe Technologies. ERPNext na Frappe ni alama za biashara za Frappe Technologies Pvt. Ltd. ICDOS™, HCMOS™ na WMOS™ ni matoleo ya sekta ya RailGrid yaliyojengwa juu ya ERPNext.',
    'Capabilities': 'Uwezo wa mfumo',
    'Deployment & hosting': 'Usambazaji na uhifadhi',
    'Tanzanian localisation': 'Ulinganifu wa Tanzania',
    'Company': 'Kampuni',
    'Clients': 'Wateja',
    'Editions': 'Matoleo',
    'ICDOS™ – Inland container depots': 'ICDOS™ – Bandari kavu za makontena',
    'HCMOS™ – Human capital & payroll': 'HCMOS™ – Rasilimali watu na mishahara',
    'WMOS™ – Warehouse operations': 'WMOS™ – Uendeshaji wa maghala',
    '© 2026 RailGrid Technologies Limited. All rights reserved.': '© 2026 RailGrid Technologies Limited. Haki zote zimehifadhiwa.',
    'Privacy notice': 'Taarifa ya faragha',
    'privacy notice': 'taarifa ya faragha',

    /* ---------- Home ---------- */
    'Built on ERPNext · open source': 'Imejengwa juu ya ERPNext · programu huria',
    'Hosted on Frappe Cloud or your servers': 'Inahifadhiwa Frappe Cloud au kwenye seva zako',
    'Enterprise ERP, implemented and supported in East Africa.': 'ERP ya kitaasisi, inayosimikwa na kuhudumiwa Afrika Mashariki.',
    'RailGrid brings finance, HR & payroll, inventory, procurement and operations into one audited system – ERPNext, configured for Tanzanian compliance and delivered by a team that stays after go‑live.': 'RailGrid inaleta fedha, rasilimali watu na mishahara, bidhaa ghalani, manunuzi na uendeshaji katika mfumo mmoja unaokaguliwa – ERPNext, iliyosanidiwa kwa kufuata sheria za Tanzania na kutolewa na timu inayobaki nawe baada ya mfumo kuanza kutumika.',
    'Book an executive walkthrough': 'Weka miadi ya maonyesho kwa viongozi',
    'See the platform': 'Tazama jukwaa',
    'Live at Taifa Mining & Civils': 'Inatumika Taifa Mining & Civils',
    'No per‑user licence fees': 'Hakuna ada ya leseni kwa kila mtumiaji',
    'Data stays in your jurisdiction': 'Data inabaki ndani ya mamlaka yako',
    'ERPNext · Taifa Mining & Civils · Workforce': 'ERPNext · Taifa Mining & Civils · Wafanyakazi',
    'Employees': 'Wafanyakazi',
    'Sites': 'Maeneo',
    'Payroll run': 'Mzunguko wa mishahara',
    'Posted': 'Imechapishwa',
    'Leave – Site B, 14 requests': 'Likizo – Eneo B, maombi 14',
    'Pending': 'Inasubiri',
    'Overtime – Camp 2, August': 'Muda wa ziada – Kambi 2, Agosti',
    'Approved': 'Imeidhinishwa',
    'NSSF & PAYE return – August': 'Ritani ya NSSF na PAYE – Agosti',
    'Filed': 'Imewasilishwa',
    'The platform': 'Jukwaa',
    'One system for the whole institution – not a stack of modules.': 'Mfumo mmoja kwa taasisi nzima – si rundo la moduli.',
    'Every module shares one ledger, one approval engine and one audit trail. What you switch on is a configuration decision, not a new purchase.': 'Kila moduli inashiriki leja moja, injini moja ya idhini na rekodi moja ya ukaguzi. Unachokiwasha ni uamuzi wa usanidi, si manunuzi mapya.',
    'Accounting & Finance': 'Uhasibu na Fedha',
    'GL, AR/AP, budgets, multi‑currency, cost centres, IFRS reporting.': 'Leja kuu, wadaiwa/wadai, bajeti, sarafu nyingi, vituo vya gharama, ripoti za IFRS.',
    'HR & Payroll': 'Rasilimali Watu na Mishahara',
    'Attendance, leave, shifts, appraisals, training, Tanzanian statutory payroll.': 'Mahudhurio, likizo, zamu, tathmini, mafunzo, mishahara kwa mujibu wa sheria za Tanzania.',
    'Inventory & Warehouse': 'Bidhaa Ghalani na Maghala',
    'Bin, batch and serial tracking, cycle counts, transfers, valuation.': 'Ufuatiliaji kwa sehemu, kundi na namba ya mfululizo, hesabu za mzunguko, uhamisho, uthamini.',
    'Procurement': 'Manunuzi',
    'Requests, RFQs, supplier scorecards, purchase orders, three‑way matching.': 'Maombi, maombi ya bei, kadi za alama za wasambazaji, oda za manunuzi, ulinganifu wa njia tatu.',
    'Manufacturing': 'Uzalishaji viwandani',
    'BOMs, work orders, job cards, capacity planning and subcontracting.': 'Orodha za malighafi, oda za kazi, kadi za kazi, upangaji wa uwezo na ukandarasi mdogo.',
    'Projects': 'Miradi',
    'Tasks, timesheets, milestones and costing against budget.': 'Kazi, ratiba za muda, hatua muhimu na gharama dhidi ya bajeti.',
    'Assets & Maintenance': 'Mali na Matengenezo',
    'Registers, depreciation, maintenance schedules and downtime.': 'Rejista, uchakavu, ratiba za matengenezo na muda wa kutofanya kazi.',
    'CRM & Sales': 'Uhusiano na Wateja na Mauzo',
    'Leads, quotations, contracts, invoicing and collections.': 'Wateja tarajiwa, nukuu za bei, mikataba, ankara na ukusanyaji.',
    'Quality & Compliance': 'Ubora na Uzingatiaji',
    'Inspections, non‑conformance, procedures, audit trail on every record.': 'Ukaguzi, kutokidhi viwango, taratibu, rekodi ya ukaguzi kwenye kila kumbukumbu.',
    'Dashboards & Reporting': 'Dashibodi na Ripoti',
    'Role‑based KPIs, report builder, scheduled board packs.': 'Viashiria kwa kila nafasi, kijenga‑ripoti, mafaili ya bodi yaliyoratibiwa.',
    'Explore every capability': 'Chunguza kila uwezo',
    'Preconfigured for the institutions Africa runs on.': 'Imesanidiwa mapema kwa taasisi ambazo Afrika inazitegemea.',
    'Each edition is the same platform with the workflows, master data, reports and controls of one sector already in place – so implementation starts from month one, not from a blank system.': 'Kila toleo ni jukwaa lilelile likiwa na mtiririko wa kazi, data kuu, ripoti na udhibiti wa sekta moja tayari vimewekwa – hivyo usimikaji unaanza kuanzia mwezi wa kwanza, si kutoka kwenye mfumo tupu.',
    'Mining & Resources': 'Madini na Rasilimali',
    'Live': 'Inatumika',
    'HCMOS™ Edition': 'Toleo la HCMOS™',
    'Multi‑site workforce, camp rosters, gate attendance, grievances, statutory payroll and Exact integration – proven at Taifa Mining & Civils.': 'Wafanyakazi wa maeneo mengi, ratiba za kambi, mahudhurio getini, malalamiko, mishahara ya kisheria na muunganiko na Exact – imethibitishwa Taifa Mining & Civils.',
    'Explore HCMOS™ →': 'Chunguza HCMOS™ →',
    'Logistics & Trade': 'Usafirishaji na Biashara',
    'ICDOS™ Edition': 'Toleo la ICDOS™',
    'Container depot operations from gate‑in to gate‑out: storage and handling billing, revenue assurance, agent portal and TRA‑compliant invoicing.': 'Uendeshaji wa bandari kavu kuanzia kuingia getini hadi kutoka: ankara za uhifadhi na ushughulikiaji, uhakikisho wa mapato, tovuti ya mawakala na ankara zinazokidhi TRA.',
    'Explore ICDOS™ →': 'Chunguza ICDOS™ →',
    'Industrial Operations': 'Uendeshaji wa Viwanda',
    'WMOS™ Edition': 'Toleo la WMOS™',
    'Inbound to dispatch with bin, batch and serial control, cycle counts, multi‑warehouse transfers and variance workflows posted to the ledger.': 'Kuanzia kupokea hadi kusafirisha kwa udhibiti wa sehemu, kundi na namba ya mfululizo, hesabu za mzunguko, uhamisho kati ya maghala na mtiririko wa tofauti unaochapishwa kwenye leja.',
    'Explore WMOS™ →': 'Chunguza WMOS™ →',
    'Government & Public Sector': 'Serikali na Sekta ya Umma',
    'Public Institution Edition': 'Toleo la Taasisi za Umma',
    'Budget‑controlled procurement, asset registers, HR establishment and payroll, grant and project accounting, with full approval audit for oversight bodies.': 'Manunuzi yanayodhibitiwa na bajeti, rejista za mali, ikama ya watumishi na mishahara, uhasibu wa ruzuku na miradi, pamoja na ukaguzi kamili wa idhini kwa vyombo vya usimamizi.',
    'Learn more →': 'Jifunze zaidi →',
    'Banking & Financial Services': 'Benki na Huduma za Fedha',
    'Back‑office Edition': 'Toleo la Ofisi ya Nyuma',
    'Non‑core operations for banks, SACCOs and insurers: HR, procurement, fixed assets, branch expense control and management reporting alongside the core banking system.': 'Shughuli zisizo za msingi kwa benki, SACCOS na bima: rasilimali watu, manunuzi, mali za kudumu, udhibiti wa matumizi ya matawi na ripoti za uongozi sambamba na mfumo mkuu wa benki.',
    'Energy & Utilities': 'Nishati na Huduma za Umma',
    'Utilities Edition': 'Toleo la Mashirika ya Huduma',
    'Asset‑heavy maintenance, field workforce, spares inventory, project capitalisation and regulatory reporting for generation, distribution and water utilities.': 'Matengenezo ya mali nyingi, wafanyakazi wa uwandani, hifadhi ya vipuri, uwekaji mtaji wa miradi na ripoti za kisheria kwa mashirika ya uzalishaji, usambazaji na maji.',
    'Tanzanian localisation in every edition:': 'Ulinganifu wa Tanzania katika kila toleo:',
    'TRA VFD e‑invoicing': 'Ankara za kielektroniki za TRA VFD',
    'TZS + multi‑currency': 'TZS + sarafu nyingi',
    'Kiswahili UI': 'Kiolesura cha Kiswahili',
    'Run it where your policy says it must run.': 'Iendeshe pale sera yako inaposema lazima iendeshwe.',
    'Same platform, three hosting models. Move between them later without re‑implementing – the data and configuration are yours.': 'Jukwaa lilelile, mifumo mitatu ya uhifadhi. Hamia kati yake baadaye bila kusimika upya – data na usanidi ni vyako.',
    'Recommended': 'Inapendekezwa',
    'Frappe Cloud': 'Frappe Cloud',
    'Managed hosting by the makers of ERPNext. Automated backups, upgrades, monitoring and scaling. Go live in weeks with no server team.': 'Uhifadhi unaosimamiwa na watengenezaji wa ERPNext. Nakala rudufu, uboreshaji, ufuatiliaji na upanuzi wa kiotomatiki. Anza kutumia ndani ya wiki chache bila timu ya seva.',
    'For regulated data': 'Kwa data inayodhibitiwa kisheria',
    'Private cloud in Tanzania': 'Wingu binafsi nchini Tanzania',
    'Dedicated instance in an in‑country data centre, operated by RailGrid under an SLA. Meets residency requirements for public and financial institutions.': 'Mfumo maalumu katika kituo cha data ndani ya nchi, unaoendeshwa na RailGrid chini ya mkataba wa huduma (SLA). Unakidhi masharti ya ukaaji wa data kwa taasisi za umma na za fedha.',
    'For remote sites': 'Kwa maeneo ya mbali',
    'On‑premise': 'Kwenye seva zako',
    'Installed on your own servers at a mine, depot or head office where connectivity is unreliable. Same software, full source access, no lock‑in.': 'Inasimikwa kwenye seva zako mgodini, bandari kavu au makao makuu ambako mtandao hauaminiki. Programu ileile, ufikiaji kamili wa msimbo, hakuna kufungwa na mtoa huduma.',
    'Compare hosting options': 'Linganisha chaguo za uhifadhi',
    'Client story · Mining': 'Simulizi ya mteja · Madini',
    'Taifa Mining & Civils replaced spreadsheets and disconnected HR tools with one auditable system.': 'Taifa Mining & Civils ilibadilisha majedwali na zana za rasilimali watu zisizounganishwa kwa mfumo mmoja unaokaguliwa.',
    'Across mine sites, camps and head office: employees, attendance, leave, performance, training, grievances and approvals now run on the HCMOS™ edition of ERPNext, with payroll posted to Exact and a mobile self‑service app for staff in the field.': 'Katika maeneo ya mgodi, kambi na makao makuu: wafanyakazi, mahudhurio, likizo, utendaji, mafunzo, malalamiko na idhini sasa vinaendeshwa kwenye toleo la HCMOS™ la ERPNext, mishahara ikichapishwa kwenye Exact na programu ya simu ya kujihudumia kwa wafanyakazi wa uwandani.',
    'Read the client story': 'Soma simulizi ya mteja',
    'Reference call available on request': 'Simu ya rejea inapatikana ukiomba',
    'employees on the system': 'wafanyakazi kwenye mfumo',
    'sites and camps': 'maeneo na kambi',
    '[N] weeks': 'wiki [N]',
    'from kick‑off to go‑live': 'kuanzia uzinduzi hadi kuanza kutumika',
    '[N] days': 'siku [N]',
    'payroll cycle, down from [N]': 'mzunguko wa mishahara, umepungua kutoka [N]',
    'How we deliver': 'Jinsi tunavyotekeleza',
    'Software is the easy part. We stay for the hard part.': 'Programu ni sehemu rahisi. Tunabaki kwa ajili ya sehemu ngumu.',
    'Our doctrine: no operational event without traceability, no financial entry without source intent, no override without an audit record. Implementation is where that gets built in.': 'Msimamo wetu: hakuna tukio la uendeshaji bila ufuatiliaji, hakuna ingizo la fedha bila kusudi la chanzo, hakuna kupitilizwa bila rekodi ya ukaguzi. Usimikaji ndipo hayo yanapojengwa ndani.',
    'Implementation': 'Usimikaji',
    'Process mapping, configuration, approval design and controlled cut‑over – phased by site or function.': 'Uchoraji wa michakato, usanidi, muundo wa idhini na uhamishaji unaodhibitiwa – kwa awamu kulingana na eneo au idara.',
    'Data migration & integration': 'Uhamishaji wa data na muunganiko',
    'From spreadsheets, Exact, Sage, Tally or legacy HR systems. Reconciled opening balances, not just imported rows.': 'Kutoka majedwali, Exact, Sage, Tally au mifumo ya zamani ya rasilimali watu. Salio za ufunguzi zilizosuluhishwa, si safu zilizoingizwa tu.',
    'Role‑based training and an internal ERP champion programme, so the institution can specify, govern and extend the system itself.': 'Mafunzo kwa kila nafasi na programu ya mabingwa wa ERP wa ndani, ili taasisi iweze kuainisha, kusimamia na kupanua mfumo yenyewe.',
    'Managed support': 'Msaada unaosimamiwa',
    'Helpdesk, statutory updates, version upgrades and monthly health reviews under a service‑level agreement.': 'Dawati la msaada, masasisho ya kisheria, uboreshaji wa matoleo na mapitio ya afya ya mfumo kila mwezi chini ya mkataba wa kiwango cha huduma.',
    'See it in your operation.': 'Ione ikifanya kazi katika shughuli zako.',
    'A focused executive walkthrough on workforce, finance, depot or warehouse governance – configured around your environment, not a generic demo.': 'Maonyesho ya viongozi yaliyolenga usimamizi wa wafanyakazi, fedha, bandari kavu au ghala – yakisanidiwa kulingana na mazingira yako, si onyesho la kawaida.',

    /* ---------- Editions index ---------- */
    'Built for institutions that cannot afford to stop.': 'Imejengwa kwa taasisi zisizoweza kumudu kusimama.',
    'An edition is ERPNext with one sector\'s workflows, master data, reports and controls already configured. Implementation starts from a working system, not a blank one – and everything is still the same platform underneath.': 'Toleo ni ERPNext ikiwa na mtiririko wa kazi, data kuu, ripoti na udhibiti wa sekta moja tayari vimesanidiwa. Usimikaji unaanza kutoka kwenye mfumo unaofanya kazi, si mfumo tupu – na kila kitu bado ni jukwaa lilelile chini.',
    'An edition is ERPNext with one sector’s workflows, master data, reports and controls already configured. Implementation starts from a working system, not a blank one – and everything is still the same platform underneath.': 'Toleo ni ERPNext ikiwa na mtiririko wa kazi, data kuu, ripoti na udhibiti wa sekta moja tayari vimesanidiwa. Usimikaji unaanza kutoka kwenye mfumo unaofanya kazi, si mfumo tupu – na kila kitu bado ni jukwaa lilelile chini.',
    'Human capital and payroll for multi‑site operations: camps, rosters, gate attendance, statutory payroll and a field app for every employee.': 'Rasilimali watu na mishahara kwa shughuli za maeneo mengi: kambi, ratiba za zamu, mahudhurio getini, mishahara ya kisheria na programu ya uwandani kwa kila mfanyakazi.',
    'Inland container depot operations, storage and handling billing, revenue assurance and an agent portal – all posted to the ledger in real time.': 'Uendeshaji wa bandari kavu, ankara za uhifadhi na ushughulikiaji, uhakikisho wa mapato na tovuti ya mawakala – vyote vikichapishwa kwenye leja papo hapo.',
    'Warehouse operations from receiving to dispatch with bin, batch and serial control, cycle counts and variance workflows.': 'Uendeshaji wa ghala kuanzia kupokea hadi kusafirisha kwa udhibiti wa sehemu, kundi na namba ya mfululizo, hesabu za mzunguko na mtiririko wa tofauti.',
    'For ministries, agencies, authorities, local government and parastatals that must show every shilling was committed, approved and spent in line with a budget and a delegation of authority.': 'Kwa wizara, wakala, mamlaka, serikali za mitaa na mashirika ya umma yanayopaswa kuonyesha kuwa kila shilingi iliahidiwa, kuidhinishwa na kutumika kulingana na bajeti na mgawanyo wa mamlaka.',
    'Budget commitment control on requisitions and purchase orders, by vote and cost centre.': 'Udhibiti wa ahadi za bajeti kwenye maombi na oda za manunuzi, kwa fungu na kituo cha gharama.',
    'Procurement workflows with tender records, evaluation and contract management.': 'Mtiririko wa manunuzi wenye rekodi za zabuni, tathmini na usimamizi wa mikataba.',
    'Establishment control: approved positions, vacancies and payroll linked to the structure.': 'Udhibiti wa ikama: nafasi zilizoidhinishwa, nafasi wazi na mishahara iliyounganishwa na muundo.',
    'Asset registers with custodians, verification exercises and disposals.': 'Rejista za mali zenye watunzaji, zoezi la uhakiki na uondoshaji.',
    'Grant and project accounting for donor‑funded programmes with separate reporting.': 'Uhasibu wa ruzuku na miradi kwa programu zinazofadhiliwa na wafadhili, zenye ripoti tofauti.',
    'Approval audit that internal audit and oversight bodies can inspect directly.': 'Ukaguzi wa idhini ambao ukaguzi wa ndani na vyombo vya usimamizi vinaweza kuuchunguza moja kwa moja.',
    'The core banking system runs the accounts. Everything around it – people, procurement, assets, branch costs and management reporting – runs here, consolidated and audited.': 'Mfumo mkuu wa benki unaendesha akaunti. Kila kitu kinachokizunguka – watu, manunuzi, mali, gharama za matawi na ripoti za uongozi – kinaendeshwa hapa, kikiwa kimeunganishwa na kukaguliwa.',
    'HR and payroll for head office and branch networks, with statutory compliance.': 'Rasilimali watu na mishahara kwa makao makuu na mtandao wa matawi, kwa kufuata sheria.',
    'Procurement and supplier management with segregation of duties.': 'Manunuzi na usimamizi wa wasambazaji wenye mgawanyo wa majukumu.',
    'Fixed assets across branches, from ATMs to vehicles, with depreciation and verification.': 'Mali za kudumu katika matawi yote, kuanzia ATM hadi magari, zenye uchakavu na uhakiki.',
    'Branch expense control against budget, with approval hierarchies.': 'Udhibiti wa matumizi ya matawi dhidi ya bajeti, wenye ngazi za idhini.',
    'Management reporting that consolidates the core system\'s GL extract with operating costs.': 'Ripoti za uongozi zinazounganisha dondoo la leja kuu ya mfumo mkuu na gharama za uendeshaji.',
    'Management reporting that consolidates the core system’s GL extract with operating costs.': 'Ripoti za uongozi zinazounganisha dondoo la leja kuu ya mfumo mkuu na gharama za uendeshaji.',
    'Suitable for banks, SACCOs, microfinance institutions and insurers.': 'Inafaa kwa benki, SACCOS, taasisi za fedha ndogo na kampuni za bima.',
    'For generation, transmission, distribution and water utilities where the balance sheet is made of assets in the field and the workforce that keeps them running.': 'Kwa mashirika ya uzalishaji, usafirishaji, usambazaji na maji ambapo mizania imeundwa na mali zilizo uwandani na wafanyakazi wanaozifanya ziendelee kufanya kazi.',
    'Asset registers by substation, plant, line and zone, with condition and history.': 'Rejista za mali kwa kituo kidogo, mtambo, laini na kanda, zenye hali na historia.',
    'Preventive and breakdown maintenance with work orders, crews and spares.': 'Matengenezo ya kinga na ya hitilafu yenye oda za kazi, vikundi vya kazi na vipuri.',
    'Spares and consumables inventory across depots, with reorder rules.': 'Hifadhi ya vipuri na vifaa vya matumizi katika maghala yote, yenye sheria za kuagiza upya.',
    'Field workforce scheduling, attendance and payroll.': 'Upangaji ratiba, mahudhurio na mishahara ya wafanyakazi wa uwandani.',
    'Project capitalisation from work‑in‑progress to fixed asset.': 'Uwekaji mtaji wa miradi kutoka kazi‑inayoendelea hadi mali ya kudumu.',
    'Regulatory and board reporting from one governed data set.': 'Ripoti za kisheria na za bodi kutoka seti moja ya data inayosimamiwa.',
    'What an edition contains': 'Toleo linajumuisha nini',
    'Configuration, not code – so it stays upgradeable.': 'Usanidi, si msimbo – hivyo inaendelea kuboreshwa.',
    'Editions are delivered as ERPNext configuration and RailGrid apps that follow the Frappe framework\'s rules, so standard version upgrades continue to apply.': 'Matoleo yanatolewa kama usanidi wa ERPNext na programu za RailGrid zinazofuata kanuni za mfumo wa Frappe, hivyo uboreshaji wa kawaida wa matoleo unaendelea kutumika.',
    'Editions are delivered as ERPNext configuration and RailGrid apps that follow the Frappe framework’s rules, so standard version upgrades continue to apply.': 'Matoleo yanatolewa kama usanidi wa ERPNext na programu za RailGrid zinazofuata kanuni za mfumo wa Frappe, hivyo uboreshaji wa kawaida wa matoleo unaendelea kutumika.',
    'Workflows': 'Mtiririko wa kazi',
    'Approval chains, document states and delegated authority matching how the sector is regulated.': 'Mnyororo wa idhini, hali za nyaraka na mamlaka yaliyokasimiwa yanayolingana na jinsi sekta inavyodhibitiwa.',
    'Master data': 'Data kuu',
    'Chart of accounts, cost centres, item groups, HR structures and templates ready for the sector.': 'Chati ya akaunti, vituo vya gharama, makundi ya bidhaa, miundo ya rasilimali watu na violezo tayari kwa sekta.',
    'Reports & dashboards': 'Ripoti na dashibodi',
    'The KPIs and statutory reports the sector\'s executives and regulators actually ask for.': 'Viashiria na ripoti za kisheria ambazo viongozi na wadhibiti wa sekta wanaziomba kwa hakika.',
    'The KPIs and statutory reports the sector’s executives and regulators actually ask for.': 'Viashiria na ripoti za kisheria ambazo viongozi na wadhibiti wa sekta wanaziomba kwa hakika.',
    'Controls': 'Udhibiti',
    'Role sets, segregation of duties and audit configurations that pass an internal‑audit review.': 'Seti za nafasi, mgawanyo wa majukumu na usanidi wa ukaguzi unaopita mapitio ya ukaguzi wa ndani.',
    'Not in one of these sectors?': 'Hauko katika mojawapo ya sekta hizi?',
    'The platform is the same. Talk to us about what your institution runs on and we will show you how it maps.': 'Jukwaa ni lilelile. Zungumza nasi kuhusu taasisi yako inaendeshwa na nini na tutakuonyesha jinsi inavyolingana.',
    'Talk to RailGrid': 'Zungumza na RailGrid',

    /* ---------- Platform page ---------- */
    'Everything an institution runs on, in one audited system.': 'Kila kitu ambacho taasisi inakitegemea, katika mfumo mmoja unaokaguliwa.',
    'RailGrid implements ERPNext – the open‑source ERP used by tens of thousands of organisations worldwide – and localises it for how Tanzanian and East African institutions actually operate. One ledger, one approval engine, one audit trail across every function.': 'RailGrid inasimika ERPNext – ERP huria inayotumiwa na makumi ya maelfu ya mashirika duniani – na kuilinganisha na jinsi taasisi za Tanzania na Afrika Mashariki zinavyofanya kazi kwa hakika. Leja moja, injini moja ya idhini, rekodi moja ya ukaguzi katika kila idara.',
    'Open source · GPL v3': 'Programu huria · GPL v3',
    'Full source access': 'Ufikiaji kamili wa msimbo',
    'Web, mobile and API': 'Wavuti, simu na API',
    'Capability map': 'Ramani ya uwezo',
    'Ten modules. One data model.': 'Moduli kumi. Muundo mmoja wa data.',
    'Switch on what you need now and add the rest later without migration – every module writes to the same ledger and reads the same master data.': 'Washa unachokihitaji sasa na ongeza mengine baadaye bila uhamishaji – kila moduli inaandika kwenye leja ileile na kusoma data kuu ileile.',
    'Chart of accounts, general ledger, receivables and payables, bank reconciliation, budgets with commitment control, cost centres and dimensions, multi‑company consolidation, multi‑currency with revaluation, fixed‑asset depreciation, deferred revenue and IFRS‑ready financial statements.': 'Chati ya akaunti, leja kuu, wadaiwa na wadai, usuluhishi wa benki, bajeti zenye udhibiti wa ahadi, vituo vya gharama na vipimo, uunganishaji wa kampuni nyingi, sarafu nyingi zenye uthamini upya, uchakavu wa mali za kudumu, mapato yaliyoahirishwa na taarifa za fedha zinazokidhi IFRS.',
    'Employee lifecycle from onboarding to exit, org structure and establishment control, biometric and geofenced attendance, shift and roster management, leave policies and approvals, appraisals and objectives, training and certification tracking, grievances, and payroll with PAYE, NSSF, WCF, SDL and loan deductions. Employee self‑service on mobile.': 'Mzunguko wa mfanyakazi kuanzia kuajiriwa hadi kuondoka, muundo wa shirika na udhibiti wa ikama, mahudhurio ya kibayometriki na ya eneo la kijiografia, usimamizi wa zamu na ratiba, sera za likizo na idhini, tathmini na malengo, ufuatiliaji wa mafunzo na vyeti, malalamiko, na mishahara yenye makato ya PAYE, NSSF, WCF, SDL na mikopo. Kujihudumia kwa mfanyakazi kupitia simu.',
    'Multi‑warehouse stock with bin, batch and serial tracking, valuation methods, ASN‑driven receiving, putaway, pick lists, packing and dispatch, stock transfers and reconciliation, cycle counts with variance investigation, and landed‑cost accounting.': 'Bidhaa katika maghala mengi zenye ufuatiliaji wa sehemu, kundi na namba ya mfululizo, mbinu za uthamini, upokeaji kwa ASN, uwekaji, orodha za kuchukua, ufungaji na usafirishaji, uhamisho na usuluhishi wa bidhaa, hesabu za mzunguko zenye uchunguzi wa tofauti, na uhasibu wa gharama ya kufika.',
    'Material requests, supplier quotations and comparison, purchase orders with approval chains, supplier scorecards, contracts and blanket orders, three‑way matching of order, receipt and invoice, and procurement dashboards for oversight.': 'Maombi ya vifaa, nukuu za bei za wasambazaji na ulinganisho, oda za manunuzi zenye mnyororo wa idhini, kadi za alama za wasambazaji, mikataba na oda za jumla, ulinganifu wa njia tatu wa oda, risiti na ankara, na dashibodi za manunuzi kwa usimamizi.',
    'Multi‑level bills of material, production planning, work orders and job cards, capacity planning, subcontracting, scrap and by‑product accounting, and actual‑versus‑standard costing.': 'Orodha za malighafi za ngazi nyingi, upangaji wa uzalishaji, oda za kazi na kadi za kazi, upangaji wa uwezo, ukandarasi mdogo, uhasibu wa mabaki na bidhaa‑pambizo, na gharama halisi dhidi ya kiwango.',
    'Projects and tasks, timesheets, milestones, project costing against budget, billing by milestone or time, and profitability reporting – linked to procurement, payroll and the ledger.': 'Miradi na kazi, ratiba za muda, hatua muhimu, gharama za mradi dhidi ya bajeti, ankara kwa hatua au muda, na ripoti za faida – vikiunganishwa na manunuzi, mishahara na leja.',
    'Asset register with location and custodian, capitalisation from purchase, depreciation schedules, preventive maintenance calendars, breakdown logs and repair costs, transfers and disposals.': 'Rejista ya mali yenye eneo na mtunzaji, uwekaji mtaji kutoka manunuzi, ratiba za uchakavu, kalenda za matengenezo ya kinga, kumbukumbu za hitilafu na gharama za ukarabati, uhamisho na uondoshaji.',
    'Leads and opportunities, quotations and contracts, sales orders, invoicing and collections, customer credit control, and a customer portal for statements and documents.': 'Wateja tarajiwa na fursa, nukuu za bei na mikataba, oda za mauzo, ankara na ukusanyaji, udhibiti wa mikopo ya wateja, na tovuti ya wateja kwa taarifa na nyaraka.',
    'Quality inspections at receipt and dispatch, non‑conformance and corrective action, procedures and reviews, and a system‑wide audit trail on every document, version and override.': 'Ukaguzi wa ubora wakati wa kupokea na kusafirisha, kutokidhi viwango na hatua za marekebisho, taratibu na mapitio, na rekodi ya ukaguzi ya mfumo mzima kwenye kila hati, toleo na kupitilizwa.',
    'Role‑based dashboards, a no‑code report builder, scheduled board packs by email, and open APIs for BI tools where a deeper analytics layer is required.': 'Dashibodi kwa kila nafasi, kijenga‑ripoti kisichohitaji msimbo, mafaili ya bodi yaliyoratibiwa kwa barua pepe, na API huria kwa zana za BI pale tabaka la kina la uchambuzi linapohitajika.',
    'Compliance built in, not bolted on.': 'Uzingatiaji umejengwa ndani, si kubandikwa.',
    'Statutory rules are configured and maintained by RailGrid as regulations change, so the system stays compliant without a project each time the rates move.': 'Kanuni za kisheria zinasanidiwa na kudumishwa na RailGrid kadri kanuni zinavyobadilika, hivyo mfumo unaendelea kuzingatia sheria bila mradi kila viwango vinapobadilika.',
    'Payroll statutory': 'Mishahara kwa mujibu wa sheria',
    'PAYE bands, NSSF employee and employer contributions, WCF, SDL, HESLB loan deductions, and the monthly and annual returns in the formats the authorities accept.': 'Viwango vya PAYE, michango ya NSSF ya mfanyakazi na mwajiri, WCF, SDL, makato ya mikopo ya HESLB, na ritani za kila mwezi na mwaka katika miundo inayokubaliwa na mamlaka.',
    'Tax & invoicing': 'Kodi na ankara',
    'VAT configuration, TRA VFD/EFD electronic fiscal invoicing, withholding tax, and TIN capture on customers and suppliers.': 'Usanidi wa VAT, ankara za kielektroniki za TRA VFD/EFD, kodi ya zuio, na kurekodi TIN kwa wateja na wasambazaji.',
    'Currency & language': 'Sarafu na lugha',
    'Tanzanian Shilling as base currency with USD and other currencies, exchange‑rate revaluation, and a Kiswahili user interface for staff who need it.': 'Shilingi ya Tanzania kama sarafu ya msingi pamoja na USD na sarafu nyingine, uthamini upya wa viwango vya ubadilishaji, na kiolesura cha Kiswahili kwa wafanyakazi wanaokihitaji.',
    'Public‑sector controls': 'Udhibiti wa sekta ya umma',
    'Budget commitment control, approval hierarchies matching delegated authority, and audit trails that satisfy oversight and internal audit requirements.': 'Udhibiti wa ahadi za bajeti, ngazi za idhini zinazolingana na mamlaka yaliyokasimiwa, na rekodi za ukaguzi zinazokidhi mahitaji ya usimamizi na ukaguzi wa ndani.',
    'Regional operations': 'Shughuli za kikanda',
    'Multi‑company and multi‑currency structures for groups operating across Kenya, Uganda, Rwanda, Zambia, the DRC and the Gulf.': 'Miundo ya kampuni nyingi na sarafu nyingi kwa makundi yanayofanya kazi Kenya, Uganda, Rwanda, Zambia, DRC na Ghuba.',
    'Integrations': 'Muunganiko',
    'Exact, Sage and Tally for finance, biometric attendance devices, mobile‑money and bank feeds, and any system with an API – ERPNext exposes REST endpoints on every record.': 'Exact, Sage na Tally kwa fedha, vifaa vya mahudhurio ya kibayometriki, mlisho wa pesa za simu na benki, na mfumo wowote wenye API – ERPNext inatoa vituo vya REST kwenye kila rekodi.',
    'Security & governance': 'Usalama na utawala',
    'Security by design. Governance embedded.': 'Usalama kwa muundo. Utawala umejengwa ndani.',
    'The controls the current RailGrid doctrine demands are native to the platform, and enforced the same way in every module.': 'Udhibiti unaodaiwa na msimamo wa sasa wa RailGrid ni sehemu ya asili ya jukwaa, na unatekelezwa kwa njia ileile katika kila moduli.',
    'Role‑based access control down to field level, with segregation of duties across functions.': 'Udhibiti wa ufikiaji kwa nafasi hadi ngazi ya sehemu ya data, wenye mgawanyo wa majukumu katika idara zote.',
    'Immutable audit log of every create, change, submit, cancel and override, with user, time and before/after values.': 'Kumbukumbu ya ukaguzi isiyobadilika ya kila uundaji, mabadiliko, uwasilishaji, ufutaji na kupitilizwa, yenye mtumiaji, muda na thamani za kabla/baada.',
    'Document workflows with approval chains that match delegated authority – no action without a recorded approver.': 'Mtiririko wa nyaraka wenye mnyororo wa idhini unaolingana na mamlaka yaliyokasimiwa – hakuna hatua bila mwidhinishaji aliyerekodiwa.',
    'Two‑factor authentication, session controls, password policy and login audit.': 'Uthibitishaji wa hatua mbili, udhibiti wa vipindi, sera ya nywila na ukaguzi wa kuingia.',
    'Encrypted backups, point‑in‑time restore and tested disaster‑recovery procedures.': 'Nakala rudufu zilizosimbwa, urejeshaji wa wakati maalumu na taratibu za kurejesha baada ya maafa zilizojaribiwa.',
    'Open standards and full source access: no vendor lock‑in, and an independent audit can inspect exactly what the system does.': 'Viwango huria na ufikiaji kamili wa msimbo: hakuna kufungwa na mtoa huduma, na ukaguzi huru unaweza kuchunguza hasa mfumo unafanya nini.',
    'No operational event exists without traceability.': 'Hakuna tukio la uendeshaji bila ufuatiliaji.',
    'No financial entry exists without source intent.': 'Hakuna ingizo la fedha bila kusudi la chanzo.',
    'No override exists without audit record.': 'Hakuna kupitilizwa bila rekodi ya ukaguzi.',
    'Map the platform to your operation.': 'Linganisha jukwaa na shughuli zako.',
    'Bring your process pain points to a working session and see the exact module, workflow and report that answers each one.': 'Leta changamoto za michakato yako kwenye kikao cha kazi na uone moduli, mtiririko na ripoti hasa inayojibu kila moja.',

    /* ---------- Deployment page ---------- */
    'Same platform, three hosting models. Because ERPNext is open source and the data is yours, you can move between them later without re‑implementing.': 'Jukwaa lilelile, mifumo mitatu ya uhifadhi. Kwa kuwa ERPNext ni programu huria na data ni yako, unaweza kuhamia kati yake baadaye bila kusimika upya.',
    'Managed hosting by Frappe, the makers of ERPNext. Automated backups, version upgrades, monitoring, scaling and SSL – with RailGrid as your implementation and support partner on top.': 'Uhifadhi unaosimamiwa na Frappe, watengenezaji wa ERPNext. Nakala rudufu, uboreshaji wa matoleo, ufuatiliaji, upanuzi na SSL vya kiotomatiki – RailGrid ikiwa mshirika wako wa usimikaji na msaada juu yake.',
    'Go live in weeks with no server team': 'Anza kutumia ndani ya wiki chache bila timu ya seva',
    'Daily offsite backups, point‑in‑time restore': 'Nakala rudufu za kila siku nje ya eneo, urejeshaji wa wakati maalumu',
    'Region selectable for data residency': 'Kanda inachaguliwa kwa ukaaji wa data',
    'RailGrid managed support included': 'Msaada unaosimamiwa na RailGrid umejumuishwa',
    'A dedicated, single‑tenant instance in an in‑country data centre, operated by RailGrid under a service‑level agreement. Built for public institutions and financial services with residency obligations.': 'Mfumo maalumu wa mpangaji mmoja katika kituo cha data ndani ya nchi, unaoendeshwa na RailGrid chini ya mkataba wa kiwango cha huduma. Umejengwa kwa taasisi za umma na huduma za fedha zenye wajibu wa ukaaji wa data.',
    'Data held in Tanzania': 'Data inahifadhiwa Tanzania',
    'Encrypted at rest and in transit': 'Imesimbwa ikiwa imehifadhiwa na ikiwa safarini',
    'Named support engineer': 'Mhandisi wa msaada aliyetajwa',
    'Patch windows agreed with you': 'Muda wa masasisho unakubaliwa nawe',
    'Installed on your own servers at a mine, depot or head office where connectivity cannot be relied upon. The same software, full source access and no lock‑in.': 'Inasimikwa kwenye seva zako mgodini, bandari kavu au makao makuu ambako mtandao hauwezi kutegemewa. Programu ileile, ufikiaji kamili wa msimbo na hakuna kufungwa.',
    'Keeps working through outages': 'Inaendelea kufanya kazi wakati wa kukatika kwa mtandao',
    'Your IT team trained to operate it': 'Timu yako ya TEHAMA inafundishwa kuiendesha',
    'Optional replication to cloud': 'Unakili wa hiari kwenda wingu',
    'Hardware sizing by RailGrid': 'Ukubwa wa vifaa unapangwa na RailGrid',
    'Compare': 'Linganisha',
    'What each model gives you.': 'Kila mfumo unakupa nini.',
    'All three include RailGrid implementation, localisation and support. The difference is who runs the servers and where the data sits.': 'Yote matatu yanajumuisha usimikaji, ulinganifu na msaada wa RailGrid. Tofauti ni nani anaendesha seva na data inakaa wapi.',
    'Private cloud (TZ)': 'Wingu binafsi (TZ)',
    'Infrastructure operated by': 'Miundombinu inaendeshwa na',
    'Your IT team, trained by RailGrid': 'Timu yako ya TEHAMA, iliyofundishwa na RailGrid',
    'Data location': 'Eneo la data',
    'Selectable region': 'Kanda inayochaguliwa',
    'Tanzania': 'Tanzania',
    'Your premises': 'Majengo yako',
    'Backups & restore': 'Nakala rudufu na urejeshaji',
    'Automated, offsite': 'Kiotomatiki, nje ya eneo',
    'Automated, in‑country': 'Kiotomatiki, ndani ya nchi',
    'Configured by RailGrid, run by you': 'Inasanidiwa na RailGrid, inaendeshwa nawe',
    'Version upgrades': 'Uboreshaji wa matoleo',
    'Managed, one click': 'Unasimamiwa, bofya mara moja',
    'Scheduled by RailGrid': 'Unaratibiwa na RailGrid',
    'Scheduled with RailGrid': 'Unaratibiwa pamoja na RailGrid',
    'Typical time to live': 'Muda wa kawaida hadi kuanza kutumika',
    'Fastest': 'Haraka zaidi',
    'Fast': 'Haraka',
    'Depends on hardware': 'Inategemea vifaa',
    'Best for': 'Inafaa zaidi kwa',
    'Most organisations': 'Mashirika mengi',
    'Public sector, banks, insurers': 'Sekta ya umma, benki, bima',
    'Remote sites, poor connectivity': 'Maeneo ya mbali, mtandao dhaifu',
    'Licence fees': 'Ada za leseni',
    'None – hosting only': 'Hakuna – uhifadhi tu',
    'None': 'Hakuna',
    'Operations': 'Uendeshaji',
    'What "managed" means in practice.': 'Maana halisi ya "kusimamiwa".',
    'What “managed” means in practice.': 'Maana halisi ya “kusimamiwa”.',
    'Whichever model you choose, RailGrid remains accountable for the system working – not just for installing it.': 'Mfumo wowote utakaochagua, RailGrid inabaki kuwajibika kwa mfumo kufanya kazi – si kuusimika tu.',
    'Monitoring': 'Ufuatiliaji',
    'Uptime, performance and backup checks with alerts to the RailGrid support desk.': 'Ukaguzi wa upatikanaji, utendaji na nakala rudufu wenye tahadhari kwa dawati la msaada la RailGrid.',
    'Statutory updates': 'Masasisho ya kisheria',
    'PAYE, NSSF, VAT and other rule changes applied and tested before they take effect.': 'Mabadiliko ya PAYE, NSSF, VAT na kanuni nyingine yanawekwa na kujaribiwa kabla hayajaanza kutumika.',
    'Upgrades': 'Uboreshaji',
    'ERPNext version upgrades planned, tested on a staging copy and applied in an agreed window.': 'Uboreshaji wa matoleo ya ERPNext unapangwa, kujaribiwa kwenye nakala ya majaribio na kuwekwa katika muda uliokubaliwa.',
    'Helpdesk': 'Dawati la msaada',
    'Named contacts, ticket tracking and response targets under a service‑level agreement.': 'Wawasiliani waliotajwa, ufuatiliaji wa tiketi na malengo ya majibu chini ya mkataba wa kiwango cha huduma.',
    'Not sure which model fits?': 'Huna uhakika mfumo upi unakufaa?',
    'Tell us your data‑residency obligations, site connectivity and IT capacity, and we will recommend one – and size it.': 'Tuambie wajibu wako wa ukaaji wa data, hali ya mtandao eneo lako na uwezo wa TEHAMA, nasi tutapendekeza mmoja – na kuupangia ukubwa.',
    'Ask for a recommendation': 'Omba pendekezo',

    /* ---------- Capacity building ---------- */
    'Digital Transformation Capacity Building': 'Kujenga Uwezo wa Mabadiliko ya Kidijitali',
    'Building the capability inside your organisation to specify, govern and get value from technology. For boards, executives, technology leadership, functional heads and IT departments – whether or not you ever buy a system from us.': 'Kujenga uwezo ndani ya shirika lako wa kuainisha, kusimamia na kupata thamani kutoka kwenye teknolojia. Kwa bodi, viongozi wakuu, uongozi wa teknolojia, wakuu wa idara na idara za TEHAMA – ukinunua mfumo kutoka kwetu au la.',
    'Register your organisation': 'Sajili shirika lako',
    'Speak to us first': 'Zungumza nasi kwanza',
    'The problem': 'Tatizo',
    'Four failures that repeat, in every sector, for the same reason.': 'Kasoro nne zinazojirudia, katika kila sekta, kwa sababu ileile.',
    'Each of these is a capability gap, not a software gap. An ERP project that starts without closing them ends with the old spreadsheet still running.': 'Kila moja ya hizi ni pengo la uwezo, si pengo la programu. Mradi wa ERP unaoanza bila kuziba mapengo haya unaishia na jedwali la zamani likiendelea kutumika.',
    'The board cannot interrogate technology': 'Bodi haiwezi kuhoji teknolojia',
    'Technology reaches the board as a status update rather than as a business case, so the hard question is not asked until the money is spent.': 'Teknolojia inafika bodini kama taarifa ya hali badala ya hoja ya kibiashara, hivyo swali gumu haliulizwi hadi fedha zimeshatumika.',
    'The executive cannot specify': 'Uongozi hauwezi kuainisha mahitaji',
    'Requirements arrive as a wish list rather than a defined outcome, so the vendor scopes the work and the organisation inherits whatever the vendor thought best.': 'Mahitaji yanafika kama orodha ya matakwa badala ya matokeo yaliyoainishwa, hivyo muuzaji anapanga upeo wa kazi na shirika linarithi chochote alichodhani muuzaji ni bora.',
    'The middle cannot absorb': 'Ngazi ya kati haiwezi kupokea mabadiliko',
    'A system goes live and the parallel spreadsheet survives, because the process was never redesigned around the system.': 'Mfumo unaanza kutumika na jedwali sambamba linaendelea kuishi, kwa sababu mchakato haukuwahi kubuniwa upya kuzunguka mfumo.',
    'The technical team cannot advance': 'Timu ya kiufundi haiwezi kusonga mbele',
    'Capable engineers spend their time keeping yesterday running, so under‑budgeting and mounting technical risk surface only when something fails.': 'Wahandisi wenye uwezo wanatumia muda wao kuendesha mifumo ya jana, hivyo bajeti pungufu na hatari ya kiufundi inayoongezeka vinajitokeza tu kitu kinaposhindwa.',
    'The model': 'Muundo',
    'Three domains, one governed data foundation.': 'Nyanja tatu, msingi mmoja wa data unaosimamiwa.',
    'The three domains are transformed together, on one governed data foundation. Change one alone and the other two pull it back.': 'Nyanja tatu zinabadilishwa pamoja, juu ya msingi mmoja wa data unaosimamiwa. Badilisha moja peke yake na nyingine mbili zitairudisha nyuma.',
    'What changes': 'Kinachobadilika',
    'Processes, models, relationships': 'Michakato, miundo, mahusiano',
    'Business processes': 'Michakato ya biashara',
    '– how the work is actually done.': '– jinsi kazi inavyofanyika kwa hakika.',
    'Business models': 'Miundo ya biashara',
    '– how the organisation earns and competes.': '– jinsi shirika linavyopata mapato na kushindana.',
    'Customer relationships': 'Mahusiano na wateja',
    '– internal employees or external customers.': '– wafanyakazi wa ndani au wateja wa nje.',
    'One unified system': 'Mfumo mmoja ulioungana',
    'Data – governed, single source': 'Data – inasimamiwa, chanzo kimoja',
    'People. Process. Platform. Policy. The four held together by one data foundation everybody trusts – which, in practice, is what an ERP is for.': 'Watu. Mchakato. Jukwaa. Sera. Vinne hivyo vinashikiliwa pamoja na msingi mmoja wa data ambao kila mtu anauamini – ambao, kwa vitendo, ndio kusudi la ERP.',
    'What the business gets': 'Biashara inapata nini',
    'Governance, visibility, control': 'Utawala, uwazi, udhibiti',
    'Governance': 'Utawala',
    '– decisions made on evidence, not opinion.': '– maamuzi yanafanywa kwa ushahidi, si maoni.',
    'Visibility': 'Uwazi',
    '– the same picture for everyone who looks.': '– picha ileile kwa kila anayeangalia.',
    'Control': 'Udhibiti',
    '– exceptions found early, not at year end.': '– kasoro zinagunduliwa mapema, si mwisho wa mwaka.',
    'Who it is for': 'Ni kwa ajili ya nani',
    'Every level that has to carry a decision.': 'Kila ngazi inayopaswa kubeba uamuzi.',
    'Board and directors': 'Bodi na wakurugenzi',
    'What to expect from the executive, and how to read a technology business review.': 'Cha kutarajia kutoka kwa uongozi, na jinsi ya kusoma mapitio ya biashara ya teknolojia.',
    'CEO, COO and executive committee': 'Mkurugenzi Mtendaji, Mkurugenzi wa Uendeshaji na kamati ya utendaji',
    'Owning the transformation agenda, the investment case and the benefit that follows it.': 'Kumiliki ajenda ya mabadiliko, hoja ya uwekezaji na faida inayofuata.',
    'CIO, CTO and technology leadership': 'CIO, CTO na uongozi wa teknolojia',
    'Architecture, security, delivery cadence and the discipline of saying no.': 'Usanifu, usalama, mwendo wa utekelezaji na nidhamu ya kusema hapana.',
    'Functional and departmental heads': 'Wakuu wa idara na vitengo',
    'Process digitisation, one version of the number, and adoption that survives the pilot.': 'Udijitali wa michakato, toleo moja la namba, na matumizi yanayodumu baada ya majaribio.',
    'IT departments and technical teams': 'Idara za TEHAMA na timu za kiufundi',
    'Integration, resilience, controls and the daily practice that makes all of it real.': 'Muunganiko, uimara, udhibiti na mazoezi ya kila siku yanayofanya yote yawe halisi.',
    'The programme catalogue': 'Orodha ya programu',
    'Five tracks, selected and adapted to the room.': 'Njia tano, zinazochaguliwa na kurekebishwa kulingana na washiriki.',
    'No generic material is delivered twice. Each track is adapted to the organisation before it is delivered.': 'Hakuna maudhui ya jumla yanayotolewa mara mbili. Kila njia inarekebishwa kulingana na shirika kabla ya kutolewa.',
    'Track A · Boardroom and directors': 'Njia A · Chumba cha bodi na wakurugenzi',
    'The technology agenda in the boardroom · Reading the technology business review · Investment, benefit and the case that follows it · Technology risk and the director\'s exposure · Data as an asset the board owns': 'Ajenda ya teknolojia bodini · Kusoma mapitio ya biashara ya teknolojia · Uwekezaji, faida na hoja inayofuata · Hatari ya teknolojia na dhima ya mkurugenzi · Data kama mali inayomilikiwa na bodi',
    'The technology agenda in the boardroom · Reading the technology business review · Investment, benefit and the case that follows it · Technology risk and the director’s exposure · Data as an asset the board owns': 'Ajenda ya teknolojia bodini · Kusoma mapitio ya biashara ya teknolojia · Uwekezaji, faida na hoja inayofuata · Hatari ya teknolojia na dhima ya mkurugenzi · Data kama mali inayomilikiwa na bodi',
    'Track B · Chief executives and executive committees': 'Njia B · Wakurugenzi watendaji na kamati za utendaji',
    'Owning the transformation agenda · Specifying outcomes, not wish lists · The investment case and benefit realisation · Governing the vendor relationship · Reading the numbers the system produces': 'Kumiliki ajenda ya mabadiliko · Kuainisha matokeo, si orodha za matakwa · Hoja ya uwekezaji na upatikanaji wa faida · Kusimamia uhusiano na muuzaji · Kusoma namba ambazo mfumo unazalisha',
    'Track C · Technology leadership and IT departments': 'Njia C · Uongozi wa teknolojia na idara za TEHAMA',
    'Architecture and platform decisions · Security and controls · Delivery cadence · Integration and resilience · Running an open‑source ERP estate responsibly': 'Maamuzi ya usanifu na jukwaa · Usalama na udhibiti · Mwendo wa utekelezaji · Muunganiko na uimara · Kuendesha mfumo wa ERP huria kwa uwajibikaji',
    'Track D · Functional and departmental heads': 'Njia D · Wakuu wa idara na vitengo',
    'Process digitisation · One version of the number · Approval design · Adoption that survives the pilot · Retiring the parallel spreadsheet': 'Udijitali wa michakato · Toleo moja la namba · Muundo wa idhini · Matumizi yanayodumu baada ya majaribio · Kustaafisha jedwali sambamba',
    'Track E · Sector tracks': 'Njia E · Njia za kisekta',
    'Mining and civils · Logistics, terminals and depots · Government institutions · Financial services · Energy and utilities · Manufacturing and distribution': 'Madini na ujenzi · Usafirishaji, vituo na bandari kavu · Taasisi za serikali · Huduma za fedha · Nishati na huduma za umma · Uzalishaji na usambazaji',
    'Formats': 'Miundo ya utoaji',
    'Five ways to run it.': 'Njia tano za kuiendesha.',
    'Not a lecture. Participants bring their own operation into the room and senior managers present a problem from their own area. Something usable leaves the room – each session produces an artefact the organisation keeps.': 'Si mhadhara. Washiriki wanaleta shughuli zao wenyewe chumbani na mameneja waandamizi wanawasilisha tatizo kutoka eneo lao. Kitu kinachotumika kinatoka chumbani – kila kikao kinazalisha zao ambalo shirika linalibakiza.',
    'Executive briefing': 'Muhtasari kwa viongozi',
    'Half a day, boardroom setting, up to fifteen participants.': 'Nusu siku, mazingira ya chumba cha bodi, hadi washiriki kumi na watano.',
    'Workshop': 'Warsha',
    'One day, working session with materials and exercises. The standard format.': 'Siku moja, kikao cha kazi chenye nyenzo na mazoezi. Muundo wa kawaida.',
    'Tailor‑made programme': 'Programu maalumu',
    'Multiple days, structured around one organisation and its systems. For corporates, enterprises and government institutions.': 'Siku kadhaa, ikipangwa kuzunguka shirika moja na mifumo yake. Kwa makampuni, mashirika makubwa na taasisi za serikali.',
    'Maturity assessment and roadmap': 'Tathmini ya ukomavu na ramani ya njia',
    'A structured review with a written baseline and a sequenced plan.': 'Mapitio yaliyopangwa yenye msingi ulioandikwa na mpango wenye mpangilio.',
    'Embedded advisory': 'Ushauri wa ndani',
    'A recurring engagement alongside the executive or the technology function.': 'Ushirikiano wa mara kwa mara sambamba na uongozi au kitengo cha teknolojia.',
    'Facilitator': 'Mwezeshaji',
    'Founder and Chief Technology Officer, RailGrid Technologies Limited': 'Mwanzilishi na Afisa Mkuu wa Teknolojia, RailGrid Technologies Limited',
    'More than fifteen years building and transforming secure, regulator‑ready technology functions across multi‑country enterprises, preceded by seven years of university‑level teaching in computer science. M.Sc. Computer Systems, Networking and Telecommunications, University of Greenwich, London.': 'Zaidi ya miaka kumi na mitano ya kujenga na kubadilisha vitengo vya teknolojia salama vinavyokidhi wadhibiti katika mashirika ya nchi nyingi, ikitanguliwa na miaka saba ya kufundisha sayansi ya kompyuta ngazi ya chuo kikuu. M.Sc. Mifumo ya Kompyuta, Mitandao na Mawasiliano ya Simu, Chuo Kikuu cha Greenwich, London.',
    'A diversified group of eighteen operating companies': 'Kundi la kampuni kumi na nane za shughuli mbalimbali',
    'Group technology strategy held for a decade across East Africa and the Gulf.': 'Mkakati wa teknolojia wa kundi ulioshikiliwa kwa muongo mmoja Afrika Mashariki na Ghuba.',
    'A global logistics and trading group across five jurisdictions': 'Kundi la kimataifa la usafirishaji na biashara katika mamlaka tano',
    'Three regional systems consolidated into one estate with international‑standard controls.': 'Mifumo mitatu ya kikanda iliunganishwa kuwa mfumo mmoja wenye udhibiti wa viwango vya kimataifa.',
    'A greenfield enterprise software company': 'Kampuni mpya kabisa ya programu za kitaasisi',
    'Strategy, architecture and governance baseline from inception; platforms delivered to regulated clients.': 'Msingi wa mkakati, usanifu na utawala tangu kuanzishwa; majukwaa yalitolewa kwa wateja wanaodhibitiwa kisheria.',
    'Tell us what you want to achieve.': 'Tuambie unataka kufanikisha nini.',
    'We will come back to arrange a scoping conversation. Nothing is proposed before that has happened.': 'Tutarudi kupanga mazungumzo ya kuainisha upeo. Hakuna kinachopendekezwa kabla ya hilo kutokea.',
    'The organisation': 'Shirika',
    'Organisation name': 'Jina la shirika',
    '(required)': '(lazima)',
    'Sector': 'Sekta',
    'Select a sector': 'Chagua sekta',
    'Logistics, transport and terminals': 'Usafirishaji, uchukuzi na vituo',
    'Trading and distribution': 'Biashara na usambazaji',
    'Government institution or public body': 'Taasisi ya serikali au chombo cha umma',
    'Mining, civils and projects': 'Madini, ujenzi na miradi',
    'Financial or professional services': 'Huduma za fedha au za kitaalamu',
    'Energy and utilities': 'Nishati na huduma za umma',
    'Other': 'Nyingine',
    'Country': 'Nchi',
    'Kenya': 'Kenya',
    'Uganda': 'Uganda',
    'Rwanda': 'Rwanda',
    'Burundi': 'Burundi',
    'South Sudan': 'Sudan Kusini',
    'Democratic Republic of the Congo': 'Jamhuri ya Kidemokrasia ya Kongo',
    'Zambia': 'Zambia',
    'United Arab Emirates': 'Falme za Kiarabu',
    'Saudi Arabia': 'Saudi Arabia',
    'Oman': 'Oman',
    'Qatar': 'Qatar',
    'Kuwait': 'Kuwait',
    'Bahrain': 'Bahrain',
    'Approximate number of employees': 'Makadirio ya idadi ya wafanyakazi',
    'Select a range': 'Chagua kiwango',
    'Under 50': 'Chini ya 50',
    '50 to 250': '50 hadi 250',
    '250 to 1,000': '250 hadi 1,000',
    'Over 1,000': 'Zaidi ya 1,000',
    'Who we should speak to': 'Tuzungumze na nani',
    'Contact name': 'Jina la mwasiliani',
    'Job title': 'Cheo',
    'Work email': 'Barua pepe ya kazi',
    'Phone': 'Simu',
    '(international format accepted)': '(muundo wa kimataifa unakubalika)',
    'What you need': 'Unachohitaji',
    'Audiences to be reached': 'Walengwa wa kufikiwa',
    'Chief executives and executive committee': 'Wakurugenzi watendaji na kamati ya utendaji',
    'Technology leadership': 'Uongozi wa teknolojia',
    'IT and technical teams': 'Timu za TEHAMA na za kiufundi',
    'Tracks of interest': 'Njia unazovutiwa nazo',
    'Preferred format': 'Muundo unaopendelea',
    'Select a format': 'Chagua muundo',
    'Not sure yet': 'Sina uhakika bado',
    'Approximate number of participants': 'Makadirio ya idadi ya washiriki',
    'Preferred timing': 'Muda unaopendelea',
    'Select a timeframe': 'Chagua kipindi',
    'Within a month': 'Ndani ya mwezi mmoja',
    'Within a quarter': 'Ndani ya robo mwaka',
    'Within six months': 'Ndani ya miezi sita',
    'Exploring only': 'Nachunguza tu',
    'How did you hear about this?': 'Ulisikia vipi kuhusu hili?',
    'Select an option': 'Chagua chaguo',
    'Referral': 'Kupendekezwa na mtu',
    'LinkedIn': 'LinkedIn',
    'Web search': 'Utafutaji mtandaoni',
    'Event': 'Tukio',
    'Existing RailGrid client': 'Mteja wa sasa wa RailGrid',
    'What are you trying to achieve?': 'Unajaribu kufanikisha nini?',
    'I agree that RailGrid Technologies Limited may contact me about this enquiry and may store the information I have provided for that purpose. See our': 'Nakubali kwamba RailGrid Technologies Limited inaweza kuwasiliana nami kuhusu ombi hili na inaweza kuhifadhi taarifa nilizotoa kwa kusudi hilo. Tazama',
    'Submit registration': 'Wasilisha usajili',
    'Your details are used for this enquiry only.': 'Taarifa zako zinatumika kwa ombi hili pekee.',

    /* ---------- Insights ---------- */
    'Research. Analysis. Advisory.': 'Utafiti. Uchambuzi. Ushauri.',
    'Field notes on infrastructure governance and operational discipline across Africa.': 'Maelezo ya uwandani kuhusu utawala wa miundombinu na nidhamu ya uendeshaji barani Afrika.',
    'Featured · Infrastructure': 'Iliyoangaziwa · Miundombinu',
    'The Moving Grid: What the Tour de France Teaches About Infrastructure': 'Gridi Inayosonga: Tour de France Inafundisha Nini Kuhusu Miundombinu',
    'A 3,300‑kilometre race across 21 stages is a rolling stress test for power, telecoms, transit, medical response and civil coordination. What African operators can learn from a peloton that moves through a country and leaves it working.': 'Mbio za kilomita 3,300 katika hatua 21 ni jaribio linalosonga la umeme, mawasiliano, usafiri, majibu ya kitabibu na uratibu wa kiraia. Waendeshaji wa Afrika wanaweza kujifunza nini kutoka kwa kundi la waendesha baiskeli linalopita nchini na kuiacha ikifanya kazi.',
    '23 Jul 2026 · 8 min read': '23 Jul 2026 · dakika 8 za kusoma',
    '19 Jun 2026 · 8 min': '19 Jun 2026 · dakika 8',
    '4 Apr 2026 · 6 min': '4 Apr 2026 · dakika 6',
    '2 Apr 2026 · 7 min': '2 Apr 2026 · dakika 7',
    '28 Mar 2026 · 10 min': '28 Mar 2026 · dakika 10',
    '26 Mar 2026 · 7 min': '26 Mar 2026 · dakika 7',
    'Read the article': 'Soma makala',
    'Corridors, not venues →': 'Korido, si kumbi →',
    'Infrastructure': 'Miundombinu',
    'Hosting Major Global Events: The Infrastructure Question Behind the Spectacle': 'Kuandaa Matukio Makubwa ya Kimataifa: Swali la Miundombinu Nyuma ya Tamasha',
    'Stadiums get the cameras. Power, transit, telecoms, payments and identity systems get the load. A field perspective on what "resilient" really means when the world arrives at once.': 'Viwanja vinapata kamera. Umeme, usafiri, mawasiliano, malipo na mifumo ya utambulisho vinapata mzigo. Mtazamo wa uwandani kuhusu maana halisi ya "uimara" dunia inapofika kwa pamoja.',
    'Stadiums get the cameras. Power, transit, telecoms, payments and identity systems get the load. A field perspective on what “resilient” really means when the world arrives at once.': 'Viwanja vinapata kamera. Umeme, usafiri, mawasiliano, malipo na mifumo ya utambulisho vinapata mzigo. Mtazamo wa uwandani kuhusu maana halisi ya “uimara” dunia inapofika kwa pamoja.',
    'Full article coming to this site': 'Makala kamili inakuja kwenye tovuti hii',
    'Product': 'Bidhaa',
    'Security by Design: How the ICDOS™ Edition Embeds Governance at Every Layer': 'Usalama kwa Muundo: Jinsi Toleo la ICDOS™ Linavyojenga Utawala Katika Kila Tabaka',
    'A technical overview of how the ICDOS™ value architecture on ERPNext enforces security, audit trails and role‑based access from the visibility layer through intelligence.': 'Muhtasari wa kiufundi wa jinsi usanifu wa thamani wa ICDOS™ juu ya ERPNext unavyotekeleza usalama, rekodi za ukaguzi na ufikiaji kwa nafasi kuanzia tabaka la uwazi hadi la akili.',
    'Compliance': 'Uzingatiaji',
    'TCRA Compliance for Digital Logistics: What Operators Must Know': 'Uzingatiaji wa TCRA kwa Usafirishaji wa Kidijitali: Waendeshaji Wanapaswa Kujua Nini',
    'Tanzania\'s regulatory framework is tightening around digital systems in trade and logistics. This guide breaks down the compliance requirements and timelines.': 'Mfumo wa udhibiti wa Tanzania unabana kuhusu mifumo ya kidijitali katika biashara na usafirishaji. Mwongozo huu unachambua mahitaji ya uzingatiaji na ratiba zake.',
    'Tanzania’s regulatory framework is tightening around digital systems in trade and logistics. This guide breaks down the compliance requirements and timelines.': 'Mfumo wa udhibiti wa Tanzania unabana kuhusu mifumo ya kidijitali katika biashara na usafirishaji. Mwongozo huu unachambua mahitaji ya uzingatiaji na ratiba zake.',
    'ERP Consolidation Across Multi‑Country Operations: Lessons from the Field': 'Uunganishaji wa ERP Katika Shughuli za Nchi Nyingi: Mafunzo Kutoka Uwandani',
    'Drawing from 15+ years of enterprise IT transformation across East Africa and the GCC, key patterns for successful ERP consolidation in fragmented environments.': 'Kutokana na zaidi ya miaka 15 ya mabadiliko ya TEHAMA ya kitaasisi Afrika Mashariki na GCC, mifumo muhimu ya uunganishaji wa ERP wenye mafanikio katika mazingira yaliyogawanyika.',
    'Revenue assurance': 'Uhakikisho wa mapato',
    'Revenue Leakage in Depot Operations: The $3.2M Problem Nobody Talks About': 'Uvujaji wa Mapato Katika Uendeshaji wa Bandari Kavu: Tatizo la $3.2M Ambalo Hakuna Anayelizungumzia',
    'Research‑based analysis of how unstructured depot systems lose revenue through unlinked charges, manual reconciliation failures and operational opacity.': 'Uchambuzi wa kiutafiti wa jinsi mifumo ya bandari kavu isiyopangwa inavyopoteza mapato kupitia gharama zisizounganishwa, kushindwa kwa usuluhishi wa mikono na ukosefu wa uwazi wa uendeshaji.',
    'Briefings, by invitation': 'Muhtasari, kwa mwaliko',
    'Quarterly notes on infrastructure, governance and live engagement learnings. No filler.': 'Maelezo ya kila robo mwaka kuhusu miundombinu, utawala na mafunzo kutoka kazi zinazoendelea. Hakuna maneno ya kujaza.',
    'Request the briefings': 'Omba muhtasari',

    /* ---------- Contact ---------- */
    'Talk to RailGrid.': 'Zungumza na RailGrid.',
    'Finance, workforce, depot or warehouse – book a working session with the team that implements and supports the system.': 'Fedha, wafanyakazi, bandari kavu au ghala – weka miadi ya kikao cha kazi na timu inayosimika na kuhudumia mfumo.',
    'Product walkthrough': 'Maonyesho ya bidhaa',
    'A live session on ERPNext and the ICDOS™, HCMOS™ or WMOS™ edition, mapped to your own operation – bring your real process, not a checklist.': 'Kikao cha moja kwa moja kuhusu ERPNext na toleo la ICDOS™, HCMOS™ au WMOS™, kikilinganishwa na shughuli zako – leta mchakato wako halisi, si orodha ya kukagua.',
    'Anchor partnership': 'Ushirikiano wa mteja‑nanga',
    'Deploy first in your sector, shape the edition\'s roadmap with us, and set the standard the rest of the sector is measured against.': 'Kuwa wa kwanza kusimika katika sekta yako, tengeneza ramani ya toleo pamoja nasi, na weka kiwango ambacho sekta nzima itapimwa nacho.',
    'Deploy first in your sector, shape the edition’s roadmap with us, and set the standard the rest of the sector is measured against.': 'Kuwa wa kwanza kusimika katika sekta yako, tengeneza ramani ya toleo pamoja nasi, na weka kiwango ambacho sekta nzima itapimwa nacho.',
    'Advisory session': 'Kikao cha ushauri',
    'Confidential review of governance, revenue assurance, ERP readiness or the state of your current systems.': 'Mapitio ya siri ya utawala, uhakikisho wa mapato, utayari wa ERP au hali ya mifumo yako ya sasa.',
    'Send a message': 'Tuma ujumbe',
    'We respond within one working day.': 'Tunajibu ndani ya siku moja ya kazi.',
    'Full name': 'Jina kamili',
    'I would like to': 'Ningependa',
    'Book a product walkthrough': 'Kuweka miadi ya maonyesho ya bidhaa',
    'Apply as an anchor client': 'Kuomba kuwa mteja‑nanga',
    'Request an advisory session': 'Kuomba kikao cha ushauri',
    'Ask about hosting and pricing': 'Kuuliza kuhusu uhifadhi na bei',
    'Receive the quarterly briefings': 'Kupokea muhtasari wa kila robo mwaka',
    'Something else': 'Jambo lingine',
    'How can we help?': 'Tunaweza kukusaidia vipi?',
    'Send message': 'Tuma ujumbe',
    'Sending...': 'Inatuma...',
    'Thank you. We will reply within one working day.': 'Asante. Tutajibu ndani ya siku moja ya kazi.',
    'What to expect': 'Cha kutarajia',
    'Reply within one working day': 'Jibu ndani ya siku moja ya kazi',
    'NDA available on request': 'Mkataba wa usiri unapatikana ukiomba',
    'Every enquiry logged and tracked – in our own ERPNext': 'Kila ombi linarekodiwa na kufuatiliwa – kwenye ERPNext yetu wenyewe',
    'Direct contact': 'Mawasiliano ya moja kwa moja',
    'RailGrid Technologies Limited': 'RailGrid Technologies Limited',
    'Dar es Salaam, Tanzania': 'Dar es Salaam, Tanzania',
    'Quarterly notes on infrastructure, governance and live engagement learnings. No filler, no spam, unsubscribe anytime. Choose "Receive the quarterly briefings" in the form.': 'Maelezo ya kila robo mwaka kuhusu miundombinu, utawala na mafunzo kutoka kazi zinazoendelea. Hakuna maneno ya kujaza, hakuna taka‑barua, jiondoe wakati wowote. Chagua "Kupokea muhtasari wa kila robo mwaka" kwenye fomu.',
    'Quarterly notes on infrastructure, governance and live engagement learnings. No filler, no spam, unsubscribe anytime. Choose “Receive the quarterly briefings” in the form.': 'Maelezo ya kila robo mwaka kuhusu miundombinu, utawala na mafunzo kutoka kazi zinazoendelea. Hakuna maneno ya kujaza, hakuna taka‑barua, jiondoe wakati wowote. Chagua “Kupokea muhtasari wa kila robo mwaka” kwenye fomu.',

    /* ---------- Clients ---------- */
    'Live in the mining sector.': 'Inatumika katika sekta ya madini.',
    'Taifa Mining & Civils is the first organisation on RailGrid\'s HCMOS™ edition of ERPNext – replacing spreadsheets and disconnected HR tools with one auditable platform across mine sites, camps and head office.': 'Taifa Mining & Civils ni shirika la kwanza kwenye toleo la HCMOS™ la ERPNext la RailGrid – likibadilisha majedwali na zana za rasilimali watu zisizounganishwa kwa jukwaa moja linalokaguliwa katika maeneo ya mgodi, kambi na makao makuu.',
    'Taifa Mining & Civils is the first organisation on RailGrid’s HCMOS™ edition of ERPNext – replacing spreadsheets and disconnected HR tools with one auditable platform across mine sites, camps and head office.': 'Taifa Mining & Civils ni shirika la kwanza kwenye toleo la HCMOS™ la ERPNext la RailGrid – likibadilisha majedwali na zana za rasilimali watu zisizounganishwa kwa jukwaa moja linalokaguliwa katika maeneo ya mgodi, kambi na makao makuu.',
    'Client story · Mining & civils': 'Simulizi ya mteja · Madini na ujenzi',
    'One workforce system, from the gate to the payroll posting.': 'Mfumo mmoja wa wafanyakazi, kuanzia getini hadi uchapishaji wa mishahara.',
    'Before: employee records in spreadsheets by site, leave tracked by email, attendance on paper at the gate, and a payroll assembled by hand each month. After: every employee event captured once, approved through a defined chain, and posted to Exact with a full audit trail.': 'Kabla: rekodi za wafanyakazi kwenye majedwali kwa kila eneo, likizo zikifuatiliwa kwa barua pepe, mahudhurio kwenye karatasi getini, na mishahara ikikusanywa kwa mikono kila mwezi. Baada: kila tukio la mfanyakazi linarekodiwa mara moja, linaidhinishwa kupitia mnyororo uliobainishwa, na kuchapishwa kwenye Exact na rekodi kamili ya ukaguzi.',
    'Workforce overview · KPI scorecard': 'Muhtasari wa wafanyakazi · Kadi ya viashiria',
    'Attendance': 'Mahudhurio',
    'Leave pending': 'Likizo zinazosubiri',
    'Certs expiring': 'Vyeti vinavyoisha muda',
    'Grievance case GR‑0412 – Site C': 'Kesi ya lalamiko GR‑0412 – Eneo C',
    'Under review': 'Inapitiwa',
    'Training – Blasting refresher, 22 staff': 'Mafunzo – Rejea ya ulipuaji, wafanyakazi 22',
    'Scheduled': 'Imeratibiwa',
    'Payroll August – Exact journal': 'Mishahara Agosti – Jarida la Exact',
    'Scope delivered': 'Upeo uliotekelezwa',
    'Modules in use at Taifa.': 'Moduli zinazotumika Taifa.',
    'Configured from the HCMOS™ edition, adapted to Taifa\'s sites, shift patterns and approval structure.': 'Zimesanidiwa kutoka toleo la HCMOS™, zikirekebishwa kulingana na maeneo, mifumo ya zamu na muundo wa idhini wa Taifa.',
    'Configured from the HCMOS™ edition, adapted to Taifa’s sites, shift patterns and approval structure.': 'Zimesanidiwa kutoka toleo la HCMOS™, zikirekebishwa kulingana na maeneo, mifumo ya zamu na muundo wa idhini wa Taifa.',
    'Workforce overview & KPI scorecard': 'Muhtasari wa wafanyakazi na kadi ya viashiria',
    'Headcount, attendance, leave, turnover and compliance by site, for the executive team and site managers.': 'Idadi ya wafanyakazi, mahudhurio, likizo, mabadiliko ya wafanyakazi na uzingatiaji kwa kila eneo, kwa timu ya uongozi na mameneja wa maeneo.',
    'Employees, leave & attendance': 'Wafanyakazi, likizo na mahudhurio',
    'Single employee record, leave entitlements and approval chains, attendance from the gate and geofenced mobile check‑in.': 'Rekodi moja ya mfanyakazi, stahili za likizo na mnyororo wa idhini, mahudhurio kutoka getini na kuingia kwa simu kwenye eneo la kijiografia.',
    'Performance, training, grievances & approvals': 'Utendaji, mafunzo, malalamiko na idhini',
    'Appraisal cycles, certification expiry tracking, grievance cases with escalation, and every approval logged.': 'Mizunguko ya tathmini, ufuatiliaji wa kuisha kwa vyeti, kesi za malalamiko zenye upandishaji ngazi, na kila idhini inarekodiwa.',
    'Reports, Exact integration & data migration': 'Ripoti, muunganiko na Exact na uhamishaji wa data',
    'Payroll journals posted to Exact, statutory returns, and the migration of historical records from spreadsheets.': 'Majarida ya mishahara yanachapishwa kwenye Exact, ritani za kisheria, na uhamishaji wa rekodi za zamani kutoka majedwali.',
    'Security, organisation settings & mobile app': 'Usalama, mipangilio ya shirika na programu ya simu',
    'Role‑based access by site and function, organisation structure, and the employee self‑service app for staff in the field.': 'Ufikiaji kwa nafasi kulingana na eneo na idara, muundo wa shirika, na programu ya kujihudumia kwa wafanyakazi wa uwandani.',
    'Ongoing helpdesk, statutory updates and monthly health reviews under RailGrid\'s support agreement.': 'Dawati la msaada endelevu, masasisho ya kisheria na mapitio ya afya ya mfumo kila mwezi chini ya mkataba wa msaada wa RailGrid.',
    'Ongoing helpdesk, statutory updates and monthly health reviews under RailGrid’s support agreement.': 'Dawati la msaada endelevu, masasisho ya kisheria na mapitio ya afya ya mfumo kila mwezi chini ya mkataba wa msaada wa RailGrid.',
    'Advisory experience': 'Uzoefu wa ushauri',
    'Drawn from experience, not from a curriculum.': 'Unatokana na uzoefu, si mtaala.',
    'Client names from RailGrid\'s founding team\'s prior engagements are withheld as a matter of policy. Referees can be provided in confidence where an engagement is being seriously considered.': 'Majina ya wateja kutoka kazi za awali za timu waanzilishi wa RailGrid hayatajwi kwa mujibu wa sera. Warejeleaji wanaweza kutolewa kwa siri pale ushirikiano unapofikiriwa kwa dhati.',
    'Client names from RailGrid’s founding team’s prior engagements are withheld as a matter of policy. Referees can be provided in confidence where an engagement is being seriously considered.': 'Majina ya wateja kutoka kazi za awali za timu waanzilishi wa RailGrid hayatajwi kwa mujibu wa sera. Warejeleaji wanaweza kutolewa kwa siri pale ushirikiano unapofikiriwa kwa dhati.',
    'Group technology strategy held for a decade across East Africa and the Gulf, with accountability to the group board for investment, risk and delivery.': 'Mkakati wa teknolojia wa kundi ulioshikiliwa kwa muongo mmoja Afrika Mashariki na Ghuba, ukiwajibika kwa bodi ya kundi kuhusu uwekezaji, hatari na utekelezaji.',
    'Three regional systems consolidated into one estate, with cloud infrastructure, disaster recovery and security controls aligned to international standards.': 'Mifumo mitatu ya kikanda iliunganishwa kuwa mfumo mmoja, wenye miundombinu ya wingu, urejeshaji baada ya maafa na udhibiti wa usalama unaolingana na viwango vya kimataifa.',
    'Full technology strategy, architecture and governance baseline defined from inception, and enterprise platforms delivered to clients in regulated industries.': 'Mkakati kamili wa teknolojia, usanifu na msingi wa utawala vilibainishwa tangu kuanzishwa, na majukwaa ya kitaasisi yalitolewa kwa wateja katika sekta zinazodhibitiwa.',
    'Be the anchor client in your sector.': 'Kuwa mteja‑nanga katika sekta yako.',

    /* ---------- HCMOS ---------- */
    'Sector edition · Mining, civils & multi‑site workforces': 'Toleo la sekta · Madini, ujenzi na wafanyakazi wa maeneo mengi',
    'Human Capital Management Operating System': 'Mfumo wa Uendeshaji wa Usimamizi wa Rasilimali Watu',
    'Core for the institution. Self‑service for the workforce. One audited system across every site and every shift – from attendance at the gate to the payroll posting.': 'Msingi kwa taasisi. Kujihudumia kwa wafanyakazi. Mfumo mmoja unaokaguliwa katika kila eneo na kila zamu – kuanzia mahudhurio getini hadi uchapishaji wa mishahara.',
    'Book a workforce walkthrough': 'Weka miadi ya maonyesho ya wafanyakazi',
    'Read the Taifa story': 'Soma simulizi ya Taifa',
    'Payroll posted to Exact': 'Mishahara inachapishwa kwenye Exact',
    'ESS FIELD APP': 'PROGRAMU YA UWANDANI YA ESS',
    'GEOFENCED · AUDIT LOGGED': 'ENEO LA KIJIOGRAFIA · UKAGUZI UNAREKODIWA',
    'Welcome back, Asha': 'Karibu tena, Asha',
    'Operations · Site B': 'Uendeshaji · Eneo B',
    'Leave balance': 'Salio la likizo',
    '14.5 days': 'siku 14.5',
    'Next shift': 'Zamu ijayo',
    'Tue 06:00': 'Jumanne 06:00',
    'Payslip – August': 'Hati ya mshahara – Agosti',
    'Ready': 'Tayari',
    'Leave request': 'Ombi la likizo',
    'Check in': 'Ingia',
    'Payslip': 'Hati ya mshahara',
    'Apply leave': 'Omba likizo',
    'Core capabilities': 'Uwezo wa msingi',
    'One system. The full employee lifecycle.': 'Mfumo mmoja. Mzunguko mzima wa mfanyakazi.',
    'Every module is standard ERPNext HR and Payroll, configured for multi‑site operations and Tanzanian statutory rules.': 'Kila moduli ni ERPNext HR na Payroll ya kawaida, iliyosanidiwa kwa shughuli za maeneo mengi na kanuni za kisheria za Tanzania.',
    'Lifecycle management': 'Usimamizi wa mzunguko wa mfanyakazi',
    'Onboarding, transfers, role changes and exits – every employee event captured once, with full audit trail and document checklist.': 'Kuajiriwa, uhamisho, mabadiliko ya nafasi na kuondoka – kila tukio la mfanyakazi linarekodiwa mara moja, na rekodi kamili ya ukaguzi na orodha ya nyaraka.',
    'Attendance & leave': 'Mahudhurio na likizo',
    'Biometric and geofenced attendance, shift rosters for camps and sites, leave entitlements and approval chains feeding straight into payroll.': 'Mahudhurio ya kibayometriki na ya eneo la kijiografia, ratiba za zamu kwa kambi na maeneo, stahili za likizo na mnyororo wa idhini vinavyoingia moja kwa moja kwenye mishahara.',
    'Payroll & statutory': 'Mishahara na sheria',
    'PAYE, NSSF, WCF, SDL, HESLB and loan deductions; payslips, bank files and the monthly returns – posted to your finance system or run in ERPNext accounting.': 'Makato ya PAYE, NSSF, WCF, SDL, HESLB na mikopo; hati za mshahara, mafaili ya benki na ritani za kila mwezi – vinachapishwa kwenye mfumo wako wa fedha au kuendeshwa kwenye uhasibu wa ERPNext.',
    'Performance & appraisals': 'Utendaji na tathmini',
    'Objective tracking, structured appraisal cycles and competency‑based reviews tied to training and progression.': 'Ufuatiliaji wa malengo, mizunguko ya tathmini iliyopangwa na mapitio ya umahiri yanayounganishwa na mafunzo na maendeleo.',
    'Training & compliance': 'Mafunzo na uzingatiaji',
    'Training records, certification expiry tracking and enforcement of the licences and inductions a site requires before someone works.': 'Rekodi za mafunzo, ufuatiliaji wa kuisha kwa vyeti na utekelezaji wa leseni na maelekezo ambayo eneo linahitaji kabla mtu hajafanya kazi.',
    'Grievances & governance': 'Malalamiko na utawala',
    'Grievance cases with escalation and case tracking, role‑based access, override audit logs and segregation of duties across HR functions.': 'Kesi za malalamiko zenye upandishaji ngazi na ufuatiliaji, ufikiaji kwa nafasi, kumbukumbu za ukaguzi wa kupitilizwa na mgawanyo wa majukumu katika kazi za rasilimali watu.',
    'ESS field app': 'Programu ya uwandani ya ESS',
    'The institution\'s HR system, in every employee\'s pocket.': 'Mfumo wa rasilimali watu wa taasisi, mfukoni mwa kila mfanyakazi.',
    'The institution’s HR system, in every employee’s pocket.': 'Mfumo wa rasilimali watu wa taasisi, mfukoni mwa kila mfanyakazi.',
    'Employee self‑service on Android and iOS, built on the ERPNext mobile experience. Staff in the field do their own HR admin; HR stops re‑keying.': 'Kujihudumia kwa mfanyakazi kwenye Android na iOS, kimejengwa juu ya uzoefu wa simu wa ERPNext. Wafanyakazi wa uwandani wanafanya shughuli zao za rasilimali watu wenyewe; idara ya rasilimali watu inaacha kuingiza data upya.',
    'Digital payslips with download history.': 'Hati za mshahara za kidijitali zenye historia ya upakuaji.',
    'Real‑time leave balances and applications.': 'Salio za likizo na maombi papo hapo.',
    'Geofenced attendance check‑in from the field.': 'Kuingia mahudhurio kutoka uwandani kwenye eneo la kijiografia.',
    'Document submission and acknowledgement.': 'Uwasilishaji na uthibitisho wa nyaraka.',
    'Grievance escalation with case tracking.': 'Upandishaji ngazi wa malalamiko na ufuatiliaji wa kesi.',
    'Profile and statutory record updates, approved by HR.': 'Masasisho ya wasifu na rekodi za kisheria, yanayoidhinishwa na rasilimali watu.',
    'Proven in production': 'Imethibitishwa katika matumizi halisi',
    'Built with Taifa Mining & Civils.': 'Imejengwa pamoja na Taifa Mining & Civils.',
    'The HCMOS™ edition was shaped in a live mining operation with sites, camps and a head office – not in a demo environment.': 'Toleo la HCMOS™ liliundwa katika shughuli halisi za mgodi zenye maeneo, kambi na makao makuu – si katika mazingira ya maonyesho.',
    'Workforce overview': 'Muhtasari wa wafanyakazi',
    'KPI scorecard by site: headcount, attendance, leave, turnover, certification compliance.': 'Kadi ya viashiria kwa kila eneo: idadi ya wafanyakazi, mahudhurio, likizo, mabadiliko ya wafanyakazi, uzingatiaji wa vyeti.',
    'Exact integration': 'Muunganiko na Exact',
    'Payroll journals posted to Exact each cycle, with the audit trail back to every employee record.': 'Majarida ya mishahara yanachapishwa kwenye Exact kila mzunguko, na rekodi ya ukaguzi inayorudi hadi kila rekodi ya mfanyakazi.',
    'Data migration': 'Uhamishaji wa data',
    'Historical records migrated from spreadsheets and reconciled before go‑live.': 'Rekodi za zamani zilihamishwa kutoka majedwali na kusuluhishwa kabla ya kuanza kutumika.',
    'Security & settings': 'Usalama na mipangilio',
    'Role‑based access by site and function; organisation structure maintained in one place.': 'Ufikiaji kwa nafasi kulingana na eneo na idara; muundo wa shirika unadumishwa mahali pamoja.',
    'No employment event exists without traceability.': 'Hakuna tukio la ajira bila ufuatiliaji.',
    'No payroll entry exists without source intent.': 'Hakuna ingizo la mishahara bila kusudi la chanzo.',
    'See HCMOS™ with your own org chart.': 'Ione HCMOS™ kwa chati yako ya shirika.',
    'Bring your sites, shift patterns and last payroll; we will show you the same month run end‑to‑end in the system.': 'Leta maeneo yako, mifumo ya zamu na mishahara ya mwezi uliopita; tutakuonyesha mwezi huohuo ukiendeshwa mwanzo hadi mwisho kwenye mfumo.',

    /* ---------- ICDOS ---------- */
    'Sector edition · Logistics & trade': 'Toleo la sekta · Usafirishaji na biashara',
    'Inland Container Depot Operating System': 'Mfumo wa Uendeshaji wa Bandari Kavu za Makontena',
    'Depot operations, billing, finance and compliance governed as one estate. Built on ERPNext, so every gate movement becomes a charge, every charge becomes a ledger entry, and every entry carries its audit trail.': 'Uendeshaji wa bandari kavu, ankara, fedha na uzingatiaji vinasimamiwa kama mfumo mmoja. Imejengwa juu ya ERPNext, hivyo kila mwendo getini unakuwa gharama, kila gharama inakuwa ingizo la leja, na kila ingizo linabeba rekodi yake ya ukaguzi.',
    'Book a depot walkthrough': 'Weka miadi ya maonyesho ya bandari kavu',
    'Platform capabilities': 'Uwezo wa jukwaa',
    'Ops control · live': 'Udhibiti wa uendeshaji · moja kwa moja',
    'Active containers': 'Makontena yaliyopo',
    'Gate moves today': 'Miendo ya getini leo',
    'Yard utilisation': 'Matumizi ya yadi',
    'Charged': 'Imetozwa',
    'Awaiting payment': 'Inasubiri malipo',
    'Value architecture': 'Usanifu wa thamani',
    'Six layers, one system.': 'Matabaka sita, mfumo mmoja.',
    'The ICDOS™ value architecture maps directly onto ERPNext modules – so it is delivered as configuration and RailGrid apps, not as a bespoke build you depend on us to maintain.': 'Usanifu wa thamani wa ICDOS™ unalingana moja kwa moja na moduli za ERPNext – hivyo unatolewa kama usanidi na programu za RailGrid, si kama ujenzi maalumu unaotutegemea sisi kuudumisha.',
    'Container lifecycle, manifest, gate and yard': 'Mzunguko wa kontena, manifesto, geti na yadi',
    'Charge linking, tariff engine, leakage control': 'Uunganishaji wa gharama, injini ya ushuru, udhibiti wa uvujaji',
    'Financial management': 'Usimamizi wa fedha',
    'GL, branch books, reconciliation': 'Leja kuu, vitabu vya matawi, usuluhishi',
    'Audit trails, overrides, RBAC': 'Rekodi za ukaguzi, kupitilizwa, RBAC',
    'TRA fiscal invoicing, authority documents': 'Ankara za kodi za TRA, nyaraka za mamlaka',
    'Intelligence': 'Akili ya biashara',
    'Dashboards, SLA, analytics': 'Dashibodi, SLA, uchambuzi',
    'From gate‑in to gate‑out, every event has a financial consequence.': 'Kuanzia kuingia getini hadi kutoka, kila tukio lina athari ya kifedha.',
    'Depot operations are modelled as ERPNext documents with their own workflows, and each one links to the customer, the charge and the invoice.': 'Shughuli za bandari kavu zinaundwa kama nyaraka za ERPNext zenye mtiririko wake wa kazi, na kila moja inaunganishwa na mteja, gharama na ankara.',
    'Gate & yard operations': 'Shughuli za geti na yadi',
    'Gate‑in and gate‑out with QR‑token validation, yard positions by block, row and slot, moves and dwell tracking per container.': 'Kuingia na kutoka getini kwa uthibitisho wa tokeni ya QR, nafasi za yadi kwa bloku, safu na nafasi, ufuatiliaji wa miendo na muda wa kukaa kwa kila kontena.',
    'Manifest & documentation': 'Manifesto na nyaraka',
    'Bills of lading, manifests and authority documents held in a registry with digital hash, linked to every release.': 'Hati za usafirishaji, manifesto na nyaraka za mamlaka zinahifadhiwa kwenye rejista yenye alama ya kidijitali, zikiunganishwa na kila kuachiliwa.',
    'Tariff & charge linking': 'Ushuru na uunganishaji wa gharama',
    'Storage, handling, lift and ancillary tariffs applied automatically from operational events – no charge left unlinked.': 'Ushuru wa uhifadhi, ushughulikiaji, kuinua na huduma za ziada unatozwa kiotomatiki kutokana na matukio ya uendeshaji – hakuna gharama inayobaki bila kuunganishwa.',
    'Invoicing & collections': 'Ankara na ukusanyaji',
    'TRA VFD‑compliant invoices, customer statements, payment verification before release, credit control by agent.': 'Ankara zinazokidhi TRA VFD, taarifa za wateja, uthibitisho wa malipo kabla ya kuachiliwa, udhibiti wa mikopo kwa kila wakala.',
    'Agent portal': 'Tovuti ya mawakala',
    'Clearing agents see their containers, charges and documents, request releases and pay online – the "agent super‑app", delivered on the ERPNext portal.': 'Mawakala wa forodha wanaona makontena yao, gharama na nyaraka, wanaomba kuachiliwa na kulipa mtandaoni – "programu kuu ya wakala", inayotolewa kwenye tovuti ya ERPNext.',
    'Clearing agents see their containers, charges and documents, request releases and pay online – the “agent super‑app”, delivered on the ERPNext portal.': 'Mawakala wa forodha wanaona makontena yao, gharama na nyaraka, wanaomba kuachiliwa na kulipa mtandaoni – “programu kuu ya wakala”, inayotolewa kwenye tovuti ya ERPNext.',
    'Daily reconciliation of operational events to charges to ledger, with variance reports that show exactly where revenue would have leaked.': 'Usuluhishi wa kila siku wa matukio ya uendeshaji na gharama na leja, wenye ripoti za tofauti zinazoonyesha hasa mahali mapato yangevuja.',
    'Control environment': 'Mazingira ya udhibiti',
    'Operations, financials and audit – in one governed surface.': 'Uendeshaji, fedha na ukaguzi – katika uso mmoja unaosimamiwa.',
    'The depot manager, the finance controller and the internal auditor look at the same records, each through their own role.': 'Meneja wa bandari kavu, mdhibiti wa fedha na mkaguzi wa ndani wanaangalia rekodi zilezile, kila mmoja kupitia nafasi yake.',
    'Financial · month to date': 'Fedha · mwezi hadi sasa',
    'Revenue': 'Mapato',
    'Reconciled': 'Imesuluhishwa',
    'Charges linked. Reconciled in real time.': 'Gharama zimeunganishwa. Zimesuluhishwa papo hapo.',
    'Audit log · secured': 'Kumbukumbu ya ukaguzi · imelindwa',
    'Immutable. Permission controlled.': 'Haibadiliki. Inadhibitiwa kwa ruhusa.',
    'Security by design': 'Usalama kwa muundo',
    'Role‑based access enforcement': 'Utekelezaji wa ufikiaji kwa nafasi',
    'Immutable audit logs': 'Kumbukumbu za ukaguzi zisizobadilika',
    'QR token validation at the gate': 'Uthibitisho wa tokeni ya QR getini',
    'Document registry with digital hash': 'Rejista ya nyaraka yenye alama ya kidijitali',
    'Reconciliation validation before release': 'Uthibitisho wa usuluhishi kabla ya kuachiliwa',
    'See ICDOS™ on your own depot.': 'Ione ICDOS™ kwenye bandari kavu yako.',
    'Bring your tariff sheet and a week of gate logs; we will show you the charges you are not capturing today.': 'Leta jedwali lako la ushuru na kumbukumbu za geti za wiki moja; tutakuonyesha gharama ambazo hurekodi leo.',

    /* ---------- WMOS ---------- */
    'Sector edition · Industrial operations & distribution': 'Toleo la sekta · Uendeshaji wa viwanda na usambazaji',
    'Warehouse Management Operating System': 'Mfumo wa Uendeshaji wa Usimamizi wa Maghala',
    'Inbound to dispatch, under one operating system. Every movement reconciled, every variance investigated – inventory accuracy as an institutional property, not a periodic audit outcome.': 'Kuanzia kupokea hadi kusafirisha, chini ya mfumo mmoja wa uendeshaji. Kila mwendo unasuluhishwa, kila tofauti inachunguzwa – usahihi wa bidhaa ghalani kama sifa ya taasisi, si matokeo ya ukaguzi wa mara kwa mara.',
    'Book a warehouse walkthrough': 'Weka miadi ya maonyesho ya ghala',
    'Receiving · live': 'Upokeaji · moja kwa moja',
    'Verified': 'Imethibitishwa',
    'Partial': 'Sehemu',
    'Hold': 'Imezuiliwa',
    'Bin accuracy': 'Usahihi wa sehemu',
    'Waves today': 'Mawimbi leo',
    'Variances open': 'Tofauti zilizo wazi',
    'From inbound to dispatch – under one operating system.': 'Kuanzia kupokea hadi kusafirisha – chini ya mfumo mmoja wa uendeshaji.',
    'Standard ERPNext stock and warehouse functions, configured with the disciplines of a controlled distribution operation.': 'Kazi za kawaida za bidhaa na ghala za ERPNext, zilizosanidiwa kwa nidhamu ya shughuli za usambazaji zinazodhibitiwa.',
    'Inbound & receiving': 'Kuingia na upokeaji',
    'ASN‑driven receiving, supplier reconciliation and quality inspection at the point of arrival.': 'Upokeaji kwa ASN, usuluhishi wa wasambazaji na ukaguzi wa ubora wakati wa kufika.',
    'Putaway & slotting': 'Uwekaji na upangaji nafasi',
    'Bin allocation, dynamic slotting and zone‑aware storage rules.': 'Ugawaji wa sehemu, upangaji nafasi wa kubadilika na sheria za uhifadhi kwa kanda.',
    'Inventory accuracy': 'Usahihi wa bidhaa ghalani',
    'Bin, lot, batch and serial tracking with continuous cycle counts and variance workflows.': 'Ufuatiliaji wa sehemu, kundi na namba ya mfululizo wenye hesabu za mzunguko endelevu na mtiririko wa tofauti.',
    'Picking & packing': 'Kuchukua na kufunga',
    'Wave‑based pick lists, multi‑order consolidation and packing validation.': 'Orodha za kuchukua kwa mawimbi, uunganishaji wa oda nyingi na uthibitisho wa ufungaji.',
    'Dispatch & returns': 'Usafirishaji na marejesho',
    'Loading confirmation, delivery notes, proof of delivery and structured returns governance.': 'Uthibitisho wa upakiaji, hati za uwasilishaji, uthibitisho wa uwasilishaji na usimamizi wa marejesho uliopangwa.',
    'Stock movement': 'Mwendo wa bidhaa',
    'Inter‑warehouse transfers, consolidation and full chain‑of‑custody traceability.': 'Uhamisho kati ya maghala, uunganishaji na ufuatiliaji kamili wa mnyororo wa utunzaji.',
    'Operational intelligence': 'Akili ya uendeshaji',
    'Throughput, dwell and accuracy dashboards integrated to financial posting and billing.': 'Dashibodi za kiwango cha kazi, muda wa kukaa na usahihi zilizounganishwa na uchapishaji wa fedha na ankara.',
    'Audit & governance': 'Ukaguzi na utawala',
    'Every movement reconciled. Every variance investigated. Every override logged.': 'Kila mwendo unasuluhishwa. Kila tofauti inachunguzwa. Kila kupitilizwa kunarekodiwa.',
    'Receiving, storage, picking and dispatch – reconciled to financial posting in real time.': 'Upokeaji, uhifadhi, kuchukua na kusafirisha – vinasuluhishwa na uchapishaji wa fedha papo hapo.',
    'Stock value in the warehouse and stock value in the ledger are the same number, at every moment, because they come from the same transaction.': 'Thamani ya bidhaa ghalani na thamani ya bidhaa kwenye leja ni namba ileile, kila wakati, kwa sababu zinatoka kwenye muamala uleule.',
    'Bin heatmap': 'Ramani ya joto ya sehemu',
    'Zone A': 'Kanda A',
    'Zone B': 'Kanda B',
    'Zone C': 'Kanda C',
    'Utilisation by zone, live from bin balances.': 'Matumizi kwa kanda, moja kwa moja kutoka salio za sehemu.',
    'Dispatch · 12 waves': 'Usafirishaji · mawimbi 12',
    'Wave 081': 'Wimbi 081',
    'Wave 082': 'Wimbi 082',
    'Wave 083': 'Wimbi 083',
    'Pick progress per wave, by picker.': 'Maendeleo ya kuchukua kwa kila wimbi, kwa kila mchukuaji.',
    'Financially traceable': 'Inafuatiliwa kifedha',
    'Stock ledger and general ledger post together': 'Leja ya bidhaa na leja kuu zinachapishwa pamoja',
    'Landed cost applied at receipt': 'Gharama ya kufika inatozwa wakati wa kupokea',
    'Variance investigation before adjustment posts': 'Uchunguzi wa tofauti kabla ya marekebisho kuchapishwa',
    'Permission‑controlled overrides, all logged': 'Kupitilizwa kunakodhibitiwa kwa ruhusa, kote kunarekodiwa',
    'No movement exists without traceability.': 'Hakuna mwendo bila ufuatiliaji.',
    'No variance exists without investigation.': 'Hakuna tofauti bila uchunguzi.',
    'See WMOS™ on your own stock file.': 'Ione WMOS™ kwenye faili lako la bidhaa.',
    'Bring last quarter\'s stock take and variance report; we will show you what continuous cycle counting would have caught.': 'Leta hesabu ya bidhaa na ripoti ya tofauti ya robo mwaka iliyopita; tutakuonyesha kile ambacho hesabu za mzunguko endelevu zingekigundua.',
    'Bring last quarter’s stock take and variance report; we will show you what continuous cycle counting would have caught.': 'Leta hesabu ya bidhaa na ripoti ya tofauti ya robo mwaka iliyopita; tutakuonyesha kile ambacho hesabu za mzunguko endelevu zingekigundua.',

    /* ---------- Privacy ---------- */
    'Legal': 'Kisheria',
    'Privacy Notice': 'Taarifa ya Faragha',
    'What we collect when you contact us, why we hold it, and how to have it corrected or removed.': 'Tunachokusanya unapowasiliana nasi, kwa nini tunakihifadhi, na jinsi ya kukirekebisha au kukiondoa.',
    'Who we are': 'Sisi ni nani',
    'RailGrid Technologies Limited is a technology company registered in Tanzania and based in Dar es Salaam. We are the data controller for information submitted through this website, railgrid.co.tz. For any question about this notice, or about information we hold, write to info@railgrid.co.tz.': 'RailGrid Technologies Limited ni kampuni ya teknolojia iliyosajiliwa Tanzania na yenye makao yake Dar es Salaam. Sisi ni mdhibiti wa data kwa taarifa zinazowasilishwa kupitia tovuti hii, railgrid.co.tz. Kwa swali lolote kuhusu taarifa hii, au kuhusu taarifa tunazohifadhi, andika kwa info@railgrid.co.tz.',
    'What we collect': 'Tunachokusanya',
    'We only collect what you choose to send us. Through the enquiry, walkthrough request and Capacity Building registration forms on this site, that is your name, job title, organisation, work email address, telephone number where you provide one, and whatever you tell us about what you are trying to achieve.': 'Tunakusanya tu kile unachochagua kututumia. Kupitia fomu za maombi, maombi ya maonyesho na usajili wa Kujenga Uwezo kwenye tovuti hii, hizo ni jina lako, cheo, shirika, barua pepe ya kazi, namba ya simu pale unapoitoa, na chochote unachotuambia kuhusu unachojaribu kufanikisha.',
    'We record anonymous counts of which pages and buttons are used on this site. Those counts carry no name, email address or other identifying detail.': 'Tunarekodi hesabu zisizo na utambulisho za kurasa na vitufe vinavyotumika kwenye tovuti hii. Hesabu hizo hazibebi jina, barua pepe au maelezo mengine ya utambulisho.',
    'Why we hold it': 'Kwa nini tunaihifadhi',
    'To reply to your enquiry, to arrange and run a scoping conversation, and to correspond with you about the engagement you asked about. Nothing more. We do not sell your information, we do not share it with third parties for their own marketing, and we do not add you to a marketing list on the strength of an enquiry.': 'Kujibu ombi lako, kupanga na kuendesha mazungumzo ya kuainisha upeo, na kuwasiliana nawe kuhusu ushirikiano ulioulizia. Hakuna zaidi. Hatuuzi taarifa zako, hatuzishiriki na wahusika wengine kwa masoko yao, na hatukuongezi kwenye orodha ya masoko kwa sababu ya ombi.',
    'Where it is held': 'Inahifadhiwa wapi',
    'Submissions are stored in our own ERPNext system, hosted on Frappe Cloud, and are readable only by authorised RailGrid staff who are signed in. A copy of each submission is sent by email to info@railgrid.co.tz, and a confirmation is sent to the address you provided. We use a third‑party email delivery service to send those messages; it processes the message on our instruction only.': 'Mawasilisho yanahifadhiwa kwenye mfumo wetu wa ERPNext, unaohifadhiwa Frappe Cloud, na yanasomeka tu na wafanyakazi wa RailGrid walioidhinishwa na walioingia. Nakala ya kila wasilisho inatumwa kwa barua pepe kwenda info@railgrid.co.tz, na uthibitisho unatumwa kwenye anwani uliyotoa. Tunatumia huduma ya wahusika wengine ya kutuma barua pepe kutuma ujumbe huo; inashughulikia ujumbe kwa maelekezo yetu pekee.',
    'How long we keep it': 'Tunaihifadhi kwa muda gani',
    'We keep enquiry and registration records for as long as the enquiry is live, and afterwards for as long as we may reasonably need them for our own records. Where a record is no longer needed, it is deleted.': 'Tunahifadhi rekodi za maombi na usajili kwa muda wote ombi likiwa hai, na baadaye kwa muda ambao tunaweza kuzihitaji kwa kumbukumbu zetu. Rekodi isipohitajika tena, inafutwa.',
    'Your choices': 'Chaguo zako',
    'You may ask us what we hold about you, ask us to correct it, or ask us to delete it. Write to info@railgrid.co.tz and we will act on the request. You may withdraw your consent to be contacted at any time by the same route.': 'Unaweza kutuuliza tunachohifadhi kukuhusu, kutuomba tukirekebishe, au kutuomba tukifute. Andika kwa info@railgrid.co.tz nasi tutatekeleza ombi hilo. Unaweza kuondoa idhini yako ya kuwasiliana nawe wakati wowote kwa njia hiyohiyo.',
    'RailGrid Technologies Limited, Dar es Salaam, Tanzania. info@railgrid.co.tz': 'RailGrid Technologies Limited, Dar es Salaam, Tanzania. info@railgrid.co.tz',

    /* ---------- Titles / meta ---------- */
    'RailGrid Technologies — ERPNext implemented and supported in East Africa': 'RailGrid Technologies — ERPNext inayosimikwa na kuhudumiwa Afrika Mashariki',
    'Sector editions — ERPNext preconfigured by RailGrid for six sectors': 'Matoleo ya sekta — ERPNext iliyosanidiwa mapema na RailGrid kwa sekta sita',
    'The platform — ERPNext capabilities, localised for Tanzania | RailGrid Technologies': 'Jukwaa — uwezo wa ERPNext, uliolinganishwa kwa Tanzania | RailGrid Technologies',
    'Deployment & hosting — Frappe Cloud, private cloud in Tanzania, or on-premise | RailGrid': 'Usambazaji na uhifadhi — Frappe Cloud, wingu binafsi Tanzania, au kwenye seva zako | RailGrid',
    'Contact RailGrid Technologies — book a walkthrough, apply as anchor client, advisory': 'Wasiliana na RailGrid Technologies — weka miadi ya maonyesho, omba kuwa mteja‑nanga, ushauri',
    'Clients — Taifa Mining & Civils on the HCMOS™ edition of ERPNext | RailGrid': 'Wateja — Taifa Mining & Civils kwenye toleo la HCMOS™ la ERPNext | RailGrid',
    'Insights — research, analysis and advisory on infrastructure governance | RailGrid': 'Maarifa — utafiti, uchambuzi na ushauri kuhusu utawala wa miundombinu | RailGrid',
    'Privacy Notice | RailGrid Technologies': 'Taarifa ya Faragha | RailGrid Technologies',
    /* ---------- Added after the September 2026 audit ---------- */
    'Skip to content': 'Ruka hadi maudhui',
    'Shift roster': 'Ratiba ya zamu',
    'GPS clock‑ins – Site A, today': 'Kuingia kwa GPS – Eneo A, leo',
    'Verified': 'Imethibitishwa',
    'Available': 'Inapatikana',
    'Anchor client sought': 'Mteja‑nanga anatafutwa',
    'Be the anchor client in this sector →': 'Kuwa mteja‑nanga katika sekta hii →',
    'Deploy first, shape the edition\'s roadmap, set the standard.': 'Simika kwanza, tengeneza ramani ya toleo, weka kiwango.',
    'Deploy first, shape the edition’s roadmap, set the standard.': 'Simika kwanza, tengeneza ramani ya toleo, weka kiwango.',
    'In preparation': 'Inaandaliwa',
    'attendance, leave and shift rosters in production': 'mahudhurio, likizo na ratiba za zamu zinatumika',
    'geofenced clock‑in from every site': 'kuingia kazini kwa GPS kutoka kila eneo',
    'One workforce system, from the gate to the approval chain.': 'Mfumo mmoja wa wafanyakazi, kuanzia getini hadi mnyororo wa idhini.',
    'Before: employee records in spreadsheets by site, leave tracked by email, attendance on paper at the gate, and a payroll assembled by hand each month. After: every employee event captured once, approved through a defined chain, and recorded with a full audit trail. Statutory payroll and the Exact posting are the next phase.': 'Kabla: rekodi za wafanyakazi kwenye majedwali kwa kila eneo, likizo zikifuatiliwa kwa barua pepe, mahudhurio kwenye karatasi getini, na mishahara ikikusanywa kwa mikono kila mwezi. Baada: kila tukio la mfanyakazi linarekodiwa mara moja, linaidhinishwa kupitia mnyororo uliobainishwa, na kuhifadhiwa na rekodi kamili ya ukaguzi. Mishahara ya kisheria na uchapishaji kwenye Exact ni awamu inayofuata.',
    'Shift roster – Site B, September': 'Ratiba ya zamu – Eneo B, Septemba',
    'Published': 'Imetolewa',
    'Migration of historical records from spreadsheets, reconciled before go‑live; statutory returns and the payroll posting to Exact are scheduled as the next phase.': 'Uhamishaji wa rekodi za zamani kutoka majedwali, zilizosuluhishwa kabla ya kuanza kutumika; ritani za kisheria na uchapishaji wa mishahara kwenye Exact zimepangwa kama awamu inayofuata.',
    'GPS clock‑in across 6 sites': 'Kuingia kazini kwa GPS katika maeneo 6',
    'Built to post payroll journals to Exact each cycle, with the audit trail back to every employee record – Taifa\'s next phase.': 'Imejengwa kuchapisha majarida ya mishahara kwenye Exact kila mzunguko, na rekodi ya ukaguzi inayorudi hadi kila rekodi ya mfanyakazi – awamu inayofuata ya Taifa.',
    'Built to post payroll journals to Exact each cycle, with the audit trail back to every employee record – Taifa’s next phase.': 'Imejengwa kuchapisha majarida ya mishahara kwenye Exact kila mzunguko, na rekodi ya ukaguzi inayorudi hadi kila rekodi ya mfanyakazi – awamu inayofuata ya Taifa.',
    'Across mine sites, camps and head office: employees, attendance, leave, performance, training, grievances and approvals now run on the HCMOS™ edition of ERPNext, with GPS‑verified clock‑in, shift rosters and a mobile self‑service app for staff in the field. Statutory payroll and the Exact posting follow as the next phase.': 'Katika maeneo ya mgodi, kambi na makao makuu: wafanyakazi, mahudhurio, likizo, utendaji, mafunzo, malalamiko na idhini sasa vinaendeshwa kwenye toleo la HCMOS™ la ERPNext, kwa kuingia kazini kunakothibitishwa kwa GPS, ratiba za zamu na programu ya simu ya kujihudumia kwa wafanyakazi wa uwandani. Mishahara ya kisheria na uchapishaji kwenye Exact vinafuata kama awamu inayofuata.',
    'Page not found | RailGrid Technologies': 'Ukurasa haujapatikana | RailGrid Technologies',
    'Error 404': 'Hitilafu 404',
    'That page is not here.': 'Ukurasa huo haupo hapa.',
    'The address may have changed, or the link you followed is out of date. Everything on the site is one click away below.': 'Anwani inaweza kuwa imebadilika, au kiungo ulichofuata kimepitwa na wakati. Kila kitu kwenye tovuti kiko hapa chini kwa kubofya mara moja.',
    'Go to the home page': 'Nenda ukurasa wa mwanzo',
    'Every capability': 'Kila uwezo',
    'Finance, HR and payroll, inventory, procurement, projects, assets and reporting in one audited system.': 'Fedha, rasilimali watu na mishahara, bidhaa ghalani, manunuzi, miradi, mali na ripoti katika mfumo mmoja unaokaguliwa.',
    'Explore the platform →': 'Chunguza jukwaa →',
    'Preconfigured for your sector': 'Imesanidiwa mapema kwa sekta yako',
    'HCMOS™, ICDOS™, WMOS™ and editions for government, banking and utilities.': 'HCMOS™, ICDOS™, WMOS™ na matoleo kwa serikali, benki na mashirika ya huduma.',
    'See the editions →': 'Tazama matoleo →',
    'Run it where policy says': 'Iendeshe pale sera inaposema',
    'Frappe Cloud, a private cloud in Tanzania, or on‑premise at a remote site.': 'Frappe Cloud, wingu binafsi Tanzania, au kwenye seva zako eneo la mbali.',
    'Compare hosting →': 'Linganisha uhifadhi →',
    '← Back to Insights': '← Rudi kwenye Maarifa',
    'Infrastructure ·': 'Miundombinu ·',
    '23 July 2026': '23 Julai 2026',
    '· 8 min read': '· dakika 8 za kusoma',
    'Founder and Chief Technology Officer, RailGrid Technologies': 'Mwanzilishi na Afisa Mkuu wa Teknolojia, RailGrid Technologies',
    'Share this article': 'Shiriki makala hii',
    'Copy link': 'Nakili kiungo',
    'Copied': 'Imenakiliwa',
    'Engage the advisory': 'Shirikiana na huduma ya ushauri',
    'RailGrid works alongside institutions to strengthen workforce governance, revenue assurance and operational discipline across Africa.': 'RailGrid inafanya kazi bega kwa bega na taasisi kuimarisha usimamizi wa wafanyakazi, uhakikisho wa mapato na nidhamu ya uendeshaji barani Afrika.',
    'References': 'Marejeleo',
    'A race is a corridor, not a venue': 'Mbio ni korido, si ukumbi',
    'Five load surfaces, moving at 40 km/h': 'Nyuso tano za mzigo, zikisonga kwa kilomita 40 kwa saa',
    'The institutional lesson for African operators': 'Somo la kitaasisi kwa waendeshaji wa Afrika',
    'Evolution, not revolution': 'Mageuzi ya taratibu, si mapinduzi',
    'Every July, the Tour de France runs roughly 3,300 kilometres across 21 stages, moving through some 600 towns and villages, drawing an estimated 10–12 million roadside spectators and a global television audience above one billion.¹ The peloton is the visible surface. Underneath is one of the world\'s largest recurring temporary infrastructure deployments: rolling road closures, mobile telecoms cells, medical helicopters, power for broadcast compounds, timing and identity systems, and multi‑agency incident command. Unlike a stadium event, the Tour cannot fail in place – it has to fail forward, into the next stage, the next département, the next border. That is precisely why it is a useful reference for operators thinking about corridor infrastructure in Africa.': 'Kila Julai, Tour de France inakimbia takriban kilomita 3,300 katika hatua 21, ikipita katika miji na vijiji vipatavyo 600, ikivutia watazamaji wa kando ya barabara wanaokadiriwa kuwa milioni 10–12 na hadhira ya televisheni duniani inayozidi bilioni moja.¹ Kundi la waendesha baiskeli ndilo uso unaoonekana. Chini yake kuna mojawapo ya usambazaji mkubwa zaidi duniani wa miundombinu ya muda unaojirudia: kufungwa kwa barabara kunakosonga, minara ya simu inayohamishika, helikopta za matibabu, umeme kwa vituo vya matangazo, mifumo ya muda na utambulisho, na uongozi wa matukio wa mashirika mengi. Tofauti na tukio la uwanjani, Tour haiwezi kushindwa mahali pamoja – lazima ishindwe mbele, kuelekea hatua inayofuata, mkoa unaofuata, mpaka unaofuata. Hiyo ndiyo sababu hasa ni rejea muhimu kwa waendeshaji wanaofikiria kuhusu miundombinu ya korido barani Afrika.',
    'Desbordes (2007) documented that the Tour\'s economic footprint is dispersed rather than concentrated: host towns pay a fee to be a stage start or finish, but the majority of measurable value lands along the 200‑kilometre daily route, in fuel, catering, accommodation and small‑trade activity.² The same architectural fact applies to rail and road corridors: value does not accumulate at the terminal, it accumulates along the line. Ports, depots, weighbridges, border posts and inland container depots are stage towns. The corridor is the race.': 'Desbordes (2007) alithibitisha kuwa athari ya kiuchumi ya Tour imesambaa badala ya kujikita mahali pamoja: miji mwenyeji inalipa ada kuwa mwanzo au mwisho wa hatua, lakini sehemu kubwa ya thamani inayopimika inatua kando ya njia ya kila siku ya kilomita 200, katika mafuta, chakula, malazi na biashara ndogo.² Ukweli huohuo wa kimuundo unahusu korido za reli na barabara: thamani haikusanyiki kwenye kituo cha mwisho, inakusanyika kando ya njia. Bandari, bandari kavu, mizani ya barabarani, vituo vya mpakani na bandari kavu za makontena ni miji ya hatua. Korido ndiyo mbio.',
    'The Tour stresses the same five infrastructure surfaces that any host institution must plan for – energy, mobility, telecommunications, payments and identity, and incident response – with one added constraint: the load surface moves. Broadcast compounds need grid‑grade power in a different commune every 24 hours. UCI operational protocols require dedicated medical evacuation windows and race‑radio spectrum coordination with national regulators for every stage.⁴ Bouhaouala and Chanavat (2017) note that host départements that treat these requirements as part of their permanent territorial development plan – rather than as a one‑off logistical burden – retain measurable tourism and mobility gains for three to five years after the race passes.³ Those that treat it as a one‑off do not.': 'Tour inabana nyuso zilezile tano za miundombinu ambazo taasisi yoyote mwenyeji lazima izipangie – nishati, uhamaji, mawasiliano ya simu, malipo na utambulisho, na majibu ya matukio – ikiwa na kikwazo kimoja cha ziada: uso wa mzigo unasonga. Vituo vya matangazo vinahitaji umeme wa kiwango cha gridi katika eneo tofauti kila saa 24. Taratibu za uendeshaji za UCI zinahitaji madirisha maalumu ya uokoaji wa kitabibu na uratibu wa masafa ya redio ya mbio na wadhibiti wa kitaifa kwa kila hatua.⁴ Bouhaouala na Chanavat (2017) wanabainisha kuwa mikoa mwenyeji inayochukulia mahitaji haya kama sehemu ya mpango wake wa kudumu wa maendeleo ya eneo – badala ya mzigo wa mara moja wa usafirishaji – inabakiza faida zinazopimika za utalii na uhamaji kwa miaka mitatu hadi mitano baada ya mbio kupita.³ Ile inayoyachukulia kama jambo la mara moja haibakizi.',
    'For port authorities, rail corridors and inland depot operators, the transferable principle is direct. A corridor that can absorb a synchronised, moving demand event without degrading service to its resident traffic is a corridor with genuine institutional maturity. Flyvbjerg\'s work on megaprojects consistently shows that infrastructure investments produce durable returns when they accelerate systems the institution was already building, not when they invent capacity for a moment.⁵ The Tour de France is not a sporting exception to this rule. It is the clearest annual demonstration of it.': 'Kwa mamlaka za bandari, korido za reli na waendeshaji wa bandari kavu, kanuni inayohamishika ni ya moja kwa moja. Korido inayoweza kupokea tukio la mahitaji lililosawazishwa na linalosonga bila kupunguza huduma kwa trafiki yake ya kawaida ni korido yenye ukomavu halisi wa kitaasisi. Kazi ya Flyvbjerg kuhusu miradi mikubwa inaonyesha mara kwa mara kuwa uwekezaji wa miundombinu unazalisha faida za kudumu unapoharakisha mifumo ambayo taasisi ilikuwa tayari inaijenga, si unapobuni uwezo kwa ajili ya muda mfupi.⁵ Tour de France si tofauti ya kimichezo kwa kanuni hii. Ni onyesho la wazi zaidi la kila mwaka la kanuni hiyo.',
    'The peloton looks like a spectacle. It is actually a governance instrument – a recurring, standardised, publicly scrutinised test of whether the underlying institutions can hold their rhythm under load. That is the same test RailGrid configures its sector editions of ERPNext to pass every day: ICDOS™ across depot corridors, HCMOS™ across workforce operations, WMOS™ across warehouse throughput. Strengthen the layer the institution already runs on, and it holds when the world arrives – whether the world arrives as a container surge, a regulator audit, or a race.': 'Kundi la waendesha baiskeli linaonekana kama tamasha. Kwa hakika ni chombo cha utawala – jaribio linalojirudia, lililosanifiwa na linalochunguzwa hadharani la iwapo taasisi za msingi zinaweza kushikilia mdundo wake chini ya mzigo. Hilo ndilo jaribio lilelile ambalo RailGrid inasanidi matoleo yake ya sekta ya ERPNext kulipita kila siku: ICDOS™ katika korido za bandari kavu, HCMOS™ katika shughuli za wafanyakazi, WMOS™ katika kiwango cha kazi cha maghala. Imarisha tabaka ambalo taasisi tayari inalitegemea, nalo litashikilia dunia inapofika – iwe dunia inafika kama wimbi la makontena, ukaguzi wa mdhibiti, au mbio.',
    'The Moving Grid: What the Tour de France Teaches About Infrastructure | RailGrid Insights': 'Gridi Inayosonga: Tour de France Inafundisha Nini Kuhusu Miundombinu | Maarifa ya RailGrid',
    'HCMOS™ — Human Capital & Payroll edition of ERPNext | RailGrid Technologies': 'HCMOS™ — Toleo la ERPNext la Rasilimali Watu na Mishahara | RailGrid Technologies',
    'ICDOS™ — Inland Container Depot edition of ERPNext | RailGrid Technologies': 'ICDOS™ — Toleo la ERPNext la Bandari Kavu za Makontena | RailGrid Technologies',
    'WMOS™ — Warehouse Operations edition of ERPNext | RailGrid Technologies': 'WMOS™ — Toleo la ERPNext la Uendeshaji wa Maghala | RailGrid Technologies',
    'Digital Transformation Capacity Building — boards, executives, technology leaders | RailGrid': 'Kujenga Uwezo wa Mabadiliko ya Kidijitali — bodi, viongozi wakuu, viongozi wa teknolojia | RailGrid',
    'Privacy Notice | RailGrid Technologies': 'Taarifa ya Faragha | RailGrid Technologies'
  };

  /* ================================================================
     ENGINE
     ================================================================ */
  var norm = function (s) { return s.replace(/\s+/g, ' ').trim(); };
  var currentLang = 'en';
  var applying = false;
  var nodes = [];       // [{node, original}]
  var attrs = [];       // [{el, attr, original}]
  var seen = typeof WeakSet === 'function' ? new WeakSet() : null;

  var SKIP = 'script,style,noscript,code,pre,[data-i18n-skip]';

  function collectFrom(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var n;
    while ((n = walker.nextNode())) {
      if (seen && seen.has(n)) continue;
      var p = n.parentElement;
      if (!p || p.closest(SKIP)) continue;
      if (!norm(n.textContent)) continue;
      nodes.push({ node: n, original: n.textContent });
      if (seen) seen.add(n);
    }
    var els = root.querySelectorAll ? root.querySelectorAll('[placeholder],[aria-label],[title],img[alt]') : [];
    Array.prototype.forEach.call(els, function (el) {
      if (el.closest(SKIP)) return;
      ['placeholder', 'aria-label', 'title', 'alt'].forEach(function (a) {
        var v = el.getAttribute(a);
        if (v && norm(v)) attrs.push({ el: el, attr: a, original: v });
      });
    });
  }

  function translate(text, lang) {
    if (lang === 'en') return null;
    var key = norm(text);
    var t = SW[key];
    if (t === undefined) return null;
    // preserve surrounding whitespace of the original node
    var lead = text.match(/^\s*/)[0], trail = text.match(/\s*$/)[0];
    return lead + t + trail;
  }

  function apply(lang) {
    applying = true;
    nodes.forEach(function (r) {
      if (!r.node.parentNode) return; // detached
      var t = translate(r.original, lang);
      var want = t === null ? r.original : t;
      if (r.node.textContent !== want) r.node.textContent = want;
    });
    attrs.forEach(function (r) {
      var t = translate(r.original, lang);
      r.el.setAttribute(r.attr, t === null ? r.original : t);
    });
    // <title> and meta description
    var titleEl = document.querySelector('title');
    if (titleEl) {
      if (!titleEl.__orig) titleEl.__orig = titleEl.textContent;
      var tt = translate(titleEl.__orig, lang);
      titleEl.textContent = tt === null ? titleEl.__orig : tt;
    }
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);
    currentLang = lang;
    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    applying = false;
    try { window.dispatchEvent(new CustomEvent('rg:langchange', { detail: { lang: lang } })); } catch (e) {}
  }

  function setLang(lang, persist) {
    if (!LANGS[lang]) lang = 'en';
    if (persist !== false) { try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {} }
    apply(lang);
  }

  function initialLang() {
    var m = location.search.match(/[?&]lang=(en|sw)\b/);
    if (m) return m[1];
    try { var s = localStorage.getItem(STORAGE_KEY); if (LANGS[s]) return s; } catch (e) {}
    // First visit: follow the browser if it is set to Swahili
    var nav = (navigator.languages || [navigator.language || '']).join(',').toLowerCase();
    if (/(^|,)sw(-|,|$)/.test(nav)) return 'sw';
    return 'en';
  }

  function buildSwitch() {
    if (document.querySelector('.lang-switch')) return;
    var host = document.querySelector('.header__cta') || document.querySelector('.header .container');
    if (!host) return;
    var wrap = document.createElement('div');
    wrap.className = 'lang-switch';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Language / Lugha');
    wrap.setAttribute('data-i18n-skip', '');
    [['en', 'EN', 'English'], ['sw', 'SW', 'Kiswahili']].forEach(function (d) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = d[1];
      b.title = d[2];
      b.setAttribute('lang', d[0]);
      b.setAttribute('data-lang', d[0]);
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { setLang(d[0]); });
      wrap.appendChild(b);
    });
    host.insertBefore(wrap, host.firstChild);
  }

  // Keep dynamically inserted / rewritten text (form status, "Sending...",
  // the character counter) translated while Kiswahili is active.
  function observe() {
    if (!('MutationObserver' in window)) return;
    var mo = new MutationObserver(function (muts) {
      if (applying || currentLang === 'en') return;
      var touched = false;
      muts.forEach(function (m) {
        if (m.type === 'childList') {
          m.addedNodes.forEach(function (n) {
            if (n.nodeType === 1) { collectFrom(n); touched = true; }
            else if (n.nodeType === 3 && !(seen && seen.has(n))) {
              nodes.push({ node: n, original: n.textContent }); if (seen) seen.add(n); touched = true;
            }
          });
        } else if (m.type === 'characterData') {
          var rec = null;
          for (var i = 0; i < nodes.length; i++) if (nodes[i].node === m.target) { rec = nodes[i]; break; }
          if (rec) {
            // site.js rewrote the node (e.g. "Sending..." → original label). Treat the
            // new content as the new English original unless it is already translated.
            var nowNorm = norm(m.target.textContent);
            var isTranslated = false;
            for (var k in SW) if (SW[k] === nowNorm) { isTranslated = true; break; }
            if (!isTranslated) { rec.original = m.target.textContent; touched = true; }
          }
        }
      });
      if (touched) apply(currentLang);
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function boot() {
    collectFrom(document.body);
    buildSwitch();
    var fromUrl = location.search.match(/[?&]lang=(en|sw)\b/);
    if (fromUrl) setLang(fromUrl[1]);      // a shared ?lang=sw link sticks for the rest of the visit
    else apply(initialLang());
    observe();
  }

  // Public API (optional): RailGridI18n.set('sw'), .get(), .add({...})
  window.RailGridI18n = {
    set: setLang,
    get: function () { return currentLang; },
    add: function (map) { for (var k in map) SW[norm(k)] = map[k]; if (currentLang !== 'en') apply(currentLang); },
    // RailGridI18n.missing() in the console lists English strings on this page
    // that have no Kiswahili entry yet (brand names, codes and numbers excluded).
    missing: function () {
      var out = [];
      nodes.forEach(function (r) {
        var k = norm(r.original);
        if (SW[k] === undefined && !/^[\d\W]+$/.test(k) && out.indexOf(k) < 0) out.push(k);
      });
      return out;
    },
    dictionary: SW
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
