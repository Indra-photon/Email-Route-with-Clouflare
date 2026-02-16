# Feature 2.2: Ticket Assignment - Task List

**Goal:** Build ticket claiming/assignment system to prevent duplicate work and dropped tickets  
**Time:** 3-4 days  
**Plan:** See `ticket-assignment-plan.md` for architecture details

---

## Day 1: Database & Backend APIs (6 tasks)

### Task 1.1: Update EmailThread Model
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open file: `app/api/models/EmailThreadModel.ts`
- [ ] Add to interface `IEmailThread`:
  - `assignedTo?: string` (Clerk userId)
  - `assignedToEmail?: string` (display email)
  - `assignedToName?: string` (display name)
  - `claimedAt?: Date` (when claimed)
- [ ] Add fields to Mongoose schema with optional: true
- [ ] Save file
- [ ] See **Plan → Database Changes**

**Result:** EmailThread model supports assignment

**Example:**
```typescript
export interface IEmailThread extends Document {
  // ... existing fields ...
  assignedTo?: string;
  assignedToEmail?: string;
  assignedToName?: string;
  claimedAt?: Date;
  // ... existing fields ...
}
```

---

### Task 1.2: Create Claim API Endpoint
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create file: `app/api/emails/claim/route.ts`
- [ ] Import dependencies: auth (Clerk), dbConnect, EmailThread
- [ ] Create POST handler
- [ ] Get userId from Clerk auth
- [ ] Get user email and name from Clerk
- [ ] Get threadId from request body
- [ ] Validate threadId exists
- [ ] Check if ticket is already claimed
- [ ] Update EmailThread with assignment fields
- [ ] Return success response
- [ ] Add error handling
- [ ] See **Plan → API Endpoints → Claim**

**Result:** POST /api/emails/claim works

**Example:**
```typescript
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const { threadId } = await request.json();
  
  await dbConnect();
  
  const thread = await EmailThread.findById(threadId);
  if (!thread) return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  
  if (thread.assignedTo) {
    return NextResponse.json({ error: "Already claimed" }, { status: 400 });
  }
  
  // Get user details from Clerk
  const user = await clerkClient.users.getUser(userId);
  
  await EmailThread.findByIdAndUpdate(threadId, {
    assignedTo: userId,
    assignedToEmail: user.emailAddresses[0].emailAddress,
    assignedToName: user.firstName + " " + user.lastName,
    claimedAt: new Date()
  });
  
  return NextResponse.json({ success: true });
}
```

---

### Task 1.3: Create Unclaim API Endpoint
**Time:** 45 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create file: `app/api/emails/unclaim/route.ts`
- [ ] Import dependencies
- [ ] Create POST handler
- [ ] Get userId from Clerk auth
- [ ] Get threadId from request body
- [ ] Find ticket in database
- [ ] Check if current user owns this ticket
- [ ] Set assignedTo fields to null
- [ ] Return success
- [ ] See **Plan → API Endpoints → Unclaim**

**Result:** POST /api/emails/unclaim works

**Security:** Only ticket owner can unclaim their own tickets

---

### Task 1.4: Update Reply API for Auto-Claim
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open file: `app/api/emails/reply/route.ts`
- [ ] Find where email is sent successfully
- [ ] Add auto-claim logic AFTER email sent
- [ ] Check if thread.assignedTo is null
- [ ] If null, update with current user
- [ ] If already assigned, do nothing
- [ ] See **Plan → User Flow → Auto-Claim**

**Result:** Replying to unclaimed ticket auto-assigns it

**Example:**
```typescript
// After email sent successfully
if (!thread.assignedTo) {
  const user = await clerkClient.users.getUser(userId);
  await EmailThread.findByIdAndUpdate(threadId, {
    assignedTo: userId,
    assignedToEmail: user.emailAddresses[0].emailAddress,
    assignedToName: user.firstName + " " + user.lastName,
    claimedAt: new Date()
  });
}
```

---

### Task 1.5: Create "My Tickets" API
**Time:** 45 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create file: `app/api/emails/tickets/mine/route.ts`
- [ ] Create GET handler
- [ ] Get userId from Clerk auth
- [ ] Get workspace for user
- [ ] Find all EmailThreads where assignedTo = userId
- [ ] Sort by receivedAt (newest first)
- [ ] Include: from, subject, status, claimedAt, receivedAt
- [ ] Return array of tickets
- [ ] See **Plan → API Endpoints → Get My Tickets**

