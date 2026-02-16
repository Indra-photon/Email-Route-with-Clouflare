# Feature 2.2: Ticket Assignment - Completion Task List

**Goal:** Complete the remaining 9 tasks to finish ticket assignment feature  
**Time:** 4-6 hours  
**Status:** 59% complete (13/22 done), need to finish last 41%

---

## ✅ Already Completed (13/22 tasks)

- ✅ Day 1: All backend APIs (6/6 tasks)
- ✅ Day 2: All UI components (5/5 tasks)
- ✅ Day 3: Loading states & error handling (2/6 tasks)

---

## 🔨 Remaining Tasks (9 tasks)

### Day 3 Completion: Integration & Polish (4 tasks)

**Status:** Need to finish 4 more tasks

---

### Task 3.1: Add Navigation Links
**Time:** 30 minutes  
**Priority:** ⭐⭐⭐⭐⭐ CRITICAL  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Find navigation/sidebar component in codebase
- [ ] Look for files like:
  - `app/dashboard/layout.tsx`
  - `components/Sidebar.tsx`
  - `components/Navigation.tsx`  
  - `components/DashboardNav.tsx`
- [ ] Add two new navigation links:
  - "My Tickets" → `/dashboard/tickets/mine`
  - "Unassigned" → `/dashboard/tickets/unassigned`
- [ ] Add icons (📧 for My Tickets, 📥 for Unassigned)
- [ ] Add active state highlighting
- [ ] Test navigation works
- [ ] See **Plan → Part 2: Navigation Links**

**How to find navigation component:**
```bash
# Search for navigation-related files
find app -name "*layout*" -o -name "*nav*" -o -name "*sidebar*"

# Or search for existing nav links like "Domains"
grep -r "Domains" app/dashboard --include="*.tsx"
```

**Expected structure:**
```typescript
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'My Tickets', href: '/dashboard/tickets/mine', icon: '📧' },     // NEW
  { name: 'Unassigned', href: '/dashboard/tickets/unassigned', icon: '📥' }, // NEW
  { name: 'Domains', href: '/dashboard/domains', icon: '🌐' },
  // ... other links
];
```

**Result:** Users can navigate to ticket pages from sidebar

---

### Task 3.2: Update Discord Notification Message  
**Time:** 1 hour  
**Priority:** ⭐⭐⭐⭐ HIGH  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open file: `app/api/webhooks/resend/route.ts`
- [ ] Find where `emailThread` is created (line ~165-180)
- [ ] Find where Discord message is formatted (line ~195-210)
- [ ] After creating EmailThread, add claim check
- [ ] Add claim status line to Discord message IF claimed
- [ ] Test with new incoming email
- [ ] See **Plan → Part 1: Discord Integration**

**Where to add code:**

```typescript
// After saving email to database (around line 180)
const emailThread = await EmailThread.create({
  workspaceId: alias.workspaceId,
  aliasId: alias._id,
  // ... other fields
});

// NEW CODE - Check if claimed
let claimStatus = "";
if (emailThread.assignedTo && emailThread.assignedToEmail) {
  claimStatus = `👤 **Claimed by:** ${emailThread.assignedToEmail}\n`;
}

// Update Discord message format (around line 205)
const messagePayload = integration.type === "slack"
  ? {
      text: `📧 New email to *${emailLower}*\n${claimStatus}*From:* ${fromEmail}\n*Subject:* ${subject}\n\n${snippet}\n\n🔗 [Click here to reply](${replyUrl})`,
    }
  : {
      content: `📧 **New email to ${emailLower}**
${claimStatus}**From:** ${fromEmail}
**Subject:** ${subject}

${snippet}

🔗 [Click here to reply](${replyUrl})`,
    };
```

**Important Notes:**
- New incoming emails are NEVER pre-claimed
- This will only show claim status IF somehow the emailThread has assignedTo
- In practice, this will rarely show for NEW emails
- But it's good to have for consistency

**Alternative Approach (More Complex):**
If you want to show if PREVIOUS emails from same sender are claimed:
- Look up previous threads from same sender
- Check their claim status
- Show in notification
- **Skip this for now** - not in original plan

**Result:** Discord shows "👤 Claimed by: email" if ticket is claimed

---

### Task 3.3: Update Reply Page to Show Claim Status
**Time:** 45 minutes  
**Priority:** ⭐⭐⭐ MEDIUM  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open file: `app/reply/[threadId]/page.tsx`
- [ ] Find where thread data is displayed (around line 60-90)
- [ ] Get current userId from Clerk auth
- [ ] Add claim status component ABOVE email content
- [ ] Show different messages based on claim status:
  - Not claimed: "⚠️ Not claimed yet"
  - Claimed by you: "👤 Assigned to you"
  - Claimed by other: "👤 Assigned to: {name}"
