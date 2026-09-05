# Newsletter framework

Newsletter activation is intentionally paused while the publishing team chooses its software. No provider account or paid plan has been created. The same page layouts work with either existing adapter.

## Shared contract

- All signup locations use `src/components/NewsletterSignup.astro`.
- The frontend sends `email`, `source` and the `website` honeypot to `/api/subscribe`.
- `src/pages/api/subscribe.ts` owns provider communication, origin checks, rate limits, validation and service errors. Credentials stay on the server.
- `src/content/settings/newsletter.json`, editable in Keystatic → Newsletter settings, selects `disabled`, `beehiiv` or `mailerlite`. The current and default selection is `disabled`.
- Paused or unconfigured providers show a clear notice and links to existing sample content. A configured, selected provider enables the form after a normal build/deployment.

## Connect the eventual choice

| Provider | Production environment variables | Notes |
| --- | --- | --- |
| Beehiiv | `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID` | The existing adapter passes signup source as UTM metadata. The welcome-email setting remains off until deliberately enabled. |
| MailerLite | `MAILERLITE_API_KEY`; optional `MAILERLITE_GROUP_ID` | The existing adapter can add subscribers to one selected group. Campaigns and welcome automations are configured in MailerLite. |

Choose the provider in Keystatic, add its credentials to Vercel, deploy, and verify a signup using an authorised recipient. Confirm the intended audience/group, success and error states, unsubscribe behaviour and any welcome/campaign settings before launch. No credentials belong in the repository.

For another provider, retain the form and request/response contract; add an adapter in the subscription endpoint and its configuration check in the shared signup component. Article, homepage and footer designs do not need individual provider integrations.

The existing RSS/digest endpoints and newsletter sample remain available while signup is paused. The separate contact page uses the published email route until contact delivery is configured.
