# Feature 2.3: Status Tracking - Task List

**Goal:** Implement ticket status lifecycle with automatic updates and filtering  
**Time:** 3-4 days  
**Plan:** See `status-tracking-plan.md` for architecture details

---

## Day 1: Database & Backend Logic (6 tasks)

### Task 1.1: Update EmailThread Model
**Time:** 30 minutes  
**Priority:** ⭐⭐⭐⭐⭐ CRITICAL  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open file: `app/api/models/EmailThreadModel.ts`
- [ ] Add to interface `IEmailThread`:
  - `status?: string` (default: 'open')
  - `statusUpdatedAt?: Date`
  - `resolvedAt?: Date`
  - `resolvedBy?: string`
- [ ] Add fields to Mongoose schema
- [ ] Set default value for status: `default: 'open'`
- [ ] Add index on status field for faster queries
- [ ] See **Plan → Database Changes**

**Result:** EmailThread model supports status tracking

**Example:**
```typescript
export interface IEmailThread extends Document {
  // ... existing fields ...
  
  // Status tracking fields
  status?: string;          // 'open' | 'in_progress' | 'waiting' | 'resolved'
  statusUpdatedAt?: Date;   // When status last changed
  resolvedAt?: Date;        // When marked resolved
  resolvedBy?: string;      // Clerk userId who resolved it
  
  // ... existing fields ...
}

const EmailThreadSchema = new Schema<IEmailThread>({
  // ... existing fields ...
  
  status: {
    type: String,
    enum: ['open', 'in_progress', 'waiting', 'resolved'],
    default: 'open',
    index: true,  // Index for filtering
  },
  statusUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
  resolvedBy: {
    type: String,
    default: null,
  },
  
  // ... existing fields ...
});
```

---

### Task 1.2: Update Webhook to Set Initial Status
**Time:** 15 minutes  
**Priority:** ⭐⭐⭐⭐⭐ CRITICAL  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open file: `app/api/webhooks/resend/route.ts`
- [ ] Find where EmailThread is created (around line 165-180)
- [ ] Add status fields to the create call
- [ ] Set default: `status: 'open'`
- [ ] Set statusUpdatedAt to current date
- [ ] See **Plan → Auto-Status Update Logic**

**Where to add:**
```typescript
// Around line 165-180, in the webhook handler
const emailThread = await EmailThread.create({
  workspaceId: alias.workspaceId,
  aliasId: alias._id,
  // ... other existing fields ...
  
  // NEW STATUS FIELDS:
  status: 'open',                    // Default status for new emails
  statusUpdatedAt: new Date(),       // Track when status set
  
  // ... other existing fields ...
});
```

**Result:** New emails start with status = 'open'

---

### Task 1.3: Update Claim API to Set Status
**Time:** 20 minutes  
**Priority:** ⭐⭐⭐⭐⭐ CRITICAL  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open file: `app/api/emails/claim/route.ts`
- [ ] Find where EmailThread is updated (around line 65-70)
- [ ] Add status change to 'in_progress'
- [ ] Update statusUpdatedAt
- [ ] See **Plan → Auto-Status Update Logic → In Claim API**

**Where to add:**
```typescript
// Around line 65-70, where we update the thread
thread.assignedTo = userId;
thread.assignedToEmail = userEmail;
thread.assignedToName = userName;
thread.claimedAt = new Date();

// NEW: Update status
thread.status = 'in_progress';      // Claiming means working on it
thread.statusUpdatedAt = new Date(); // Track the change

await thread.save();
```

**Result:** Claiming a ticket auto-sets status to 'in_progress'

---

### Task 1.4: Update Reply API to Set Status
**Time:** 20 minutes  
**Priority:** ⭐⭐⭐⭐⭐ CRITICAL  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open file: `app/api/emails/reply/route.ts`
- [ ] Find where reply is successful (after email sent, around line 115-130)
- [ ] AFTER email sends successfully, update status to 'waiting'
- [ ] Update statusUpdatedAt
- [ ] See **Plan → Auto-Status Update Logic → In Reply API**

**Where to add:**
```typescript
// AFTER email sent successfully (around line 115-130)
if (sendError || !sentEmail) {
  // ... error handling ...
}

// Email sent successfully - now update thread
thread.status = 'replied';
thread.repliedAt = new Date();

// NEW: Update status to waiting (waiting on customer)
thread.status = 'waiting';           // Now waiting for customer response
thread.statusUpdatedAt = new Date(); // Track the change

await thread.save();
```

