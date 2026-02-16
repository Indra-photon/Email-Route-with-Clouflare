# Feature 2.2: Ticket Assignment (Claim) - Implementation Plan

**Goal:** Enable team members to claim/assign tickets to prevent duplicate work and dropped tickets

**Time Estimate:** 3-4 days  
**Priority:** CRITICAL - Required for multi-person support workflow

---

## Overview

### Current Problem

```
Email arrives → Everyone sees it in Discord/Slack
    ↓
Nobody knows who's handling it
    ↓
Result: Either 3 people reply (duplicate work)
        OR nobody replies (dropped ticket)
```

### Solution Flow

```
Email arrives → Discord notification sent
    ↓
Team member clicks "Claim" 
    ↓
Database updated: assignedTo = userId
    ↓
Discord shows: "👤 Claimed by @username"
    ↓
Everyone knows it's being handled
    ↓
Team member replies
    ↓
Auto-updates: status = "in_progress"
    ↓
Zero duplicate work! Zero dropped tickets! ✅
```

---

## Why Ticket Assignment?

**Problem it solves:**
- **Duplicate work:** Multiple people replying to same ticket
- **Dropped tickets:** Nobody taking ownership
- **No accountability:** Can't track who's doing what
- **Manager chaos:** Can't see team workload distribution

**Benefits:**
- **Zero duplicate responses** (down from 15%)
- **Zero dropped tickets** (down from 10%)
- **Clear ownership** of every ticket
- **Workload visibility** for managers
- **Auto-assignment** on reply (saves clicks)

---

## Architecture

### Database Changes

**Update EmailThread Model:**

```javascript
EmailThread {
  // ... existing fields ...
  
  // NEW ASSIGNMENT FIELDS:
  assignedTo: String,           // Clerk userId who claimed it
  assignedToEmail: String,      // Email for display
  assignedToName: String,       // Display name
  claimedAt: Date,             // When it was claimed
  
  // ... existing fields ...
}
```

**No new collections needed!** Just updating existing EmailThread model.

---

## User Flow (Team Member Side)

### Scenario 1: Claim Before Reply

**Dashboard View:**

```
┌─────────────────────────────────────────────────┐
│ 📥 Unassigned Tickets (12)                      │
├─────────────────────────────────────────────────┤
│ From                 Subject          Actions   │
├─────────────────────────────────────────────────┤
│ mike@startup.com    Payment failed   [Claim]    │
│ lisa@corp.com       API question     [Claim]    │
│ john@acme.com       Login issue      [Claim]    │
└─────────────────────────────────────────────────┘
```

**After clicking "Claim":**

```
┌─────────────────────────────────────────────────┐
│ 📧 My Tickets (1)                                │
├─────────────────────────────────────────────────┤
│ From                 Subject          Actions   │
├─────────────────────────────────────────────────┤
│ mike@startup.com    Payment failed   [Reply]    │
│                                      [Unclaim]  │
└─────────────────────────────────────────────────┘
```

---

### Scenario 2: Auto-Claim on Reply

**User clicks "Reply" from Discord:**

```
1. User clicks "🔗 Click here to reply"
2. Reply page loads
3. User types response
4. User clicks "Send Reply"
    ↓
5. Backend checks: Is ticket claimed?
    ↓
6. If NO: Auto-assign to current user
    ↓
7. Email sent + ticket claimed automatically
```

**No need to click both "Claim" AND "Reply"** - replying auto-claims!

---

### Scenario 3: Unclaim/Reassign

**Use cases:**
- Claimed wrong ticket by mistake
- Team member goes on vacation
- Need to redistribute workload
- Escalate to senior team member

**Action:**

```
┌─────────────────────────────────────────────────┐
│ 📧 Ticket Details                                │
├─────────────────────────────────────────────────┤
│ From: customer@email.com                         │
│ Subject: Billing issue                          │
│ Claimed by: You                                 │
│ Claimed at: 2 hours ago                         │
│                                                 │
│ [Reply]  [Unclaim]                              │
└─────────────────────────────────────────────────┘
```

**After unclaim:**
- assignedTo = null
- Ticket back in "Unassigned" pool
- Available for anyone to claim

---

## Discord/Slack Integration

### Before Claiming

```
┌────────────────────────────────────────────┐
│ 📧 New email to support@git-cv.com         │
│ From: customer@email.com                   │
│ Subject: Need help with billing            │
│                                            │
│ Hi, I need help with my invoice...         │
│                                            │
│ 🔗 Click here to reply                     │
└────────────────────────────────────────────┘
```

### After Claiming

