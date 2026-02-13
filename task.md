## Task 1 – Minimal Authenticated Dashboard + Data Layer Setup

### 1. Objective

Build a **minimal but real dashboard** that runs end-to-end with:

- Authentication via Clerk.
- A basic app shell (sidebar + top bar) and three core pages:
  - `Dashboard`
  - `Domains`
  - `Aliases`
- MongoDB connected with **real DB models** (no Cloudflare Worker yet).
- Simple CRUD on mock/stub data structures (or very thin DB models) so we can:
  - Log in.
  - See the dashboard.
  - Create/read basic records (e.g. domains and aliases) from the database.

This task is about seeing and feeling the SaaS app working in the browser, not yet about routing real emails.

---

### 2. Scope

**In scope**

- Running the `NextJS-Starter` app locally.
- Wiring Clerk into the app (sign up / sign in / sign out).
- Connecting MongoDB Atlas and adding a shared DB connection utility.
- Defining minimal TypeScript models/interfaces for:
  - `users`
  - `workspaces`
  - `domains`
  - `aliases`
- Creating a basic dashboard shell:
  - Sidebar with links to `Dashboard`, `Domains`, `Aliases`.
  - Top bar with user menu.
- Implementing **very simple CRUD**:
  - `Domains` page:
    - List domains from DB.
    - Add domain with just `domain` string and `status = 'pending_verification'`.
  - `Aliases` page:
    - List aliases from DB.
    - Add alias with `localPart` and a dummy `domain` reference (no verification yet).

**Out of scope (for this task)**

- Cloudflare Worker, Cloudflare Email Routing, and KV.
- Slack/Discord integrations.
- DodoPayments / billing.
- DNS verification logic.
- Plan limits and subscription enforcement.
- Any production-ready design polish (basic Tailwind layout is enough).

---

### 3. Deliverables

By the end of Task 1, we should have:

1. **Local dev environment**:
   - `npm run dev` runs the app without crashes.
   - Clerk is configured with test keys for local use.
   - MongoDB Atlas connection works from the app.

2. **Authenticated dashboard shell**:
   - After login, the user lands on a dashboard layout with:
     - Sidebar (Dashboard / Domains / Aliases links).
     - Simple main content area.

3. **Working `Domains` page**:
   - Shows list of domains from MongoDB for the current user/workspace.
   - Has a simple “Add Domain” form (just a text input + button).
   - New domains appear immediately in the list with status `pending_verification`.

4. **Working `Aliases` page**:
   - Shows list of aliases from MongoDB.
   - Simple “Add Alias” form that:
     - Lets you select a domain from a dropdown.
     - Lets you input a local part (e.g. `support`).
   - Creates alias records and shows them in the list.

5. **Basic workspace concept**:
   - Even if minimal, there is a way to associate:
     - `user` → `workspace` → `domains` and `aliases`.

---

### 4. Detailed Steps

#### Step 1 – Run the starter app

1. Install dependencies:
   - `npm install` (or `yarn` / `pnpm` as preferred).
2. Set up environment variables required by the starter (from its README).
3. Run dev server:
   - `npm run dev`.
4. Confirm the base starter page loads at `http://localhost:3000`.

#### Step 2 – Configure Clerk