**Result:** GET /api/emails/tickets/mine returns user's tickets

---

### Task 1.6: Create "Unassigned Tickets" API
**Time:** 45 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create file: `app/api/emails/tickets/unassigned/route.ts`
- [ ] Create GET handler
- [ ] Get workspace for current user
- [ ] Find all EmailThreads where assignedTo = null
- [ ] Only include direction = "inbound"
- [ ] Sort by receivedAt (oldest first = highest priority)
- [ ] Return array of tickets
- [ ] See **Plan → API Endpoints → Get Unassigned**

**Result:** GET /api/emails/tickets/unassigned returns unclaimed tickets

---

## Day 2: Dashboard UI Components (5 tasks)

### Task 2.1: Create ClaimButton Component
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create file: `components/tickets/ClaimButton.tsx`
- [ ] Make it a client component ("use client")
- [ ] Accept props: threadId, onSuccess callback
- [ ] Create claim handler calling POST /api/emails/claim
- [ ] Show loading state while claiming
- [ ] Show success/error toast messages
- [ ] Disable button while loading
- [ ] Call onSuccess after successful claim
- [ ] Style with Tailwind

**Result:** Reusable claim button component

**Example:**
```typescript
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ClaimButton({ 
  threadId, 
  onSuccess 
}: { 
  threadId: string; 
  onSuccess: () => void;
}) {
  const [claiming, setClaiming] = useState(false);
  
  const handleClaim = async () => {
    setClaiming(true);
    try {
      const res = await fetch("/api/emails/claim", {
        method: "POST",
        body: JSON.stringify({ threadId })
      });
      if (!res.ok) throw new Error("Failed to claim");
      onSuccess();
    } catch (err) {
      alert("Error claiming ticket");
    } finally {
      setClaiming(false);
    }
  };
  
  return (
    <Button onClick={handleClaim} disabled={claiming}>
      {claiming ? "Claiming..." : "Claim"}
    </Button>
  );
}
```

---

### Task 2.2: Create UnclaimButton Component
**Time:** 45 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create file: `components/tickets/UnclaimButton.tsx`
- [ ] Similar structure to ClaimButton
- [ ] Call POST /api/emails/unclaim
- [ ] Add confirmation dialog before unclaim
- [ ] Show loading state
- [ ] Handle errors

**Result:** Reusable unclaim button

---

### Task 2.3: Create TicketsList Component
**Time:** 2 hours  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create file: `components/tickets/TicketsList.tsx`
- [ ] Accept props: tickets array, showClaimButton, showUnclaimButton
- [ ] Create table with columns:
  - From (email)
  - Subject
  - Received (time ago)
  - Status
  - Actions (Claim/Unclaim/Reply buttons)
- [ ] Use ClaimButton component
- [ ] Use UnclaimButton component
- [ ] Add Reply link to /reply/[threadId]
- [ ] Style with Tailwind
- [ ] Make responsive for mobile
- [ ] Show empty state if no tickets

**Result:** Reusable ticket list table

**Columns:**
- From: customer@email.com
- Subject: Need help with billing
- Received: 2 hours ago
- Status: Open
- Actions: [Claim] [Reply]

---

### Task 2.4: Create "My Tickets" Page
**Time:** 1.5 hours  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create file: `app/dashboard/tickets/mine/page.tsx`
- [ ] Make it server component
- [ ] Fetch data from GET /api/emails/tickets/mine
- [ ] Pass data to TicketsList component
- [ ] Set showUnclaimButton = true
- [ ] Add page title: "My Tickets"
- [ ] Show count: "My Tickets (5)"
- [ ] Add refresh button
- [ ] Handle empty state: "No tickets assigned to you"
- [ ] See **Plan → Dashboard Pages → My Tickets**

**Result:** /dashboard/tickets/mine shows user's tickets

---

### Task 2.5: Create "Unassigned Tickets" Page
**Time:** 1.5 hours  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create file: `app/dashboard/tickets/unassigned/page.tsx`
- [ ] Fetch from GET /api/emails/tickets/unassigned
- [ ] Pass to TicketsList component
- [ ] Set showClaimButton = true
- [ ] Add page title: "Unassigned Tickets"
- [ ] Show count: "Unassigned Tickets (12)"
- [ ] Sort by oldest first (FIFO)
- [ ] Add refresh button
- [ ] Empty state: "All tickets are assigned! 🎉"

