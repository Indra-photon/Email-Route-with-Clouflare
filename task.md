# Admin-Managed Receiving Verification - Task List

**Goal:** Build admin panel for manual receiving verification  
**Time:** 3-4 days  
**Plan:** See `ADMIN_RECEIVING_VERIFICATION_PLAN.md` for details

---

## Day 1: Database & User Flow (8 tasks)

### Task 1.1: Create ReceivingRequest Model
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create file: `app/api/models/ReceivingRequestModel.ts`
- [ ] Define interface `IReceivingRequest`
- [ ] Create Mongoose schema with fields:
  - `domainId` (ObjectId, required)
  - `workspaceId` (ObjectId, required)
  - `requestedBy` (String - user email)
  - `status` (enum: pending/approved/rejected)
  - `requestedAt` (Date)
  - `reviewedAt` (Date, nullable)
  - `reviewedBy` (String - admin email)
  - `rejectionReason` (String, nullable)
  - `mxRecords` (Array of objects)
  - `notes` (String)
- [ ] Export model
- [ ] See **Plan → Database Changes** for schema

**Result:** New model for tracking requests

---

### Task 1.2: Update Domain Model
**Time:** 15 minutes  
**Status:** ✅ Done (partially)

**What to do:**
- [ ] Open: `app/api/models/DomainModel.ts`
- [ ] Add fields to interface:
  - `receivingRequestId?: ObjectId`
  - `receivingMxRecords?: Array<MxRecord>`
- [ ] Add fields to schema:
  - `receivingRequestId` (ObjectId, ref: 'ReceivingRequest')
  - `receivingMxRecords` (Array)
- [ ] Save file
- [ ] See **Plan → Database Changes**

**Result:** Domain model tracks receiving status

---

### Task 1.3: Create User Request API
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create: `app/api/receiving-requests/route.ts`
- [ ] Implement POST handler
- [ ] Check user authentication
- [ ] Validate domainId
- [ ] Check domain exists and verified for sending
- [ ] Check if request already exists (prevent duplicates)
- [ ] Create ReceivingRequest document
- [ ] Update domain.receivingRequestId
- [ ] Return success response
- [ ] See **Plan → API Endpoints → Request Receiving Access**

**Result:** User can request receiving

---

### Task 1.4: Create Get Status API
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create: `app/api/receiving-requests/[domainId]/route.ts`
- [ ] Implement GET handler
- [ ] Check user authentication
- [ ] Find request by domainId
- [ ] Return status, dates, MX records if approved
- [ ] See **Plan → API Endpoints → Get Status**

**Result:** User can check request status

---

### Task 1.5: Create Request Button Component
**Time:** 45 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create: `components/ReceivingRequestButton.tsx`
- [ ] Add button with loading state
- [ ] Call `/api/receiving-requests` on click
- [ ] Handle success/error states
- [ ] Show confirmation message
- [ ] Disable if already requested
- [ ] See **Plan → User Flow → Step 1**

**Result:** Reusable request button

---

### Task 1.6: Update Verification Page
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open: `app/dashboard/domains/[id]/verify/page.tsx`
- [ ] Fetch receiving request status on load
- [ ] Show different UI based on status:
  - Not requested: Show request button
  - Pending: Show "Awaiting approval" message
  - Approved: Show MX records table
  - Rejected: Show rejection reason
- [ ] Add `<ReceivingRequestButton />` component
- [ ] Style according to design
- [ ] See **Plan → User Flow**

**Result:** User sees receiving status in dashboard

---

### Task 1.7: Update Domain Verification Instructions
**Time:** 30 minutes  
**Status:** ✅ Done (partially)

**What to do:**
- [ ] Open: `components/DomainVerificationInstructions.tsx`
- [ ] Accept `receivingRequest` prop
- [ ] Conditionally show receiving section:
  - If approved: Show MX records from request
  - If not approved: Show message about admin verification
