# Feature 2.3: Status Tracking - Implementation Plan

**Goal:** Enable ticket lifecycle management with automatic status updates and filtering

**Time Estimate:** 3-4 days  
**Priority:** HIGH - Essential for ticket management workflow

---

## Overview

### Current Problem

```
Email arrives → Gets claimed → Gets replied to → ???

Questions we can't answer:
- Which tickets are still open?
- Which tickets are waiting on customer?
- Which tickets are resolved?
- How many tickets did we close today?
```

**No way to:**
- Filter completed vs active tickets
- Track what needs attention
- Generate completion metrics
- Hide resolved tickets from view

### Solution: Status Lifecycle

```
New Email Arrives
      ↓
    OPEN 🆕 (Not claimed yet)
      ↓
  [User Claims]
      ↓
  IN PROGRESS 🔄 (Being worked on)
      ↓
  [User Replies]
      ↓
  WAITING ⏸️ (Waiting on customer response)
      ↓
  [Customer Replies Back]
      ↓
  IN PROGRESS 🔄 (Back to being worked on)
      ↓
  [Mark Resolved]
      ↓
   RESOLVED ✅ (Completed, archived)
```

---

## Why Status Tracking?

**Problem it solves:**
- **Clutter:** Can't hide completed tickets
- **Visibility:** Manager can't see workload
- **Priority:** Don't know what needs attention
- **Metrics:** Can't track completion rates

**Benefits:**
- **Clear priorities:** See what needs work vs what's waiting
- **Clean dashboard:** Hide resolved tickets
- **Team metrics:** Track tickets closed per day/week
- **Better UX:** Visual status indicators everywhere

---

## Architecture

### Database Changes

**Update EmailThread Model:**

```javascript
EmailThread {
  // ... existing fields ...
  
  // STATUS FIELD (NEW):
  status: String,  // 'open' | 'in_progress' | 'waiting' | 'resolved'
  
  // STATUS TIMESTAMPS (NEW):
  statusUpdatedAt: Date,    // When status last changed
  resolvedAt: Date,         // When marked resolved
  resolvedBy: String,       // Who marked it resolved
  
  // ... existing fields ...
}
```

**No new collections needed!** Just updating existing EmailThread model.

---

### Status Definitions

**1. OPEN 🆕** - Default for new emails
- Not claimed by anyone yet
- Needs someone to pick it up
- Shows in "Unassigned Tickets"

**2. IN PROGRESS 🔄** - Actively being worked on
- Claimed by a team member
- Being drafted or investigated
- Shows in "My Tickets" for the assignee

**3. WAITING ⏸️** - Waiting on customer
- Reply has been sent
- Ball is in customer's court
- Shows in "Waiting" filter
- When customer replies, auto-changes back to "In Progress"

**4. RESOLVED ✅** - Completed
- Issue is resolved
- No further action needed
- Can be hidden from active views
- Shows in "Resolved" filter or archive

---

## Status Transition Rules

### Automatic Status Updates

**Rule 1: New Email Arrives**
```javascript
status = 'open'
```

**Rule 2: Ticket Gets Claimed**
```javascript
// When user clicks "Claim" or auto-claims
status = 'in_progress'
```

**Rule 3: User Sends Reply**
```javascript
// After reply is sent successfully
status = 'waiting'  // Now waiting on customer
```

**Rule 4: Customer Replies Back**
```javascript
// When new email comes in from same thread
status = 'in_progress'  // Back to being worked on
```

**Rule 5: User Marks Resolved**
```javascript
// Manual action by user
status = 'resolved'
resolvedAt = new Date()
resolvedBy = userId
```

### Manual Status Changes

Users can manually change status via:
- "Mark as Resolved" button
- Status dropdown (future enhancement)
- Reopen ticket (future enhancement)

---

## User Flow

### Scenario 1: Normal Ticket Flow

**Step 1: Email Arrives**
```
Status: OPEN 🆕
Shows in: Unassigned Tickets
Actions: Claim
```

**Step 2: Agent Claims**
```
Status: IN PROGRESS 🔄
Shows in: My Tickets
Actions: Reply, Unclaim, Mark Resolved
```

**Step 3: Agent Replies**
```
Status: WAITING ⏸️
Shows in: My Tickets (Waiting filter)
Actions: Mark Resolved
```

**Step 4: Customer Replies**
```
Status: IN PROGRESS 🔄 (auto-changed)
Shows in: My Tickets
Actions: Reply, Mark Resolved
```

