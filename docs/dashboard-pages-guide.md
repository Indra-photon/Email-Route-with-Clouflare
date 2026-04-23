# Dashboard Pages — How They Work

---

## 1. Customize App

### What is this page?

This page lets you change how the **Slack bot looks** when it posts email notifications into your Slack channels. Think of it like giving your bot a personality — you can give it a name, a profile picture, and an optional description.

The settings you save here are **linked to a specific domain**. So if you have two domains (say `support.acme.com` and `billing.acme.com`), each one can have its own bot with a different name and avatar.

---

### The three things you can set

**Bot Name**
This is the display name that appears in Slack when the bot posts a message. Instead of showing something generic like "Incoming Webhook", it will say whatever you type here — for example "Acme Support" or "Billing Bot". This name shows at the top of every message the bot posts.

**Bot Avatar**
This is the profile picture of the bot in Slack. You upload an image (JPG, PNG, GIF, or WebP, max 2MB) and when the bot posts a message in your channel, that image appears as its profile photo. If you don't upload anything, Slack uses a default icon.

**Bot Description**
This is a short line of text that appears *below the email header* in every Slack message the bot posts — shown as small italic grey text. For example, if you type "Handles support tickets for acme.com", that line will appear right under the notification header in Slack, giving your team context about which channel or purpose this bot is for.

> **Note:** Description used to be internal-only (not shown in Slack). It now shows directly inside the Slack message as a context line.

---

### How it works end to end

1. You open the Customize App page and pick a domain from the tab bar at the top.
2. You fill in the bot name, upload an avatar image, and type a description.
3. You hit Save Changes.
4. From that moment on, whenever someone sends an email to that domain's alias, the bot that pops up in Slack will have the name, avatar, and description you saved.

---

### What happens if you leave fields blank?

- No bot name → Slack uses the default name set in your Slack app settings.
- No avatar → Slack uses the default icon.
- No description → No context line appears in the message, which is fine.

---

---

## 2. Email Templates

### What is this page?

This page lets you create **pre-written reply templates** that your team can use when responding to customer emails from Slack. Instead of typing the same reply over and over, an agent just picks a template, tweaks it if needed, and sends it in one click.

---

### The smart variable system

Templates support **placeholders** — special words wrapped in curly braces — that get automatically filled in with real data when the template is used. You don't have to hardcode names or subjects.

Here are the placeholders you can use:

- **{name}** — gets replaced with the customer's name from the email (e.g. "John")
- **{email}** — gets replaced with the customer's email address
- **{subject}** — gets replaced with the email subject line
- **{date}** — gets replaced with the date the email was received
- **{agent}** — gets replaced with the Slack agent's name (the person handling the ticket)

So if you write "Hi {name}, thank you for reaching out about {subject}" and the customer's name is Sarah and they emailed about a billing issue, the final email reads "Hi Sarah, thank you for reaching out about Invoice #1042".

---

### The three body modes

When writing a template body, you have three ways to do it:

**Plain Text**
You just write the reply in normal text. When the agent uses the template in Slack, the entire message is shown and they can freely edit any part of it before sending.

**Editable HTML**
You write the email in HTML (for styling, formatting, etc.) but you wrap one specific section inside a special tag pair. Only that wrapped section shows up as editable text in Slack — the rest of the HTML is locked and sent exactly as written. This is useful when you want a nicely formatted email but only want the agent to fill in one paragraph.

**Static HTML**
You write full HTML with no special editable section. The entire email is sent exactly as you wrote it, with no editing step in Slack. Good for fully standardised replies where nothing should change.

---

### How it works end to end

1. You go to Email Templates and click **Add Template**.
2. You give the template a name (just for your team's reference, like "Welcome Response" or "Refund Policy").
3. You write an email subject — you can use {subject} here if you want it to auto-fill.
4. You write the body — using plain text or HTML with the editable section tag if needed.
5. You click Create Template. It's now saved to your workspace.

When an agent is replying to a ticket in Slack:
- They click the Templates button on the Slack message.
- A menu appears showing all saved templates.
- They pick one, the placeholders auto-fill with the customer's real data, and they can edit the editable section before hitting send.
- The customer receives the email from your domain's branded address, not from Slack.

---

### Managing existing templates

- **Edit** — You can update the name, subject, or body of any template at any time. The changes apply to future uses immediately.
- **Delete** — You can remove a template permanently. This does not affect emails that were already sent using it.
- **Templates tab** — Shows you the list of all saved templates so you can browse and select which one to edit or delete.

---

### Plan requirement

Creating new templates requires an active paid plan. If your plan has expired or you haven't subscribed yet, the save button will fail and prompt you to upgrade. Viewing and using existing templates still works normally.

---

### Real world example

Say you run an e-commerce store. You create three templates:

- **"Order Received"** — sent when someone asks if their order went through
- **"Refund Processing"** — sent when someone requests a refund
- **"Shipping Delay"** — sent when there's a delay

Each template uses {name} so every customer gets a personalised reply. Your Slack team handles 50 tickets a day but only spends 10 seconds per reply because the templates do the heavy lifting.