**Important:** Only update status AFTER email sends successfully, not before!

**Result:** Replying auto-sets status to 'waiting'

---

### Task 1.5: Create Update Status API
**Time:** 1 hour  
**Priority:** ⭐⭐⭐⭐ HIGH  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create file: `app/api/emails/update-status/route.ts`
- [ ] Create POST handler
- [ ] Get userId from Clerk auth
- [ ] Get threadId and status from request body
- [ ] Validate status value (open, in_progress, waiting, resolved)
- [ ] Find thread and verify user has access
- [ ] Update status, statusUpdatedAt
- [ ] If status = 'resolved', also set resolvedAt and resolvedBy
- [ ] Return updated thread
- [ ] See **Plan → API Endpoints → Update Status**

**Result:** POST /api/emails/update-status works

**Example:**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { Workspace } from "@/app/api/models/WorkspaceModel";

const VALID_STATUSES = ['open', 'in_progress', 'waiting', 'resolved'];

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadId, status } = await request.json();

    // Validate inputs
    if (!threadId || !status) {
      return NextResponse.json(
        { error: "threadId and status are required" },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get user's workspace
    const workspace = await Workspace.findOne({ ownerUserId: userId }).lean();
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // Find thread and verify access
    const thread = await EmailThread.findById(threadId);
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    if (thread.workspaceId.toString() !== workspace._id.toString()) {
      return NextResponse.json(
        { error: "You don't have access to this thread" },
        { status: 403 }
      );
    }

    // Update status
    thread.status = status;
    thread.statusUpdatedAt = new Date();

    // If resolved, track who and when
    if (status === 'resolved') {
      thread.resolvedAt = new Date();
      thread.resolvedBy = userId;
    }

    await thread.save();

    return NextResponse.json({
      success: true,
      thread: {
        id: thread._id.toString(),
        status: thread.status,
        statusUpdatedAt: thread.statusUpdatedAt,
        resolvedAt: thread.resolvedAt,
        resolvedBy: thread.resolvedBy,
      }
    });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

### Task 1.6: Create Get Status Counts API
**Time:** 45 minutes  
**Priority:** ⭐⭐⭐ MEDIUM  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create file: `app/api/emails/tickets/status-counts/route.ts`
- [ ] Create GET handler
- [ ] Get userId from Clerk auth
- [ ] Get user's workspace
- [ ] Count tickets by status using aggregation
- [ ] Return counts object
- [ ] See **Plan → API Endpoints → Get Status Counts**

**Result:** GET /api/emails/tickets/status-counts returns counts

**Example:**
```typescript
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { EmailThread } from "@/app/api/models/EmailThreadModel";
import { Workspace } from "@/app/api/models/WorkspaceModel";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const workspace = await Workspace.findOne({ ownerUserId: userId }).lean();
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // Count tickets by status
    const counts = await EmailThread.aggregate([
      { $match: { workspaceId: workspace._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Format response
    const result = {
      open: 0,
      in_progress: 0,
      waiting: 0,
      resolved: 0,
      total: 0
    };

    counts.forEach(item => {
      if (item._id) {
        result[item._id] = item.count;
        result.total += item.count;
      }
    });

    return NextResponse.json({ counts: result });
  } catch (error) {
    console.error("Error getting status counts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## Day 2: UI Components (5 tasks)

### Task 2.1: Create StatusBadge Component
**Time:** 45 minutes  
**Priority:** ⭐⭐⭐⭐ HIGH  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create file: `components/StatusBadge.tsx`
- [ ] Make it a client component ("use client")
- [ ] Accept props: status (string)
- [ ] Define badge configs for each status (icon, label, colors)
- [ ] Return colored badge with icon
- [ ] Style with Tailwind
- [ ] See **Plan → Status Badge Components**

**Result:** Reusable status badge component

**Example:**
```typescript
"use client";

import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: 'open' | 'in_progress' | 'waiting' | 'resolved';
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const badges = {
    open: {
      icon: '🆕',
      label: 'Open',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    },
    in_progress: {
      icon: '🔄',
      label: 'In Progress',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    },
    waiting: {
      icon: '⏸️',
      label: 'Waiting',
      className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    },
    resolved: {
      icon: '✅',
      label: 'Resolved',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    }
  };

  const badge = badges[status] || badges.open;
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${badge.className} ${sizeClass}`}>
      <span>{badge.icon}</span>
      <span>{badge.label}</span>
    </span>
  );
}
```

---

### Task 2.2: Create MarkResolvedButton Component
**Time:** 1 hour  
**Priority:** ⭐⭐⭐⭐ HIGH  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create file: `components/MarkResolvedButton.tsx`
- [ ] Make it a client component
- [ ] Accept props: threadId, currentStatus, onResolved callback
- [ ] Only show button if status != 'resolved'
- [ ] Call POST /api/emails/update-status with status='resolved'
- [ ] Show loading state
- [ ] Show success/error toast
- [ ] Call onResolved callback after success
- [ ] Style with Tailwind

**Result:** Button to mark tickets as resolved

**Example:**
```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MarkResolvedButtonProps {
  threadId: string;
  currentStatus: string;
  onResolved?: () => void;
  size?: "sm" | "default" | "lg";
}

export default function MarkResolvedButton({
  threadId,
  currentStatus,
  onResolved,
  size = "sm"
}: MarkResolvedButtonProps) {
  const [resolving, setResolving] = useState(false);

  // Don't show if already resolved
  if (currentStatus === 'resolved') {
    return null;
  }

  const handleResolve = async () => {
    setResolving(true);

    try {
      const response = await fetch("/api/emails/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId,
          status: "resolved"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to resolve ticket");
        return;
      }

      toast.success("Ticket marked as resolved!");

      if (onResolved) {
        onResolved();
      }
    } catch (error) {
      console.error("Error resolving ticket:", error);
      toast.error("Failed to resolve ticket. Please try again.");
    } finally {
      setResolving(false);
    }
  };

  return (
    <Button
      onClick={handleResolve}
      disabled={resolving}
      size={size}
      variant="outline"
      className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
    >
      {resolving ? "Resolving..." : "✅ Mark Resolved"}
    </Button>
  );
}
```

---

### Task 2.3: Create StatusFilter Component
**Time:** 1 hour  
**Priority:** ⭐⭐⭐⭐ HIGH  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create file: `components/StatusFilter.tsx`
- [ ] Make it a client component
- [ ] Accept props: currentFilter, counts, onFilterChange
- [ ] Create filter tabs for each status (All, Open, In Progress, Waiting, Resolved)
- [ ] Show count badges next to each filter
- [ ] Highlight active filter
- [ ] Call onFilterChange when filter clicked
- [ ] Style with Tailwind

**Result:** Filter tabs for status

**Example:**
```typescript
"use client";

interface StatusFilterProps {
  currentFilter: string;
  counts: {
    all: number;
    open: number;
    in_progress: number;
    waiting: number;
    resolved: number;
  };
  onFilterChange: (filter: string) => void;
}

export default function StatusFilter({
  currentFilter,
  counts,
  onFilterChange
}: StatusFilterProps) {
  const filters = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'open', label: '🆕 Open', count: counts.open },
    { key: 'in_progress', label: '🔄 In Progress', count: counts.in_progress },
    { key: 'waiting', label: '⏸️ Waiting', count: counts.waiting },
    { key: 'resolved', label: '✅ Resolved', count: counts.resolved },
  ];

  return (
    <div className="flex gap-2 flex-wrap border-b border-neutral-200 dark:border-neutral-700 pb-4 mb-4">
      {filters.map(filter => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentFilter === filter.key
              ? 'bg-blue-600 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
          }`}
        >
          {filter.label}
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
            currentFilter === filter.key
              ? 'bg-blue-500'
              : 'bg-neutral-200 dark:bg-neutral-700'
          }`}>
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
}
```