```
┌────────────────────────────────────────────┐
│ 📧 New email to support@git-cv.com         │
│ 👤 Claimed by: indranil@email.com          │ ← NEW
│ From: customer@email.com                   │
│ Subject: Need help with billing            │
│                                            │
│ Hi, I need help with my invoice...         │
│                                            │
│ 🔗 Click here to reply                     │
└────────────────────────────────────────────┘
```

**Note:** Discord doesn't support interactive buttons like Slack, so we show claim status in the message text. The actual claiming happens in the web dashboard.

---

## Dashboard Pages

### Page 1: My Tickets

**URL:** `/dashboard/tickets/mine`

**Shows:**
- All tickets assigned to current user
- Filter by status (Open/In Progress/Waiting/Resolved)
- Quick reply button
- Unclaim option

**Purpose:** See MY workload at a glance

---

### Page 2: All Tickets

**URL:** `/dashboard/tickets`

**Shows:**
- All tickets (assigned + unassigned)
- Filter by assignee
- Filter by status
- Claim button for unassigned tickets

**Purpose:** Team-wide view of all work

---

### Page 3: Unassigned Tickets

**URL:** `/dashboard/tickets/unassigned`

**Shows:**
- Only tickets with NO assignee
- Big "Claim" button
- Sorted by received date (oldest first)

**Purpose:** Pick up new work quickly

---

## API Endpoints

### 1. Claim Ticket

**Endpoint:** `POST /api/emails/claim`

**Request:**
```json
{
  "threadId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "assignedTo": "user_2abc123",
  "assignedToEmail": "john@company.com",
  "assignedToName": "John Smith",
  "claimedAt": "2026-02-16T12:00:00.000Z"
}
```

**What it does:**
1. Get current user from Clerk auth
2. Update EmailThread with assignedTo fields
3. Return success

---

### 2. Unclaim Ticket

**Endpoint:** `POST /api/emails/unclaim`

**Request:**
```json
{
  "threadId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ticket unclaimed successfully"
}
```

**What it does:**
1. Verify current user owns this ticket
2. Set assignedTo = null
3. Return success

---

### 3. Get My Tickets

**Endpoint:** `GET /api/emails/tickets/mine`

**Response:**
```json
{
  "tickets": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "from": "customer@email.com",
      "subject": "Billing issue",
      "status": "open",
      "assignedToEmail": "john@company.com",
      "claimedAt": "2026-02-16T12:00:00.000Z",
      "receivedAt": "2026-02-16T11:00:00.000Z"
    }
  ]
}
```

---

### 4. Get Unassigned Tickets

**Endpoint:** `GET /api/emails/tickets/unassigned`

**Response:**
```json
{
  "tickets": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "from": "customer2@email.com",
      "subject": "Login problem",
      "status": "open",
      "assignedTo": null,
      "receivedAt": "2026-02-16T10:00:00.000Z"
    }
  ]
}
```

---

## Implementation Phases

### Phase 1: Database & Backend (Day 1)

- ✅ Update EmailThread model schema
- ✅ Create claim API endpoint
- ✅ Create unclaim API endpoint
- ✅ Update reply API for auto-claim
- ✅ Create "my tickets" API
- ✅ Create "unassigned tickets" API

---

### Phase 2: Dashboard UI (Day 2-3)

- ✅ Create "My Tickets" page
- ✅ Create "All Tickets" page
- ✅ Create "Unassigned Tickets" page
- ✅ Build ClaimButton component
- ✅ Build UnclaimButton component
- ✅ Build TicketsList component
- ✅ Add filters (status, assignee)

---

### Phase 3: Discord Integration (Day 3)

- ✅ Update webhook to show claimed status
- ✅ Format message with assignee name
- ✅ Test Discord notifications

---

### Phase 4: Testing & Polish (Day 4)

- ✅ Test claim/unclaim flow
- ✅ Test auto-claim on reply
- ✅ Test dashboard filters
- ✅ Test with multiple users
- ✅ Error handling
- ✅ Loading states

---

## File Structure

```
app/
├── api/
│   └── emails/
│       ├── claim/
│       │   └── route.ts (POST - claim ticket)
│       ├── unclaim/
│       │   └── route.ts (POST - unclaim ticket)
│       ├── tickets/
│       │   ├── mine/
│       │   │   └── route.ts (GET - my tickets)
│       │   └── unassigned/
│       │       └── route.ts (GET - unassigned tickets)
│       └── reply/
│           └── route.ts (UPDATE - add auto-claim logic)
│
├── dashboard/
│   └── tickets/
│       ├── page.tsx (All tickets)
│       ├── mine/
│       │   └── page.tsx (My tickets)
│       └── unassigned/
│           └── page.tsx (Unassigned tickets)
│
└── models/
    └── EmailThreadModel.ts (UPDATE - add assignment fields)

components/
├── tickets/
│   ├── TicketsList.tsx (Reusable table)
│   ├── ClaimButton.tsx (Claim action)
│   ├── UnclaimButton.tsx (Unclaim action)
│   └── TicketFilters.tsx (Status/assignee filters)
└── ReplyForm.tsx (UPDATE - show claimed status)
```

