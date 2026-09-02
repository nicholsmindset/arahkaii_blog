# Arahkaii AdSense launch checklist

The code is deliberately safe-by-default: AdSense does not load unless both
`PUBLIC_ADSENSE_CLIENT` and `PUBLIC_GOOGLE_CMP_ENABLED=true` are present. Do not
set the CMP flag merely to make the script appear; it records that a certified
consent message has actually been published and tested.

## Before requesting another review

- Deploy and crawl-test every generated legacy redirect in `vercel.json`.
- Confirm `/sitemap-index.xml` lists no tag archives or `noindex` articles.
- Keep the remediation queue out of the index until each article has original
  reporting or an honest method note plus substantive sources.
- Publish two or three genuinely reported stories weekly for eight consecutive
  weeks. Do not backdate or batch the release dates.
- Configure `PUBLIC_GTM_ID`, import `docs/gtm-arahkaii-ga4.json`, and verify
  page views, 50/90% reading depth, recirculation, outbound clicks and newsletter
  signups in GA4 DebugView.
- Test the MailerLite welcome automation and one complete Arahkaii Weekly send,
  including unsubscribe and suppression behaviour.
- Recheck `https://www.arahkaii.com/ads.txt`; it must return HTTP 200 and the
  account's exact `pub-` identifier.

## Consent and ad serving

Google requires publishers serving ads in the EEA, UK or Switzerland to use a
Google-certified CMP integrated with the IAB Transparency and Consent Framework.
Google's own European regulations message in AdSense Privacy & messaging is one
certified option.

1. In AdSense, publish the European regulations message and configure consent
   choices and privacy-policy links.
2. Test in an EEA location or Google's message-testing tools. Verify that a
   first visit shows the message and that rejecting optional storage leaves
   `ad_storage`, `analytics_storage`, `ad_user_data` and `ad_personalization`
   denied.
3. Set `PUBLIC_ADSENSE_CLIENT=ca-pub-7886081043408699` and
   `PUBLIC_GOOGLE_CMP_ENABLED=true` in Vercel only after that test passes.
4. Add real numeric slot IDs through `src/components/ads/AdSlot.astro`. The
   component reserves height and labels every unit “Advertisement”.
5. Start with at most one in-article unit and one post-article unit. Never place
   an ad above the headline, inside navigation, or where it can be mistaken for
   editorial content.
6. Run mobile checks for layout shift, accidental clicks, reading interruption
   and Core Web Vitals before enabling more inventory.

Official references:

- [Google consent requirements for publishers](https://support.google.com/adsense/answer/13554116?hl=en-GB)
- [Connect a site to AdSense](https://support.google.com/adsense/answer/7584263?hl=en)
- [Google Consent Mode implementation](https://developers.google.com/tag-platform/security/guides/consent)
- [Google ads.txt guidance](https://support.google.com/adsense/answer/12171612?hl=en-GB)

## Review timing

Request review only after the improved corpus has been recrawled and the
publishing cadence is visible. An “Authorised” ads.txt status confirms the file,
not the quality or policy approval of the site.
