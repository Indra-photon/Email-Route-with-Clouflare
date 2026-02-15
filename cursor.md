# Product Requirements Document (PRD)
## Email-to-Slack Support Ticket Router

**Version:** 2.0  
**Last Updated:** February 14, 2026  
**Status:** MVP Complete, Phase 2 Planning  
**Document Owner:** Product Team

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Target Customers](#target-customers)
4. [Current State - Phase 1 Complete](#current-state---phase-1-complete)
5. [Feature Roadmap](#feature-roadmap)
6. [Technical Architecture](#technical-architecture)
7. [Success Metrics](#success-metrics)
8. [Timeline](#timeline)

---

## Executive Summary

A Slack-native support ticket management system that eliminates shared inbox chaos by routing incoming support emails directly to Slack, enabling teams to claim, track, and respond to customer emails without ever leaving Slack.

### Vision
Replace traditional shared email inboxes with a fast, collaborative, Slack-based support workflow that reduces response times from hours to minutes.

### Current Status
- ✅ **Phase 1 Complete:** Email receiving and Slack notifications working
- 🔨 **Phase 2 Starting:** Reply from Slack, ticket assignment, status tracking
- 📊 **Metrics:** End-to-end email delivery in 2-5 seconds, 100% reliability

---

## Problem Statement

### The Shared Inbox Problem

Companies with support email addresses (`support@company.com`, `help@company.com`) face critical operational challenges that cost them customers and waste team time.

### Primary Pain Points

| Pain Point | Impact | Current Cost |
|------------|--------|--------------|
| **Invisibility** | Emails sit in inbox - no one knows they arrived | Lost customers, missed SLAs |
| **Slow Response** | Team checks email sporadically | 2+ hour average response time |
| **Duplicate Work** | Multiple people respond to same email | Wasted time, confusion |
| **No Accountability** | Unclear who's handling what | Dropped tickets, blame games |
| **Context Switching** | Constant email ↔ Slack switching | 10+ hours/week wasted |
| **No Metrics** | Can't measure response times | No improvement possible |

### Real-World Impact

**Without our solution:**
- Support teams check email every 30-60 minutes
- Average first response: 2+ hours
- 15-20% of tickets get missed entirely
- Team spends 10+ hours/week in email client
- No visibility into who's working on what

**With our solution:**
- Instant Slack notification (2-5 seconds)
- Average first response: <15 minutes
- Zero missed tickets
- 100% of work happens in Slack
- Complete visibility and metrics

---

## Target Customers

### Primary Target: Small-to-Medium SaaS Companies

**Company Profile:**
- **Size:** 5-50 employees
- **Industry:** SaaS, tech startups, agencies, e-commerce
- **Support Team:** 2-10 people
- **Tools:** Already using Slack as primary communication
- **Email Volume:** 50-500 support emails per month
- **Pain:** Shared inbox causing chaos, missed tickets, slow responses

### User Personas

#### 1. Sarah - Support Manager (Primary Decision Maker)

**Background:**
- Manages 3-5 support team members
- Responsible for customer satisfaction metrics
- Budget holder for support tools

**Pain Points:**
- "I don't know if tickets are falling through the cracks"
- "Can't track who's working on what"
- "No visibility into response times"
- "Team wastes time checking email constantly"

**Goals:**
- Ensure every ticket gets a response
- Reduce average response time
- Track team performance
- Spend less time coordinating

**Budget:** $50-200/month for support tools

**Decision Criteria:**
- ✅ Easy setup (under 30 minutes)
- ✅ Works with existing Slack
- ✅ Visible metrics
- ✅ Team accountability features

---

#### 2. Mike - Founder/CEO (Secondary Decision Maker)

**Background:**
- 15-person startup
- Currently handles support himself
- Wants to scale support without hiring

**Pain Points:**
- "Need professional support@ email without infrastructure"
- "Can't check email every 5 minutes"
- "Miss urgent customer issues"
- "Don't want to pay for Zendesk"

**Goals:**
- Get instant notifications
- Look professional with support@company.com
- Eventually delegate to team member
- Keep costs low

**Budget:** Bootstrapped, price-sensitive

**Decision Criteria:**
- ✅ Works immediately
- ✅ No email server setup needed
- ✅ Affordable flat pricing
- ✅ Can start solo, add team later

---

#### 3. Jessica - Support Agent (End User)

**Background:**
- Responds to 10-30 tickets daily
- Works primarily in Slack
- Frustrated with slow email workflow

**Pain Points:**
- "Constantly switching between email and Slack"
- "Don't know if someone else already responded"
- "Can't find previous conversations with customer"
- "Email client is slow and clunky"

**Goals:**
- Respond faster
- Never leave Slack
- Know what teammates are handling
- Have customer context

**Needs:**
- ✅ Reply directly from Slack
- ✅ See who claimed tickets
- ✅ Quick access to templates
- ✅ Previous conversation history

---

### Secondary Targets

**Growing Startups (Pre-Product Market Fit):**
- 3-10 employees
- Don't have email infrastructure yet
- Want `contact@startup.com` without Gmail/Zoho
- Need instant lead notifications

**Sales Teams:**
- 3-10 sales reps
- `sales@company.com` for inbound leads
- Need instant alerts on new leads
- Want fast response to close deals

**Agencies:**
- Managing multiple client support emails
- Need organized client separation
- Billing per client
- White-label potential

---

## Current State - Phase 1 Complete

### ✅ What's Built and Working (Phase 1)

Phase 1 was completed on February 14, 2026. The core infrastructure and basic email routing functionality is fully operational and deployed to production.

---

### Tech Stack

**Frontend:**
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS + shadcn/ui components
- React Server Components

**Backend:**
- Next.js API Routes
- MongoDB Atlas (Database)
- Clerk (Authentication & User Management)

**Email Infrastructure:**
- Resend (Email receiving)
- Resend SDK for fetching email content

**Hosting & DevOps:**
- Vercel (Deployment & Hosting)
- Git-based deployment workflow

---

### Database Architecture

**Current Models (Fully Implemented):**

```javascript
Workspace {
  _id: ObjectId
  ownerUserId: String       // Clerk user ID
  name: String
  plan: String              // Future: 'free' | 'pro' | 'team'
  createdAt: Date
  updatedAt: Date
}

Domain {
  _id: ObjectId
  workspaceId: ObjectId
  domain: String            // e.g., 'galearen.resend.app'
  status: String            // 'pending_verification' | 'active'
  createdAt: Date
  updatedAt: Date
}

Integration {
  _id: ObjectId
  workspaceId: ObjectId
  type: String              // 'slack' | 'discord'
  name: String
  webhookUrl: String
  createdAt: Date
  updatedAt: Date
}

Alias {
  _id: ObjectId
  workspaceId: ObjectId
  domainId: ObjectId
  localPart: String         // e.g., 'support'
  email: String             // Full email: 'support@domain.com'
  status: String            // 'active'
  integrationId: ObjectId   // Links to Slack/Discord integration
  createdAt: Date
  updatedAt: Date
}
```

---

### ✅ Feature 1.1: User Authentication & Workspace Management

**Status:** ✅ Complete  
**Deployed:** Yes

**What It Does:**
- User signup and login via Clerk
- Automatic workspace creation for each user
- Multi-tenant data isolation (each user has their own workspace)
- Session management and protected routes

**Value to Customer:**
- Secure access to their support configuration
- Isolated data - can't see other customers' data
- No manual workspace setup needed

**Technical Implementation:**
- Clerk middleware for authentication
- `getOrCreateWorkspaceForCurrentUser()` helper function
- Automatic workspace creation on first login
- All API routes protected with `await auth()` check

---

### ✅ Feature 1.2: Domain Management

**Status:** ✅ Complete  
**Deployed:** Yes

**What It Does:**
- Add domains to account via dashboard
- View list of configured domains
- Domain status tracking (pending/active)
- DNS instructions displayed to user

**User Flow:**
1. User goes to "Domains" page
2. Clicks "Add Domain"
3. Enters domain name (e.g., `galearen.resend.app`)
4. System creates domain record with `pending_verification` status
5. User can view DNS instructions

**Value to Customer:**
- See which domains are configured
- Know what DNS records to add
- Organized domain management

**API Endpoints:**
- `GET /api/domains` - List all domains for workspace
- `POST /api/domains` - Create new domain

**Current Limitations:**
- ❌ No automated DNS verification (manual setup)
- ❌ Must use Resend test domain (`galearen.resend.app`)
- ❌ Can't add custom domains yet
- ❌ No delete functionality

**Phase 2 Improvements:**
- Add DNS verification via lookup
- Add delete functionality
- Show MX record instructions

**Phase 5 Improvements:**
- Custom domain support via Resend API
- Automatic DNS verification
- SSL certificate handling

---

### ✅ Feature 1.3: Integration Management (Slack/Discord)

**Status:** ✅ Complete  
**Deployed:** Yes

**What It Does:**
- Add Slack incoming webhook URLs
- Add Discord channel webhook URLs
- Name and organize integrations
- View list of all connected integrations
- Store webhook URLs securely

**User Flow:**
1. User creates Slack/Discord webhook in their workspace
2. User goes to "Integrations" page in dashboard
3. Selects type (Slack or Discord)
4. Enters name (e.g., "Support Channel")
5. Pastes webhook URL
6. Clicks "Add Integration"
7. Integration appears in list

**Value to Customer:**
- Connect support notifications to team channels
- Multiple integrations for different teams/purposes
- Organized integration management

**Supported Platforms:**
- ✅ Slack (Incoming Webhooks)
- ✅ Discord (Channel Webhooks)

**API Endpoints:**
- `GET /api/integrations` - List all integrations for workspace
- `POST /api/integrations` - Create new integration

**Current Limitations:**
- ❌ No edit functionality
- ❌ No delete functionality
- ❌ No validation of webhook URL
- ❌ No Microsoft Teams support

**Phase 2 Improvements:**
- Add edit and delete
- Test webhook before saving
- Show last used timestamp

**Phase 4 Improvements:**
- Microsoft Teams integration
- Other chat platforms

---

### ✅ Feature 1.4: Email Alias Creation & Routing

**Status:** ✅ Complete  
**Deployed:** Yes

**What It Does:**
- Create email aliases (e.g., `support@domain.com`)
- Link each alias to a Slack/Discord integration
- View all configured aliases in dashboard
- Track alias status (active)

**User Flow:**
1. User goes to "Aliases" page
2. Clicks "Add Alias"
3. Selects domain from dropdown
4. Enters local part (e.g., "support", "sales", "hello")
5. Selects target integration
6. Clicks "Add Alias"
7. System creates alias with full email address

**Value to Customer:**
- Map different email addresses to different channels
- Examples:
  - `support@company.com` → #customer-support
  - `sales@company.com` → #sales-team
  - `billing@company.com` → #billing-team
- Organized routing configuration

**API Endpoints:**
- `GET /api/aliases` - List all aliases with populated domain/integration
- `POST /api/aliases` - Create new alias

**Current Limitations:**
- ❌ No edit functionality
- ❌ No delete functionality
- ❌ No bulk creation
- ❌ No alias deactivation

**Phase 2 Improvements:**
- Add edit and delete
- Bulk import from CSV
- Enable/disable aliases

---

### ✅ Feature 1.5: Email Reception & Slack Notification

**Status:** ✅ Complete  
**Deployed:** Yes  
**Performance:** 2-5 second end-to-end latency

**What It Does:**
- Receives emails via Resend inbound routing
- Webhook triggers immediately on email arrival
- Fetches full email content from Resend API
- Looks up alias in MongoDB database
- Formats beautiful message for Slack/Discord
- Posts to configured webhook
- Includes first 500 characters of email body

**Technical Flow:**

```
1. Customer sends email to: support@galearen.resend.app
                ↓
2. Resend receives email
                ↓
3. Resend sends webhook to: /api/webhooks/resend
                ↓
4. Our system extracts email_id from webhook
                ↓
5. Fetch full email content via Resend API:
   - resend.emails.receiving.get(email_id)
                ↓
6. Look up alias in MongoDB by email address
                ↓
7. Look up linked integration
                ↓
8. Format message with from/subject/body
                ↓
9. POST to Slack/Discord webhook
                ↓
10. Message appears in channel (2-5 seconds total)
```

**Message Format:**

**Slack:**
```
📧 New email to support@company.com
From: customer@email.com
Subject: Need help with billing

Hi, I need help with my invoice. I was charged twice...
[First 500 chars of email body]
```

**Discord:**
```
📧 **New email to support@company.com**
**From:** customer@email.com
**Subject:** Need help with billing

Hi, I need help with my invoice. I was charged twice...
[First 500 chars of email body]
```

**Value to Customer:**
- **Instant notification:** Team sees email in 2-5 seconds
- **No email checking:** Never need to open email client
- **Full context:** See who sent it, subject, and body content
- **Team visibility:** Everyone sees tickets simultaneously

**API Endpoint:**
- `POST /api/webhooks/resend` - Receives Resend webhook events

**Technical Implementation Details:**

**Resend Integration:**
```javascript
// Initialize Resend SDK
const resend = new Resend(process.env.RESEND_API_KEY);

// Fetch email content
const { data: fullEmail } = await resend.emails.receiving.get(email_id);
const textBody = fullEmail?.text || "";
const htmlBody = fullEmail?.html || "";
```

**Database Lookup:**
```javascript
// Find alias by exact email match
const alias = await Alias.findOne({ 
  localPart: localPart,
  email: emailLower 
}).lean().exec();

// Manually fetch integration (no populate to avoid serverless issues)
const integration = await Integration.findById(alias.integrationId).lean().exec();
```

**Performance Metrics:**
- Email received → Webhook triggered: <1 second
- Webhook → Database lookup: <500ms
- Fetch email content: <1 second
- Post to Slack: <1 second
- **Total end-to-end: 2-5 seconds**

**Error Handling:**
- Invalid email format → 400 error
- Alias not found → 200 OK (silent ignore)
- Integration not found → 200 OK (silent ignore)
- Webhook post failure → Logged, 500 error
- Email fetch failure → Log error, continue without body

**Current Limitations:**
- ❌ No reply functionality
- ❌ No conversation threading
- ❌ No attachments handling
- ❌ Body truncated at 500 chars
- ❌ No email storage (fetched on demand)

**Phase 2 Improvements:**
- Add "Reply" button to Slack message
- Store email content in database
- Handle attachments
- Show full email body in modal

---

### What Phase 1 Solves

✅ **Visibility Problem**  
Team sees every email instantly in Slack - no more checking email

✅ **Speed Problem**  
Notifications arrive in 2-5 seconds - faster than any email client

✅ **Context Switching**  
See email content directly in Slack - no switching to Gmail

✅ **Setup Complexity**  
5-minute setup with existing Slack - no email server needed

---

### What Phase 1 DOESN'T Solve Yet

❌ **Response Problem**  
Still have to open email client to reply

❌ **Assignment Problem**  
Don't know who's handling which ticket

❌ **Status Problem**  
Can't track if ticket is resolved or in progress

❌ **History Problem**  
No conversation threading or customer history

❌ **Metrics Problem**  
Can't measure response times or team performance

❌ **Collaboration Problem**  
No way to discuss ticket without cluttering channel

**These gaps are addressed in Phase 2 and beyond.**

---

### Current User Experience

**Setup (5 minutes):**
1. Sign up with email
2. Create Slack incoming webhook
3. Add webhook to dashboard
4. Add domain (galearen.resend.app)
5. Create alias (support@galearen.resend.app)
6. Done!

**Daily Usage:**
1. Customer sends email
2. Team member sees notification in Slack
3. Team member opens email client
4. Team member finds the email
5. Team member responds
6. Email sent

**Pain points still present:**
- Step 3-4: Context switching (leaving Slack)
- Step 4: Finding email can be slow
- No visibility into who's handling (steps 3-5)

---

## Feature Roadmap

### Development Phases Overview

```
Phase 1: ✅ COMPLETE (Foundation)
│
├─ Email receiving infrastructure
├─ Slack notification system
└─ Basic dashboard (domains, integrations, aliases)

Phase 2: 🔨 NEXT (Complete Support Workflow)
│
├─ Reply from Slack
├─ Ticket assignment
└─ Status tracking

Phase 3: 📋 PLANNED (Team Collaboration)
│
├─ Email threading
├─ Response metrics
└─ Canned responses

Phase 4: 💡 FUTURE (Advanced Features)
│
├─ CRM integration
├─ AI categorization
├─ SLA management
└─ Multi-channel

Phase 5: 💡 FUTURE (Enterprise)
│
├─ Custom domains
├─ Team permissions
└─ API access
```

---

## Phase 2: Complete Support Workflow (Weeks 1-4)

**Goal:** Transform from "notification tool" to "complete support solution"

**Success Criteria:**
- 90% of replies happen from Slack (not email client)
- Zero duplicate responses to same ticket
- All tickets have clear owner and status

---

### 🔥 Feature 2.1: Reply from Slack

**Priority:** ⭐⭐⭐⭐⭐ CRITICAL - MUST HAVE  
**Effort:** 2 weeks  
**Status:** 🔨 Next to build  
**Target Completion:** Week 2

**Problem It Solves:**

**Before:**
```
1. See email in Slack ✅
2. Open email client ❌ (context switch)
3. Find the email ❌ (time waste)
4. Write reply ❌ (still in email)
5. Send ❌ (slow workflow)

Total time: 5-10 minutes per response
```

**After:**
```
1. See email in Slack ✅
2. Click "Reply" button ✅
3. Type response in Slack ✅
4. Click "Send" ✅

Total time: 30 seconds per response
10x faster! Never leave Slack!
```

**User Stories:**

**As Sarah (Support Manager):**
> "I want my team to reply from Slack so they stop wasting 10 hours/week in their email client and can respond 10x faster."

**As Jessica (Support Agent):**
> "I want to reply directly from Slack so I don't have to context-switch to my email client and can keep my flow state."

**As Mike (Founder):**
> "I want to reply instantly from Slack so I can close sales leads before competitors respond."

---

**Technical Requirements:**

**Backend - Email Storage:**

New database model to store emails:

```javascript
EmailThread {
  _id: ObjectId
  workspaceId: ObjectId
  aliasId: ObjectId
  
  // Email metadata for threading
  originalEmailId: String   // Resend email_id
  messageId: String         // Email Message-ID header
  inReplyTo: String         // For threading
  references: [String]      // For threading
  
  // Email content
  from: String              // customer@email.com
  to: String                // support@company.com
  subject: String
  textBody: String
  htmlBody: String
  
  // Workflow metadata
  direction: String         // 'inbound' | 'outbound'
  status: String            // 'open' | 'replied' | 'resolved'
  assignedTo: String        // Clerk userId (Phase 2.2)
  
  // Slack metadata
  slackMessageTs: String    // Slack message timestamp for updating
  slackChannelId: String
  
  // Timestamps
  receivedAt: Date
  firstReplyAt: Date
  resolvedAt: Date
  createdAt: Date
}
```

**Why we need this:**
- Store email content for later replies
- Track conversation threads
- Update Slack messages with status
- Enable metrics tracking

---

**Backend - Reply API:**

New endpoint: `POST /api/emails/reply`

```javascript
// Request body
{
  threadId: "507f1f77bcf86cd799439011",
  replyText: "Hi! Thanks for reaching out...",
  userId: "user_abc123"  // From Clerk session
}

// Response
{
  success: true,
  emailSent: true,
  emailId: "resend_email_id"
}
```

**Implementation:**
```javascript
// 1. Fetch original email thread
const thread = await EmailThread.findById(threadId);

// 2. Prepare reply email
const replyEmail = {
  from: thread.to,           // support@company.com
  to: thread.from,           // customer@email.com
  subject: `Re: ${thread.subject}`,
  text: replyText,
  // Headers for threading
  inReplyTo: thread.messageId,
  references: [thread.messageId, ...thread.references]
};

// 3. Send via Resend API
const { data } = await resend.emails.send(replyEmail);

// 4. Store outbound email in database
await EmailThread.create({
  workspaceId: thread.workspaceId,
  direction: 'outbound',
  from: replyEmail.from,
  to: replyEmail.to,
  subject: replyEmail.subject,
  textBody: replyText,
  inReplyTo: thread.messageId,
  references: [thread.messageId],
  status: 'replied'
});

// 5. Update original thread status
await EmailThread.findByIdAndUpdate(threadId, {
  status: 'waiting',  // Waiting on customer
  firstReplyAt: new Date()
});

// 6. Update Slack message to show "Replied"
await updateSlackMessage(thread.slackMessageTs, {
  status: 'replied',
  repliedBy: userId
});
```

---

**Slack Integration - Modal Interface:**

**Step 1: Add "Reply" button to email notification**

Update webhook route to add button:

```javascript
const messagePayload = {
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `📧 *New email to ${emailLower}*\n*From:* ${fromEmail}\n*Subject:* ${subject}\n\n${snippet}`
      }
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Reply"
          },
          action_id: "reply_button",
          value: threadId
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Claim"
          },
          action_id: "claim_button",
          value: threadId
        }
      ]
    }
  ]
};
```

**Step 2: Handle button click**

Create Slack interactivity endpoint: `/api/slack/interactions`

```javascript
// When user clicks "Reply" button
if (payload.type === 'block_actions' && 
    payload.actions[0].action_id === 'reply_button') {
  
  const threadId = payload.actions[0].value;
  
  // Open modal
  await slack.views.open({
    trigger_id: payload.trigger_id,
    view: {
      type: 'modal',
      callback_id: 'reply_modal',
      title: {
        type: 'plain_text',
        text: 'Reply to Email'
      },
      submit: {
        type: 'plain_text',
        text: 'Send Reply'
      },
      private_metadata: threadId,  // Pass threadId
      blocks: [
        {
          type: 'input',
          block_id: 'reply_text',
          label: {
            type: 'plain_text',
            text: 'Your Reply'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'reply_input',
            multiline: true,
            placeholder: {
              type: 'plain_text',
              text: 'Type your reply here...'
            }
          }
        }
      ]
    }
  });
}
```

**Step 3: Handle modal submission**

```javascript
// When user submits modal
if (payload.type === 'view_submission' && 
    payload.view.callback_id === 'reply_modal') {
  
  const threadId = payload.view.private_metadata;
  const replyText = payload.view.state.values.reply_text.reply_input.value;
  const userId = payload.user.id;
  
  // Call our reply API
  await fetch('/api/emails/reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ threadId, replyText, userId })
  });
  
  return { response_action: 'clear' };
}
```

**Step 4: Update original Slack message**

After reply is sent, update the Slack message:

```javascript
await slack.chat.update({
  channel: thread.slackChannelId,
  ts: thread.slackMessageTs,
  blocks: [
    // Original email content
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `📧 *New email to ${emailLower}*\n*From:* ${fromEmail}\n*Subject:* ${subject}\n\n${snippet}`
      }
    },
    // Status update
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `✅ *Replied* by <@${userId}> at ${new Date().toLocaleTimeString()}`
        }
      ]
    },
    // Buttons (Reply disabled)
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "View Thread" },
          action_id: "view_thread",
          value: threadId
        }
      ]
    }
  ]
});
```

---

**UI/UX Flow:**

**Before Click:**
```
┌────────────────────────────────────────────┐
│ 📧 New email to support@company.com        │
│ From: customer@email.com                   │
│ Subject: Need help with billing            │
│                                            │
│ Hi, I need help with my invoice...         │
│                                            │
│ [Reply]  [Claim]  [Mark Resolved]          │
└────────────────────────────────────────────┘
```

**User clicks "Reply" → Modal opens:**
```
┌────────────────────────────────────────────┐
│ Reply to Email                         [X] │
├────────────────────────────────────────────┤
│                                            │
│ To: customer@email.com                     │
│ Subject: Re: Need help with billing        │
│                                            │
│ Your Reply:                                │
│ ┌────────────────────────────────────────┐ │
│ │ Hi! Thanks for reaching out.           │ │
│ │                                        │ │
│ │ I can help with that invoice...       │ │
│ │                                        │ │
│ │                                        │ │
│ └────────────────────────────────────────┘ │
│                                            │
│         [Cancel]  [Send Reply]             │
└────────────────────────────────────────────┘
```

**After sending:**
```
┌────────────────────────────────────────────┐
│ 📧 New email to support@company.com        │
│ From: customer@email.com                   │
│ Subject: Need help with billing            │
│                                            │
│ Hi, I need help with my invoice...         │
│                                            │
│ ✅ Replied by @jessica at 2:34 PM          │
│                                            │
│ [View Thread]                              │
└────────────────────────────────────────────┘
```

---

**Email Threading:**

Emails sent via reply will include proper headers:

```
From: support@company.com
To: customer@email.com
Subject: Re: Need help with billing
In-Reply-To: <original-message-id@gmail.com>
References: <original-message-id@gmail.com>
```

This ensures replies appear in the same thread in the customer's email client (Gmail, Outlook, etc.).

---

**Success Metrics:**

**Adoption:**
- 90% of team members use "Reply from Slack" within 1 week
- 95% of replies sent from Slack (vs email client) by week 4

**Speed:**
- Average response time drops from 2 hours → 15 minutes
- 80% of emails replied within 30 minutes

**Efficiency:**
- Team saves 10+ hours/week (no email client usage)
- 3x more tickets handled per agent

---

**Testing Plan:**

**Unit Tests:**
- Email sending via Resend API
- Thread lookup in database
- Modal rendering
- Proper email headers

**Integration Tests:**
- End-to-end reply flow
- Slack modal interaction
- Database updates
- Email delivery confirmation

**User Acceptance Testing:**
- Beta test with 3-5 real customers
- Gather feedback on modal UX
- Measure actual response time improvement

---

**Rollout Plan:**

**Week 1:**
- Build backend API
- Database schema updates
- Resend email sending integration
- Unit tests

**Week 2:**
- Slack modal UI
- Button integration
- Update Slack messages
- Integration tests

**Week 3:**
- Beta testing with select customers
- Bug fixes
- Performance optimization

**Week 4:**
- General release to all users
- Documentation
- Success metrics tracking

---

### 🔥 Feature 2.2: Ticket Assignment (Claim)

**Priority:** ⭐⭐⭐⭐⭐ CRITICAL - MUST HAVE  
**Effort:** 1 week  
**Status:** 🔨 Next to build  
**Target Completion:** Week 3

**Problem It Solves:**

**Current Situation:**
- Email appears in Slack
- Everyone sees it
- No one knows who's handling it
- Result: Either 3 people respond (duplicate work) OR no one responds (dropped ticket)

**Solution:**
- Click "Claim" button
- Others see "👤 Claimed by @jessica"
- Everyone knows it's handled
- No duplicate work, no dropped tickets

**User Stories:**

**As Jessica (Support Agent):**
> "I want to claim tickets so my teammates know I'm handling them and don't duplicate my work."

**As Sarah (Support Manager):**
> "I want to see who claimed which tickets so I can ensure workload is distributed evenly and nothing is forgotten."

---

**Technical Requirements:**

**Database Schema Update:**

Add fields to EmailThread model:

```javascript
EmailThread {
  // ... existing fields
  
  // Assignment fields
  assignedTo: String         // Clerk userId
  assignedToName: String     // User's display name
  assignedToSlackId: String  // Slack user ID for @mentions
  claimedAt: Date           // When it was claimed
  
  // ... existing fields
}
```

**Backend API:**

New endpoints:

```javascript
// POST /api/emails/claim
{
  threadId: "507f1f77bcf86cd799439011",
  userId: "user_abc123",
  userName: "Jessica Smith",
  slackUserId: "U12345ABC"
}

// POST /api/emails/unclaim
{
  threadId: "507f1f77bcf86cd799439011"
}
```

**Implementation:**

```javascript
// Claim endpoint
export async function POST(request: Request) {
  const { threadId, userId, userName, slackUserId } = await request.json();
  
  // Update thread
  await EmailThread.findByIdAndUpdate(threadId, {
    assignedTo: userId,
    assignedToName: userName,
    assignedToSlackId: slackUserId,
    claimedAt: new Date(),
    status: 'in_progress'  // Auto-update status
  });
  
  // Update Slack message
  await updateSlackMessage(threadId, {
    claimed: true,
    claimedBy: slackUserId
  });
  
  return NextResponse.json({ success: true });
}

// Unclaim endpoint (for reassignment)
export async function POST(request: Request) {
  const { threadId } = await request.json();
  
  await EmailThread.findByIdAndUpdate(threadId, {
    assignedTo: null,
    assignedToName: null,
    assignedToSlackId: null,
    claimedAt: null,
    status: 'open'
  });
  
  await updateSlackMessage(threadId, {
    claimed: false
  });
  
  return NextResponse.json({ success: true });
}
```

---

**Slack Integration:**

**Before Claiming:**
```
┌────────────────────────────────────────────┐
│ 📧 New email to support@company.com        │
│ From: customer@email.com                   │
│ Subject: Need help with billing            │
│                                            │
│ Hi, I need help with my invoice...         │
│                                            │
│ [Reply]  [Claim]  [Mark Resolved]          │
└────────────────────────────────────────────┘
```

**After Claiming:**
```
┌────────────────────────────────────────────┐
│ 📧 New email to support@company.com        │
│ 👤 Claimed by @jessica                     │ ← New indicator
│ From: customer@email.com                   │
│ Subject: Need help with billing            │
│                                            │
│ Hi, I need help with my invoice...         │
│                                            │
│ [Reply]  [Unclaim]  [Mark Resolved]        │ ← Claim→Unclaim
└────────────────────────────────────────────┘
```

**Unclaim Use Case:**
- Jessica claimed by mistake
- Jessica is out sick, Mike needs to take over
- Need to reassign to someone else

---

**Auto-Claim on Reply:**

When someone replies to an email, auto-assign to them:

```javascript
// In reply API
if (!thread.assignedTo) {
  // Auto-assign to person who replied
  await EmailThread.findByIdAndUpdate(threadId, {
    assignedTo: userId,
    assignedToName: userName,
    claimedAt: new Date()
  });
}
```

This prevents the need to click both "Claim" and "Reply".

---

**Dashboard View:**

Add "My Tickets" view:

```
┌─────────────────────────────────────────────────┐
│ My Tickets (5)                                  │
├─────────────────────────────────────────────────┤
│ Status: [All] [Open] [In Progress] [Resolved]   │
├─────────────────────────────────────────────────┤
│ From                 Subject            Status   │
├─────────────────────────────────────────────────┤
│ customer@email.com  Billing issue      Open     │
│ john@company.com    Feature request    Progress │
│ sarah@startup.com   Login problem      Open     │
└─────────────────────────────────────────────────┘
```

Sarah (manager) can see:
- Who's handling what
- Who has too many tickets
- Who has capacity
- Unassigned tickets

---

**Success Metrics:**

**Adoption:**
- 80% of tickets get claimed within 5 minutes
- 100% of replied tickets have an assignee

**Quality:**
- Zero duplicate responses (down from 15% in Phase 1)
- Zero dropped tickets (down from 10% in Phase 1)

**Efficiency:**
- Managers spend 50% less time coordinating "who's handling what"

---

### Feature 2.3: Status Tracking

**Priority:** ⭐⭐⭐⭐ HIGH  
**Effort:** 1 week  
**Status:** 📋 Planned  
**Target Completion:** Week 4

**Problem It Solves:**

**Current:**
- No way to know if ticket is resolved
- Can't filter open vs closed
- Can't generate reports

**Solution:**
- Mark tickets: Open → In Progress → Resolved
- Filter by status
- Track completion rates

**User Stories:**

**As Sarah (Support Manager):**
> "I want to see open ticket count so I know if we're keeping up with support volume."

**As Jessica (Support Agent):**
> "I want to mark tickets resolved so they don't clutter my view and I can focus on active work."

---

**Status Workflow:**

```
New Email Arrives
      ↓
    OPEN (🆕)
      ↓
  [User Claims]
      ↓
  IN PROGRESS (🔄)
      ↓
  [User Replies]
      ↓
  WAITING ON CUSTOMER (⏸️)
      ↓
  [Customer Replies]
      ↓
  IN PROGRESS (🔄)
      ↓
  [Mark Resolved]
      ↓
   RESOLVED (✅)
```

**Status Types:**

1. **Open (🆕)** - New email, not claimed
2. **In Progress (🔄)** - Claimed, being worked on
3. **Waiting (⏸️)** - Replied, waiting on customer
4. **Resolved (✅)** - Completed, closed

---

**Database Schema:**

```javascript
EmailThread {
  // ... existing fields
  status: String  // 'open' | 'in_progress' | 'waiting' | 'resolved'
  // ... existing fields
}
```

**API:**

```javascript
// POST /api/emails/update-status
{
  threadId: "507f1f77bcf86cd799439011",
  status: "resolved"
}
```

---

**Auto-Status Updates:**

```javascript
// When email arrives
status = 'open'

// When claimed
status = 'in_progress'

// When replied
status = 'waiting'

// When customer replies
status = 'in_progress'

// When marked resolved
status = 'resolved'
```

---

**Slack UI:**

Add status buttons:

```
┌────────────────────────────────────────────┐
│ 📧 New email to support@company.com        │
│ 🔄 Status: In Progress                     │ ← Status indicator
│ 👤 Claimed by @jessica                     │
│                                            │
│ From: customer@email.com                   │
│ Subject: Need help with billing            │
│                                            │
│ [Reply]  [Unclaim]  [Mark Resolved]        │ ← Status button
└────────────────────────────────────────────┘
```

---

**Dashboard Filters:**

```
┌─────────────────────────────────────────────────┐
│ All Tickets (47)                                │
├─────────────────────────────────────────────────┤
│ Status: [Open: 12] [Progress: 8] [Waiting: 15]  │
│         [Resolved: 12]                           │
├─────────────────────────────────────────────────┤
│ Assigned: [All] [Me] [Unassigned] [By Person]   │
├─────────────────────────────────────────────────┤
│ From                 Subject            Status   │
├─────────────────────────────────────────────────┤
│ customer@email.com  Billing issue      Open     │
│ john@company.com    Feature request    Progress │
│ sarah@startup.com   Login problem      Waiting  │
└─────────────────────────────────────────────────┘
```

---

**Success Metrics:**

- 95% of resolved tickets marked as resolved
- Open ticket count visible to managers 24/7
- Average resolution time trackable

---

## Phase 3: Team Collaboration & Efficiency (Weeks 5-8)

**Goal:** Make team more efficient with history, metrics, and templates

---

### Feature 3.1: Email Threading & Conversation History

**Priority:** ⭐⭐⭐⭐ HIGH  
**Effort:** 2 weeks  
**Status:** 📋 Planned

**Problem:**
- Each email is isolated
- No context of previous conversation with customer
- Support agents ask questions customer already answered

**Solution:**
- Group emails by conversation
- Show full history with customer
- Context for better responses

**User Story:**
> "As a support agent, I want to see previous emails from this customer so I have full context and don't ask redundant questions."

---

**Technical Implementation:**

**New Database Model:**

```javascript
EmailConversation {
  _id: ObjectId
  workspaceId: ObjectId
  customerEmail: String     // customer@email.com
  subject: String           // Original subject
  threadIds: [ObjectId]     // All emails in conversation
  status: String            // Current status
  assignedTo: String
  firstEmailAt: Date
  lastActivityAt: Date
  emailCount: Number
  createdAt: Date
}
```

**Threading Logic:**

```javascript
// When email arrives, find existing conversation
const conversation = await EmailConversation.findOne({
  workspaceId: workspace._id,
  customerEmail: emailFrom,
  // Match by subject similarity or message-id
  $or: [
    { subject: subjectWithoutRe },
    { threadIds: { $in: findRelatedByMessageId } }
  ]
});

if (conversation) {
  // Add to existing conversation
  conversation.threadIds.push(newThreadId);
  conversation.lastActivityAt = new Date();
  conversation.emailCount++;
  await conversation.save();
} else {
  // Create new conversation
  await EmailConversation.create({
    workspaceId: workspace._id,
    customerEmail: emailFrom,
    subject: subject,
    threadIds: [newThreadId],
    emailCount: 1
  });
}
```

---

**Slack UI:**

Add "Previous Emails" link:

```
┌────────────────────────────────────────────┐
│ 📧 New email to support@company.com        │
│ 🔄 Status: In Progress                     │
│ 👤 Claimed by @jessica                     │
│ 📖 Previous emails: 3                      │ ← New link
│                                            │
│ From: customer@email.com                   │
│ Subject: Re: Billing issue                 │
│                                            │
│ [Reply]  [View History]  [Mark Resolved]   │
└────────────────────────────────────────────┘
```

Click "View History" → Opens modal:

```
┌────────────────────────────────────────────┐
│ Conversation with customer@email.com   [X] │
├────────────────────────────────────────────┤
│ 📧 Feb 14, 2:30 PM (Customer)              │
│ Subject: Billing issue                     │
│ I was charged twice for February...        │
├────────────────────────────────────────────┤
│ 📤 Feb 14, 2:45 PM (You)                   │
│ Subject: Re: Billing issue                 │
│ Thanks for reaching out...                 │
├────────────────────────────────────────────┤
│ 📧 Feb 14, 3:10 PM (Customer)              │
│ Subject: Re: Billing issue                 │
│ Thanks! Can you also...                    │
└────────────────────────────────────────────┘
```

---

**Success Metrics:**
- Support agents have context for 100% of follow-up emails
- 30% reduction in back-and-forth (fewer clarifying questions)

---

### Feature 3.2: Response Time Tracking & Metrics

**Priority:** ⭐⭐⭐ MEDIUM  
**Effort:** 1 week  
**Status:** 📋 Planned

**Problem:**
- No visibility into team performance
- Can't measure improvement
- Don't know if meeting SLAs

**Solution:**
- Track first response time
- Track resolution time
- Dashboard with metrics

**Metrics to Track:**

**Per Ticket:**
- Time to first response
- Time to resolution
- Number of exchanges
- Customer satisfaction (future)

**Team Aggregate:**
- Average first response time (7-day, 30-day)
- Average resolution time
- Tickets per agent
- Open ticket count over time

---

**Dashboard Mockup:**

```
┌─────────────────────────────────────────────────┐
│ Support Performance Dashboard                   │
├─────────────────────────────────────────────────┤
│ Today's Stats:                                  │
│                                                 │
│ New Tickets: 23        Resolved: 18             │
│ Open: 12               Avg Response: 14 min     │
│                                                 │
├─────────────────────────────────────────────────┤
│ 7-Day Trends:                                   │
│                                                 │
│ [Line graph showing response time]              │
│ Target: 30 min  ━━━━━━━                         │
│ Actual: 14 min  ━━━━━━━━━━━                    │
│                                                 │
├─────────────────────────────────────────────────┤
│ Team Leaderboard (7 days):                      │
│                                                 │
│ 1. Jessica    24 resolved   Avg: 12 min        │
│ 2. Mike       18 resolved   Avg: 15 min        │
│ 3. Sarah      15 resolved   Avg: 18 min        │
└─────────────────────────────────────────────────┘
```

---

**Success Metrics:**
- Teams reduce average response time by 50%
- Managers have daily visibility into performance

---

### Feature 3.3: Canned Responses / Templates

**Priority:** ⭐⭐⭐ MEDIUM  
**Effort:** 1 week  
**Status:** 📋 Planned

**Problem:**
- Typing same responses repeatedly
- Inconsistent answers to common questions
- Slow response times for FAQs

**Solution:**
- Pre-written response templates
- Quick insert in reply modal
- Customizable per team

**Example Templates:**

```
Template: "Billing - Invoice Request"
Category: Billing
---
Hi {customer_name},

Thanks for reaching out! I'd be happy to help with your invoice.

Could you please provide:
- Your account email
- Invoice date or number

I'll send you the invoice right away.

Best,
{agent_name}
```

**Template Variables:**
- `{customer_name}` - Auto-extracted from email
- `{agent_name}` - Current user's name
- `{company_name}` - From workspace settings
- `{support_email}` - Alias email address

---

**UI Integration:**

In reply modal, add template dropdown:

```
┌────────────────────────────────────────────┐
│ Reply to Email                         [X] │
├────────────────────────────────────────────┤
│                                            │
│ Template: [Select template ▼]              │ ← New dropdown
│                                            │
│ Your Reply:                                │
│ ┌────────────────────────────────────────┐ │
│ │ Hi John,                               │ │
│ │                                        │ │
│ │ Thanks for reaching out...             │ │
│ └────────────────────────────────────────┘ │
│                                            │
│         [Cancel]  [Send Reply]             │
└────────────────────────────────────────────┘
```

---

**Dashboard Template Management:**

```
┌─────────────────────────────────────────────────┐
│ Response Templates                              │
├─────────────────────────────────────────────────┤
│ [+ New Template]                                │
├─────────────────────────────────────────────────┤
│ Category: [All] [Billing] [Technical] [Sales]   │
├─────────────────────────────────────────────────┤
│ Name                    Category    Used        │
├─────────────────────────────────────────────────┤
│ Invoice Request         Billing     47 times    │
│ Password Reset          Technical   23 times    │
│ Feature Request Thanks  Sales       12 times    │
└─────────────────────────────────────────────────┘
```

---

**Success Metrics:**
- 40% of responses use templates
- 50% faster response time for FAQ questions
- More consistent customer experience

---

## Phase 4: Advanced Features (Weeks 9-16)

**Goal:** Add competitive differentiation and premium features

---

### Feature 4.1: Customer Context & CRM Integration

**Priority:** ⭐⭐⭐ MEDIUM  
**Effort:** 2 weeks  
**Status:** 💡 Future

**Problem:**
- No context about who the customer is
- VIP customers treated same as free users
- Can't prioritize important tickets

**Solution:**
- Stripe integration showing subscription info
- Customer history (total tickets, frequency)
- VIP badges and priority handling

**Integrations:**

**1. Stripe:**
```
┌────────────────────────────────────────────┐
│ 📧 New email to support@company.com        │
│ 💎 Premium Customer ($99/mo)               │ ← Stripe data
│ 📊 Active subscription since Jan 2025      │
│                                            │
│ From: customer@email.com                   │
│ Subject: Need help                         │
└────────────────────────────────────────────┘
```

**2. Customer Metadata:**
```
┌────────────────────────────────────────────┐
│ 📧 New email to support@company.com        │
│ 🔁 3rd ticket this week (⚠️ High Frequency)│ ← Warning
│ 📅 First contact: 6 months ago             │
│ ✅ 12 total tickets, all resolved          │
└────────────────────────────────────────────┘
```

---

**Success Metrics:**
- VIP customers get 2x faster response
- Support team has context for 100% of tickets

---

### Feature 4.2: AI Auto-Categorization & Sentiment

**Priority:** ⭐⭐ LOW  
**Effort:** 2 weeks  
**Status:** 💡 Future

**Problem:**
- Manual categorization is slow
- Can't detect angry customers automatically
- No automatic prioritization

**Solution:**
- AI categorizes emails (Bug/Feature/Question/Billing)
- AI detects sentiment (Positive/Neutral/Negative/Angry)
- AI assigns priority based on multiple factors

**Example:**

```
┌────────────────────────────────────────────┐
│ 📧 New email to support@company.com        │
│ 🏷️ Category: Billing (AI)                  │ ← Auto-categorized
│ 😡 Sentiment: Angry (AI)                   │ ← Auto-detected
│ 🔥 Priority: URGENT                        │ ← Auto-prioritized
│                                            │
│ From: customer@email.com                   │
│ Subject: TERRIBLE SERVICE!!!               │
│                                            │
│ Your billing is completely broken...       │
└────────────────────────────────────────────┘
```

---

**AI Priority Factors:**
1. Customer value (from Stripe)
2. Sentiment (angry = high priority)
3. Ticket age (older = higher priority)
4. Category (billing > question)
5. Keywords ("urgent", "broken", "can't login")

---

**Success Metrics:**
- 90% categorization accuracy
- Angry customers get 3x faster response
- 80% reduction in triage time

---

### Feature 4.3: SLA Management & Alerts

**Priority:** ⭐⭐ LOW  
**Effort:** 1 week  
**Status:** 💡 Future

**Problem:**
- No enforcement of response time goals
- Tickets slip through without alerts
- Can't report on SLA compliance

**Solution:**
- Set SLAs by priority level
- Slack alerts when approaching breach
- Dashboard showing compliance %

**SLA Configuration:**

```
Priority    First Response    Resolution
────────    ──────────────    ──────────
Urgent      30 minutes        4 hours
High        2 hours           24 hours
Medium      8 hours           3 days
Low         24 hours          7 days
```

**Alert Examples:**

```
⚠️ SLA Warning
Urgent ticket needs response in 10 minutes
From: vip@customer.com
Subject: Can't access account
[View Ticket]
```

```
🚨 SLA BREACH
High priority ticket overdue by 1 hour
From: customer@email.com
Subject: Payment failed
[View Ticket]
```

---

**Dashboard:**

```
┌─────────────────────────────────────────────────┐
│ SLA Compliance (30 days)                        │
├─────────────────────────────────────────────────┤
│                                                 │
│ Overall: 94.2%  ████████████████░░  (Target 95%)│
│                                                 │
│ By Priority:                                    │
│ Urgent:  98%  ███████████████████░              │
│ High:    96%  ██████████████████░░              │
│ Medium:  92%  █████████████████░░░              │
│ Low:     90%  ████████████████░░░░              │
│                                                 │
│ Breaches this month: 3                          │
│ └─ 2 High priority                              │
│ └─ 1 Medium priority                            │
└─────────────────────────────────────────────────┘
```

---

**Success Metrics:**
- 95% SLA compliance
- Zero urgent ticket breaches
- Manager has real-time visibility

---

### Feature 4.4: Multi-Channel Support

**Priority:** ⭐⭐ LOW  
**Effort:** 2 weeks per channel  
**Status:** 💡 Future

**Problem:**
- Customers contact via email, live chat, forms
- Separate tools for each channel
- No unified view

**Solution:**
- Add live chat widget for websites
- Contact form integration
- All channels → same Slack workflow

**Additional Channels:**

**1. Live Chat Widget:**
```javascript
<script src="https://yourapp.com/widget.js"></script>
<script>
  SupportWidget.init({
    apiKey: 'your_api_key',
    slackChannel: '#support'
  });
</script>
```

Customer chats on website → appears in Slack like email

**2. Contact Forms:**
- Create custom contact forms
- Embed on website
- Submissions → Slack notifications
- Reply from Slack

**3. Microsoft Teams:**
- Same functionality as Slack
- For companies using Teams
- Parallel implementation

---

## Phase 5: Enterprise Features (6+ months)

**Goal:** Support larger companies and advanced use cases

---

### Feature 5.1: Custom Domains via Resend API

**Priority:** ⭐⭐⭐ MEDIUM  
**Effort:** 2 weeks  
**Status:** 💡 Future

**Current Limitation:**
- Must use `@galearen.resend.app` test domain
- Can't receive at `support@customerdomain.com`

**Solution:**
- Use Resend API to add custom domains
- Automatic DNS verification
- MX record management
- SSL certificates

**User Flow:**
1. User adds `customerdomain.com` in dashboard
2. System calls Resend API to add domain
3. Shows DNS records to add
4. Auto-verifies when DNS propagates
5. User can receive at `support@customerdomain.com`

---

### Feature 5.2: Team Roles & Permissions

**Priority:** ⭐⭐ LOW  
**Effort:** 2 weeks  
**Status:** 💡 Future

**Roles:**
- **Admin:** Full access, billing, settings
- **Manager:** View all tickets, analytics, manage team
- **Agent:** Handle tickets only
- **Viewer:** Read-only access to tickets

**Permissions:**
- Create/edit templates
- View analytics
- Manage integrations
- Invite users
- Delete tickets

---

### Feature 5.3: API & Webhooks for Developers

**Priority:** ⭐⭐ LOW  
**Effort:** 2 weeks  
**Status:** 💡 Future

**Public API:**
```
GET  /api/v1/tickets          - List tickets
POST /api/v1/tickets          - Create ticket
GET  /api/v1/tickets/:id      - Get ticket
POST /api/v1/tickets/:id/reply - Reply to ticket
PUT  /api/v1/tickets/:id      - Update status
GET  /api/v1/analytics        - Get metrics
```

**Webhooks:**
- `ticket.created` - New ticket
- `ticket.replied` - Reply sent
- `ticket.resolved` - Ticket resolved
- `ticket.assigned` - Ticket claimed

**Use Cases:**
- Sync with existing CRM
- Custom dashboards
- Zapier/Make integration
- Automated workflows

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────┐
│              User Browser                   │
│         (Dashboard Interface)               │
└─────────────────────────────────────────────┘
                    │
                    │ HTTPS
                    ▼
┌─────────────────────────────────────────────┐
│           Next.js Frontend                  │
│         (Vercel Edge Network)               │
│                                             │
│  - Dashboard Pages                          │
│  - Authentication (Clerk)                   │
│  - API Routes                               │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
┌─────────────┐ ┌────────┐ ┌──────────┐
│  MongoDB    │ │ Clerk  │ │  Resend  │
│   Atlas     │ │  Auth  │ │  Email   │
│             │ │        │ │          │
│ - Users     │ │ - Auth │ │ - Receive│
│ - Domains   │ │ - SSO  │ │ - Send   │
│ - Aliases   │ │        │ │          │
│ - Threads   │ │        │ │          │
└─────────────┘ └────────┘ └──────────┘
                               │
                               │ Webhook
                               ▼
                    ┌──────────────────┐
                    │   Slack/Discord  │
                    │   Notifications  │
                    └──────────────────┘
```

---

### Email Flow Architecture

**Inbound Email Flow:**

```
1. Customer sends email
   customer@email.com → support@galearen.resend.app
          │
          ▼
2. Resend receives email
   MX records point to Resend
          │
          ▼
3. Resend triggers webhook
   POST /api/webhooks/resend
   { type: "email.received", data: { email_id, from, to, subject } }
          │
          ▼
4. Our webhook handler
   - Fetch email content via Resend API
   - Parse recipient (support@galearen.resend.app)
          │
          ▼
5. Database lookup
   - Find alias by email
   - Get linked integration
          │
          ▼
6. Store email
   - Create EmailThread document
   - Save content, metadata
          │
          ▼
7. Format & post to Slack
   - Create rich message with buttons
   - POST to Slack webhook
          │
          ▼
8. Team sees notification (2-5 sec total)
```

---

**Outbound Email Flow (Phase 2):**

```
1. User clicks "Reply" in Slack
          │
          ▼
2. Slack opens modal
   - Reply text input
   - Submit button
          │
          ▼
3. User types & submits
          │
          ▼
4. Slack interaction webhook
   POST /api/slack/interactions
          │
          ▼
5. Our API processes
   - Extract reply text
   - Fetch original EmailThread
          │
          ▼
6. Send via Resend
   resend.emails.send({
     from: support@company.com,
     to: customer@email.com,
     subject: "Re: ...",
     text: replyText,
     inReplyTo: originalMessageId  // Threading
   })
          │
          ▼
7. Store outbound email
   - Create new EmailThread (outbound)
   - Update original thread status
          │
          ▼
8. Update Slack message
   - Show "Replied by @user"
   - Update buttons
          │
          ▼
9. Customer receives reply email
```

---

### Database Schema (Complete)

**Current Models (Phase 1):**

```javascript
// User workspace
Workspace {
  _id: ObjectId
  ownerUserId: String       // Clerk user ID
  name: String
  plan: String              // 'free' | 'pro' | 'team'
  createdAt: Date
  updatedAt: Date
}

// Email domains
Domain {
  _id: ObjectId
  workspaceId: ObjectId
  domain: String            // e.g., 'galearen.resend.app'
  status: String            // 'pending_verification' | 'active'
  verificationToken: String // For DNS verification
  createdAt: Date
  updatedAt: Date
}

// Slack/Discord integrations
Integration {
  _id: ObjectId
  workspaceId: ObjectId
  type: String              // 'slack' | 'discord'
  name: String              // User-friendly name
  webhookUrl: String        // Webhook endpoint
  slackTeamId: String       // For Slack app integration (future)
  createdAt: Date
  updatedAt: Date
}

// Email routing rules
Alias {
  _id: ObjectId
  workspaceId: ObjectId
  domainId: ObjectId        // References Domain
  localPart: String         // e.g., 'support'
  email: String             // Full: 'support@domain.com'
  status: String            // 'active' | 'inactive'
  integrationId: ObjectId   // References Integration
  createdAt: Date
  updatedAt: Date
}
```

---

**New Models (Phase 2+):**

```javascript
// Individual email messages
EmailThread {
  _id: ObjectId
  workspaceId: ObjectId
  aliasId: ObjectId         // Which alias received this
  conversationId: ObjectId  // Link related emails (Phase 3)
  
  // Email metadata
  originalEmailId: String   // Resend email_id
  messageId: String         // Email Message-ID header
  inReplyTo: String         // For threading
  references: [String]      // Full email thread reference
  
  // Content
  from: String              // customer@email.com
  fromName: String          // Customer Name
  to: String                // support@company.com
  subject: String
  textBody: String          // Plain text version
  htmlBody: String          // HTML version
  attachments: [{           // Phase 3
    filename: String,
    contentType: String,
    size: Number,
    url: String
  }]
  
  // Workflow
  direction: String         // 'inbound' | 'outbound'
  status: String            // 'open' | 'in_progress' | 'waiting' | 'resolved'
  priority: String          // 'low' | 'medium' | 'high' | 'urgent' (Phase 4)
  category: String          // 'bug' | 'feature' | 'question' | 'billing' (Phase 4)
  sentiment: String         // 'positive' | 'neutral' | 'negative' | 'angry' (Phase 4)
  
  // Assignment
  assignedTo: String        // Clerk userId
  assignedToName: String    // Display name
  assignedToSlackId: String // For @mentions
  claimedAt: Date
  
  // Slack
  slackMessageTs: String    // Slack message timestamp for updates
  slackChannelId: String    // Which channel it was posted to
  slackThreadTs: String     // For threaded replies (Phase 3)
  
  // Metrics
  receivedAt: Date          // When email arrived
  firstViewedAt: Date       // When first viewed in Slack
  firstReplyAt: Date        // When first reply sent
  resolvedAt: Date          // When marked resolved
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}

// Email conversations (Phase 3)
EmailConversation {
  _id: ObjectId
  workspaceId: ObjectId
  customerEmail: String     // customer@email.com
  customerName: String      // Extracted from emails
  subject: String           // Original subject
  threadIds: [ObjectId]     // All EmailThreads in conversation
  
  // Status
  status: String            // Current conversation status
  assignedTo: String
  priority: String
  
  // Metadata
  firstEmailAt: Date
  lastActivityAt: Date
  lastCustomerReplyAt: Date
  emailCount: Number
  inboundCount: Number
  outboundCount: Number
  
  // Metrics
  firstResponseTime: Number // Seconds to first reply
  avgResponseTime: Number   // Average response time
  resolutionTime: Number    // Seconds to resolve
  
  // CRM data (Phase 4)
  customerId: String        // Stripe customer ID
  customerValue: Number     // MRR or LTV
  customerPlan: String      // Subscription plan
  
  createdAt: Date
  updatedAt: Date
}

// Response templates (Phase 3)
ResponseTemplate {
  _id: ObjectId
  workspaceId: ObjectId
  name: String              // "Billing - Invoice Request"
  category: String          // "Billing", "Technical", etc.
  subject: String           // Email subject template
  body: String              // Email body template
  variables: [String]       // ['customer_name', 'agent_name']
  
  // Usage tracking
  usageCount: Number
  lastUsedAt: Date
  createdBy: String         // User who created it
  
  createdAt: Date
  updatedAt: Date
}

// Team analytics (Phase 3)
TeamMetrics {
  _id: ObjectId
  workspaceId: ObjectId
  date: Date                // Daily metrics
  
  // Volume
  newTickets: Number
  resolvedTickets: Number
  openTickets: Number
  
  // Performance
  avgFirstResponseTime: Number    // Seconds
  avgResolutionTime: Number       // Seconds
  slaCompliance: Number           // Percentage
  
  // Per-agent breakdown
  agentMetrics: [{
    userId: String,
    ticketsHandled: Number,
    avgResponseTime: Number,
    ticketsResolved: Number
  }]
  
  createdAt: Date
}
```

---

### API Routes (Complete List)

**Authentication:**
- Handled by Clerk middleware

**Workspaces:**
- `GET  /api/workspace` - Get current workspace ✅
- `POST /api/workspace` - Create workspace (auto on signup) ✅

**Domains:**
- `GET    /api/domains` - List domains ✅
- `POST   /api/domains` - Add domain ✅
- `DELETE /api/domains/:id` - Delete domain 📋
- `POST   /api/domains/:id/verify` - Verify DNS 📋

**Integrations:**
- `GET    /api/integrations` - List integrations ✅
- `POST   /api/integrations` - Add integration ✅
- `PUT    /api/integrations/:id` - Update 📋
- `DELETE /api/integrations/:id` - Delete 📋
- `POST   /api/integrations/:id/test` - Test webhook 📋

**Aliases:**
- `GET    /api/aliases` - List aliases ✅
- `POST   /api/aliases` - Create alias ✅
- `PUT    /api/aliases/:id` - Update 📋
- `DELETE /api/aliases/:id` - Delete 📋

**Webhooks:**
- `POST /api/webhooks/resend` - Resend email webhook ✅

**Emails (Phase 2):**
- `GET  /api/emails` - List all email threads 🔨
- `GET  /api/emails/:id` - Get single thread 🔨
- `POST /api/emails/reply` - Send reply 🔨
- `POST /api/emails/claim` - Assign to user 🔨
- `POST /api/emails/unclaim` - Unassign 🔨
- `POST /api/emails/:id/status` - Update status 🔨

**Conversations (Phase 3):**
- `GET /api/conversations` - List conversations 📋
- `GET /api/conversations/:id` - Get conversation with threads 📋

**Templates (Phase 3):**
- `GET    /api/templates` - List templates 📋
- `POST   /api/templates` - Create template 📋
- `PUT    /api/templates/:id` - Update 📋
- `DELETE /api/templates/:id` - Delete 📋

**Analytics (Phase 3):**
- `GET /api/analytics/overview` - Dashboard stats 📋
- `GET /api/analytics/team` - Team performance 📋
- `GET /api/analytics/agent/:id` - Agent performance 📋

**Slack Interactivity (Phase 2):**
- `POST /api/slack/interactions` - Handle button clicks, modals 🔨
- `POST /api/slack/events` - Handle Slack events 📋

**Legend:**
- ✅ Complete (Phase 1)
- 🔨 In Progress (Phase 2)
- 📋 Planned (Phase 3+)
- 💡 Future

---

### Security & Performance

**Authentication:**
- Clerk handles all auth
- JWT tokens
- Session management
- Protected API routes

**Authorization:**
- Workspace-level isolation
- All queries filtered by `workspaceId`
- No cross-workspace data access

**Data Security:**
- MongoDB Atlas encryption at rest
- TLS in transit
- Webhook URLs encrypted in database
- No sensitive data in logs

**Performance:**
- Vercel Edge Network (CDN)
- MongoDB Atlas indexes on:
  - `workspaceId`
  - `email` (for alias lookup)
  - `createdAt` (for sorting)
- Database connection pooling
- Lean queries (no unnecessary data)

**Scalability:**
- Serverless architecture
- Horizontal scaling via Vercel
- MongoDB sharding (when needed)
- Webhook queue (future for high volume)

---

## Success Metrics

### Product Metrics

**Activation (How fast can users get value):**
- Time to first domain added: <2 minutes
- Time to first integration connected: <3 minutes
- Time to first alias created: <5 minutes
- Time to first email notification: <10 minutes

**Engagement (Are users using it daily):**
- Daily active users (DAU)
- Emails routed per day
- Replies sent from Slack (Phase 2)
- % of replies from Slack vs email client

**Retention (Do users stick around):**
- Week 1 → Week 2 retention: >80%
- Month 1 → Month 2 retention: >70%
- Month 1 → Month 6 retention: >50%
- Churn rate: <5% monthly

**Performance (Is it reliable):**
- Email delivery time: <5 seconds (p95)
- API response time: <500ms (p95)
- Uptime: >99.9%
- Error rate: <0.1%

---

### Customer Outcome Metrics

**Speed (Are customers responding faster):**
- Average first response time: <15 minutes (vs 2+ hours before)
- % of tickets replied within 30 min: >80%
- % of tickets replied within 1 hour: >90%
- % of tickets replied within 4 hours: >99%

**Efficiency (Are teams more productive):**
- Time saved per agent: 10+ hours/week
- Tickets handled per agent: +50% capacity
- Context switching: -90% (no email client)
- Duplicate responses: 0% (vs 15% before)

**Quality (Are customers happier):**
- Customer satisfaction (CSAT): >4.5/5
- Response completeness: >95% (no missing details)
- Tickets requiring follow-up: <20%

**Adoption (Is team using it):**
- % of team using Slack replies: >90%
- % of tickets claimed: >80%
- % of tickets with status: >95%

---

### Business Metrics (Future)

**Revenue:**
- Monthly Recurring Revenue (MRR)
- Average Revenue Per User (ARPU)
- Customer Lifetime Value (LTV)

**Growth:**
- New signups per week
- Activation rate (signup → first email)
- Conversion rate (free → paid)

**Efficiency:**
- Customer Acquisition Cost (CAC)
- LTV:CAC ratio (target >3:1)
- Gross margin (target >80%)

---

## Timeline & Milestones

### Overall Timeline

```
Phase 1: ✅ COMPLETE
Week 0-4: Foundation & MVP
└─ Feb 14, 2026: ✅ LAUNCHED

Phase 2: 🔨 IN PROGRESS
Week 5-8: Complete Support Workflow
├─ Week 5-6: Reply from Slack
├─ Week 7: Ticket assignment
└─ Week 8: Status tracking

Phase 3: 📋 PLANNED
Week 9-12: Team Collaboration
├─ Week 9-10: Email threading
├─ Week 11: Metrics dashboard
└─ Week 12: Canned responses

Phase 4: 💡 FUTURE
Week 13-20: Advanced Features
├─ Week 13-14: CRM integration
├─ Week 15-16: AI features
├─ Week 17: SLA management
└─ Week 18-20: Multi-channel

Phase 5: 💡 FUTURE
6+ months: Enterprise Features
└─ Custom domains, API, etc.
```

---

### Phase 2 Detailed Timeline

**Week 5-6: Reply from Slack**

**Week 5:**
- Day 1-2: Database schema updates
- Day 3-4: Backend reply API
- Day 5: Resend email sending integration

**Week 6:**
- Day 1-2: Slack modal UI
- Day 3-4: Button integration & message updates
- Day 5: Testing & bug fixes

---

**Week 7: Ticket Assignment**

- Day 1-2: Database schema & API
- Day 3-4: Slack UI & auto-claim logic
- Day 5: Dashboard view & testing

---

**Week 8: Status Tracking**

- Day 1-2: Status system implementation
- Day 3-4: Slack status buttons & filters
- Day 5: Dashboard integration & testing

---

### Key Milestones

**✅ Milestone 1: MVP Launch (Feb 14, 2026)**
- Basic email → Slack routing
- Dashboard CRUD for domains, integrations, aliases
- Deployed to production

**🎯 Milestone 2: Reply from Slack (Week 6)**
- Users can reply without leaving Slack
- 90% of replies from Slack
- 10x faster response times

**🎯 Milestone 3: Complete Workflow (Week 8)**
- Assignment, status, reply all working
- Zero duplicate responses
- Full team coordination

**🎯 Milestone 4: Team Efficiency (Week 12)**
- Metrics dashboard live
- Templates in use
- Conversation threading working

**🎯 Milestone 5: Enterprise Ready (Week 20)**
- CRM integration
- AI categorization
- SLA management
- Multi-channel support

---

## Open Questions & Decisions Needed

### Product Questions

**1. Slack vs Discord priority?**
- **Question:** Should we focus on Slack-only first for Phase 2 features?
- **Context:** Discord is supported but has <10% market share vs Slack
- **Recommendation:** Build Phase 2 for Slack first, add Discord parity in Phase 3
- **Decision:** TBD

**2. Microsoft Teams support timeline?**
- **Question:** When to add Teams integration?
- **Context:** Large enterprise market, but different API than Slack
- **Recommendation:** Phase 4 (after Slack/Discord are solid)
- **Decision:** TBD

**3. Free tier email limits?**
- **Question:** How many emails/month on free tier?
- **Options:**
  - 50 emails/month (very limited, forces upgrade)
  - 100 emails/month (moderate, allows testing)
  - 500 emails/month (generous, may not upgrade)
- **Recommendation:** Discuss during pricing design
- **Decision:** TBD

**4. Attachment handling priority?**
- **Question:** When to add attachment support?
- **Context:** Not critical for notifications, but needed for some use cases
- **Recommendation:** Phase 3
- **Decision:** TBD

---

### Technical Questions

**1. Slack App vs Webhooks?**
- **Current:** Using incoming webhooks (simple, works)
- **Alternative:** Build Slack app (more features, better UX)
- **Tradeoff:** Webhooks are simple but limited; app requires OAuth flow
- **Recommendation:** Keep webhooks for Phase 2, evaluate app in Phase 3
- **Decision:** TBD

**2. Email storage duration?**
- **Question:** How long to keep email content in database?
- **Options:**
  - 30 days (minimize storage costs)
  - 90 days (reasonable for most users)
  - 1 year (for compliance)
  - Forever (best UX, highest cost)
- **Recommendation:** 90 days free, unlimited paid
- **Decision:** TBD

**3. Rate limiting strategy?**
- **Question:** How to prevent abuse?
- **Context:** No rate limits currently
- **Options:**
  - Per-workspace email limits
  - Per-IP webhook limits
  - Cloudflare rate limiting
- **Recommendation:** Phase 2 - workspace limits based on plan
- **Decision:** TBD

**4. Webhook retry logic?**
- **Question:** What happens if Slack webhook fails?
- **Options:**
  - No retry (simple, may lose notifications)
  - 3 retries with exponential backoff (standard)
  - Queue with DLQ (most robust, complex)
- **Recommendation:** Phase 2 - exponential backoff
- **Decision:** TBD

---

### Business/Strategy Questions

**1. Self-serve vs sales-assisted?**
- **Question:** Pure self-serve or add sales team?
- **Context:** Enterprise customers may want demos
- **Recommendation:** Start self-serve, add sales at $50K MRR
- **Decision:** TBD

**2. Freemium vs free trial?**
- **Question:** Free tier forever or 14-day trial?
- **Options:**
  - Freemium: Free tier with limits (Slack model)
  - Free trial: 14 days full access, then pay (Front model)
- **Recommendation:** Discuss during pricing
- **Decision:** TBD

**3. Agency/reseller program?**
- **Question:** Allow agencies to white-label or resell?
- **Context:** Could accelerate growth but complex
- **Recommendation:** Phase 5 (after PMF)
- **Decision:** TBD

---

## Next Steps

### Immediate Actions (This Week)

1. ✅ **Celebrate Phase 1 completion!**
   - MVP is live and working
   - Real customers can use it today

2. 📝 **Review this PRD**
   - Get feedback from team
   - Finalize Phase 2 priorities
   - Make any needed adjustments

3. 🎨 **Design Phase 2 UI**
   - Slack modal mockups
   - Button designs
   - Message update formats

4. 💬 **Customer feedback**
   - Get 3-5 beta users
   - Watch how they use Phase 1
   - Identify pain points

---

### Short Term (Next 2 Weeks)

1. 🔨 **Start Phase 2.1: Reply from Slack**
   - Write technical specs
   - Set up Slack app (if needed)
   - Begin backend development

2. 📊 **Add error tracking**
   - Set up Sentry
   - Monitor production errors
   - Track API performance

3. 📚 **Documentation**
   - API documentation
   - Setup guides
   - Troubleshooting docs

4. 🧪 **Testing infrastructure**
   - Unit test framework
   - Integration test suite
   - E2E testing with real Slack

---

### Medium Term (Next Month)

1. ✅ **Complete Phase 2**
   - Reply, claim, status all working
   - 90% of replies from Slack
   - Zero duplicate responses

2. 📈 **Track key metrics**
   - Dashboard for internal metrics
   - Response time tracking
   - User engagement analytics

3. 🎯 **Marketing prep**
   - Landing page updates
   - Demo video
   - Case study (if possible)

4. 💰 **Pricing discussion**
   - Research competitors
   - Design pricing tiers
   - Implement billing (future)

---

### Long Term (Next 3-6 Months)

1. 🚀 **Complete Phase 3 & 4**
   - Email threading
   - Metrics dashboard
   - CRM integration
   - AI features

2. 📊 **Product-Market Fit**
   - Achieve high retention
   - Strong word-of-mouth
   - Clear ICP validation

3. 💵 **Revenue Growth**
   - Launch paid tiers
   - Hit $10K MRR
   - Scale to $50K MRR

4. 👥 **Team Growth**
   - Hire customer success
   - Hire additional engineer
   - Consider designer

---

## Appendix

### Competitor Analysis

**Front ($19/user/month):**
- ✅ Reply from Slack/Teams
- ✅ Assignment & status
- ✅ Metrics dashboard
- ✅ Team collaboration
- ❌ Expensive per-user pricing
- ❌ Complex setup
- ❌ Steep learning curve

**Help Scout ($20/user/month):**
- ✅ Email management
- ✅ Metrics & reporting
- ✅ Customer profiles
- ✅ Knowledge base
- ❌ Not Slack-native
- ❌ Separate tool to learn
- ❌ Per-user pricing

**Zendesk ($55/user/month):**
- ✅ Full help desk platform
- ✅ Enterprise features
- ✅ Multi-channel
- ✅ Advanced automation
- ❌ Very expensive
- ❌ Overkill for small teams
- ❌ Complex implementation

**Our Advantage:**
- ✅ Slack-native (no new tool)
- ✅ Flat pricing (not per-user)
- ✅ 5-minute setup
- ✅ Simple, focused on email→Slack
- ✅ Much more affordable

---

### Key Differentiators

**1. Simplicity:**
- Not trying to be a full help desk
- Just email routing to Slack
- 95% less complexity than competitors

**2. Pricing:**
- Flat rate, not per-user
- 3-10x cheaper than alternatives
- Predictable costs

**3. Time to Value:**
- 5 minutes to first notification
- No training needed (it's just Slack)
- Immediate ROI

**4. Slack-First:**
- Built for Slack from day 1
- Not a Slack "integration"
- Works like native Slack feature

---

### Target Market Size

**Total Addressable Market (TAM):**
- Companies with support email: ~5M worldwide
- Using Slack: ~2M companies
- 5-50 employees: ~500K companies
- **TAM: 500K companies**

**Serviceable Addressable Market (SAM):**
- Tech/SaaS companies: ~100K
- Willing to pay $10-50/month: ~50K
- **SAM: 50K companies**

**Serviceable Obtainable Market (SOM - Year 1):**
- Can realistically reach: 5-10K companies
- Conversion rate: 2-5%
- **SOM: 100-500 customers**

**Revenue Potential (Year 1):**
- 100 customers × $20/month = $2K MRR
- 500 customers × $20/month = $10K MRR
- 1,000 customers × $20/month = $20K MRR

---

### Success Criteria Summary

**Phase 1 Success (✅ ACHIEVED):**
- Email receiving works
- Slack notification works
- Dashboard CRUD works
- Deployed to production
- First customer using it

**Phase 2 Success:**
- 90% of replies from Slack
- Zero duplicate responses
- All tickets have owner
- 10x faster response time

**Phase 3 Success:**
- Teams track metrics daily
- Templates used for 40% of replies
- Conversation history visible
- High customer satisfaction

**Phase 4 Success:**
- Enterprise features working
- CRM integration providing value
- AI categorization accurate
- Multi-channel support

**Long-term Success:**
- $50K+ MRR
- <5% monthly churn
- >4.5/5 customer satisfaction
- Strong word-of-mouth growth

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 1, 2026 | Product Team | Initial PRD |
| 2.0 | Feb 14, 2026 | Product Team | Updated after Phase 1 completion |

**Review Schedule:**
- Weekly during active development
- Monthly during steady state
- Quarterly strategic review

**Stakeholders:**
- Product Team (owner)
- Engineering Team
- Customers (via feedback)

**Distribution:**
- Internal: All team members
- External: Not for distribution

---

**END OF PRD**