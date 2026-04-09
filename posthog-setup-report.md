<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 16 App Router project (SyncSupport). Client-side initialization was added via `instrumentation-client.ts` using the Next.js 15.3+ pattern. A server-side PostHog client was created at `lib/posthog-server.ts`. The `next.config.ts` was updated with reverse-proxy rewrites for PostHog ingestion (improving ad-blocker resilience). User identification was wired into `components/UserSync.tsx` via Clerk's `useUser` hook, so every signed-in user is automatically identified and reset on sign-out. 14 server-side events were instrumented across 9 API route files covering billing, ticket management, feature setup, and live chat.

| Event | Description | File |
|---|---|---|
| `checkout_initiated` | User starts a checkout session for a paid plan (upgrade, downgrade, or new) | `app/api/billing/checkout/route.ts` |
| `subscription_cancelled` | User cancels their subscription (cancel at period end) | `app/api/billing/cancel/route.ts` |
| `subscription_activated` | Subscription activated via Dodo payment webhook | `app/api/webhooks/dodo/route.ts` |
| `payment_succeeded` | Monthly subscription payment succeeded via Dodo webhook | `app/api/webhooks/dodo/route.ts` |
| `payment_failed` | Subscription payment failed via Dodo webhook | `app/api/webhooks/dodo/route.ts` |
| `email_reply_sent` | Agent sent an outbound reply to a customer email ticket | `app/api/emails/reply/route.ts` |
| `ticket_claimed` | Agent explicitly claimed an unassigned support ticket | `app/api/emails/claim/route.ts` |
| `ticket_status_updated` | Agent manually updated a ticket's status (e.g., resolved) | `app/api/emails/update-status/route.ts` |
| `alias_created` | User created a new email alias on a domain | `app/api/aliases/route.ts` |
| `domain_created` | User added a new domain to their workspace | `app/api/domains/route.ts` |
| `integration_created` | User connected a Slack or Discord webhook integration | `app/api/integrations/route.ts` |
| `chat_widget_created` | User created a new live chat widget | `app/api/chat/widgets/route.ts` |
| `receiving_request_submitted` | User submitted a request to enable inbound email receiving | `app/api/receiving-requests/route.ts` |
| `chat_reply_sent` | Agent sent a reply to a live chat conversation | `app/api/chat/conversations/[id]/reply/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/375005/dashboard/1447233
- **Subscription Checkout → Activation Funnel** (conversion): https://us.posthog.com/project/375005/insights/cGBha43v
- **Churn Signals: Cancellations & Payment Failures**: https://us.posthog.com/project/375005/insights/RSM3KE8J
- **Feature Adoption: Domains, Aliases, Integrations & Widgets**: https://us.posthog.com/project/375005/insights/JItZps0x
- **Support Activity: Email & Chat Replies**: https://us.posthog.com/project/375005/insights/66NsCuI8
- **Tickets Resolved Per Day**: https://us.posthog.com/project/375005/insights/KGIgC1jy

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
