## Build Plan – 3 Phases

This plan is based on `cursor.md` (PRD) and splits the work into three phases.

---

## Phase 1 – Core Dashboard & Main Routing Feature

**Goal**: Have a working end-to-end demo where a user can configure a domain + alias and see emails arrive in Slack/Discord, without payments or strict limits.

### 1. Foundations & Setup

- **Project setup**
  - Confirm Next.js starter (`NextJS-Starter`) runs locally.
  - Wire up Clerk for authentication and basic session handling.
  - Connect MongoDB Atlas and set up environment variables for local/dev.

- **Core data models (DB schema)**
  - Implement collections (and types/interfaces) for:
    - `users`: `clerkUserId`, email, name.
    - `workspaces`: owner, name, plan stub (`free`/`internal` for now).
    - `domains`: `workspaceId`, `domain`, `status`, `verificationToken`, timestamps.
    - `integrations`: `workspaceId`, `type` (`slack`/`discord`), `name`, `webhookUrl`.
    - `aliases`: `workspaceId`, `domainId`, `localPart`, `email`, `targets`, `status`.
    - (Optional in Phase 1) `email_logs`: alias, timestamps, status.
  - Implement shared DB connection utility.

- **Basic dashboard layout**
  - App shell:
    - Sidebar/nav with entries: `Dashboard`, `Domains`, `Aliases`, `Integrations`, `Profile`.
    - Top bar with workspace switch (if needed) and user menu.
  - Simple landing view after login that shows “Getting Started” steps.

### 2. Domain Management (No Payments Yet)

- **Domain CRUD (UI + API)**
  - Page: `Domains`
    - List of domains with status badges (`pending`, `active`).
    - “Add Domain” modal/form:
      - Input domain (e.g. `acme.com`).
  - API:
    - Create domain: generate `verificationToken` and store `status = pending_verification`.
    - Read list of domains for current workspace.
    - Delete domain (soft or hard).

- **DNS instructions (front-end only for now)**
  - For each domain, show:
    - MX records (static instructions: point to app’s Cloudflare zone).
    - TXT record with `verificationToken`.
  - Note: In Phase 1, DNS setup on Cloudflare side can be manual by you.

- **Domain verification check**
  - Implement backend service or API route that:
    - Performs DNS lookup for TXT and MX records (or stub/mock for local).
    - Updates domain status to `active` when verification passes.
  - Add “Check DNS” button on each domain row for manual re-check (automatic polling can come later).

### 3. Integrations (Slack & Discord basics)

- **Integrations UI**
  - Page: `Integrations`
    - Cards for Slack and Discord.
    - Each card shows:
      - Status (connected/not).
      - List of saved webhooks (with labels).
      - “Add Webhook” button.

- **Integrations API**
  - Create integration:
    - Accept `type` (`slack`/`discord`), `name`, `webhookUrl`.
  - List integrations:
    - Filtered by workspace.
  - Delete integration.

- **Security**
  - Store `webhookUrl` as sensitive data (server-side only, not exposed raw in client lists where unnecessary).

### 4. Alias Management & Routing Config

- **Aliases UI**
  - Page: `Aliases`
    - Filter by domain.
    - List aliases with:
      - `email` (e.g. `support@acme.com`).
      - Status.
      - Associated Slack/Discord targets.
    - “Add Alias” form:
      - Select domain (active only).
      - Local part input (`support`).
      - Multi-select of available integrations (Slack/Discord webhooks).

- **Aliases API**
  - Create alias:
    - Build full email from `localPart + domain`.
    - Validate uniqueness within domain.
    - Save alias with `targets` referencing integration IDs.
  - Update alias:
    - Change local part, status, or targets.
  - Delete alias.

### 5. Cloudflare Worker & KV (Main Feature Check)

- **Worker basics**
  - Create Cloudflare Worker (separate repo/folder, but in Phase 1 just get it running).
  - Define HTTP handler that:
    - Accepts Cloudflare Email Routing payload (or a mocked JSON input for local testing).
    - Extracts `to`, `from`, `subject`, `text/html`.

- **Alias lookup logic**
  - Decide lookup scheme:
    - Key format: `domain:localPart` (e.g. `acme.com:support`).
  - Implement:
    - Read from KV; if missing, optionally call an app-side API (or skip DB fallback in Phase 1).
    - KV value includes minimal routing info: array of `{ type, webhookUrlOrId }`.

- **Posting to Slack & Discord**
  - Implement utility inside Worker to:
    - POST to Slack Incoming Webhook URL.
    - POST to Discord Webhook URL.
  - Format messages to include:
    - Sender, subject, first lines of body, and maybe a truncated preview.

- **End-to-end “main feature” test**
  - Manual or staging test:
    - Configure a test domain in Cloudflare.
    - Add it in the app, set up one alias + Slack or Discord webhook.
    - Send a real email to `support@your-test-domain`.
    - Confirm it appears in Slack/Discord.
  - Fix any parsing, lookup, or formatting issues until reliable.

---

## Phase 2 – Payments & Plan Enforcement

**Goal**: Add DodoPayments integration and basic plan limits, so this can function as a real paid SaaS.

### 1. Plan Definition & Subscription Model