- [ ] Remove hardcoded MX records
- [ ] Use dynamic MX records from database
- [ ] See **Plan → User Flow**

**Result:** Dynamic MX records display

---

### Task 1.8: Send User Notification Email (Request Received)
**Time:** 45 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create: `lib/email-templates/receiving-request-received.tsx`
- [ ] Create email template with request details
- [ ] Update request API to send email after creating request
- [ ] Use Resend to send email
- [ ] Test email delivery
- [ ] See **Plan → Email Notifications → Request Received**

**Result:** User gets confirmation email

---

## Day 2: Admin Panel (10 tasks)

### Task 2.1: Set Up Admin Authentication
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Choose auth method (Clerk roles recommended)
- [ ] Add admin role to your Clerk user
- [ ] Create: `lib/admin-auth.ts`
- [ ] Create `checkAdminAuth()` helper function
- [ ] Test admin check works
- [ ] See **Plan → Security & Authentication**

**Result:** Admin auth system ready

---

### Task 2.2: Create Admin Layout
**Time:** 45 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create: `app/admin/layout.tsx`
- [ ] Add authentication check (redirect if not admin)
- [ ] Create admin navigation sidebar
- [ ] Add links: Dashboard, Requests, Domains
- [ ] Style admin UI differently from user UI
- [ ] See **Plan → Admin Panel Pages**

**Result:** Admin panel layout

---

### Task 2.3: Create Admin Dashboard
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create: `app/admin/dashboard/page.tsx`
- [ ] Show stats:
  - Total pending requests
  - Approved this week
  - Rejected this week
- [ ] Show recent activity list
- [ ] Add quick action buttons
- [ ] See **Plan → Admin Dashboard**

**Result:** Admin overview page

---

### Task 2.4: Create List Requests API (Admin)
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create: `app/api/admin/receiving-requests/route.ts`
- [ ] Implement GET handler
- [ ] Check admin authentication
- [ ] Accept query params: `status` filter
- [ ] Fetch requests from database
- [ ] Populate domain and workspace details
- [ ] Return formatted list
- [ ] See **Plan → Admin APIs → List All**

**Result:** Admin can fetch all requests

---

### Task 2.5: Create Requests List Page
**Time:** 2 hours  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create: `app/admin/receiving-requests/page.tsx`
- [ ] Fetch requests via API
- [ ] Create table with columns:
  - Domain
  - Requested by
  - Status
  - Date
  - Actions
- [ ] Add filter tabs (All/Pending/Approved/Rejected)
- [ ] Add search functionality
- [ ] Style with Tailwind
- [ ] See **Plan → Receiving Requests List**

**Result:** Admin sees all requests

---

### Task 2.6: Create Review Detail Page
**Time:** 2 hours  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create: `app/admin/receiving-requests/[id]/page.tsx`
- [ ] Fetch single request details
- [ ] Show request information
- [ ] Show domain information (alias count, emails sent, etc.)
- [ ] Add approve/reject forms
- [ ] Add notes textarea
- [ ] See **Plan → Review Modal**

**Result:** Admin can review request details

---

### Task 2.7: Create Approve API
**Time:** 1.5 hours  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create: `app/api/admin/receiving-requests/[id]/approve/route.ts`
- [ ] Implement POST handler
- [ ] Check admin authentication
- [ ] Validate MX records input
- [ ] Update ReceivingRequest:
  - status = 'approved'
  - reviewedAt = now
  - reviewedBy = admin email
  - mxRecords = from input
- [ ] Update Domain:
  - receivingEnabled = true
  - receivingEnabledAt = now
  - receivingMxRecords = from input
- [ ] Send user notification email (approval)
- [ ] Return success
- [ ] See **Plan → Approve API**

**Result:** Admin can approve requests

---

### Task 2.8: Create Reject API
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create: `app/api/admin/receiving-requests/[id]/reject/route.ts`
- [ ] Implement POST handler
- [ ] Check admin authentication
- [ ] Validate rejection reason
- [ ] Update ReceivingRequest:
  - status = 'rejected'
  - reviewedAt = now
  - reviewedBy = admin email
  - rejectionReason = from input