---

### Task 2.4: Update TicketsList to Show Status
**Time:** 30 minutes  
**Priority:** ⭐⭐⭐⭐ HIGH  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open file: `components/tickets/TicketsList.tsx`
- [ ] Import StatusBadge component
- [ ] Add status column to table
- [ ] Import MarkResolvedButton component
- [ ] Add "Mark Resolved" button to actions column
- [ ] Pass status prop to StatusBadge
- [ ] See **Plan → Dashboard Integration**

**Where to add:**
```typescript
// In the table header
<th>Status</th>

// In the table row
<td className="p-3">
  <StatusBadge status={ticket.status} size="sm" />
</td>

// In actions column
<td className="p-3">
  <div className="flex items-center justify-end gap-2">
    <Link href={`/reply/${ticket.id}`}>
      <Button size="sm" variant="outline">View</Button>
    </Link>
    {type === "unassigned" && (
      <ClaimButton threadId={ticket.id} onClaimed={onRefresh} />
    )}
    {type === "mine" && (
      <>
        <MarkResolvedButton 
          threadId={ticket.id}
          currentStatus={ticket.status}
          onResolved={onRefresh}
        />
        <UnclaimButton threadId={ticket.id} onUnclaimed={onRefresh} />
      </>
    )}
  </div>
</td>
```