- [ ] Style with background colors
- [ ] Test with claimed and unclaimed tickets
- [ ] See **Plan → Part 3: Update Reply Page**

**Where to add code:**

```typescript
// At the top of the component, after auth
const { userId } = await auth();

// After fetching thread data
const thread = result.thread;

// Determine claim status UI
let claimStatusBadge = null;

if (!thread.assignedTo) {
  // Unclaimed
  claimStatusBadge = (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
      <div className="flex items-center gap-2">
        <span className="text-yellow-800 font-medium">⚠️ Not claimed yet</span>
      </div>
      <p className="text-xs text-yellow-700 mt-1">
        This ticket hasn't been assigned to anyone
      </p>
    </div>
  );
} else if (thread.assignedTo === userId) {
  // Claimed by current user
  claimStatusBadge = (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
      <div className="flex items-center gap-2">
        <span className="text-blue-800 font-medium">👤 Assigned to you</span>
      </div>
      <p className="text-xs text-blue-700 mt-1">
        Claimed {new Date(thread.claimedAt).toLocaleString()}
      </p>
    </div>
  );
} else {
  // Claimed by someone else
  claimStatusBadge = (
    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 mb-6">
      <div className="flex items-center gap-2">
        <span className="text-neutral-800 font-medium">
          👤 Assigned to: {thread.assignedToName || thread.assignedToEmail}
        </span>
      </div>
      <p className="text-xs text-neutral-600 mt-1">
        Claimed {new Date(thread.claimedAt).toLocaleString()}
      </p>
    </div>
  );
}

// Render it above the email content
return (
  <div>
    {claimStatusBadge}  {/* NEW - Add this */}
    
    {/* Existing email content */}
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2>Original Email</h2>
      ...
    </div>
  </div>
);
```

**Result:** Reply page shows who (if anyone) claimed the ticket

---

### Task 3.4: Quick Smoke Test
**Time:** 15 minutes  
**Priority:** ⭐⭐⭐⭐⭐ CRITICAL  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Restart dev server
- [ ] Login to dashboard
- [ ] Check navigation links appear
- [ ] Click "My Tickets" - should load
- [ ] Click "Unassigned" - should load
- [ ] Try claiming a ticket
- [ ] Try unclaiming a ticket
- [ ] Send test email - check Discord
- [ ] Fix any obvious bugs

**Quick checks:**
- ✅ Navigation links visible?
- ✅ Pages load without errors?
- ✅ Claim button works?
- ✅ Unclaim button works?
- ✅ Discord message looks right?

**If any errors:**
- Check browser console
- Check terminal logs
- Fix syntax errors
- Retry

**Result:** Basic functionality works, no crashes

---

## Day 4: Testing & Documentation (5 tasks)

### Task 4.1: Test Claim Flow (End-to-End)
**Time:** 30 minutes  
**Priority:** ⭐⭐⭐⭐⭐ CRITICAL  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Login to dashboard
- [ ] Navigate to "Unassigned Tickets"
- [ ] Verify you see unassigned tickets in the list
- [ ] Click "Claim" on a ticket
- [ ] Wait for success toast notification
- [ ] Navigate to "My Tickets"
- [ ] Verify the claimed ticket now appears there
- [ ] Refresh the page - ticket still there
- [ ] Check "Unassigned Tickets" - ticket gone from there
- [ ] Check MongoDB (optional) - verify assignedTo field set
- [ ] Document any issues found
- [ ] See **Plan → Part 4: Testing → Test 1**

**How to check database (optional):**
```bash
# Connect to MongoDB
# Find the ticket
db.emailthreads.findOne({ _id: ObjectId("YOUR_TICKET_ID") })

# Should show:
# assignedTo: "user_xyz123"
# assignedToEmail: "your@email.com"
# assignedToName: "Your Name"
# claimedAt: ISODate("2026-02-16...")
```

**Success criteria:**
- ✅ Ticket moves from "Unassigned" to "My Tickets"
- ✅ Toast notification shows
- ✅ Refresh doesn't break it
- ✅ Database updated correctly

**If it fails:**
- Check browser console for errors
- Check network tab for API errors
- Check terminal for backend errors
- Fix and retry

**Result:** Claim flow works end-to-end

---

### Task 4.2: Test Unclaim Flow (End-to-End)
**Time:** 20 minutes  
**Priority:** ⭐⭐⭐⭐ HIGH  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Go to "My Tickets"
- [ ] Find a claimed ticket (or claim one first if empty)
- [ ] Click "Unclaim" button
- [ ] Confirm in the dialog popup
- [ ] Wait for success toast
- [ ] Verify ticket removed from "My Tickets"
- [ ] Navigate to "Unassigned Tickets"
- [ ] Verify ticket now appears there
- [ ] Refresh both pages - changes persist
- [ ] Check database (optional) - assignedTo should be null
- [ ] See **Plan → Part 4: Testing → Test 2**