- [ ] Send user notification email (rejection)
- [ ] Return success
- [ ] See **Plan → Reject API**

**Result:** Admin can reject requests

---

### Task 2.9: Create Approve Form Component
**Time:** 1.5 hours  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create: `components/admin/ApproveMXRecordsForm.tsx`
- [ ] Create form with:
  - MX record priority input
  - MX record value input
  - Option to add second MX record
  - Notes textarea
  - Submit button
- [ ] Add validation
- [ ] Handle form submission
- [ ] Call approve API
- [ ] Show success/error message
- [ ] See **Plan → Review Modal → Approve Form**

**Result:** Form to enter MX records

---

### Task 2.10: Create Admin Navigation
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create: `components/admin/AdminNav.tsx`
- [ ] Add links to:
  - Dashboard
  - Receiving Requests
  - All Domains
  - Settings (future)
- [ ] Highlight active page
- [ ] Add logout button
- [ ] Style with Tailwind

**Result:** Admin sidebar navigation

---

## Day 3: Email Notifications (6 tasks)

### Task 3.1: Create Email Template: Request Received
**Time:** 45 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create: `lib/email-templates/receiving-request-received.tsx`
- [ ] Design HTML email template
- [ ] Include:
  - Domain name
  - Request ID
  - Expected review time
  - Link to dashboard
- [ ] Test email rendering
- [ ] See **Plan → Email Notifications → Request Received**

**Result:** Request confirmation email

---

### Task 3.2: Create Email Template: Approved
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create: `lib/email-templates/receiving-approved.tsx`
- [ ] Design HTML email with:
  - Success message
  - MX records table (formatted)
  - Step-by-step instructions
  - Link to dashboard
- [ ] Make MX records copyable
- [ ] Test rendering
- [ ] See **Plan → Email Notifications → Approved**

**Result:** Approval email with MX records

---

### Task 3.3: Create Email Template: Rejected
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create: `lib/email-templates/receiving-rejected.tsx`
- [ ] Design email with:
  - Rejection message
  - Reason from admin
  - Contact support CTA
  - Request ID for reference
- [ ] Use sympathetic tone
- [ ] Test rendering
- [ ] See **Plan → Email Notifications → Rejected**

**Result:** Rejection notification email

---

### Task 3.4: Create Admin Email Template: New Request
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create: `lib/email-templates/admin-new-request.tsx`
- [ ] Design email with:
  - Domain name
  - User email
  - Workspace name
  - Request timestamp
  - Direct link to review page
- [ ] Keep it concise
- [ ] Test rendering
- [ ] See **Plan → Email Notifications → Admin**

**Result:** Admin notification email

---

### Task 3.5: Integrate Email Sending
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create: `lib/send-notification.ts`
- [ ] Create helper function for each email type:
  - `sendRequestReceivedEmail()`
  - `sendApprovedEmail()`
  - `sendRejectedEmail()`
  - `sendAdminNotification()`
- [ ] Use Resend SDK
- [ ] Add error handling
- [ ] Test each email type

**Result:** Email sending helpers

---

### Task 3.6: Update APIs to Send Emails
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Update `POST /api/receiving-requests`: Send user + admin emails
- [ ] Update `POST /api/admin/.../approve`: Send approval email
- [ ] Update `POST /api/admin/.../reject`: Send rejection email
- [ ] Add try-catch for email errors
- [ ] Log email sending attempts

**Result:** Automatic email notifications

---

## Day 4: Polish & Testing (8 tasks)

### Task 4.1: Add Loading States
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Add loading spinners to all forms
- [ ] Add skeleton loaders to tables
- [ ] Disable buttons during API calls
- [ ] Show progress indicators
- [ ] Test UX feels responsive

**Result:** Smooth loading experience