**Result:** Ticket list shows status badges and resolve button

---

### Task 2.5: Update My Tickets Page with Status Filter
**Time:** 1.5 hours  
**Priority:** ⭐⭐⭐⭐ HIGH  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open file: `app/dashboard/tickets/mine/page.tsx`
- [ ] Import StatusFilter component
- [ ] Add state for current filter (useState)
- [ ] Add state for status counts (useState)
- [ ] Fetch status counts from API
- [ ] Filter tickets based on selected status
- [ ] Add StatusFilter component above TicketsList
- [ ] Pass filter change handler
- [ ] See **Plan → Dashboard Integration**

**Example:**
```typescript
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import TicketsList from "@/components/tickets/TicketsList";
import StatusFilter from "@/components/StatusFilter";
import Link from "next/link";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    open: 0,
    in_progress: 0,
    waiting: 0,
    resolved: 0
  });

  const fetchMyTickets = async () => {
    // ... fetch tickets ...
    
    // Calculate counts
    const counts = {
      all: data.tickets.length,
      open: data.tickets.filter(t => t.status === 'open').length,
      in_progress: data.tickets.filter(t => t.status === 'in_progress').length,
      waiting: data.tickets.filter(t => t.status === 'waiting').length,
      resolved: data.tickets.filter(t => t.status === 'resolved').length,
    };
    setStatusCounts(counts);
  };

  // Filter tickets based on current filter
  const filteredTickets = currentFilter === 'all'
    ? tickets
    : tickets.filter(t => t.status === currentFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Tickets</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Tickets assigned to you
          </p>
        </div>
        <Button onClick={fetchMyTickets} variant="outline">
          🔄 Refresh
        </Button>
      </div>

      <StatusFilter
        currentFilter={currentFilter}
        counts={statusCounts}
        onFilterChange={setCurrentFilter}
      />

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <TicketsList 
          tickets={filteredTickets} 
          type="mine" 
          onRefresh={fetchMyTickets} 
        />
      )}
    </div>
  );
}
```

**Result:** My Tickets page has status filter tabs

---

## Day 3: Integrations & Polish (4 tasks)

### Task 3.1: Update Discord Webhook to Show Status
**Time:** 30 minutes  
**Priority:** ⭐⭐⭐ MEDIUM  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open file: `app/api/webhooks/resend/route.ts`
- [ ] Find where Discord message is formatted (around line 200-215)
- [ ] Add status line to Discord message
- [ ] Use emoji indicators (🆕 🔄 ⏸️ ✅)
- [ ] See **Plan → Discord/Slack Integration**

**Where to add:**
```typescript
// After claim status, add status line
let claimStatus = "";
if (emailThread.assignedTo && emailThread.assignedToEmail) {
  claimStatus = integration.type === "slack"
    ? `👤 *Claimed by:* ${emailThread.assignedToEmail}\n`
    : `👤 **Claimed by:** ${emailThread.assignedToEmail}\n`;
}

// NEW: Add status line
const statusEmojis = {
  open: '🆕',
  in_progress: '🔄',
  waiting: '⏸️',
  resolved: '✅'
};
const statusEmoji = statusEmojis[emailThread.status] || '🆕';
const statusLabels = {
  open: 'Open',
  in_progress: 'In Progress',
  waiting: 'Waiting',
  resolved: 'Resolved'
};
const statusLabel = statusLabels[emailThread.status] || 'Open';

let statusLine = integration.type === "slack"
  ? `${statusEmoji} *Status:* ${statusLabel}\n`
  : `${statusEmoji} **Status:** ${statusLabel}\n`;

// Update message payload
const messagePayload = integration.type === "slack"
  ? {
      text: `📧 New email to *${emailLower}*\n${claimStatus}${statusLine}*From:* ${fromEmail}\n*Subject:* ${subject}\n\n${snippet}\n\n🔗 [Click here to reply](${replyUrl})`,
    }
  : {
      content: `📧 **New email to ${emailLower}**