---

## Security Considerations

**Authorization Rules:**

1. **Claim:** Any authenticated user can claim any unassigned ticket
2. **Unclaim:** Only the assigned user OR admin can unclaim
3. **View My Tickets:** Users only see their own tickets
4. **View All Tickets:** All users can see all tickets (team visibility)

**Implementation:**

```javascript
// In unclaim API
const thread = await EmailThread.findById(threadId);
const { userId } = await auth();

// Check if current user owns this ticket
if (thread.assignedTo !== userId) {
  return NextResponse.json(
    { error: "You can only unclaim your own tickets" },
    { status: 403 }
  );
}
```

---

## Success Metrics

**Adoption:**
- 80% of tickets claimed within 5 minutes
- 100% of replied tickets have an assignee
- 90% of team uses claim feature

**Quality:**
- Zero duplicate responses (currently 15%)
- Zero dropped tickets (currently 10%)
- 100% of tickets have clear owner

**Efficiency:**
- Managers spend 50% less time asking "who's handling what?"
- Team handles 30% more tickets (no duplicate work)

---

## Testing Plan

### Test 1: Claim Flow

**Steps:**
1. Login as user
2. Go to /dashboard/tickets/unassigned
3. See unassigned ticket
4. Click "Claim"
5. Check it moves to "My Tickets"
6. Check assignedTo field in database

**Expected:**
- ✅ Ticket assigned to current user
- ✅ Shows in "My Tickets"
- ✅ Removed from "Unassigned"
- ✅ Discord message updated

---

### Test 2: Auto-Claim on Reply

**Steps:**
1. Click reply link from Discord
2. Type response
3. Click "Send Reply"
4. Check database

**Expected:**
- ✅ Email sent
- ✅ assignedTo = current user (auto-set)
- ✅ claimedAt = now
- ✅ Shows in "My Tickets"

---

### Test 3: Unclaim Flow

**Steps:**
1. Go to "My Tickets"
2. Click "Unclaim" on a ticket
3. Confirm action
4. Check ticket moved to "Unassigned"

**Expected:**
- ✅ assignedTo = null
- ✅ Ticket in "Unassigned" list
- ✅ Available for others to claim

---

### Test 4: Multi-User

**Steps:**
1. User A claims ticket
2. User B tries to claim same ticket
3. Check only User A sees it in "My Tickets"

**Expected:**
- ✅ Only one user can claim
- ✅ Other users see it as "Claimed by User A"
- ✅ Cannot double-claim

---

## Edge Cases

**Scenario 1:** User claims ticket, then logs out before replying
- **Solution:** Unclaim button available, or auto-unclaim after 24 hours

**Scenario 2:** Two users click "Claim" simultaneously
- **Solution:** Database handles race condition, first write wins

**Scenario 3:** User goes on vacation with 10 claimed tickets
- **Solution:** Admin can bulk unclaim, or add "Reassign" feature

**Scenario 4:** Reply API fails after claiming
- **Solution:** Ticket stays claimed, user can retry reply

---

## Future Enhancements

**Phase 3 (Later):**
- Bulk claim/unclaim
- Auto-reassign inactive tickets
- Assign to specific team member (not just self)
- Team member permissions
- Claim limits (max 10 tickets per person)
- Slack interactive buttons (claim from Slack)

---

## Questions & Decisions

**Q1:** Should we allow claiming tickets that are already claimed?
**A:** No - prevents confusion. Must unclaim first.

**Q2:** Auto-unclaim after X hours of inactivity?
**A:** Not in MVP - add later if needed.

**Q3:** Claim limit per user?
**A:** Not in MVP - can add later if abuse happens.

**Q4:** Show assignee name or email in Discord?
**A:** Email - more recognizable for small teams.

---

## Environment Variables

No new environment variables needed! Uses existing:
- `MONGODB_URI` - Database connection
- Clerk auth (already configured)

---

## Deployment Notes

**Database Migration:**
- EmailThread model updated (backward compatible)
- Existing threads will have assignedTo = null
- No data migration needed

**Backward Compatibility:**
- ✅ Old emails without assignedTo still work
- ✅ Reply API works with/without assignment
- ✅ No breaking changes

---

## Documentation Updates

**User Documentation:**
- How to claim tickets
- How to see your workload
- How to unclaim/reassign

**Admin Documentation:**
- Understanding team dashboard
- Workload distribution
- Handling edge cases

---

**Ready to build! See task.md for step-by-step implementation.**