1. Create a test application in Clerk (if not done already).
2. Add required Clerk env vars to `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - Any other vars required by the starter.
3. Wrap the app with Clerk provider (if not already done in `NextJS-Starter`).
4. Add simple auth-guard:
   - Unauthenticated users see a sign-in/register screen.
   - Authenticated users see the dashboard shell.

#### Step 3 – Connect MongoDB Atlas

1. Create a MongoDB Atlas project and cluster for this app.
2. Get connection string and add to `.env.local` (e.g. `MONGODB_URI`).
3. Implement a shared DB connection helper:
   - Reusable utility that returns a connected client/DB instance.
   - Handles re-use of connections in dev.

#### Step 4 – Define minimal models

1. Decide on a simple initial schema:

   - `users`:
     - `clerkUserId`
     - `email`
     - `name`
     - `createdAt`
   - `workspaces`:
     - `ownerUserId`
     - `name`
     - `createdAt`
   - `domains`:
     - `workspaceId`
     - `domain`
     - `status` (string, e.g. `pending_verification` | `active`)
     - `createdAt`
   - `aliases`:
     - `workspaceId`
     - `domainId`
     - `localPart`
     - `email` (computed from `localPart + '@' + domain`)
     - `status` (string, e.g. `active`)
     - `createdAt`

2. Create corresponding TypeScript types/interfaces and basic helper functions to access these collections.

#### Step 5 – Implement dashboard shell

1. Create a layout component with:
   - Sidebar navigation links:
     - Dashboard
     - Domains
     - Aliases
   - Top bar:
     - App name
     - Profile dropdown with sign-out option.
2. Integrate layout into the main authenticated part of the app:
   - All authenticated pages use the same shell.

#### Step 6 – Implement `Domains` page (minimal CRUD)

1. **Read**:
   - Fetch domains for the current workspace from MongoDB.
   - Render them in a simple table/list.
2. **Create**:
   - Add a form:
     - Input for `domain` string.
     - Button `Add Domain`.
   - On submit:
     - Create a domain record with:
       - `status = 'pending_verification'`.
       - `workspaceId` set to the current user’s workspace.
   - Update UI to show the new domain without full page reload (using TanStack Query if desired).

*(Delete / update can be added later; not strictly required for this first task.)*

#### Step 7 – Implement `Aliases` page (minimal CRUD)

1. **Read**:
   - Fetch aliases for the current workspace.
   - Display them in a list with:
     - `email` (computed field).
     - `status`.
   - Fetch domains to display domain names instead of IDs.
2. **Create**:
   - Form fields:
     - Dropdown to select domain (list of domains from DB).
     - Text input for `localPart` (`support`, `billing`, etc.).
   - On submit:
     - Create alias with:
       - `domainId` and `workspaceId`.
       - `localPart`.
       - `email = localPart + '@' + selectedDomain`.
       - `status = 'active'`.
   - Show new alias in the list.

---

### 5. Acceptance Criteria

Task 1 is **done** when:

1. **Auth works**:
   - You can sign up and log in via Clerk.
   - After login, you see the main dashboard shell (not the starter boilerplate page).

2. **Dashboard navigation works**:
   - Sidebar navigation between:
     - Dashboard → Domains → Aliases.
   - No major layout issues on desktop.

3. **Domains page works with real DB**:
   - You can add a domain (e.g. `acme-test.com`).
   - It is stored in MongoDB.
   - It appears in the list with status `pending_verification`.

4. **Aliases page works with real DB**:
   - You can create an alias for a domain (e.g. local part `support` for `acme-test.com`).
   - The alias is stored in MongoDB and shown as `support@acme-test.com`.
   - At least one alias can be created and displayed per domain.

5. **Codebase is still simple and understandable**:
   - No routing to Cloudflare Worker yet.
   - No payment/billing logic added.
   - The main purpose is clear: see how the dashboard, DB, and basic CRUD feel to work with.

---

### 6. Notes

- For this first task, it’s okay if:
  - Workspaces are simplified (e.g. 1 workspace per user created automatically).
  - Domain verification is not implemented.
  - Integrations (Slack/Discord) are not present yet.
- The priority is to **understand the flow of the app**:
  - Auth → dashboard → create/read domains and aliases in a real DB.



## Task 2 – Real Cloudflare Worker Integration + shadcn UI

### 1. Objective

Connect the **real Cloudflare Worker** and **Cloudflare Email Routing** to your app so you can:

- Configure domains and aliases in your dashboard.
- Store routing config in the database.
- Sync a minimal routing snapshot into Cloudflare KV.
- Receive a real email and see it land in a Slack/Discord channel via the Worker.

At the same time, **upgrade the main dashboard UI to shadcn** patterns (using `UI_SKILLS.md` as the reference for consistent UI decisions).

---

### 2. Scope

**In scope**

- Set up shadcn/ui in the Next.js app and refactor the key screens to use it:
  - Layout shell (sidebar / top bar).
  - `Domains` page.
  - `Aliases` page.
  - A new simple `Integrations` page for Slack/Discord webhooks.
- Create a real Cloudflare Worker project for email routing:
  - Parse Cloudflare Email Routing requests.
  - Look up alias routing config from Cloudflare KV.
  - Post formatted messages to Slack/Discord webhooks.
- Add a simple **“sync alias routing to KV”** mechanism from the app to the Worker/KV.

**Out of scope for this task**

- Payments (DodoPayments).
- Full plan limiting and subscription logic.
- Rich logging UI (only minimal logging or console logs).
- Complex Slack/Discord app flows (OAuth, bots). We’ll stick to webhook URLs.

---

### 3. Prerequisites

Before starting Task 2, Task 1 should already provide:

- Working Next.js dashboard with Clerk auth.
- MongoDB Atlas connected.
- Basic `domains` and `aliases` CRUD (even if minimal).
- A “workspace” concept, even if simplified.

---

### 4. Detailed Steps

#### Step 1 – Review `UI_SKILLS.md` and set shadcn baseline

1. **Read `UI_SKILLS.md`** carefully.
   - Note the patterns it recommends for:
     - Layout.
     - Forms.
     - Tables/lists.
     - Buttons, inputs, and feedback messages.
2. **Install shadcn/ui** (if not already):
   - Initialize shadcn in the project (according to its docs).
   - Generate core components as per `UI_SKILLS.md` guidance:
     - `button`, `input`, `label`, `form`, `card`, `badge`, `table` or `data-table` (if needed), `dialog` (for modals).

#### Step 2 – Refine dashboard UI with shadcn

1. **App shell**
   - Update the dashboard layout to use shadcn components:
     - Sidebar:
       - Use `button` variants or nav link patterns recommended in `UI_SKILLS.md`.
       - Items: `Dashboard`, `Domains`, `Aliases`, `Integrations`.
     - Top bar:
       - App name/brand.
       - User avatar/menu with sign-out.
   - Ensure light/dark behavior and spacing follow the UI guidelines.

2. **Domains page**
   - Use shadcn `card` or `table` for the list of domains:
     - Columns: Domain, Status, Created At, Actions (e.g. “Check DNS” placeholder).
   - “Add Domain” uses shadcn `dialog` + `form`:
     - Domain input.
     - Submit button with loading state.
   - States:
     - Empty state for no domains.
     - Error/toast pattern per `UI_SKILLS.md`.

3. **Aliases page**
   - Use shadcn for:
     - Domain filter (select).
     - Aliases list (table or list with `card`).
   - “Add Alias” uses a dialog form:
     - Domain dropdown.
     - Local part input.
     - Save button with validation errors displayed as per UI guidelines.

4. **Integrations page (new)**
   - Add simple page:
     - Section for Slack Webhooks.
     - Section for Discord Webhooks.
   - For each:
     - List existing webhooks with name and truncated URL.
     - “Add Webhook” dialog:
       - Name field.
       - Webhook URL field.
   - Store webhooks in the `integrations` collection you defined in the PRD/plan.

> The goal is not pixel-perfect polish yet, but to **standardize on shadcn + UI_SKILLS patterns** so future pages are consistent.

---

#### Step 3 – Cloudflare Worker project setup

1. **Create Worker project**
   - Use `wrangler` to bootstrap a new Worker, e.g. `email-router-worker`.
   - Configure:
     - TypeScript (if you prefer).
     - Name and route (HTTP endpoint).

2. **Configure Cloudflare KV**
   - Create a KV namespace, e.g. `ALIAS_CONFIG_CACHE`.
   - Bind it in `wrangler.toml` to the Worker.
   - KV value design (per alias key):
     - Key: `domain:localPart` (e.g. `acme.com:support`).
     - Value (JSON string):
       {
         "workspaceId": "…",
         "targets": [
           { "type": "slack", "webhookUrl": "…" },
           { "type": "discord", "webhookUrl": "…" }
         ]
       }
Worker request handler (email ingress)
Implement a handler for the Email Routing HTTP request:
Extract:
Recipient email(s) (to).
Sender (from).
Subject.
Text and/or HTML body.
Normalize recipient:
Lowercase.
Split into localPart and domain.
Build KV key and fetch alias config.
If alias config not found:
Safely return 200/OK to Cloudflare (no retries needed in MVP), with internal log/console.
Posting to Slack & Discord
Implement two helpers inside the Worker:
postToSlack(webhookUrl, payload).
postToDiscord(webhookUrl, payload).
Format message:
Title: New email to support@acme.com.
Fields: From, Subject, first few lines of body.
Iterate over targets from alias config and post to each.
Local testing / mocking
Before using real Email Routing, test Worker with:
wrangler dev and manual HTTP POST with mocked payload.
Confirm:
KV lookup works.
Slack/Discord posts are sent correctly (using test webhooks).
Step 4 – App ↔ Worker integration: Sync alias routing to KV
Decide sync strategy for this task
Simpler MVP approach:
Whenever an alias is created or updated in the app, make a server-side request from Next.js to a Worker admin endpoint (or Cloudflare API) to update KV.
For Task 2, you can implement:
A single API route in your app: /api/aliases/sync.
Or have the alias create/update handlers call a Worker endpoint directly.
API design
From the app side, for each alias:
Collect:
domain, localPart.
List of target webhook URLs (resolved from integrations collection).
POST to Worker admin endpoint (e.g. /sync-alias) with:
     {       "domain": "acme.com",       "localPart": "support",       "targets": [         { "type": "slack", "webhookUrl": "…" },         { "type": "discord", "webhookUrl": "…" }       ]     }
Worker admin handler:
Validates a shared secret header/token.
Writes to KV with the correct key and value.
Wire alias create/update to sync
When an alias is created/updated:
Save to MongoDB.
Then call the sync endpoint.
In the UI:
Show toast if sync fails, so you know routing might not work.
Step 5 – Connect real Cloudflare Email Routing (staging/test domain)
Cloudflare DNS setup
Choose a test domain or subdomain you control (e.g. test.yourapp-domain.com).
In Cloudflare:
Configure MX records to use Cloudflare Email Routing.
Link Email Routing to your Worker:
*@test.yourapp-domain.com → your Worker route.
App domain entry
In your app’s Domains page:
Add the same test domain.
(For this task you can skip automated verification; manual alignment is enough.)
Create test alias and integration
Create Slack and/or Discord test webhooks.
In your app:
Add the webhooks via Integrations.
Create alias:
Domain: your test domain.
Local part: support.
Targets: your Slack/Discord webhooks.
Confirm alias sync to KV succeeds.
End-to-end test
From a personal email account, send:
Email to support@your-test-domain.
Verify:
Cloudflare Email Routing delivers to Worker.
Worker looks up alias config in KV.
Slack/Discord message appears with correct sender, subject, and snippet.
5. Acceptance Criteria
Task 2 is done when:
shadcn UI implemented for core pages
Dashboard, Domains, Aliases, and Integrations use shadcn components.
UI follows patterns in UI_SKILLS.md (forms, dialogs, lists, basic feedback).
Integrations page functional
You can add and list Slack/Discord webhooks.
They are stored in DB and appear as selectable targets for aliases.
Worker + KV integrated
Cloudflare Worker is deployed and can:
Read alias config from KV.
Post messages to Slack/Discord test webhooks.
There is a working sync path:
Creating/updating an alias in the app updates KV for that alias.
Real email end-to-end test passes
Sending a real email to a configured alias using your test domain:
Produces a message in the correct Slack/Discord channel.
No manual KV edits are required for normal operation (app → KV sync handles it).  