${claimStatus}${statusLine}**From:** ${fromEmail}
**Subject:** ${subject}

${snippet}

🔗 [Click here to reply](${replyUrl})`,
    };
```

**Result:** Discord shows status in notifications

---

### Task 3.2: Update Reply Page to Show Status
**Time:** 30 minutes  
**Priority:** ⭐⭐⭐ MEDIUM  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open file: `app/reply/[threadId]/page.tsx`
- [ ] Import StatusBadge component
- [ ] Import MarkResolvedButton component
- [ ] Add status badge next to claim status badge
- [ ] Add "Mark Resolved" button if not already resolved
- [ ] See **Plan → Reply Page Integration**

**Where to add:**
```typescript
// After claim status badge, add status badge
{claimStatusBadge}

{/* NEW: Status badge */}
<div className="bg-white border border-neutral-200 rounded-lg p-3 mb-6 flex items-center justify-between">
  <div className="flex items-center gap-3">
    <span className="text-neutral-700 font-medium">Status:</span>
    <StatusBadge status={thread.status || 'open'} />
  </div>
  {thread.status !== 'resolved' && (
    <MarkResolvedButton
      threadId={threadId}
      currentStatus={thread.status || 'open'}
      onResolved={() => window.location.reload()}
    />
  )}
</div>
```

**Result:** Reply page shows status and resolve button

---

### Task 3.3: Add Status to API Responses
**Time:** 45 minutes  
**Priority:** ⭐⭐⭐⭐ HIGH  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open file: `app/api/emails/tickets/mine/route.ts`
- [ ] Add status field to returned ticket object
- [ ] Open file: `app/api/emails/tickets/unassigned/route.ts`
- [ ] Add status field to returned ticket object
- [ ] Make sure status is included in all API responses

**Update both APIs:**
```typescript
// Make sure to include status in the response
const tickets = foundThreads.map(thread => ({
  id: thread._id.toString(),
  from: thread.from,
  fromName: thread.fromName,
  subject: thread.subject,
  status: thread.status || 'open',  // NEW: Include status
  receivedAt: thread.receivedAt.toISOString(),
  // ... other fields ...
}));
```

**Result:** APIs return status field

---

### Task 3.4: Update Ticket Interface Types
**Time:** 30 minutes  
**Priority:** ⭐⭐⭐ MEDIUM  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open files that use Ticket interface:
  - `app/dashboard/tickets/mine/page.tsx`
  - `app/dashboard/tickets/unassigned/page.tsx`
  - `components/tickets/TicketsList.tsx`
- [ ] Add status field to Ticket interface
- [ ] Make sure TypeScript compiles without errors

**Update interface:**
```typescript
interface Ticket {
  id: string;
  from: string;
  fromName: string;
  subject: string;
  status: string;  // NEW
  receivedAt: string;
  repliedAt?: string | null;
  assignedTo?: string;
  assignedToEmail?: string;
  assignedToName?: string;
  claimedAt?: string;
}
```

**Result:** TypeScript types updated

---

## Day 4: Testing & Documentation (5 tasks)

### Task 4.1: Test Auto-Status Updates
**Time:** 45 minutes  
**Priority:** ⭐⭐⭐⭐⭐ CRITICAL  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Test 1: Send test email → Verify status = 'open'
- [ ] Test 2: Claim ticket → Verify status = 'in_progress'
- [ ] Test 3: Reply to ticket → Verify status = 'waiting'
- [ ] Test 4: Check database for each step
- [ ] See **Plan → Testing Plan → Test 1 & 2**

**Test commands (for database check):**
```javascript
// In MongoDB compass or shell
db.emailthreads.findOne({ _id: ObjectId("YOUR_THREAD_ID") })

// Should show:
// status: "open" (initially)
// status: "in_progress" (after claim)
// status: "waiting" (after reply)
```

