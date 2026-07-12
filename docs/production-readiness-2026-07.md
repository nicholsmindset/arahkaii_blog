# Production Readiness — 12 July 2026

## Completed

- 77 generated HTML pages pass Astro/TypeScript, JSON-LD, visible schema parity,
  heading hierarchy, one-main/one-H1, image dimensions and internal-link checks.
- Desktop (1440×900) and mobile (390×844) review covered the homepage, category,
  latest, article, guide, author, franchise, topic, standards, about, subscribe,
  reading-list and contact templates. No horizontal overflow was found.
- The priority halal dining guide now carries a visible 12-entry summary,
  per-entry status, guide-level verification context and matching ItemList data.
- FAQ content is visible and identical to FAQPage data across all 17 pages.
- Publication franchises, topic clusters, author expertise, editorial standards,
  `llms.txt` and purpose-specific crawler rules are implemented.
- About and Subscribe no longer ship visible image placeholders.
- Contact migrated from Netlify Forms to a Vercel-compatible Resend endpoint.

## Production configuration required

Vercel currently contains the four Keystatic/GitHub credentials. It does not yet
contain newsletter or contact-delivery credentials. Before promoting email
capture as fully operational, add and test:

- MailerLite: `MAILERLITE_API_KEY` and optional `MAILERLITE_GROUP_ID`; or
- Beehiiv: `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID`;
- Contact: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.

The website continues to expose `hello@arahkaii.com` while contact delivery is
unconfigured. No submitted message is silently accepted by the endpoint.

## Editorial follow-through

The architecture for the Dining, Travel and Modest Fashion clusters is live.
New supporting articles still require original reporting, current certification
checks and approved image rights; they must not be fabricated to satisfy a page
count. Review Arahkaii Verified entries quarterly and update the visible checked
date whenever evidence changes.