**Result:** /dashboard/tickets/unassigned shows claimable tickets

---

## Day 3: Integration & Polish (6 tasks)

### Task 3.1: Update Discord Notification Message
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open file: `app/api/webhooks/resend/route.ts`
- [ ] Find where Discord message is created
- [ ] After saving EmailThread, check if thread.assignedTo exists
- [ ] If assigned, add line: "👤 Claimed by: {email}"
- [ ] If not assigned, don't show claim status
- [ ] Test with assigned and unassigned tickets
- [ ] See **Plan → Discord Integration**

**Result:** Discord shows who claimed each ticket

**Before:**
```
📧 New email to support@git-cv.com
From: customer@email.com
Subject: Need help
```

**After:**
```
📧 New email to support@git-cv.com
👤 Claimed by: john@company.com
From: customer@email.com
Subject: Need help
```

---

### Task 3.2: Add Navigation Links
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open dashboard layout or navigation component
- [ ] Add link: "My Tickets" → /dashboard/tickets/mine
- [ ] Add link: "Unassigned" → /dashboard/tickets/unassigned
- [ ] Style as active when on current page
- [ ] Add icons (📧 for My Tickets, 📥 for Unassigned)

**Result:** Easy navigation to ticket pages

---

### Task 3.3: Update Reply Page to Show Claim Status
**Time:** 45 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open file: `app/reply/[threadId]/page.tsx`
- [ ] After fetching thread data
- [ ] Show claim status in UI:
  - If assignedTo = current user: "👤 Assigned to you"
  - If assignedTo = other user: "👤 Assigned to {name}"
  - If not assigned: "⚠️ Not claimed yet"
- [ ] Add styling
- [ ] Position near email subject

**Result:** Reply page shows ownership

---

### Task 3.4: Add Loading States
**Time:** 45 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Add loading spinners to all buttons
- [ ] Add skeleton loaders to ticket lists
- [ ] Show "Loading..." text while fetching
- [ ] Disable buttons during API calls
- [ ] Use consistent loading UI across all pages

**Result:** Better UX during async operations

---

### Task 3.5: Add Error Handling
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Wrap all API calls in try/catch
- [ ] Show user-friendly error messages
- [ ] Handle specific errors:
  - Already claimed → "This ticket was just claimed by someone else"
  - Not found → "Ticket not found"
  - Unauthorized → "Please log in"
- [ ] Add error toast notifications
- [ ] Log errors to console for debugging

**Result:** Graceful error handling

---

### Task 3.6: Add "All Tickets" Page (Optional)
**Time:** 1 hour  
**Status:** 📋 Optional

**What to do:**
- [ ] Create file: `app/dashboard/tickets/page.tsx`
- [ ] Fetch ALL tickets (assigned + unassigned)
- [ ] Show filters:
  - All / Mine / Unassigned
  - Open / In Progress / Resolved
- [ ] Use TicketsList component
- [ ] Add search by sender email
- [ ] Show assignee name in list

**Result:** Team-wide view of all tickets

---

## Day 4: Testing & Documentation (5 tasks)

### Task 4.1: Test Claim Flow
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Login to dashboard
- [ ] Go to "Unassigned Tickets"
- [ ] Click "Claim" on a ticket
- [ ] Verify it moves to "My Tickets"
- [ ] Check database: assignedTo field populated
- [ ] Check Discord: shows claimed status
- [ ] Test with multiple users if possible

**Result:** Claim flow works end-to-end

---

### Task 4.2: Test Auto-Claim on Reply
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Find unassigned ticket
- [ ] Click "Reply" link
- [ ] Send reply
- [ ] Check database: assignedTo auto-set
- [ ] Check "My Tickets": ticket appears
- [ ] Verify email was sent

**Result:** Auto-claim works

---

### Task 4.3: Test Unclaim Flow
**Time:** 20 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Claim a ticket
- [ ] Go to "My Tickets"
- [ ] Click "Unclaim"
- [ ] Confirm action
- [ ] Verify ticket in "Unassigned"
- [ ] Check database: assignedTo = null

**Result:** Unclaim works

---

### Task 4.4: Test Edge Cases
**Time:** 45 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Try claiming already-claimed ticket → Should error
- [ ] Try unclaiming someone else's ticket → Should error
- [ ] Try claiming with no auth → Should error
- [ ] Try claiming invalid threadId → Should error
- [ ] Refresh pages multiple times → Should work
- [ ] Test with 0 tickets → Empty states work