---

### Task 4.2: Add Error Handling
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Add error boundaries to admin pages
- [ ] Show user-friendly error messages
- [ ] Handle API errors gracefully
- [ ] Add retry mechanisms
- [ ] Log errors for debugging

**Result:** Robust error handling

---

### Task 4.3: Add Validation
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Validate MX record format in approve form
- [ ] Validate rejection reason required
- [ ] Validate domain exists before requesting
- [ ] Add client-side + server-side validation
- [ ] Show validation errors clearly

**Result:** Prevent invalid data

---

### Task 4.4: Test User Flow
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Test: User requests receiving
- [ ] Verify: Database updated
- [ ] Verify: User email sent
- [ ] Verify: Admin email sent
- [ ] Verify: Status shows in dashboard
- [ ] See **Plan → Testing → Test 1**

**Result:** User flow works end-to-end

---

### Task 4.5: Test Admin Approval Flow
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Test: Admin reviews request
- [ ] Test: Admin enters MX records
- [ ] Test: Admin approves
- [ ] Verify: Database updated
- [ ] Verify: User receives email with MX records
- [ ] Verify: User sees MX records in dashboard
- [ ] See **Plan → Testing → Test 2 & 3**

**Result:** Approval flow works

---

### Task 4.6: Test Admin Rejection Flow
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Test: Admin rejects with reason
- [ ] Verify: Database updated
- [ ] Verify: User receives rejection email
- [ ] Verify: User sees rejection in dashboard
- [ ] See **Plan → Testing → Test 4**

**Result:** Rejection flow works

---

### Task 4.7: End-to-End Integration Test
**Time:** 2 hours  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Complete flow: User requests → Admin approves → User adds MX records → Email received
- [ ] Test with real domain
- [ ] Send test email
- [ ] Verify webhook receives
- [ ] Verify Discord notification
- [ ] See **Plan → Testing → Test 5**

**Result:** Complete system works

---

### Task 4.8: Create Documentation
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Write admin guide: How to review requests
- [ ] Write user guide: How to request receiving
- [ ] Document MX record setup process
- [ ] Create FAQ
- [ ] Add troubleshooting section

**Result:** Documentation complete

---

## Environment Variables Setup

**Time:** 10 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Add to `.env.local`:
  ```
  ADMIN_EMAIL=your-admin@email.com
  ADMIN_PASSWORD=secure_password
  NOTIFICATION_FROM_EMAIL=notifications@yourapp.com
  ADMIN_NOTIFICATION_EMAIL=admin@yourapp.com
  ```
- [ ] Add to Vercel environment variables
- [ ] Restart dev server

**Result:** Environment configured

---

## Progress Tracking

**Day 1 (Database & User):** ⬜⬜⬜⬜⬜⬜⬜⬜ (8 tasks)  
**Day 2 (Admin Panel):** ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ (10 tasks)  
**Day 3 (Email Notifications):** ⬜⬜⬜⬜⬜⬜ (6 tasks)  
**Day 4 (Polish & Testing):** ⬜⬜⬜⬜⬜⬜⬜⬜ (8 tasks)  
**Environment:** ⬜ (1 task)

**Total:** 0/33 tasks completed

---

## Files Summary

### New Files to Create (25 files)

**Models:**
1. `app/api/models/ReceivingRequestModel.ts`

**User APIs:**
2. `app/api/receiving-requests/route.ts`
3. `app/api/receiving-requests/[domainId]/route.ts`

**Admin APIs:**
4. `app/api/admin/receiving-requests/route.ts`
5. `app/api/admin/receiving-requests/[id]/approve/route.ts`
6. `app/api/admin/receiving-requests/[id]/reject/route.ts`

**Admin Pages:**
7. `app/admin/layout.tsx`
8. `app/admin/dashboard/page.tsx`
9. `app/admin/receiving-requests/page.tsx`
10. `app/admin/receiving-requests/[id]/page.tsx`