- **Plan model**
  - Define at least one paid plan (e.g. “Pro”):
    - `maxDomains` (e.g. 3).
    - `maxAliases` (e.g. 20).
    - (Optional) display price and features list.
  - Add `subscriptions` collection:
    - `workspaceId`, `provider = 'dodopayments'`.
    - `customerId`, `subscriptionId`.
    - `planId`, `status`, `currentPeriodEnd`.

- **Workspace plan status**
  - Add fields on workspace to:
    - Reference active subscription or plan.
  - Implement helper (server-side) to compute effective limits and active/inactive status.

### 2. DodoPayments JS SDK Integration

- **Frontend integration**
  - Add “Billing” or “Upgrade” page.
  - Integrate DodoPayments JS SDK:
    - Show current plan and subscription state.
    - Provide “Upgrade” / “Manage Subscription” button that:
      - Calls backend to create/initiate DodoPayments checkout/session if needed.
      - Uses JS SDK for the actual payment flow.

- **Backend integration**
  - Implement endpoints used by the JS SDK:
    - e.g. `/api/billing/create-session` to:
      - Validate user/workspace.
      - Create/initiate checkout with correct plan ID and workspace reference.
  - Implement endpoint(s) or webhook handler for DodoPayments to:
    - Mark subscription as `active`, `past_due`, `canceled`, etc.
    - Update `currentPeriodEnd`, `planId`.

### 3. Enforce Limits & Access Control

- **Plan limits enforcement**
  - On create domain:
    - Check workspace plan limit for `maxDomains`.
  - On create alias:
    - Check `maxAliases`.
  - If limits exceeded:
    - Return clear errors: “Upgrade plan to add more domains/aliases”.

- **Routing access**
  - Decide MVP policy for subscription status:
    - If `canceled` or `past_due`, optionally:
      - Prevent new domain/alias creation.
      - Optionally turn off routing (or allow grace period).
  - Implement checks in:
    - App API for writes (domains, aliases).
    - Worker (optional) to validate workspace is active before routing.

### 4. UX & Communication

- **Billing UX**
  - Show plan details and usage:
    - How many domains and aliases currently used vs limit.
  - Show clear status:
    - “Trial”, “Active”, “Canceled”, etc.
  - Surface billing errors:
    - Failed payment messages, if available.

---

## Phase 3 – Polish, Finalization & Launch Readiness

**Goal**: Clean up UX, reliability, and observability; finalize for beta/launch.

### 1. Observability & Logging

- **Email logs (if not done in Phase 1)**
  - Implement `email_logs` collection:
    - `aliasId`, `workspaceId`, timestamps.
    - Basic metadata: subject snippet, sender, delivery result.
  - Optional UI:
    - Simple per-alias list: last N routed emails (no search required).

- **Error tracking & monitoring**
  - Add basic logging from:
    - Cloudflare Worker (Cloudflare Logs / Wrangler tail).
    - App API (server logs, or third-party error tracker).
  - Define simple alerting for repeated failures (manual review acceptable at first).

### 2. UX Polish & Onboarding

- **Onboarding improvements**
  - “Getting Started” checklist:
    - 1) Add domain.
    - 2) Add Slack/Discord webhook.
    - 3) Create first alias.
    - 4) Send test email.
  - Inline guidance for DNS setup:
    - Clear MX/TXT examples.
    - Copy buttons for values.

- **UI/UX refinements**
  - Consistent design system across dashboard.
  - Empty states and helpful messages for pages with no data (no domains, aliases, integrations).
  - Loading/skeleton states when fetching data.

### 3. Security & Hardening

- **Secrets and data protection**
  - Confirm:
    - Webhook URLs and provider keys are never exposed to the client unnecessarily.
    - All env vars set correctly in Vercel and Cloudflare.
  - Validate:
    - Only authenticated, authorized users can access/modify their workspace data.
    - Multi-tenant isolation in all API routes.

- **Abuse considerations**
  - Basic sanity checks:
    - Reasonable alias naming validation.
    - Rate limiting for API endpoints (optionally via middleware or platform features).
  - Basic anti-spam posture:
    - Document how customers should configure SPF/DKIM/DMARC for better email reputation.

### 4. Documentation & Final Checks

- **Internal docs**
  - Update `cursor.md` (PRD) where needed.
  - Add short “runbook” notes:
    - How to onboard a new customer domain (including Cloudflare changes if any are still manual).
    - How to debug a failed routing.
- **Public-facing docs/help**
  - “How to connect your domain” guide.
  - “How to connect Slack/Discord” guide.
- **Final testing**
  - End-to-end tests for:
    - New user signup → domain added → alias → test email → Slack/Discord.
    - Subscription changes (upgrade/downgrade/cancel).
  - Cross-browser manual checks for the dashboard.

---

## Summary

- **Phase 1**: Build the dashboard, DB schema, integrations and alias management, and prove the main feature works end-to-end (email → Worker → Slack/Discord).
- **Phase 2**: Integrate DodoPayments JS SDK and enforce plan limits + subscription states.
- **Phase 3**: Polish UX, add logging/observability, harden security, and finalize docs and tests for a launch-ready MVP.