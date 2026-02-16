# Feature 2.2: Ticket Assignment - Completion Plan

**Goal:** Finish the remaining integration, polish, and testing for ticket assignment feature

**Time Estimate:** 1-1.5 days  
**Priority:** HIGH - Complete existing feature before moving to next

---

## Current Status

### ✅ COMPLETED (59% - 13/22 tasks)

**Day 1: Database & Backend** ✅ 100% COMPLETE
- All API endpoints working
- Database schema updated
- Auto-claim on reply implemented

**Day 2: Dashboard UI** ✅ 100% COMPLETE
- All components built
- Pages functional
- Error handling in place

**Day 3: Integration & Polish** ⚠️ 40% COMPLETE
- Loading states ✅ DONE
- Error handling ✅ DONE
- Discord integration ❌ MISSING
- Navigation links ❌ MISSING
- Reply page updates ⚠️ PARTIAL

**Day 4: Testing & Documentation** ❌ 0% COMPLETE
- No testing done yet
- No documentation written

---

## What Still Needs to Be Done

### Critical Path (Must Have)

```
1. Discord Integration (1 hour)
   └─ Show "👤 Claimed by: email" in notifications
   
2. Navigation Links (30 min)
   └─ Add nav items to access ticket pages
   
3. Testing (2-3 hours)
   └─ Verify everything works end-to-end
```

### Nice to Have (Optional)

```
4. Update Reply Page (45 min)
   └─ Show claim status on reply screen
   
5. Documentation (1 hour)
   └─ User guide with screenshots
```

**Total Time:** 4-6 hours to completion

---

## Part 1: Discord Integration

### Problem

Currently, Discord notifications look like this:

```
📧 New email to support@git-cv.com
From: customer@email.com
Subject: Need help with billing

Message content here...

🔗 Click here to reply
```

**Missing:** No indication of who (if anyone) claimed the ticket

### Solution

Update Discord messages to show claim status:

```
📧 New email to support@git-cv.com
👤 Claimed by: john@company.com          ← NEW LINE
From: customer@email.com
Subject: Need help with billing

Message content here...

🔗 Click here to reply
```

### When to Show Claim Status

**Show claim info when:**
- Email is assigned to someone (assignedTo field exists)

**Don't show claim info when:**
- Email is unassigned (assignedTo is null)

### Technical Implementation

**File to edit:** `app/api/webhooks/resend/route.ts`

**Where to add code:**
After saving EmailThread, before formatting Discord message

**Logic:**
1. After creating EmailThread
2. Check if `emailThread.assignedTo` exists
3. If yes, add line to Discord message: `👤 Claimed by: {assignedToEmail}`
4. If no, don't add the line

**Example Code:**

```javascript
// After saving email to database
const emailThread = await EmailThread.create({ ... });

// Check if ticket is claimed
let claimStatus = "";
if (emailThread.assignedTo && emailThread.assignedToEmail) {
  claimStatus = `👤 Claimed by: ${emailThread.assignedToEmail}\n`;
}

// Format Discord message with claim status
const messagePayload = {
  content: `📧 **New email to ${emailLower}**
${claimStatus}**From:** ${fromEmail}
**Subject:** ${subject}

${snippet}

🔗 [Click here to reply](${replyUrl})`,
};
```

### Edge Cases

**Case 1:** New email arrives (not claimed yet)
- Don't show claim status
- Shows standard Discord message

**Case 2:** Email arrives and auto-claimed via reply
- This won't happen for NEW emails
- Only REPLIES auto-claim
- So new emails are never pre-claimed

**Case 3:** User manually claimed from dashboard
- Database has assignedTo field
- Next email from same thread won't show old claim
- Each EmailThread is independent

**Note:** This shows claim status for the EMAIL THREAD being saved, not related threads. Since this is the webhook for RECEIVING new emails, tickets won't be pre-claimed.

### Alternative Approach

**If we want to show claim status on existing threads:**

We'd need to:
1. Check if there's a previous thread from same sender
2. Look up that thread's claim status
3. Show it in the notification

But this is NOT in the current plan - each email is independent.

---

## Part 2: Navigation Links

### Problem

Users can't easily access ticket pages because there are no nav links.