**Step 5: Agent Resolves**
```
Status: RESOLVED ✅
Shows in: Resolved filter (hidden from active)
Actions: Reopen (future)
```

---

### Scenario 2: Quick Resolution (No Waiting)

```
1. Email arrives → OPEN
2. Agent claims → IN PROGRESS
3. Agent resolves immediately → RESOLVED

(Skips WAITING state)
```

---

### Scenario 3: Multi-Reply Thread

```
1. Email → OPEN
2. Claim → IN PROGRESS
3. Reply → WAITING
4. Customer replies → IN PROGRESS
5. Reply again → WAITING
6. Customer replies → IN PROGRESS
7. Final reply → WAITING
8. Mark resolved → RESOLVED
```

---

## Dashboard Integration

### Updated "My Tickets" Page

**Before (Current):**
```
┌─────────────────────────────────────┐
│ My Tickets (5)                      │
├─────────────────────────────────────┤
│ From          Subject       Actions │
├─────────────────────────────────────┤
│ customer@...  Billing       [Reply] │
│ user@...      Login bug     [Reply] │
└─────────────────────────────────────┘
```

**After (With Status):**
```
┌─────────────────────────────────────────────────┐
│ My Tickets (5)                                  │
├─────────────────────────────────────────────────┤
│ Filters: [All: 5] [In Progress: 2] [Waiting: 3]│  ← NEW
├─────────────────────────────────────────────────┤
│ From          Subject       Status     Actions  │
├─────────────────────────────────────────────────┤
│ customer@...  Billing       🔄 Progress  [Reply]│  ← Status badge
│ user@...      Login bug     ⏸️ Waiting   [Resolve]│
└─────────────────────────────────────────────────┘
```

---

### Updated "Unassigned Tickets" Page

**After:**
```
┌─────────────────────────────────────────────────┐
│ Unassigned Tickets (12)                         │
├─────────────────────────────────────────────────┤
│ All tickets here are: 🆕 OPEN                   │  ← Status indicator
├─────────────────────────────────────────────────┤
│ From          Subject            Actions        │
├─────────────────────────────────────────────────┤
│ customer@...  Need help          [Claim]        │
│ user@...      Question           [Claim]        │
└─────────────────────────────────────────────────┘
```

---

### New "All Tickets" Page (Optional)

```
┌──────────────────────────────────────────────────┐
│ All Tickets (47)                                 │
├──────────────────────────────────────────────────┤
│ Status: [Open: 12] [Progress: 8] [Waiting: 15]  │  ← Filter tabs
│         [Resolved: 12]                           │
├──────────────────────────────────────────────────┤
│ Assignee: [All] [Me] [Unassigned] [Others]      │
├──────────────────────────────────────────────────┤
│ From           Subject        Status    Assigned │
├──────────────────────────────────────────────────┤
│ customer@...   Billing        🔄 Progress  You   │
│ user@...       Login          ⏸️ Waiting   You   │
│ admin@...      Feature        🆕 Open     None   │
│ support@...    Bug fix        ✅ Resolved  John  │
└──────────────────────────────────────────────────┘
```

---

## Discord/Slack Integration

### Discord Message Updates

**Before:**
```
📧 New email to support@git-cv.com
👤 Claimed by: john@company.com
From: customer@email.com
Subject: Need help with billing

Message content...

🔗 Click here to reply
```

**After (With Status):**
```
📧 New email to support@git-cv.com
👤 Claimed by: john@company.com
🔄 Status: In Progress                    ← NEW STATUS LINE
From: customer@email.com
Subject: Need help with billing

Message content...

🔗 Click here to reply
```

**Status indicators:**
- 🆕 Open (not claimed)
- 🔄 In Progress (being worked)
- ⏸️ Waiting (replied, awaiting customer)
- ✅ Resolved (completed)

---

## Reply Page Integration

**Update reply page to show and change status:**

```
┌─────────────────────────────────────┐
│ Reply to Email                      │
├─────────────────────────────────────┤
│ 👤 Assigned to you                  │
│ 🔄 Status: In Progress              │  ← Show current status
│                                     │
│ From: customer@email.com            │
│ Subject: Need help                  │
│ ...                                 │
│                                     │
│ [Send Reply]  [Mark as Resolved]    │  ← Resolve button
└─────────────────────────────────────┘
```

**After replying:**
```
Status automatically changes: In Progress → Waiting
```