**Result:** Edge cases handled

---

### Task 4.5: Write Documentation
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create user guide: How to claim tickets
- [ ] Document keyboard shortcuts (if any)
- [ ] Update README with new features
- [ ] Add screenshots to docs
- [ ] Document API endpoints for developers

**Result:** Feature documented

---

## Quick Reference

### Files to Create (11 files)

**Backend APIs (6 files):**
1. `app/api/emails/claim/route.ts`
2. `app/api/emails/unclaim/route.ts`
3. `app/api/emails/tickets/mine/route.ts`
4. `app/api/emails/tickets/unassigned/route.ts`

**Components (3 files):**
5. `components/tickets/ClaimButton.tsx`
6. `components/tickets/UnclaimButton.tsx`
7. `components/tickets/TicketsList.tsx`

**Pages (3 files):**
8. `app/dashboard/tickets/mine/page.tsx`
9. `app/dashboard/tickets/unassigned/page.tsx`
10. `app/dashboard/tickets/page.tsx` (optional)

**Optional:**
11. Navigation component updates

### Files to Edit (3 files)

1. `app/api/models/EmailThreadModel.ts` - Add assignment fields
2. `app/api/emails/reply/route.ts` - Add auto-claim logic
3. `app/api/webhooks/resend/route.ts` - Show claim status in Discord

---

## Success Criteria

✅ Feature is done when:
- [ ] EmailThread model has assignment fields
- [ ] Can claim tickets via API
- [ ] Can unclaim tickets via API
- [ ] Auto-claim works on reply
- [ ] "My Tickets" page shows assigned tickets
- [ ] "Unassigned" page shows claimable tickets
- [ ] Discord shows claim status
- [ ] All tests pass
- [ ] No duplicate work happening
- [ ] Documentation complete

---

## Environment Variables

No new environment variables needed!

Uses existing:
- `MONGODB_URI` - Database
- Clerk auth (already configured)

---

## Daily Schedule

### Day 1 (6 hours)
```
Morning (3 hours):
- Task 1.1: Update EmailThread model (30min)
- Task 1.2: Create claim API (1h)
- Task 1.3: Create unclaim API (45min)
- Break (15min)
- Task 1.4: Update reply API (45min)

Afternoon (3 hours):
- Task 1.5: My tickets API (45min)
- Task 1.6: Unassigned tickets API (45min)
- Testing backend APIs (1.5h)
```

### Day 2 (6 hours)
```
Morning (3 hours):
- Task 2.1: ClaimButton component (1h)
- Task 2.2: UnclaimButton component (45min)
- Task 2.3: TicketsList component (2h start)

Afternoon (3 hours):
- Task 2.3: TicketsList component (finish)
- Task 2.4: My Tickets page (1.5h)
- Task 2.5: Unassigned page (1.5h)
```

### Day 3 (6 hours)
```
Morning (3 hours):
- Task 3.1: Discord integration (1h)
- Task 3.2: Navigation links (30min)
- Task 3.3: Reply page updates (45min)
- Task 3.4: Loading states (45min)

Afternoon (3 hours):
- Task 3.5: Error handling (1h)
- Task 3.6: All tickets page (1h, optional)
- Integration testing (1h)
```

### Day 4 (4 hours)
```
Morning (2 hours):
- Task 4.1: Test claim flow (30min)
- Task 4.2: Test auto-claim (30min)
- Task 4.3: Test unclaim (20min)
- Task 4.4: Edge cases (40min)

Afternoon (2 hours):
- Task 4.5: Documentation (1h)
- Final testing (1h)
- Deploy to production
```

---

## Troubleshooting

### Issue: Claim button doesn't work
**Check:**
- Is user logged in? (Clerk auth)
- Is threadId correct?
- Check browser console for errors
- Check API response

### Issue: Ticket doesn't show in "My Tickets"
**Check:**
- Is assignedTo = userId? (check database)
- Refresh the page
- Check API is returning correct data

### Issue: Auto-claim not working
**Check:**
- Is reply API being called?
- Check logs after sending reply
- Verify database updated
- Check condition: if (!thread.assignedTo)

---

**Let's build ticket assignment! Start with Day 1, Task 1.1** 🚀