**Current navigation:**
- Dashboard
- Domains
- Integrations
- Aliases

**Missing:**
- My Tickets
- Unassigned Tickets

### Solution

Add navigation links in the dashboard sidebar.

### Where to Add Links

**Option 1: Main Sidebar** (Recommended)
- Add between "Dashboard" and "Domains"
- Use dropdown or flat list

**Option 2: Top Navigation**
- Add tabs in header

**Option 3: Dashboard Cards**
- Add cards on main dashboard page

**Recommended:** Option 1 - Main Sidebar

### Navigation Structure

```
📊 Dashboard
├─ 📧 My Tickets         ← NEW
├─ 📥 Unassigned        ← NEW
├─ 🌐 Domains
├─ 🔗 Integrations
└─ 📮 Aliases
```

Or with grouping:

```
📊 Dashboard

Tickets
├─ 📧 My Tickets         ← NEW
└─ 📥 Unassigned        ← NEW

Settings
├─ 🌐 Domains
├─ 🔗 Integrations
└─ 📮 Aliases
```

### Technical Implementation

**Files to check/edit:**

Common navigation patterns in Next.js:
1. `app/dashboard/layout.tsx` - Dashboard layout with sidebar
2. `components/Sidebar.tsx` or `components/Navigation.tsx` - Nav component
3. `app/dashboard/page.tsx` - Dashboard home page

**What to do:**
1. Find where navigation links are defined
2. Add new links for tickets pages
3. Add active state styling
4. Test navigation works

**Example Code:**

```typescript
// In navigation component
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'My Tickets', href: '/dashboard/tickets/mine', icon: '📧' },
  { name: 'Unassigned', href: '/dashboard/tickets/unassigned', icon: '📥' },
  { name: 'Domains', href: '/dashboard/domains', icon: '🌐' },
  { name: 'Integrations', href: '/dashboard/integrations', icon: '🔗' },
  { name: 'Aliases', href: '/dashboard/aliases', icon: '📮' },
];
```

### Active State

Highlight the current page in navigation:

```typescript
// Check if current page matches link
const isActive = pathname === item.href;

// Apply active styling
className={isActive ? 'bg-primary text-white' : 'text-gray-700'}
```

---

## Part 3: Update Reply Page (Optional)

### Problem

When viewing a reply page, users can't see if the ticket is claimed or who claimed it.

### Solution

Add claim status indicator at the top of the reply page.

### UI Design

**If ticket is unclaimed:**
```
┌─────────────────────────────────────┐
│ Reply to Email                       │
├─────────────────────────────────────┤
│ ⚠️ Not claimed yet                   │
│                                     │
│ From: customer@email.com            │
│ Subject: Need help                  │
│ ...                                 │
└─────────────────────────────────────┘
```

**If claimed by you:**
```
┌─────────────────────────────────────┐
│ Reply to Email                       │
├─────────────────────────────────────┤
│ 👤 Assigned to you                   │
│ Claimed: 2 hours ago                │
│                                     │
│ From: customer@email.com            │
│ ...                                 │
└─────────────────────────────────────┘
```

**If claimed by someone else:**
```
┌─────────────────────────────────────┐
│ Reply to Email                       │
├─────────────────────────────────────┤
│ 👤 Assigned to: john@company.com     │
│ Claimed: 5 hours ago                │
│                                     │
│ From: customer@email.com            │
│ ...                                 │
└─────────────────────────────────────┘
```

### Technical Implementation

**File to edit:** `app/reply/[threadId]/page.tsx`

**Where to add:**
After fetching thread data, before the reply form

**Logic:**
1. Thread data already has `assignedTo`, `assignedToEmail`, `assignedToName`, `claimedAt`
2. Check current userId from Clerk
3. Compare to thread.assignedTo
4. Show appropriate message

**Example Code:**

