## Project PRD – Customer-Domain Email → Slack/Discord Router (MVP)

### 1. Overview

This product is a SaaS that lets customers connect their own email domains (e.g. `acme.com`) and create email aliases like `support@acme.com`, `billing@acme.com`, etc. Incoming emails to those addresses are routed into configured Slack or Discord channels.

**Core concept**: Customer-owned domains, Cloudflare Email Routing for ingress, Cloudflare Worker for routing, and a Next.js SaaS dashboard for configuration and billing.
In the MVP, email routing is configured at the alias level only. All emails sent to a given alias (e.g. support@acme.com) are routed identically to the same Slack/Discord destinations. Conditional routing based on sender, subject, or content is intentionally deferred to a future, paid tier.

---

### 2. Goals & Non-Goals

- **Goals**
  - Allow a user to:
    - Sign up, create a workspace, and upgrade to a paid plan.
    - Connect a custom domain they own (e.g. `acme.com`).
    - Verify that domain via DNS records.
    - Create aliases on that domain (`support@acme.com`, `billing@acme.com`, etc.).
    - Connect Slack and/or Discord and map aliases to specific channels via webhooks.
  - Reliably receive emails for those aliases and post them into Slack/Discord in near real time.
  - Provide a simple, clean dashboard to manage domains, aliases, and integrations.
  - Support multi-tenant usage from day one.

- **Non-goals (MVP)**
  - Replying from Slack/Discord back to email.
  - Deep analytics, search, or advanced reporting.
  - Complex role-based access control beyond basic workspace ownership/membership.
  - Built-in email sending/transactional email (beyond minimal notifications if any).
  - Supporting many email providers: we standardize on Cloudflare Email Routing for ingress.

---

### 3. Target Users & Personas

- **Primary persona – Founder / Ops lead at small SaaS**
  - Wants a shared support inbox but prefers working inside Slack/Discord.
  - Has limited engineering time and wants easy DNS-based setup instead of building their own email→chat bridge.

- **Secondary persona – Small team IT/Dev lead**
  - Manages domains and DNS.
  - Comfortable adding MX/TXT records.
  - Wants control over routing per alias and per channel.

---

### 4. User Flows (MVP)

#### 4.1 Onboarding & Billing

1. Visitor lands on marketing page and clicks “Get Started”.
2. User signs up via Clerk (email/password or social).
3. User creates a workspace (e.g. “Acme Inc”).
4. User chooses a paid plan and is taken through DodoPayments JS SDK flow.
5. On success, workspace is marked active with plan limits (e.g. max domains, aliases).

#### 4.2 Connect Custom Domain

1. In the dashboard, user navigates to “Domains”.
2. User clicks “Add domain” and enters `acme.com`.
3. App generates:
   - DNS MX record instructions pointing `acme.com` (or `email.acme.com`) to the app’s Cloudflare email zone.
   - A DNS TXT record with a unique verification token.
4. User updates DNS at their registrar.
5. App periodically checks DNS:
   - Once MX and TXT are correct, domain status → `active`.

#### 4.3 Configure Integrations (Slack / Discord)

1. User opens “Integrations” page.
2. For Slack:
   - MVP: user pastes Slack Incoming Webhook URL for the desired channel.
3. For Discord:
   - User pastes Discord Channel Webhook URL.
4. App stores webhook configuration tied to the workspace (and optionally per alias).

#### 4.4 Create & Manage Aliases

1. User opens “Aliases” page.
2. User selects a verified domain (e.g. `acme.com`).
3. User creates alias:
   - Local part: `support` → full email `support@acme.com`.
   - Chooses one or more routing targets:
     - Slack webhook A.
     - Discord webhook B.
4. App saves alias in the database and updates Cloudflare KV cache for fast lookup.
5. For the MVP, aliases do not support conditional routing. Each alias has a static set of routing targets that apply to all incoming emails. More advanced routing logic (e.g. by subject, sender, or keywords) is explicitly out of scope for the MVP.

#### 4.5 Email Routing (Runtime Flow)

1. External sender emails `support@acme.com`.
2. DNS MX for `acme.com` points to Cloudflare Email Routing.
3. Cloudflare Email Routing invokes the configured **Cloudflare Worker** for that domain.
4. Worker:
   - Parses recipient (`support@acme.com`), sender, subject, and message body.
   - Looks up alias in KV using `acme.com:support` (fallback to DB if required).
   - Formats a structured message for Slack/Discord (sender, subject, snippet).
   - Sends message to all configured webhooks for that alias.
   - Optionally logs a minimal record in the app DB (`email_logs`) with status.

---

### 5. Functional Requirements

#### 5.1 Authentication & Accounts

- Users must be able to:
  - Sign up, sign in, sign out using Clerk.
  - Belong to at least one workspace.
- Workspaces:
  - Owned by a single user (MVP).
  - Store plan/subscription status and limits.
- Integration with DodoPayments JS SDK to manage subscription access.

#### 5.2 Billing (DodoPayments)

- Plans:
  - At least one paid plan (e.g. “Pro”) with defined limits:
    - Max number of domains.
    - Max number of aliases.
    - (Optional) Soft limit on monthly email volume.
- DodoPayments JS SDK:
  - Used in the frontend to create/complete checkout.
  - Backend registers subscription status and attaches it to the workspace.