**User Components:**
11. `components/ReceivingRequestButton.tsx`

**Admin Components:**
12. `components/admin/ReceivingRequestsTable.tsx`
13. `components/admin/ApproveMXRecordsForm.tsx`
14. `components/admin/AdminNav.tsx`

**Email Templates:**
15. `lib/email-templates/receiving-request-received.tsx`
16. `lib/email-templates/receiving-approved.tsx`
17. `lib/email-templates/receiving-rejected.tsx`
18. `lib/email-templates/admin-new-request.tsx`

**Utilities:**
19. `lib/admin-auth.ts`
20. `lib/send-notification.ts`

### Files to Modify (3 files)

1. `app/api/models/DomainModel.ts` - Add receiving fields
2. `app/dashboard/domains/[id]/verify/page.tsx` - Add receiving UI
3. `components/DomainVerificationInstructions.tsx` - Show dynamic MX records

---

## Quick Reference

### API Endpoints

**User-Facing:**
```
POST /api/receiving-requests
GET  /api/receiving-requests/[domainId]
```

**Admin-Only:**
```
GET  /api/admin/receiving-requests
POST /api/admin/receiving-requests/[id]/approve
POST /api/admin/receiving-requests/[id]/reject
```

### Admin Routes

```
/admin/dashboard
/admin/receiving-requests
/admin/receiving-requests/[id]
```

---

## Success Criteria

✅ Feature is done when:
- [ ] User can request receiving access
- [ ] User receives confirmation email
- [ ] Admin receives notification email
- [ ] Admin can see all requests
- [ ] Admin can approve with MX records
- [ ] Admin can reject with reason
- [ ] User receives approval email with MX records
- [ ] User sees MX records in dashboard
- [ ] User can add MX records and receive emails
- [ ] All emails are sent correctly
- [ ] Error handling works
- [ ] Documentation complete

---

## Daily Schedule

### Day 1 (6 hours)
```
Morning (3 hours):
- Task 1.1: ReceivingRequest model
- Task 1.2: Update Domain model
- Task 1.3: User request API

Afternoon (3 hours):
- Task 1.4: Get status API
- Task 1.5: Request button component
- Task 1.6: Update verification page
- Task 1.7: Update instructions component
- Task 1.8: Send notification email
```

### Day 2 (6 hours)
```
Morning (3 hours):
- Task 2.1: Admin auth
- Task 2.2: Admin layout
- Task 2.3: Admin dashboard
- Task 2.4: List requests API

Afternoon (3 hours):
- Task 2.5: Requests list page
- Task 2.6: Review detail page
- Task 2.7: Approve API
- Task 2.8: Reject API
- Task 2.9: Approve form
- Task 2.10: Admin navigation
```

### Day 3 (5 hours)
```
Morning (2 hours):
- Task 3.1: Email template: Request received
- Task 3.2: Email template: Approved
- Task 3.3: Email template: Rejected

Afternoon (3 hours):
- Task 3.4: Email template: Admin notification
- Task 3.5: Email sending integration
- Task 3.6: Update APIs with emails
```

### Day 4 (6 hours)
```
Morning (3 hours):
- Task 4.1: Loading states
- Task 4.2: Error handling
- Task 4.3: Validation
- Task 4.4: Test user flow

Afternoon (3 hours):
- Task 4.5: Test admin approval
- Task 4.6: Test admin rejection
- Task 4.7: End-to-end integration test
- Task 4.8: Documentation
```

---

## Troubleshooting

### Issue: Admin can't login
**Solution:** Check admin role in Clerk, verify environment variables

### Issue: Emails not sending
**Solution:** Check Resend API key, check email templates, check logs

### Issue: MX records not showing
**Solution:** Verify database updated, check API response, check frontend state

### Issue: Webhook not receiving
**Solution:** Verify MX records added to DNS, check webhook URL, test with curl

---

**Let's build the admin receiving verification system! 🚀**