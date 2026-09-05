# Partnership intake

`/partnerships/` is the public partner desk. `/partnerships/prepare/` explains interview preparation, evidence and image permissions. The footer, contact page and existing advertising page lead into the desk.

The three routes are editorial pitch, interview/visit and paid proposal. `route`, allowlisted `call`, and a sanitised `ref`/`utm_campaign` can preselect the route and preserve outreach context. Personal details are not sent to analytics. Briefs remain in the form during navigation between steps; there is no automatic local-storage draft.

The advertising page compares three proposal formats: `feature`, `conversation` and `series`. Its links use `route=paid&format=<format>&ref=advertise`. The allowlisted format appears in the form introduction, review, email/download and full stored brief. Switching to an editorial route clears it. Unknown formats are ignored. The format finder uses native radios; without JavaScript all three offers and their brief links remain visible.

## Delivery

Set **PARTNERSHIP_INTAKE_URL** as a sensitive Vercel variable in Preview and Production, then rebuild. It is server-only. Without the variable, the form prepares a complete email draft and truthfully says the user must send it in their mail client. A runtime 503 changes the primary action to that fallback.

`POST /api/partnership/` validates origin, burst rate, body size, honeypot, route, field lengths, website, asset links and consent. The shared validator also runs in the browser. Linked assets require permission for private review; this is distinct from publication rights.

The server forwards a normalised brief with a stable application reference to **ARA-02 Arahkaii Partner Desk Intake**, workflow ID `Bkk3M3OVyC0ncmiq`. The active workflow validates the request, prepares formula-safe cell values, appends or updates the existing Arahkaii Brand Feature CRM Applications tab by `application_id`, then returns a matching receipt. It has no AI, email, Slack or publishing nodes. ARA-00 is unchanged.

The public API acknowledges only a matching receipt returned after storage. Timeouts and ambiguous results preserve the user's brief and offer an email delivery check with the same reference. No submission contents or provider bodies are logged by the endpoint. The in-memory limit is burst protection per instance, not a distributed quota.

## Existing CRM mapping

- `application_id`: stable `ara-` reference.
- `brand_id`: reference-derived intake identifier, not a deduplicated company identity.
- `brand_name`, `founder_name`, `city`, `website_or_handle`, `contact_email`: contact details.
- `category`: Editorial pitch, Editorial interview or Commercial partnership.
- `origin_story`: full readable brief, including prompt, timing, materials, restrictions, consent and referral code.
- `distinct_factor`: story; `ideal_customer`: people/access/evidence. These legacy field names are retained for compatibility.
- `price_range`: indicative budget for paid proposals only.
- `photo_urls`: review links.
- `rights_consent`, `quote_consent`: false until separately agreed before publication.
- `commercial_disclosure`: route-specific statement; no agreement implied.
- `review_status`: New partner brief, or QA test — do not contact for a `[QA]` test brand.

The desk must review the Applications tab and reply manually. There is no acknowledgement email or automatic notification. Check an uncertain-delivery reference before manually creating a record. Synthetic QA rows must not enter outreach or production.

## Validation and release

Run `npm run verify`. Focused integration tests cover invalid submissions, origin checks, missing providers, failed or mismatched receipts and timeouts. Browser checks cover route/call preselection, required fields, material permissions, review, Back, mobile overflow, a real durable receipt and an aborted request preserving the brief.

After deployment, check both pages, footer/contact/advertise links and the live API. A clearly labelled synthetic QA record is safe for delivery verification; do not use a real brand contact or send any external correspondence during QA.

To disable online storage, remove the intake environment variable and rebuild: the email drafting path remains available. Pause ARA-02 only after disabling online submission to avoid inviting users into an unavailable service. This does not affect other n8n workflows.