- Access control:
  - If subscription is inactive, restrict creating new domains/aliases and optionally disable routing.

#### 5.3 Domain Management

- Users can:
  - Add domain: input domain name.
  - View DNS instructions (MX + TXT).
  - See current verification status and last checked time.
  - Remove domain (with confirmation).
- System must:
  - Validate domain format.
  - Generate unique TXT verification token per domain.
  - Periodically re-check DNS until verified.
  - Once verified, mark domain as `active` and ensure Cloudflare Email Routing is configured (manual config step by us for MVP, before later automation).

#### 5.4 Alias Management

- Users can:
  - For a given active domain:
    - Create alias by specifying local part (`support`, `billing`) and selecting target integrations (Slack/Discord).
    - Update alias (change routing targets, enable/disable).
    - Delete alias (soft-delete or hard-delete).
- System must:
  - Enforce per-plan alias limits.
  - Keep KV cache in sync with DB:
    - On create/update/delete, update KV entry with minimal routing data.
    

#### 5.5 Slack Integration

- MVP behavior:
  - User pastes Slack Incoming Webhook URL(s).
  - User can give each webhook a human-readable label (e.g. “Support channel”).
- System:
  - Stores webhook URLs encrypted in DB.
  - Exposes them as selectable routing targets when configuring aliases.
  - Cloudflare Worker uses saved webhook URLs for posting messages.

#### 5.6 Discord Integration

- MVP behavior:
  - User pastes Discord Channel Webhook URL(s).
- System:
  - Stores webhook URLs encrypted in DB.
  - Exposes them as routing targets.
  - Cloudflare Worker uses saved webhook URLs for posting messages.

#### 5.7 Email Processing & Posting

- Worker must:
  - Receive email payload from Cloudflare Email Routing.
  - Support at least:
    - `to`, `from`, `subject`, `text` (and optionally `html`).
  - Extract:
    - Local part and domain from recipient.
  - Lookup:
    - KV key: `domain:localPart` → alias config.
  - If alias not found:
    - Optionally drop silently (MVP acceptable) or send fallback notification.
  - If alias found:
    - For each configured target (Slack/Discord webhook):
      - POST formatted message.
  - Timeout and rate limits must be handled gracefully:
    - Retry policies for transient failures can be minimal for MVP (e.g. no retries, just log).

#### 5.8 Logging (Optional but Recommended MVP)

- Log:
  - Basic email metadata (alias, timestamp, status success/fail).
- Surface:
  - Simple per-alias list in UI: “Last N emails” is a stretch but not required for MVP.

---

### 6. Non-Functional Requirements

- **Performance**
  - End-to-end latency from email received to message posted typically under a few seconds.
- **Scalability**
  - Architecture should allow scaling by upgrading CF Worker/plan and DB sizing.
- **Security**
  - All sensitive values (webhook URLs, DB credentials, DodoPayments keys, Clerk secrets) in environment variables / Worker secrets.
  - SSL/TLS enforced for all endpoints.
- **Reliability**
  - Reasonable behavior on email processing failures:
    - No crashes on malformed emails.
    - Logging errors for debugging.
- **Multi-tenancy**
  - Strict isolation of data by workspace.
  - No cross-leakage of domains, aliases, or integrations.

---

### 7. Tech Stack (Finalized)

- **Frontend / App**
  - Next.js 14 (App Router, TypeScript).
  - Tailwind CSS + shadcn/ui (or equivalent).
  - TanStack Query + Redux Toolkit.
  - Clerk for authentication.
  - DodoPayments JS SDK for billing UI.

- **Backend (App side)**
  - Next.js Route Handlers (`/api/...`).
  - MongoDB Atlas with official Node driver.
  - Hosted on Vercel.

- **Email ingress & routing**
  - Customer-owned domains:
    - MX records pointing to app-owned Cloudflare zone(s).
  - Cloudflare Email Routing.
  - Cloudflare Worker (`email-router-worker`) for processing.
  - Cloudflare KV for alias routing cache.

- **Integrations**
  - Slack: Incoming Webhooks (MVP).
  - Discord: Channel Webhooks.

- **Infra & Secrets**
  - Vercel for app hosting + env vars.
  - Cloudflare (Workers + KV + DNS + Email Routing).
  - MongoDB Atlas.

---

### 8. Out of Scope (MVP)

- Bi-directional messaging (reply from Slack/Discord back to email).
- Automated analytics, dashboards, or exports.
- RBAC beyond simple workspace owner (e.g. fine-grained permissions).
- Complex volume-based pricing or metered billing.
- Support for other chat platforms (MS Teams, Telegram, etc.).

---

### 9. Risks & Open Questions

- **Cloudflare Email Routing → Worker behavior**:
  - Exact payload format and limits must be confirmed and tested.
- **DNS setup complexity for non-technical users**:
  - Might require better docs and validation UI to reduce friction.
- **DodoPayments JS SDK details**:
  - We must confirm:
    - Exact integration flow.
    - How to receive final subscription confirmation (callbacks/webhooks).
- **Scaling KV + DB writes**:
  - For MVP, manual sync is acceptable; later, event-driven updates may be required.
- Future routing complexity: Introducing conditional routing rules in later paid tiers will require careful design to avoid performance regressions in the Cloudflare Worker and to maintain a simple mental model for users.

---