**Manual resolve:**
```
Click "Mark as Resolved" → Status changes to Resolved
```

---

## API Endpoints

### 1. Update Status (Manual)

**Endpoint:** `POST /api/emails/update-status`

**Request:**
```json
{
  "threadId": "507f1f77bcf86cd799439011",
  "status": "resolved"
}
```

**Response:**
```json
{
  "success": true,
  "thread": {
    "id": "507f1f77bcf86cd799439011",
    "status": "resolved",
    "statusUpdatedAt": "2026-02-16T15:30:00.000Z",
    "resolvedAt": "2026-02-16T15:30:00.000Z",
    "resolvedBy": "user_abc123"
  }
}
```

---

### 2. Get Tickets by Status

**Endpoint:** `GET /api/emails/tickets/by-status?status=waiting`

**Query params:**
- `status` - Filter by status (open, in_progress, waiting, resolved)
- `assignedTo` - Filter by assignee (optional)

**Response:**
```json
{
  "tickets": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "from": "customer@email.com",
      "subject": "Billing issue",
      "status": "waiting",
      "assignedToEmail": "john@company.com",
      "receivedAt": "2026-02-16T11:00:00.000Z",
      "statusUpdatedAt": "2026-02-16T12:00:00.000Z"
    }
  ],
  "count": 15
}
```

---

### 3. Get Status Counts

**Endpoint:** `GET /api/emails/tickets/status-counts`

**Response:**
```json
{
  "counts": {
    "open": 12,
    "in_progress": 8,
    "waiting": 15,
    "resolved": 12
  },
  "total": 47
}
```

---

## Auto-Status Update Logic

### In Claim API

```javascript
// app/api/emails/claim/route.ts
await EmailThread.findByIdAndUpdate(threadId, {
  assignedTo: userId,
  assignedToEmail: userEmail,
  assignedToName: userName,
  claimedAt: new Date(),
  status: 'in_progress',           // NEW: Auto-set status
  statusUpdatedAt: new Date()      // NEW: Track when changed
});
```

---

### In Reply API

```javascript
// app/api/emails/reply/route.ts

// After email sent successfully
await EmailThread.findByIdAndUpdate(threadId, {
  status: 'waiting',               // NEW: Auto-set to waiting
  statusUpdatedAt: new Date(),     // NEW: Track change
  repliedAt: new Date()
});
```

---

### In Webhook (New Email)

```javascript
// app/api/webhooks/resend/route.ts

// When creating new EmailThread
const emailThread = await EmailThread.create({
  // ... other fields ...
  status: 'open',                  // NEW: Default status
  statusUpdatedAt: new Date()      // NEW: Initial timestamp
});
```

---

## Status Badge Components

### StatusBadge Component

**File:** `components/StatusBadge.tsx`