**Success criteria:**
- ✅ Confirmation dialog appears
- ✅ Ticket moves from "My Tickets" to "Unassigned"
- ✅ Toast notification shows
- ✅ Changes persist after refresh
- ✅ Database updated (assignedTo = null)

**Result:** Unclaim flow works end-to-end

---

### Task 4.3: Test Auto-Claim on Reply
**Time:** 30 minutes  
**Priority:** ⭐⭐⭐⭐⭐ CRITICAL  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Go to "Unassigned Tickets"
- [ ] Find a ticket (or send yourself a test email to create one)
- [ ] Note the ticket ID or subject
- [ ] Click "View" to go to reply page
- [ ] Type a test reply (e.g., "Testing auto-claim")
- [ ] Click "Send Reply"
- [ ] Wait for success message
- [ ] Navigate to "My Tickets"
- [ ] Verify the ticket NOW appears in "My Tickets"
- [ ] Check it's no longer in "Unassigned Tickets"
- [ ] Verify email was actually sent (check inbox if using real email)
- [ ] See **Plan → Part 4: Testing → Test 3**

**Success criteria:**
- ✅ Email sends successfully
- ✅ Ticket auto-assigned to you
- ✅ Appears in "My Tickets" immediately
- ✅ Removed from "Unassigned"
- ✅ Actual email delivered

**Alternative test (if no tickets):**
1. Send a test email to your alias email
2. Check Discord - should get notification
3. Click "Click here to reply" link
4. Reply to it
5. Check "My Tickets" - should auto-appear

**Result:** Auto-claim on reply works correctly

---

### Task 4.4: Test Edge Cases
**Time:** 45 minutes  
**Priority:** ⭐⭐⭐⭐ HIGH  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Test 1: Try claiming already-claimed ticket
  - User A claims ticket
  - User B tries to claim same ticket
  - Should show error: "Already claimed"
- [ ] Test 2: Try unclaiming someone else's ticket
  - User A claims ticket
  - User B tries to unclaim via different account
  - Should show error: "Can only unclaim your own"
- [ ] Test 3: Try claiming with no auth
  - Logout
  - Try to access API directly
  - Should show 401 Unauthorized
- [ ] Test 4: Refresh pages multiple times
  - Claim/unclaim tickets
  - Refresh pages
  - Data should persist correctly
- [ ] Test 5: Test with 0 tickets
  - Clear all tickets or use fresh account
  - Both pages should show empty states
  - Empty states should be user-friendly
- [ ] See **Plan → Part 4: Testing → Test 5**

**How to test with multiple users:**

**Option 1:** Use incognito window
- Main browser: User A (signed in)
- Incognito: User B (sign in with different account)

**Option 2:** Different browsers
- Chrome: User A
- Firefox: User B

**Option 3:** Just test API directly
```bash
# Try to claim ticket that's already claimed
curl -X POST http://localhost:3000/api/emails/claim \
  -H "Content-Type: application/json" \
  -d '{"threadId": "already_claimed_ticket_id"}'
  
# Should return error
```

**Success criteria:**
- ✅ Can't double-claim tickets
- ✅ Can't unclaim others' tickets
- ✅ Auth is required
- ✅ Refreshing pages works
- ✅ Empty states look good

**Result:** All edge cases handled correctly

---

### Task 4.5: Write Documentation (Optional)
**Time:** 1 hour  
**Priority:** ⭐⭐ LOW  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create file: `docs/TICKET_ASSIGNMENT.md` or add to README
- [ ] Write user guide section
- [ ] Add section: "What is Ticket Assignment?"
- [ ] Add section: "How to Claim a Ticket"
- [ ] Add section: "How to View Your Tickets"
- [ ] Add section: "How to Unclaim a Ticket"
- [ ] Add section: "Auto-Claim on Reply"
- [ ] Add FAQ section
- [ ] Take screenshots (optional)
- [ ] Add developer notes (API endpoints, database schema)
- [ ] See **Plan → Part 5: Documentation**

**User guide template:**

