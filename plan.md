# Feature 2.1 Implementation Plan
## Reply from Discord (Simple Link MVP)

**Feature:** Allow users to reply to customer emails from Discord via web link  
**Priority:** CRITICAL - Phase 2, Week 1-2  
**Estimated Time:** 2-3 days  
**Status:** Not Started  

---

## Table of Contents

1. [Overview](#overview)
2. [Files to Create](#files-to-create)
3. [Files to Modify](#files-to-modify)
4. [Database Changes](#database-changes)
5. [Step-by-Step Implementation](#step-by-step-implementation)
6. [Testing Plan](#testing-plan)
7. [Deployment Checklist](#deployment-checklist)

---

## Overview

### Current Flow
```
Customer emails → Resend receives → Webhook → Discord notification
```

### New Flow
```
Customer emails → Resend receives → Webhook → Save to DB → 
Discord notification with reply link → User clicks link → 
Reply form → API sends email → Customer receives reply
```

### What We're Building

**1. Database Storage**
- Store incoming emails in MongoDB
- Track email metadata for threading

**2. Reply Link in Discord**
- Add clickable link to Discord message
- Link format: `https://your-app.vercel.app/reply/[threadId]`

**3. Reply Page**
- Shows original email
- Reply form with textarea
- Auth-protected (workspace owner only)

**4. Reply API**
- Sends email via Resend
- Stores outbound email
- Updates Discord message

---

## Files to Create

### 1. Email Thread Model
**File:** `app/api/models/EmailThreadModel.ts`  
**Purpose:** Database schema for storing emails  
**Lines:** ~100

### 2. Reply Page
**File:** `app/reply/[threadId]/page.tsx`  
**Purpose:** Reply form with auth checks  
**Lines:** ~120

### 3. Reply Form Component
**File:** `components/ReplyForm.tsx`  
**Purpose:** Client component for reply form  
**Lines:** ~80

### 4. Reply API Route
**File:** `app/api/emails/reply/route.ts`  
**Purpose:** Send email via Resend  
**Lines:** ~150

### 5. Auth Helper
**File:** `lib/authHelpers.ts`  
**Purpose:** Reusable workspace auth checks  
**Lines:** ~60

**Total New Files:** 5  
**Total New Code:** ~510 lines

---

## Files to Modify

### 1. Webhook Handler
**File:** `app/api/webhooks/resend/route.ts`  
**Changes:**
- Import EmailThread model
- Save email to database after receiving
- Change Discord message format to include reply link
- Store Discord message for future updates

**Lines to Add:** ~80  
**Lines to Modify:** ~30

### 2. Environment Variables
**File:** `.env.local`  
**Changes:**
- Add `NEXT_PUBLIC_SITE_URL` for reply links

**Lines to Add:** 1

**Total Modified Files:** 2  
**Total Modified Code:** ~110 lines

---

## Database Changes

### New Collection: EmailThread

```javascript
{
  _id: ObjectId,
  workspaceId: ObjectId,      // References Workspace
  aliasId: ObjectId,          // References Alias
  
  // Email metadata
  originalEmailId: String,    // Resend email_id
  messageId: String,          // Email Message-ID header
  inReplyTo: String,          // For threading replies
  references: [String],       // Full thread reference chain
  
  // Email content
  from: String,               // customer@email.com
  fromName: String,           // Customer Name (optional)
  to: String,                 // support@company.com
  subject: String,
  textBody: String,           // Plain text version
  htmlBody: String,           // HTML version (optional)
  
  // Workflow
  direction: String,          // 'inbound' | 'outbound'
  status: String,             // 'open' | 'replied' | 'resolved'
  
  // Discord metadata
  discordMessageId: String,   // For updating message later
  discordChannelId: String,
  
  // Timestamps
  receivedAt: Date,
  repliedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes to Create
```javascript
// For fast lookup by email_id
{ originalEmailId: 1 }

// For workspace isolation
{ workspaceId: 1, createdAt: -1 }

// For finding thread by ID
{ _id: 1 }
```

---

## Step-by-Step Implementation

### Day 1: Database & Model Setup

#### Step 1.1: Create EmailThread Model

**File:** `app/api/models/EmailThreadModel.ts`

```typescript
import mongoose from "mongoose";

const EmailThreadSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Workspace",
      index: true,
    },
    aliasId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Alias",
    },

    // Email metadata
    originalEmailId: {
      type: String,
      required: true,
      index: true,
    },
    messageId: {
      type: String,
      required: true,
    },
    inReplyTo: {
      type: String,
      default: null,
    },
    references: {
      type: [String],
      default: [],
    },

    // Email content
    from: {
      type: String,
      required: true,
    },
    fromName: {
      type: String,
      default: "",
    },
    to: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    textBody: {
      type: String,
      default: "",
    },
    htmlBody: {
      type: String,
      default: "",
    },

    // Workflow
    direction: {
      type: String,
      enum: ["inbound", "outbound"],
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "replied", "resolved"],
      default: "open",
    },

    // Discord metadata (for future message updates)
    discordMessageId: {
      type: String,
      default: null,
    },
    discordChannelId: {
      type: String,
      default: null,
    },

    // Timestamps
    receivedAt: {
      type: Date,
      default: Date.now,
    },
    repliedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Indexes
EmailThreadSchema.index({ workspaceId: 1, createdAt: -1 });
EmailThreadSchema.index({ originalEmailId: 1 });

export const EmailThread =
  mongoose.models.EmailThread ||
  mongoose.model("EmailThread", EmailThreadSchema);
```

**Testing:**
```bash
# Start dev server
npm run dev

# Check if model loads without errors
# Visit http://localhost:3000/api/test
```

---

#### Step 1.2: Create Auth Helper

**File:** `lib/authHelpers.ts`

```typescript
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import { EmailThread } from "@/app/api/models/EmailThreadModel";

/**
 * Get workspace for currently logged-in user
 * Creates workspace if it doesn't exist
 */
export async function getOrCreateWorkspaceForCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  await dbConnect();

  let workspace = await Workspace.findOne({
    ownerUserId: userId,
  });

  if (!workspace) {
    workspace = await Workspace.create({
      ownerUserId: userId,
      name: "My Workspace",
      plan: "free",
    });
  }

  return workspace;
}

/**
 * Check if current user has access to an email thread
 * Returns { access: boolean, thread?, workspace?, reason? }
 */
export async function checkThreadAccess(threadId: string) {
  try {
    // Get current user's workspace
    const workspace = await getOrCreateWorkspaceForCurrentUser();

    // Fetch the email thread
    await dbConnect();
    const thread = await EmailThread.findById(threadId).lean().exec();

    if (!thread) {
      return {
        access: false,
        reason: "not_found",
        error: "Email thread not found",
      };
    }

    // Check if thread belongs to user's workspace
    if (thread.workspaceId.toString() !== workspace._id.toString()) {
      return {
        access: false,
        reason: "wrong_workspace",
        error: "This email does not belong to your workspace",
      };
    }

    return {
      access: true,
      thread,
      workspace,
    };
  } catch (error) {
    console.error("Error checking thread access:", error);
    
    if (error instanceof Error && error.message === "Not authenticated") {
      return {
        access: false,
        reason: "not_authenticated",
        error: "Please log in to continue",
      };
    }

    return {
      access: false,
      reason: "error",
      error: "An error occurred while checking access",
    };
  }
}
```

**Testing:**
```typescript
// In any API route or page
const result = await checkThreadAccess("some-thread-id");
console.log(result); // { access: true/false, ... }
```

---

#### Step 1.3: Add Environment Variable

**File:** `.env.local`

**Add this line:**
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**For production (Vercel):**
```env
NEXT_PUBLIC_SITE_URL=https://email-route-with-clouflare.vercel.app
```

**Why needed:** To generate reply links with correct domain

---

#### Step 1.4: Update Webhook Handler to Save Emails

**File:** `app/api/webhooks/resend/route.ts`

**Changes to make:**

**1. Add import at top:**
```typescript
import { EmailThread } from "@/app/api/models/EmailThreadModel";
```

**2. After fetching email content (around line 95), add this:**

```typescript
// BEFORE: We just had the email content
const fromEmail = emailData.from || "Unknown";
const subject = emailData.subject || "(no subject)";
const textBody = fullEmail?.text || "";
const htmlBody = fullEmail?.html || "";

// NEW: Save email to database
const emailThread = await EmailThread.create({
  workspaceId: alias.workspaceId,
  aliasId: alias._id,
  
  // Email metadata
  originalEmailId: emailData.email_id,
  messageId: emailData.message_id || `<${emailData.email_id}@resend.app>`,
  inReplyTo: null, // This is an inbound email, not a reply
  references: [],
  
  // Email content
  from: fromEmail,
  to: emailLower,
  subject: subject,
  textBody: textBody,
  htmlBody: htmlBody,
  
  // Workflow
  direction: 'inbound',
  status: 'open',
  
  // Timestamps
  receivedAt: new Date(emailData.created_at || Date.now()),
});

console.log("💾 Email saved to database:", emailThread._id);
```

**3. Update Discord message format (around line 120):**

**OLD:**
```typescript
const snippet = textBody.slice(0, 500);

const messagePayload = {
  content: `📧 **New email to ${emailLower}**\n**From:** ${fromEmail}\n**Subject:** ${subject}\n\n${snippet}`
};
```

**NEW:**
```typescript
const snippet = textBody.slice(0, 500);

// Generate reply link
const replyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reply/${emailThread._id}`;

const messagePayload = {
  content: `📧 **New email to ${emailLower}**
**From:** ${fromEmail}
**Subject:** ${subject}

${snippet}

🔗 [Click here to reply](${replyUrl})`
};
```

**4. After posting to Discord (around line 145), store Discord message ID:**

**OPTIONAL (for future message updates):**
```typescript
// After successful Discord post
if (webhookResponse.ok) {
  // Discord webhooks don't return message ID easily
  // We'll skip this for now and implement in Phase 3
  console.log("✨ Successfully posted to discord with reply link");
}
```

**Complete modified section:**

```typescript
// Around line 95-150 in webhook handler

// 7. Fetch full email content from Resend API
let textBody = "";
let htmlBody = "";

try {
  console.log("📥 Fetching email content from Resend API...");
  const { data: fullEmail } = await resend.emails.receiving.get(emailData.email_id);
  
  textBody = fullEmail?.text || "";
  htmlBody = fullEmail?.html || "";
  
  console.log("✅ Email content retrieved:", {
    hasText: !!textBody,
    hasHtml: !!htmlBody,
    textLength: textBody.length,
  });
} catch (fetchError) {
  console.error("❌ Error fetching email content from Resend:", fetchError);
}

// 8. Format message data
const fromEmail = emailData.from || "Unknown";
const subject = emailData.subject || "(no subject)";
const snippet = textBody.slice(0, 500) || htmlBody.slice(0, 500) || "(No body content)";

// 9. Save email to database
const emailThread = await EmailThread.create({
  workspaceId: alias.workspaceId,
  aliasId: alias._id,
  
  // Email metadata
  originalEmailId: emailData.email_id,
  messageId: emailData.message_id || `<${emailData.email_id}@resend.app>`,
  inReplyTo: null,
  references: [],
  
  // Email content
  from: fromEmail,
  to: emailLower,
  subject: subject,
  textBody: textBody,
  htmlBody: htmlBody,
  
  // Workflow
  direction: 'inbound',
  status: 'open',
  
  // Timestamps
  receivedAt: new Date(emailData.created_at || Date.now()),
});

console.log("💾 Email saved to database:", emailThread._id);

// 10. Generate reply link
const replyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reply/${emailThread._id}`;

// 11. Format Discord message with reply link
const messagePayload = {
  content: `📧 **New email to ${emailLower}**
**From:** ${fromEmail}
**Subject:** ${subject}

${snippet}

🔗 [Click here to reply](${replyUrl})`
};

console.log("📤 Posting to", integration.type, "webhook");

// 12. Post to Discord (existing code continues...)
```

**Testing:**
```bash
# Send test email to hello@galearen.resend.app
# Check MongoDB - should see new EmailThread document
# Check Discord - should see message with reply link
```

---

### Day 2: Reply Page & Form

#### Step 2.1: Create Reply Page

**File:** `app/reply/[threadId]/page.tsx`

```typescript
import { redirect } from "next/navigation";
import { checkThreadAccess } from "@/lib/authHelpers";
import ReplyForm from "@/components/ReplyForm";

export default async function ReplyPage({
  params,
}: {
  params: { threadId: string };
}) {
  // Check authentication and access
  const result = await checkThreadAccess(params.threadId);

  // Handle different failure cases
  if (!result.access) {
    if (result.reason === "not_authenticated") {
      // Redirect to login with return URL
      redirect(`/sign-in?redirect=/reply/${params.threadId}`);
    }

    // Show error page for other failures
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              {result.reason === "not_found" ? "Not Found" : "Access Denied"}
            </h1>
            <p className="text-gray-600 mb-6">{result.error}</p>
            <a
              href="/"
              className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  const { thread } = result;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Reply to Email</h1>
          <p className="text-gray-600 mt-1">
            Send a response to this customer email
          </p>
        </div>

        {/* Original Email */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Original Email
          </h2>

          <div className="space-y-3">
            <div className="flex border-b border-gray-200 pb-2">
              <span className="font-medium text-gray-700 w-24">From:</span>
              <span className="text-gray-900">{thread.from}</span>
            </div>

            <div className="flex border-b border-gray-200 pb-2">
              <span className="font-medium text-gray-700 w-24">To:</span>
              <span className="text-gray-900">{thread.to}</span>
            </div>

            <div className="flex border-b border-gray-200 pb-2">
              <span className="font-medium text-gray-700 w-24">Subject:</span>
              <span className="text-gray-900">{thread.subject}</span>
            </div>

            <div className="flex border-b border-gray-200 pb-2">
              <span className="font-medium text-gray-700 w-24">Date:</span>
              <span className="text-gray-900">
                {new Date(thread.receivedAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-2">Message:</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <pre className="whitespace-pre-wrap font-sans text-gray-900 text-sm">
                {thread.textBody || thread.htmlBody || "(No content)"}
              </pre>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Your Reply
          </h2>
          <ReplyForm threadId={params.threadId} thread={thread} />
        </div>
      </div>
    </div>
  );
}
```

**Testing:**
```bash
# Visit /reply/[some-thread-id] in browser
# Should redirect to login if not logged in
# Should show error if thread doesn't exist
# Should show error if thread belongs to different workspace
# Should show form if all checks pass
```

---

#### Step 2.2: Create Reply Form Component

**File:** `components/ReplyForm.tsx`

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReplyFormProps {
  threadId: string;
  thread: {
    from: string;
    subject: string;
  };
}

export default function ReplyForm({ threadId, thread }: ReplyFormProps) {
  const router = useRouter();
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyText.trim()) {
      setError("Please enter a reply message");
      return;
    }

    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/emails/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId,
          replyText: replyText.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send reply");
      }

      const data = await response.json();
      console.log("Reply sent:", data);

      // Show success message
      setSuccess(true);
      setReplyText("");

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Error sending reply:", err);
      setError(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">
          Reply Sent Successfully!
        </h3>
        <p className="text-gray-600 mb-4">
          Your reply has been sent to {thread.from}
        </p>
        <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* To field (read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          To:
        </label>
        <input
          type="text"
          value={thread.from}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
        />
      </div>

      {/* Subject field (read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject:
        </label>
        <input
          type="text"
          value={`Re: ${thread.subject}`}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
        />
      </div>

      {/* Reply text area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Reply: <span className="text-red-500">*</span>
        </label>
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your reply here..."
          rows={10}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
          disabled={sending}
        />
        <p className="text-sm text-gray-500 mt-1">
          {replyText.length} characters
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={sending || !replyText.trim()}
          className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          {sending ? "Sending..." : "Send Reply"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          disabled={sending}
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
```

**Testing:**
```bash
# Fill out form and click "Send Reply"
# Should show loading state
# Should show success message
# Should redirect to dashboard
```

---

### Day 3: Reply API & Email Sending

#### Step 3.1: Create Reply API Route

**File:** `app/api/emails/reply/route.ts`

```typescript
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { Workspace } from "@/app/api/models/WorkspaceModel";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // 1. Check authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { threadId, replyText } = body;

    if (!threadId || !replyText) {
      return NextResponse.json(
        { error: "Missing threadId or replyText" },
        { status: 400 }
      );
    }

    if (!replyText.trim()) {
      return NextResponse.json(
        { error: "Reply text cannot be empty" },
        { status: 400 }
      );
    }

    console.log("📧 Processing reply request:", {
      threadId,
      userId,
      replyLength: replyText.length,
    });

    // 3. Connect to database
    await dbConnect();

    // 4. Find user's workspace
    const workspace = await Workspace.findOne({
      ownerUserId: userId,
    }).lean();

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    // 5. Fetch original email thread
    const thread = await EmailThread.findById(threadId).lean();

    if (!thread) {
      return NextResponse.json(
        { error: "Email thread not found" },
        { status: 404 }
      );
    }

    // 6. Verify thread belongs to user's workspace
    if (thread.workspaceId.toString() !== workspace._id.toString()) {
      return NextResponse.json(
        { error: "You don't have access to this email thread" },
        { status: 403 }
      );
    }

    // 7. Check if thread is inbound (can only reply to inbound emails)
    if (thread.direction !== "inbound") {
      return NextResponse.json(
        { error: "Can only reply to inbound emails" },
        { status: 400 }
      );
    }

    console.log("✅ Authorization passed, sending email...");

    // 8. Prepare reply email
    const replyEmail = {
      from: thread.to, // Reply from the address customer emailed
      to: thread.from, // Reply to the customer
      subject: thread.subject.startsWith("Re:")
        ? thread.subject
        : `Re: ${thread.subject}`,
      text: replyText.trim(),
      // Email threading headers
      inReplyTo: thread.messageId,
      references: [thread.messageId, ...thread.references].filter(Boolean),
    };

    console.log("📤 Sending email via Resend:", {
      from: replyEmail.from,
      to: replyEmail.to,
      subject: replyEmail.subject,
    });

    // 9. Send email via Resend
    const { data: sentEmail, error: sendError } = await resend.emails.send(
      replyEmail
    );

    if (sendError || !sentEmail) {
      console.error("❌ Resend error:", sendError);
      return NextResponse.json(
        { error: "Failed to send email", details: sendError },
        { status: 500 }
      );
    }

    console.log("✅ Email sent successfully:", sentEmail.id);

    // 10. Store outbound email in database
    const outboundThread = await EmailThread.create({
      workspaceId: workspace._id,
      aliasId: thread.aliasId,

      // Email metadata
      originalEmailId: sentEmail.id,
      messageId: `<${sentEmail.id}@resend.app>`, // Resend generates message-id
      inReplyTo: thread.messageId,
      references: [thread.messageId, ...thread.references],

      // Email content
      from: replyEmail.from,
      to: replyEmail.to,
      subject: replyEmail.subject,
      textBody: replyText.trim(),
      htmlBody: "",

      // Workflow
      direction: "outbound",
      status: "replied",

      // Timestamps
      receivedAt: new Date(),
      repliedAt: new Date(),
    });

    console.log("💾 Outbound email saved:", outboundThread._id);

    // 11. Update original thread status
    await EmailThread.findByIdAndUpdate(threadId, {
      status: "replied",
      repliedAt: new Date(),
    });

    console.log("✅ Original thread updated to 'replied' status");

    // 12. Return success
    return NextResponse.json({
      success: true,
      message: "Reply sent successfully",
      emailId: sentEmail.id,
      threadId: outboundThread._id.toString(),
    });
  } catch (error) {
    console.error("❌ Error processing reply:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
```

**Testing:**
```bash
# Use curl or Postman to test
curl -X POST http://localhost:3000/api/emails/reply \
  -H "Content-Type: application/json" \
  -d '{
    "threadId": "some-thread-id",
    "replyText": "Thanks for reaching out!"
  }'

# Should return success
# Check email inbox - should receive reply
# Check MongoDB - should see outbound EmailThread
```

---

## Testing Plan

### Unit Tests

**Test 1: EmailThread Model**
```typescript
// Create a thread
const thread = await EmailThread.create({
  workspaceId: "workspace123",
  aliasId: "alias123",
  originalEmailId: "resend123",
  messageId: "<msg123@test.com>",
  from: "customer@test.com",
  to: "support@test.com",
  subject: "Test",
  textBody: "Hello",
  direction: "inbound",
});

// Verify it was created
expect(thread._id).toBeDefined();
expect(thread.status).toBe("open");
```

**Test 2: Auth Helper**
```typescript
const result = await checkThreadAccess("invalid-id");
expect(result.access).toBe(false);
expect(result.reason).toBe("not_found");
```

---

### Integration Tests

**Test 1: Full Reply Flow**
```
1. Send test email to hello@galearen.resend.app
2. Check MongoDB - EmailThread created ✓
3. Check Discord - Message with reply link ✓
4. Click reply link
5. Should show reply form ✓
6. Fill form and submit
7. Check email - Reply received ✓
8. Check MongoDB - Outbound thread created ✓
9. Check original thread - Status = "replied" ✓
```

**Test 2: Auth Failures**
```
1. Try /reply/thread123 without login
   → Should redirect to /sign-in ✓
   
2. Login as User A
3. Try to reply to User B's thread
   → Should show "Access Denied" ✓
```

---

### Manual Testing Checklist

**Before Deployment:**

- [ ] Email arrives in Discord with reply link
- [ ] Reply link goes to correct page
- [ ] Not logged in → redirects to login
- [ ] Wrong workspace → shows access denied
- [ ] Valid access → shows reply form
- [ ] Form shows original email correctly
- [ ] Can type in textarea
- [ ] Submit sends email successfully
- [ ] Customer receives reply email
- [ ] Reply appears in customer's thread (Gmail/Outlook)
- [ ] Database has both inbound and outbound threads
- [ ] Original thread status updated to "replied"
- [ ] Success message shows after sending
- [ ] Redirects to dashboard after success
- [ ] Error handling works (invalid thread ID, network errors)

---

## Deployment Checklist

### Pre-Deployment

**1. Environment Variables**
- [ ] Add `NEXT_PUBLIC_SITE_URL` to `.env.local`
- [ ] Add `NEXT_PUBLIC_SITE_URL` to Vercel environment variables
- [ ] Verify `RESEND_API_KEY` is set in Vercel

**2. Code Review**
- [ ] All files created
- [ ] All files modified correctly
- [ ] No console.logs left in (or converted to proper logging)
- [ ] TypeScript compiles without errors
- [ ] ESLint passes

**3. Database**
- [ ] EmailThread model deployed
- [ ] Indexes created (automatic with model)
- [ ] Test document can be created

---

### Deployment Steps

**1. Commit Code**
```bash
git add .
git commit -m "feat: Add reply from Discord feature (Feature 2.1)"
git push origin main
```

**2. Verify Vercel Deployment**
- [ ] Build succeeds
- [ ] No deployment errors
- [ ] Environment variables set correctly

**3. Post-Deployment Tests**
- [ ] Send test email to production
- [ ] Verify Discord notification with link
- [ ] Click link and reply
- [ ] Verify email received

**4. Monitor**
- [ ] Check Vercel logs for errors
- [ ] Check MongoDB for new documents
- [ ] Check Resend for email delivery

---

### Rollback Plan

If something breaks:

**1. Quick Rollback**
```bash
# In Vercel dashboard
# Go to Deployments
# Find previous working deployment
# Click "Promote to Production"
```

**2. Database Rollback**
```javascript
// If EmailThread model causes issues, remove it
// Old code still works without it
// Just remove import in webhook handler
```

**3. Discord Message Rollback**
```javascript
// Change back to simple message without link
const messagePayload = {
  content: `📧 **New email to ${emailLower}**...`
  // No reply link
};
```

---

## Success Criteria

**Feature is considered successful when:**

1. ✅ User receives Discord notification with reply link
2. ✅ Clicking link shows reply form (with proper auth)
3. ✅ Submitting form sends email to customer
4. ✅ Customer receives email in their inbox (threaded correctly)
5. ✅ Database stores both inbound and outbound emails
6. ✅ Process takes <30 seconds from click to send
7. ✅ No security vulnerabilities (workspace isolation works)
8. ✅ Zero data loss (all emails stored)
9. ✅ Works on mobile and desktop
10. ✅ Error messages are clear and helpful

---

## Performance Targets

- Reply page load: <1 second
- Form submission: <3 seconds
- Email delivery: <5 seconds
- Database queries: <200ms each
- No memory leaks
- Handles 100 concurrent replies

---

## Known Limitations (MVP)

**1. No Real-Time Updates**
- Discord message doesn't update to show "Replied"
- Need Discord bot for this (Phase 3)

**2. Owner Only**
- Only workspace owner can reply
- Team members can't reply yet (Phase 2.2)

**3. No Conversation View**
- Can't see full email thread history
- Each email is standalone (Phase 3)

**4. No Draft Saving**
- If user closes page, reply is lost
- Auto-save coming in Phase 3

**5. Text Only**
- No HTML formatting in replies
- No attachments support
- Plain text only

**6. No Mobile App**
- Web only
- Discord mobile → opens browser
- Native mobile app in Phase 5

---

## Next Steps After 2.1

**Immediate (Phase 2.2):**
- Add ticket assignment/claiming
- Add status tracking

**Soon (Phase 3):**
- Email conversation threading
- Response time metrics
- Canned response templates

**Future (Phase 4+):**
- Discord bot for real-time updates
- Team member management
- Rich text editor for replies

---

**END OF FEATURE 2.1 PLAN**