```typescript
interface StatusBadgeProps {
  status: 'open' | 'in_progress' | 'waiting' | 'resolved';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const badges = {
    open: {
      icon: '🆕',
      label: 'Open',
      className: 'bg-yellow-100 text-yellow-800'
    },
    in_progress: {
      icon: '🔄',
      label: 'In Progress',
      className: 'bg-blue-100 text-blue-800'
    },
    waiting: {
      icon: '⏸️',
      label: 'Waiting',
      className: 'bg-purple-100 text-purple-800'
    },
    resolved: {
      icon: '✅',
      label: 'Resolved',
      className: 'bg-green-100 text-green-800'
    }
  };
  
  const badge = badges[status];
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${badge.className}`}>
      {badge.icon} {badge.label}
    </span>
  );
}
```

---

## Testing Plan

### Test 1: Auto-Status on Claim

**Steps:**
1. Find unassigned ticket (status = 'open')
2. Click "Claim"
3. Check database

**Expected:**
- Status changed from 'open' to 'in_progress'
- statusUpdatedAt set to now

---

### Test 2: Auto-Status on Reply

**Steps:**
1. Find ticket with status = 'in_progress'
2. Send a reply
3. Check database

**Expected:**
- Status changed from 'in_progress' to 'waiting'
- statusUpdatedAt updated
- repliedAt set

---

### Test 3: Manual Mark as Resolved

**Steps:**
1. Go to any ticket
2. Click "Mark as Resolved" button
3. Check database

**Expected:**
- Status = 'resolved'
- resolvedAt = now
- resolvedBy = current userId

---

### Test 4: Status Filters

**Steps:**
1. Go to "My Tickets"
2. Click "Waiting" filter tab
3. Should only show tickets with status = 'waiting'
4. Click "In Progress" filter
5. Should only show status = 'in_progress'

**Expected:**
- Filters work correctly
- Counts match actual tickets

---

### Test 5: Status Persistence

**Steps:**
1. Change status to 'resolved'
2. Refresh page
3. Status should still be 'resolved'

**Expected:**
- Status persists across refreshes

---

## Success Metrics

**Adoption:**
- 90% of completed tickets marked as resolved
- 80% of tickets have correct status at any time

**Visibility:**
- Managers can see open ticket count 24/7
- Team knows what needs attention vs what's waiting

**Efficiency:**
- 50% reduction in "what's the status?" questions
- 30% faster ticket completion (clear priorities)

**Quality:**
- Zero tickets stuck in wrong status
- 100% of resolved tickets properly archived

---

## Implementation Priority

### Must Have (MVP)

1. **Status field in database** - Core functionality
2. **Auto-status updates** - On claim, reply, new email
3. **Status badges in UI** - Visual indicators
4. **Filter by status** - In My Tickets page
5. **Mark as Resolved** - Manual action

### Should Have

6. **Status counts** - Dashboard metrics
7. **Discord status updates** - Show in notifications
8. **Reply page status** - Show and change status

### Nice to Have (Future)

9. **Reopen ticket** - Change resolved back to open
10. **Status history** - Track all status changes
11. **Custom statuses** - Let teams define their own

---

## Timeline

### Fast Track (2-3 days)
```
Day 1: Database + Backend (6 hours)
- Update EmailThread model
- Auto-status updates in claim/reply/webhook
- Mark as resolved API

Day 2: Dashboard UI (6 hours)
- Status badge component
- Filter tabs
- Update ticket lists

Day 3: Testing + Polish (4 hours)
- End-to-end testing
- Discord integration
- Bug fixes
```

### Complete Track (4-5 days)
```
Day 1-2: Backend (8 hours)
- All database changes
- All auto-updates
- All APIs

Day 3: Dashboard (6 hours)
- Components
- Filters
- Badges

Day 4: Integrations (4 hours)
- Discord updates
- Reply page updates
- Status counts

Day 5: Testing (6 hours)
- Full testing
- Documentation
- Deployment
```

---

## File Structure

```
app/
├── api/
│   └── emails/
│       ├── update-status/
│       │   └── route.ts (POST - manual status change)
│       ├── tickets/
│       │   ├── by-status/
│       │   │   └── route.ts (GET - filter by status)
│       │   └── status-counts/
│       │       └── route.ts (GET - get status counts)
│       ├── claim/
│       │   └── route.ts (UPDATE - add auto-status)
│       └── reply/
│           └── route.ts (UPDATE - add auto-status)
│
├── models/
│   └── EmailThreadModel.ts (UPDATE - add status fields)
│
└── webhooks/
    └── resend/
        └── route.ts (UPDATE - set initial status)

components/
├── StatusBadge.tsx (NEW - status indicator)
├── MarkResolvedButton.tsx (NEW - resolve action)
├── StatusFilter.tsx (NEW - filter tabs)
└── tickets/
    └── TicketsList.tsx (UPDATE - show status)

app/dashboard/tickets/
├── mine/
│   └── page.tsx (UPDATE - add status filters)
└── unassigned/
    └── page.tsx (UPDATE - show open status)
```

---

## Edge Cases

**Case 1:** Ticket is resolved but customer replies
- **Handling:** Auto-change from 'resolved' to 'in_progress'
- **Notification:** Alert assigned person

**Case 2:** Multiple people try to resolve same ticket
- **Handling:** First one wins, store who resolved
- **Result:** resolvedBy tracks who did it

**Case 3:** Unclaim a ticket
- **Handling:** Status stays same (don't change to 'open')
- **Reason:** Status is about work progress, not assignment

**Case 4:** Reply fails but status changed
- **Handling:** Only change status AFTER email sends successfully
- **Code:** Put status update after email send confirmation

---

## Future Enhancements

**Phase 3:**
- Reopen resolved tickets
- Status change history log
- Status-based SLA tracking
- Auto-resolve after X days in waiting

**Phase 4:**
- Custom status definitions per team
- Status-based automation rules
- Status in email subject line
- Bulk status changes

---

**Ready to build! See task.md for step-by-step implementation.**