```markdown
# Ticket Assignment

## What is Ticket Assignment?

Ticket assignment lets you "claim" support tickets so your team knows who's handling what. This prevents:
- Duplicate work (two people replying to same ticket)
- Dropped tickets (nobody taking ownership)
- Confusion about workload

## How to Use

### Viewing Tickets

**My Tickets:** See all tickets assigned to you
- Click "My Tickets" in the sidebar
- Shows tickets you've claimed or auto-claimed

**Unassigned Tickets:** See tickets waiting to be claimed
- Click "Unassigned" in the sidebar
- Shows tickets nobody has claimed yet

### Claiming Tickets

1. Go to "Unassigned Tickets"
2. Find a ticket you want to handle
3. Click "Claim"
4. Ticket moves to "My Tickets"

### Unclaiming Tickets

1. Go to "My Tickets"
2. Find the ticket
3. Click "Unclaim"
4. Confirm in dialog
5. Ticket returns to "Unassigned"

### Auto-Claim

When you reply to any ticket, it automatically gets assigned to you. No need to manually claim first!

## FAQ

**Q: What if I claim by mistake?**
A: Just click "Unclaim" to release it back

**Q: Can I see all team tickets?**
A: Currently shows only yours and unassigned. "All Tickets" view coming soon!

**Q: What if someone claims my ticket?**
A: Only the person who claimed can unclaim. Contact them or admin.
```

**Developer documentation:**

```markdown
## For Developers

### API Endpoints

POST /api/emails/claim
POST /api/emails/unclaim  
GET /api/emails/tickets/mine
GET /api/emails/tickets/unassigned

### Database Schema

EmailThread {
  assignedTo?: string        // Clerk userId
  assignedToEmail?: string   // Display email
  assignedToName?: string    // Display name
  claimedAt?: Date          // Timestamp
}
```

**Result:** Feature is documented for users and developers

---

## Quick Reference

### Files Modified

**Day 3 Completion:**
1. Navigation component (find and update)
2. `app/api/webhooks/resend/route.ts` - Discord integration
3. `app/reply/[threadId]/page.tsx` - Show claim status

**Day 4:**
4. No files - just testing
5. `docs/TICKET_ASSIGNMENT.md` or README (optional)

### Total New Files: 0
### Total Edited Files: 3

---

## Testing Checklist

Before marking feature as complete, verify:

**Functionality:**
- [ ] Can navigate to ticket pages from sidebar
- [ ] Can claim unassigned tickets
- [ ] Can unclaim my tickets
- [ ] Auto-claim works when replying
- [ ] "My Tickets" shows correct tickets
- [ ] "Unassigned" shows correct tickets

**Edge Cases:**
- [ ] Can't claim already-claimed ticket
- [ ] Can't unclaim someone else's ticket
- [ ] Auth required for all actions
- [ ] Pages handle 0 tickets gracefully
- [ ] Refresh doesn't break anything

**UI/UX:**
- [ ] Navigation links are visible
- [ ] Loading states show properly
- [ ] Error messages are clear
- [ ] Toast notifications work
- [ ] Dialogs are user-friendly

**Optional:**
- [ ] Discord shows claim status (if implemented)
- [ ] Reply page shows claim status (if implemented)
- [ ] Documentation complete (if implemented)

---

## Completion Criteria

Feature is **DONE** when:

**Minimum (Fast Track):**
- ✅ Navigation links added
- ✅ Basic claim/unclaim tests pass
- ✅ No critical bugs found

**Recommended (Complete):**
- ✅ Navigation links added
- ✅ Discord integration done
- ✅ Reply page updated
- ✅ All tests pass
- ✅ Edge cases handled

**Full (Production Ready):**
- ✅ All of the above
- ✅ Documentation written
- ✅ Screenshots added
- ✅ README updated

---

## Estimated Time by Track

### Fast Track (Minimum)
```
Task 3.1: Navigation links (30 min)
Task 3.4: Smoke test (15 min)
Task 4.1: Test claim (30 min)
Task 4.2: Test unclaim (20 min)
Task 4.3: Test auto-claim (30 min)

Total: 2 hours 5 minutes
```

### Recommended Track
```
Task 3.1: Navigation links (30 min)
Task 3.2: Discord integration (1 hour)
Task 3.3: Reply page (45 min)
Task 3.4: Smoke test (15 min)
Task 4.1: Test claim (30 min)
Task 4.2: Test unclaim (20 min)
Task 4.3: Test auto-claim (30 min)
Task 4.4: Edge cases (45 min)

Total: 4 hours 35 minutes
```

### Full Track
```
All recommended tasks +
Task 4.5: Documentation (1 hour)

Total: 5 hours 35 minutes
```

---

## Troubleshooting

### Issue: Can't find navigation component
**Solution:** 
```bash
# Search for existing nav items
grep -r "Domains" app --include="*.tsx"
grep -r "navigation" app --include="*.tsx"

# Check common locations
ls app/dashboard/layout.tsx
ls components/*nav*.tsx
ls components/*sidebar*.tsx
```

### Issue: Discord integration breaks webhook
**Solution:**
- Test thoroughly before deploying
- Keep backup of original code
- Make sure syntax is correct
- Check Discord actually receives messages

### Issue: Tests fail
**Solution:**
- Check browser console
- Check network tab
- Check terminal logs
- Fix one issue at a time
- Restart dev server

---

**Start with Task 3.1 and work through sequentially!** 🚀