```typescript
// Get current user
const { userId } = await auth();

// After fetching thread
const thread = result.thread;

// Determine claim status
let claimStatusUI;
if (!thread.assignedTo) {
  claimStatusUI = (
    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
      <span className="text-yellow-800">⚠️ Not claimed yet</span>
    </div>
  );
} else if (thread.assignedTo === userId) {
  claimStatusUI = (
    <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
      <div className="text-blue-800">👤 Assigned to you</div>
      <div className="text-xs text-blue-600 mt-1">
        Claimed {new Date(thread.claimedAt).toLocaleString()}
      </div>
    </div>
  );
} else {
  claimStatusUI = (
    <div className="bg-neutral-50 border border-neutral-200 rounded p-3 mb-4">
      <div className="text-neutral-800">
        👤 Assigned to: {thread.assignedToName || thread.assignedToEmail}
      </div>
      <div className="text-xs text-neutral-600 mt-1">
        Claimed {new Date(thread.claimedAt).toLocaleString()}
      </div>
    </div>
  );
}

// Render above the email content
<div>
  {claimStatusUI}
  <div className="original-email">...</div>
</div>
```

---

## Part 4: Testing

### Test 1: Claim Flow

**Steps:**
1. Login to dashboard
2. Navigate to "Unassigned Tickets" (via URL or nav link if added)
3. See list of unassigned tickets
4. Click "Claim" on a ticket
5. Wait for success toast
6. Click "My Tickets" link
7. Verify ticket appears in "My Tickets"

**Expected Results:**
- ✅ Ticket appears in "My Tickets"
- ✅ Removed from "Unassigned Tickets"
- ✅ Database shows assignedTo = current userId
- ✅ claimedAt timestamp is set

**How to verify database:**
```javascript
// In MongoDB or via API
db.emailthreads.findOne({ _id: ObjectId("...") })
// Should show:
// assignedTo: "user_xyz123"
// assignedToEmail: "your@email.com"
// claimedAt: ISODate("2026-02-16...")
```

---

### Test 2: Unclaim Flow

**Steps:**
1. Go to "My Tickets"
2. Find a claimed ticket
3. Click "Unclaim"
4. Confirm in dialog
5. Wait for success toast
6. Verify ticket removed from "My Tickets"
7. Go to "Unassigned Tickets"
8. Verify ticket appears there

**Expected Results:**
- ✅ Ticket removed from "My Tickets"
- ✅ Appears in "Unassigned Tickets"
- ✅ Database shows assignedTo = null

---

### Test 3: Auto-Claim on Reply

**Steps:**
1. Find an unassigned ticket (check database or "Unassigned Tickets" page)
2. Copy the thread ID
3. Go to `/reply/[threadId]`
4. Type a reply
5. Click "Send Reply"
6. Wait for success message
7. Go to "My Tickets"
8. Verify the ticket now appears there

**Expected Results:**
- ✅ Email sent successfully
- ✅ Ticket auto-assigned to you
- ✅ Appears in "My Tickets"
- ✅ Database updated with assignedTo

---

### Test 4: Discord Integration (If Implemented)

**Steps:**
1. Send a test email to your alias
2. Check Discord channel
3. Look for claim status line