**Success criteria:**
- ✅ New email has status = 'open'
- ✅ Claimed ticket has status = 'in_progress'
- ✅ Replied ticket has status = 'waiting'
- ✅ statusUpdatedAt changes each time

**Result:** Auto-status updates working

---

### Task 4.2: Test Manual Status Change
**Time:** 30 minutes  
**Priority:** ⭐⭐⭐⭐ HIGH  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Go to any ticket in "My Tickets"
- [ ] Click "Mark as Resolved" button
- [ ] Wait for success toast
- [ ] Refresh page
- [ ] Verify ticket shows resolved status
- [ ] Check database for resolvedAt and resolvedBy
- [ ] See **Plan → Testing Plan → Test 3**

**Success criteria:**
- ✅ Button changes status to 'resolved'
- ✅ Toast notification shows
- ✅ Status persists after refresh
- ✅ resolvedAt and resolvedBy are set in database

**Result:** Manual resolve working

---

### Task 4.3: Test Status Filters
**Time:** 30 minutes  
**Priority:** ⭐⭐⭐⭐ HIGH  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Go to "My Tickets"
- [ ] Click each filter tab (Open, In Progress, Waiting, Resolved)
- [ ] Verify tickets are filtered correctly
- [ ] Verify counts are accurate
- [ ] Test "All" filter shows everything
- [ ] See **Plan → Testing Plan → Test 4**

**Success criteria:**
- ✅ Filters show correct tickets
- ✅ Counts match actual numbers
- ✅ "All" shows all tickets
- ✅ Empty states work

**Result:** Filtering working correctly

---

### Task 4.4: Test Discord Integration
**Time:** 30 minutes  
**Priority:** ⭐⭐⭐ MEDIUM  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Send a test email to your alias
- [ ] Check Discord notification
- [ ] Verify status line appears (🆕 Status: Open)
- [ ] Claim the ticket
- [ ] Check if status is shown in Discord (won't update old message)
- [ ] Send another test email after claiming
- [ ] Note: Discord messages don't update, only new messages show current status

**Success criteria:**
- ✅ New Discord messages show status line
- ✅ Status emoji is correct (🆕 for open)
- ✅ Format looks good

**Result:** Discord integration working

---

### Task 4.5: Write Documentation (Optional)
**Time:** 1 hour  
**Priority:** ⭐⭐ LOW  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create or update: `docs/STATUS_TRACKING.md`
- [ ] Document status workflow
- [ ] Document how to mark resolved
- [ ] Document how filters work
- [ ] Add screenshots
- [ ] Update README with status feature

**Documentation template:**

```markdown
# Status Tracking

## Status Lifecycle

Tickets move through these statuses:

1. **🆕 Open** - New email, not claimed
2. **🔄 In Progress** - Claimed and being worked on
3. **⏸️ Waiting** - Replied, waiting on customer
4. **✅ Resolved** - Completed and closed

## Automatic Status Updates

- When email arrives → Open
- When you claim → In Progress
- When you reply → Waiting
- When customer replies → In Progress (back to you)

## Manually Marking Resolved

1. Go to the ticket (My Tickets or Reply page)
2. Click "Mark as Resolved" button
3. Ticket is marked complete

## Filtering Tickets

Use the filter tabs to show:
- **All** - All your tickets
- **Open** - Unclaimed tickets
- **In Progress** - Actively being worked
- **Waiting** - Waiting on customer
- **Resolved** - Completed tickets
```

**Result:** Feature documented

---

## Quick Reference

### Files to Create (5 new files)

1. `app/api/emails/update-status/route.ts` - Manual status change API
2. `app/api/emails/tickets/status-counts/route.ts` - Get status counts
3. `components/StatusBadge.tsx` - Status indicator
4. `components/MarkResolvedButton.tsx` - Resolve button
5. `components/StatusFilter.tsx` - Filter tabs

### Files to Edit (8 files)

1. `app/api/models/EmailThreadModel.ts` - Add status fields
2. `app/api/webhooks/resend/route.ts` - Set initial status + Discord
3. `app/api/emails/claim/route.ts` - Auto-set to in_progress
4. `app/api/emails/reply/route.ts` - Auto-set to waiting
5. `app/api/emails/tickets/mine/route.ts` - Include status in response
6. `app/api/emails/tickets/unassigned/route.ts` - Include status
7. `components/tickets/TicketsList.tsx` - Show status badge
8. `app/dashboard/tickets/mine/page.tsx` - Add status filter
9. `app/reply/[threadId]/page.tsx` - Show status + resolve button

**Total:** 5 new files + 9 edited files = 14 file changes

---

## Testing Checklist

Before marking complete, verify:

**Auto-Status:**
- [ ] New emails have status = 'open'
- [ ] Claiming sets status = 'in_progress'
- [ ] Replying sets status = 'waiting'
- [ ] statusUpdatedAt changes correctly

**Manual Actions:**
- [ ] Mark as resolved works
- [ ] resolvedAt and resolvedBy are set
- [ ] Status persists after refresh

**Filtering:**
- [ ] All filter tabs work
- [ ] Counts are accurate
- [ ] Empty states work

**UI:**
- [ ] Status badges show correct colors
- [ ] Discord shows status
- [ ] Reply page shows status

---

## Success Criteria

✅ Feature is DONE when:
- [ ] EmailThread model has status fields
- [ ] Auto-status updates on claim/reply/new email
- [ ] Manual mark as resolved works
- [ ] Status badges show everywhere
- [ ] Filters work in My Tickets
- [ ] Status counts API works
- [ ] Discord shows status
- [ ] All tests pass
- [ ] No breaking changes

---

## Estimated Time by Section

```
Day 1: Database & Backend (6 hours)
- Task 1.1: Model update (30min)
- Task 1.2: Webhook update (15min)
- Task 1.3: Claim API (20min)
- Task 1.4: Reply API (20min)
- Task 1.5: Update status API (1h)
- Task 1.6: Status counts API (45min)
- Buffer (1h 30min)

Day 2: UI Components (6 hours)
- Task 2.1: StatusBadge (45min)
- Task 2.2: MarkResolvedButton (1h)
- Task 2.3: StatusFilter (1h)
- Task 2.4: Update TicketsList (30min)
- Task 2.5: Update My Tickets page (1.5h)
- Buffer (1h 15min)

Day 3: Integration (3 hours)
- Task 3.1: Discord (30min)
- Task 3.2: Reply page (30min)
- Task 3.3: API responses (45min)
- Task 3.4: TypeScript types (30min)
- Buffer (45min)

Day 4: Testing (3 hours)
- Task 4.1: Auto-status tests (45min)
- Task 4.2: Manual tests (30min)
- Task 4.3: Filter tests (30min)
- Task 4.4: Discord tests (30min)
- Task 4.5: Documentation (1h, optional)

Total: 18 hours = 3-4 days
```

---

## Troubleshooting

### Issue: Status not updating
**Check:**
- Is the API being called?
- Check browser console for errors
- Check backend logs
- Verify statusUpdatedAt changed in database

### Issue: Filters not working
**Check:**
- Are status values correct? (must match exactly)
- Check filter logic in frontend
- Verify API returns status field
- Check counts calculation

### Issue: Auto-status not working
**Check:**
- Did you update all three files? (webhook, claim, reply)
- Is status field in database?
- Check database for actual values
- Look for errors in backend logs

---

**Let's build status tracking! Start with Day 1, Task 1.1** 🚀



1. Pricing Section

Simple pricing tiers (Free, Pro, Enterprise)
Feature comparison table
"Start Free" CTA
Similar to Vercel's pricing style

2. FAQ Section

Common questions about Slack integration
"How does email routing work?"
"Is my data secure?"
"What email providers do you support?"
Accordion-style dropdowns

3. Integration/Tech Stack Section

Show logos of supported platforms
Email providers (Gmail, Outlook, etc.)
Slack, Discord logos
"Works with your existing tools"

4. Call-to-Action (CTA) Section

Large hero-style CTA before footer
"Ready to transform your support?"
Email signup or "Get Started" button
Social proof reminder

5. How It Works Section

3-step process illustration
Step 1: Connect email
Step 2: Link Slack
Step 3: Start responding
Visual timeline/flow

6. Comparison Section

Before/After comparison
"Old way vs New way"
Traditional email vs Slack integration

7. Stats/Numbers Section

Big impact metrics
"10,000+ emails routed"
"500+ teams using"
"99.9% uptime"

8. Footer

Links (Product, Company, Resources, Legal)
Social media icons
Newsletter signup
Logo and tagline