**For NEW emails:**
- ✅ Should NOT show claim status (new emails aren't pre-claimed)

**For EXISTING claimed threads:**
- This test doesn't apply - new emails create new threads

**Alternative test:**
1. Claim a ticket manually
2. Database now has assignedTo
3. Send ANOTHER email (creates new thread)
4. New thread is independent - won't show claimed

**Note:** Discord integration shows claim status of the CURRENT EmailThread being saved, which for new incoming emails is always unclaimed initially.

---

### Test 5: Edge Cases

**Test 5a: Double Claim**
1. Open ticket in two browser tabs
2. Click "Claim" in both tabs simultaneously
3. Expected: Only one succeeds, other shows error "Already claimed"

**Test 5b: Unclaim Someone Else's Ticket**
1. User A claims ticket
2. User B tries to unclaim it via API
3. Expected: Error "You can only unclaim your own tickets"

**Test 5c: Claim Already Claimed Ticket**
1. User A claims ticket
2. User B tries to claim same ticket
3. Expected: Error "Already claimed by User A"

**Test 5d: Reply to Already Claimed Ticket**
1. User A claims ticket
2. User B replies to same ticket
3. Expected: Email sends, but ticket stays assigned to User A (doesn't reassign)

---

## Part 5: Documentation (Optional)

### User Documentation

Create a simple guide: `docs/TICKET_ASSIGNMENT.md`

**Sections:**

1. **What is Ticket Assignment?**
   - Prevents duplicate work
   - Shows who's handling what
   - Auto-assigns when you reply

2. **How to Claim a Ticket**
   - Step-by-step with screenshots
   - Navigate to "Unassigned Tickets"
   - Click "Claim"

3. **How to View Your Tickets**
   - Go to "My Tickets"
   - See all tickets assigned to you

4. **How to Unclaim a Ticket**
   - When to unclaim
   - Click "Unclaim" button
   - Confirm action

5. **Auto-Claim on Reply**
   - Replying auto-assigns ticket to you
   - No need to manually claim first

6. **FAQ**
   - What happens if I claim by mistake?
   - Can I see all team tickets?
   - What if someone claims my ticket?

### Developer Documentation

Update README with API endpoints:

**API Endpoints:**
```
POST /api/emails/claim
POST /api/emails/unclaim
GET  /api/emails/tickets/mine
GET  /api/emails/tickets/unassigned
```

**Database Schema:**
```javascript
EmailThread {
  assignedTo: String,
  assignedToEmail: String,
  assignedToName: String,
  claimedAt: Date
}
```

---

## Implementation Priority

### Must Have (Ship-Blocking)

1. **Navigation Links** - Without these, users can't access the feature
   - Priority: ⭐⭐⭐⭐⭐ CRITICAL
   - Time: 30 minutes
   - Impact: HIGH

2. **Testing** - Verify nothing is broken
   - Priority: ⭐⭐⭐⭐⭐ CRITICAL
   - Time: 2-3 hours
   - Impact: HIGH

### Should Have (Important)

3. **Discord Integration** - Shows claim status in notifications
   - Priority: ⭐⭐⭐⭐ HIGH
   - Time: 1 hour
   - Impact: MEDIUM

### Nice to Have (Can Do Later)

4. **Reply Page Updates** - Shows claim status when replying
   - Priority: ⭐⭐⭐ MEDIUM
   - Time: 45 minutes
   - Impact: LOW

5. **Documentation** - User guide and dev docs
   - Priority: ⭐⭐ LOW
   - Time: 1 hour
   - Impact: LOW

---

## Timeline to Completion

### Fast Track (Minimum Viable)
**Time:** 2.5-3.5 hours

```
1. Add Navigation Links (30 min)
2. Test Core Flows (2-3 hours)
3. Ship it! ✅
```

**Skip:** Discord integration, reply page updates, documentation  
**Result:** Fully functional but missing polish

---

### Recommended Track (Complete Feature)
**Time:** 4.5-6.5 hours

```
1. Add Navigation Links (30 min)
2. Discord Integration (1 hour)
3. Test Everything (2-3 hours)
4. Update Reply Page (45 min)
5. Ship it! ✅
```

**Skip:** Documentation (do later)  
**Result:** Feature complete with all polish

---

### Full Track (Production Ready)
**Time:** 5.5-7.5 hours

```
1. Add Navigation Links (30 min)
2. Discord Integration (1 hour)
3. Update Reply Page (45 min)
4. Test Everything (2-3 hours)
5. Write Documentation (1 hour)
6. Ship it! ✅
```

**Result:** Fully polished and documented

---

## Success Criteria

✅ Feature is COMPLETE when:

**Functionality:**
- [ ] Users can navigate to ticket pages from dashboard
- [ ] Claim/unclaim works without errors
- [ ] Auto-claim on reply works
- [ ] My Tickets shows correct tickets
- [ ] Unassigned shows correct tickets

**Polish:**
- [ ] Discord shows claim status (optional)
- [ ] Reply page shows claim status (optional)
- [ ] Navigation is intuitive

**Quality:**
- [ ] All tests pass
- [ ] No duplicate claims possible
- [ ] Error messages are clear
- [ ] Loading states work

**Documentation:**
- [ ] README updated (optional)
- [ ] User guide created (optional)

---

## Risk Assessment

### Low Risk
- ✅ Navigation links - Simple addition
- ✅ Testing - Just verification

### Medium Risk
- ⚠️ Discord integration - Need to not break existing webhook
- ⚠️ Reply page updates - Need to handle auth properly

### High Risk
- None! Core functionality already works

---

**Ready to finish this feature! See task.md for step-by-step instructions.**