# Admin-Managed Receiving Email Verification - Plan

**Goal:** Allow admins to manually verify and enable email receiving for customer domains with security checks and notification system.

**Time Estimate:** 3-4 days  
**Priority:** HIGH - Required for secure receiving email setup

---

## Overview

### Current Flow (Sending - Automated)

```
User adds domain → API calls Resend → DNS records returned → User sees records → User adds to DNS → Domain verified for SENDING ✅
```

### New Flow (Receiving - Admin Managed)

```
User adds domain → Gets SENDING records immediately ✅
    ↓
User sees: "Admin will verify for receiving" 
    ↓
User clicks: "Request Receiving Access"
    ↓
Request stored in database (status: pending)
    ↓
Admin gets email notification
    ↓
Admin goes to admin panel
    ↓
Admin reviews domain (security check)
    ↓
Admin enables receiving in Resend dashboard
    ↓
Admin copies MX records from Resend
    ↓
Admin updates database (status: approved, adds MX records)
    ↓
User gets email: "Receiving enabled! Here are your MX records"
    ↓
User sees MX records in dashboard
    ↓
User adds MX records to DNS
    ↓
Emails received! 🎉
```

---

## Why Admin Verification?

**Security Reasons:**
- Prevent spam/abuse domains
- Verify legitimate business use
- Check domain reputation
- Control resource usage
- Manual quality check

**Technical Reasons:**
- MX records are region-specific (can't hardcode)
- Need to manually enable in Resend per domain
- Get actual MX records from Resend for each domain

**Business Reasons:**
- Know your customers
- Premium feature control
- Prevent free tier abuse

---

## Architecture

### Database Changes

**New Collection: ReceivingRequests**

```javascript
{
  _id: ObjectId,
  domainId: ObjectId, // Reference to Domain
  workspaceId: ObjectId,
  requestedBy: String, // User email/name
  status: String, // 'pending' | 'approved' | 'rejected'
  requestedAt: Date,
  reviewedAt: Date,
  reviewedBy: String, // Admin email
  rejectionReason: String,
  mxRecords: [
    {
      type: String, // 'MX'
      name: String, // '@'
      value: String, // 'inbound-smtp.us-east-1.amazonaws.com'
      priority: Number, // 10
      ttl: String, // 'Auto'
    }
  ],
  notes: String, // Admin notes
}
```

**Updated Domain Model:**

```javascript
{
  // ... existing fields ...
  receivingEnabled: Boolean, // default: false
  receivingEnabledAt: Date,
  receivingRequestId: ObjectId, // Reference to ReceivingRequest
  receivingMxRecords: [
    {
      type: String,
      name: String, 
      value: String,
      priority: Number,
      ttl: String,
    }
  ],
}
```

---

## User Flow (Customer Side)

### Step 1: Domain Verification Page

**When domain verified for sending:**

```
┌─────────────────────────────────────┐
│ ✅ Domain Verified for Sending      │
├─────────────────────────────────────┤
│                                     │
│ DNS Records (Sending):              │
│ [Table with DKIM, SPF records]      │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                     │
│ 📬 Receiving Emails (Optional)      │
│                                     │
│ To receive emails at this domain,   │
│ admin verification is required for  │
│ security.                           │
│                                     │
│ Status: ⏳ Not Requested            │
│                                     │
│ [Request Receiving Access]          │
│                                     │
└─────────────────────────────────────┘
```

**After clicking "Request Receiving Access":**

```
┌─────────────────────────────────────┐
│ Status: ⏳ Pending Admin Approval   │
│                                     │
│ Your request has been submitted.    │
│ You'll receive an email when        │
│ approved (typically 1-2 hours).     │
│                                     │
│ Requested: Feb 15, 2026 at 2:30 PM │
└─────────────────────────────────────┘
```

**After admin approval:**

```
┌─────────────────────────────────────┐
│ Status: ✅ Receiving Enabled        │
│                                     │
│ MX Records (Receiving):             │
│ [Table with MX records]             │
│                                     │
│ Add these records at your DNS       │
│ provider to start receiving emails. │
│                                     │
│ Enabled: Feb 15, 2026 at 3:45 PM   │
└─────────────────────────────────────┘
```

---

## Admin Flow (Admin Panel)

### Admin Panel Structure

```
/admin
  ├── /dashboard (Overview stats)
  ├── /receiving-requests (Main page)
  ├── /domains (All domains)
  └── /settings (Admin settings)
```

### Main Page: Receiving Requests

```
┌────────────────────────────────────────────────────┐
│ Receiving Requests                   [Refresh]      │
├────────────────────────────────────────────────────┤
│                                                     │
│ Filters: [All] [Pending] [Approved] [Rejected]     │
│                                                     │
│ ┌──────────────────────────────────────────────┐  │
│ │ Domain          Requested By    Status  Date │  │
│ ├──────────────────────────────────────────────┤  │
│ │ git-cv.com      john@doe.com    🟡 Pending   │  │
│ │                                  2h ago       │  │
│ │                 [Review]  [Reject]            │  │
│ ├──────────────────────────────────────────────┤  │
│ │ acme.com        jane@acme.com   ✅ Approved  │  │
│ │                                  1d ago       │  │
│ │                 [View Details]                │  │
│ ├──────────────────────────────────────────────┤  │
│ │ spam.com        bad@spam.com    ❌ Rejected  │  │
│ │                                  3d ago       │  │
│ │                 [View Details]                │  │
│ └──────────────────────────────────────────────┘  │
│                                                     │
└────────────────────────────────────────────────────┘
```

### Review Modal

**When admin clicks "Review" on pending request:**

```
┌────────────────────────────────────────┐
│ Review Receiving Request               │
├────────────────────────────────────────┤
│                                        │
│ Domain: git-cv.com                     │
│ Requested by: john@doe.com             │
│ Workspace: Acme Corp                   │
│ Requested: Feb 15, 2026 2:30 PM       │
│                                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                        │
│ Domain Info:                           │
│ • Created: 2 days ago                  │
│ • Verified for sending: Yes ✅         │
│ • Aliases created: 2                   │
│ • Emails sent: 15                      │
│                                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                        │
│ Security Checks:                       │
│ [Check domain reputation]              │
│ [Check WHOIS info]                     │
│ [Check existing MX records]            │
│                                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                        │
│ Admin Notes (optional):                │
│ [                                   ]  │
│                                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                        │
│ Actions:                               │
│ [Reject] [Approve & Enable Receiving]  │
│                                        │
└────────────────────────────────────────┘
```

**After clicking "Approve & Enable Receiving":**

```
┌────────────────────────────────────────┐
│ Enable Receiving for git-cv.com        │
├────────────────────────────────────────┤
│                                        │
│ Step 1: Enable in Resend Dashboard     │
│                                        │
│ 1. Open Resend dashboard               │
│ 2. Go to Domains → git-cv.com          │
│ 3. Enable Receiving                    │
│ 4. Copy MX records shown               │
│                                        │
│ [Open Resend Dashboard]                │
│                                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                        │
│ Step 2: Enter MX Records               │
│                                        │
│ MX Record 1:                           │
│ Priority: [10]                         │
│ Value: [________________________]      │
│                                        │
│ MX Record 2 (optional):                │
│ Priority: [20]                         │
│ Value: [________________________]      │
│                                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                        │
│ Step 3: Notify User                    │
│                                        │
│ ☑ Send email notification to user     │
│                                        │
│ [Cancel]  [Save & Approve]             │
│                                        │
└────────────────────────────────────────┘
```

---

## API Endpoints

### Customer-Facing APIs

**1. Request Receiving Access**

```
POST /api/receiving-requests

Body:
{
  domainId: string
}

Response:
{
  success: true,
  request: {
    id: string,
    status: "pending",
    requestedAt: Date
  }
}
```

**2. Get Receiving Request Status**

```
GET /api/receiving-requests/:domainId

Response:
{
  status: "pending" | "approved" | "rejected",
  requestedAt: Date,
  reviewedAt?: Date,
  mxRecords?: [...],
  rejectionReason?: string
}
```

---

### Admin-Only APIs

**1. List All Receiving Requests**

```
GET /api/admin/receiving-requests?status=pending

Headers:
Authorization: Bearer [admin-token]

Response:
{
  requests: [
    {
      id: string,
      domain: string,
      requestedBy: string,
      workspace: string,
      status: string,
      requestedAt: Date,
      domainInfo: {
        aliasCount: number,
        emailsSent: number,
        verifiedForSending: boolean
      }
    }
  ],
  total: number
}
```

**2. Approve Receiving Request**

```
POST /api/admin/receiving-requests/:id/approve

Headers:
Authorization: Bearer [admin-token]

Body:
{
  mxRecords: [
    {
      type: "MX",
      name: "@",
      value: "inbound-smtp.us-east-1.amazonaws.com",
      priority: 10,
      ttl: "Auto"
    }
  ],
  notes: string
}

Response:
{
  success: true,
  message: "Request approved and user notified"
}
```

**3. Reject Receiving Request**

```
POST /api/admin/receiving-requests/:id/reject

Headers:
Authorization: Bearer [admin-token]

Body:
{
  reason: string
}

Response:
{
  success: true,
  message: "Request rejected and user notified"
}
```

---

## Email Notifications

### User Notification: Request Received

**Sent:** Immediately after user submits request

**Subject:** Your Receiving Request for [domain] is Being Reviewed

**Body:**
```
Hi [User Name],

We've received your request to enable email receiving for:
• Domain: git-cv.com

Our team will review your request and enable receiving within 1-2 hours.

You'll receive another email with MX records once approved.

Request ID: #12345
Requested: Feb 15, 2026 at 2:30 PM

Questions? Reply to this email.

Best,
The Team
```

---

### User Notification: Request Approved

**Sent:** When admin approves request

**Subject:** ✅ Receiving Enabled for [domain]

**Body:**
```
Hi [User Name],

Great news! Email receiving has been enabled for:
• Domain: git-cv.com

Here are your MX records to add at your DNS provider:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MX Record:
Type: MX
Name: @ (or leave blank)
Priority: 10
Value: inbound-smtp.us-east-1.amazonaws.com
TTL: 1 Hour (or Auto)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next Steps:
1. Login to your DNS provider (GoDaddy, Cloudflare, etc.)
2. Add the MX record above
3. Wait 10-30 minutes for DNS propagation
4. Test by sending an email to support@git-cv.com

View full details: [Link to dashboard]

Questions? Reply to this email.

Best,
The Team
```

---

### User Notification: Request Rejected

**Sent:** When admin rejects request

**Subject:** Receiving Request for [domain] - Update Needed

**Body:**
```
Hi [User Name],

We've reviewed your request for email receiving on:
• Domain: git-cv.com

Unfortunately, we need more information before enabling:

Reason: [Admin's rejection reason]

Please reply to this email to discuss next steps.

Request ID: #12345
Reviewed: Feb 15, 2026 at 3:45 PM

Best,
The Team
```

---

### Admin Notification: New Request

**Sent:** When user submits receiving request

**To:** admin@yourapp.com

**Subject:** 🔔 New Receiving Request: git-cv.com

**Body:**
```
New receiving request received:

Domain: git-cv.com
Requested by: john@doe.com
Workspace: Acme Corp
Requested: Feb 15, 2026 at 2:30 PM

Review now: [Link to admin panel]
```

---

## Admin Panel Pages

### Page 1: Admin Dashboard

**File:** `app/admin/dashboard/page.tsx`

**Shows:**
- Total pending requests (big number)
- Approved this week
- Rejected this week
- Recent activity list
- Quick actions

---

### Page 2: Receiving Requests List

**File:** `app/admin/receiving-requests/page.tsx`

**Features:**
- Filterable table (All/Pending/Approved/Rejected)
- Search by domain
- Sort by date, status
- Bulk actions (future)
- Pagination

---

### Page 3: Review Request Detail

**File:** `app/admin/receiving-requests/[id]/page.tsx`

**Shows:**
- Request details
- Domain information
- User/workspace info
- Security check tools
- Approve/Reject form
- Activity timeline

---

### Page 4: All Domains

**File:** `app/admin/domains/page.tsx`

**Shows:**
- All domains in system
- Sending status
- Receiving status
- Actions (view, edit, disable)

---

## Security & Authentication

### Admin Authentication

**Options:**

**Option 1: Simple Password (MVP)**
```typescript
// Hardcoded admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
```

**Option 2: Clerk Role-Based**
```typescript
// Check if user has admin role
const { userId } = await auth();
const user = await clerkClient.users.getUser(userId);
if (user.publicMetadata.role !== 'admin') {
  throw new Error('Unauthorized');
}
```

**Option 3: Separate Admin Auth**
```typescript
// Separate login for admin panel
// Admin session stored separately
```

**Recommendation:** Option 2 (Clerk role-based) for scalability

---

### API Route Protection

```typescript
// Middleware for admin routes
export async function adminOnly(request: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const user = await clerkClient.users.getUser(userId);
  
  if (user.publicMetadata.role !== 'admin') {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  return null; // Authorized
}
```

---

## Email Service Integration

### Using Resend for Notifications

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Send user notification
await resend.emails.send({
  from: 'notifications@yourapp.com',
  to: userEmail,
  subject: 'Receiving Enabled for git-cv.com',
  html: emailTemplate,
});

// Send admin notification
await resend.emails.send({
  from: 'system@yourapp.com',
  to: 'admin@yourapp.com',
  subject: '🔔 New Receiving Request',
  html: adminNotificationTemplate,
});
```

---

## File Structure

```
app/
├── admin/
│   ├── layout.tsx (Admin layout with auth)
│   ├── dashboard/
│   │   └── page.tsx (Overview)
│   ├── receiving-requests/
│   │   ├── page.tsx (List)
│   │   └── [id]/
│   │       └── page.tsx (Review detail)
│   └── domains/
│       └── page.tsx (All domains)
│
├── api/
│   ├── receiving-requests/
│   │   ├── route.ts (POST - user creates request)
│   │   └── [id]/
│   │       └── route.ts (GET - user checks status)
│   │
│   └── admin/
│       ├── receiving-requests/
│       │   ├── route.ts (GET - list all)
│       │   └── [id]/
│       │       ├── approve/
│       │       │   └── route.ts (POST)
│       │       └── reject/
│       │           └── route.ts (POST)
│       └── middleware.ts (Admin auth check)
│
├── models/
│   └── ReceivingRequestModel.ts (New model)
│
├── components/
│   ├── admin/
│   │   ├── ReceivingRequestsTable.tsx
│   │   ├── ReviewRequestModal.tsx
│   │   ├── ApproveMXRecordsForm.tsx
│   │   └── AdminNav.tsx
│   │
│   └── ReceivingRequestButton.tsx (User-facing)
│
└── lib/
    ├── email-templates/
    │   ├── receiving-request-received.tsx
    │   ├── receiving-approved.tsx
    │   └── receiving-rejected.tsx
    │
    └── admin-auth.ts (Admin authentication helper)
```

---

## Implementation Phases

### Phase 1: Database & Basic Flow (Day 1)

- ✅ Create ReceivingRequest model
- ✅ Update Domain model
- ✅ User API: Request receiving
- ✅ User API: Check status
- ✅ Show request button in UI
- ✅ Show status in UI

---

### Phase 2: Admin Panel (Day 2)

- ✅ Admin authentication setup
- ✅ Admin layout
- ✅ Receiving requests list page
- ✅ Review request detail page
- ✅ Approve/reject forms
- ✅ Admin APIs

---

### Phase 3: Email Notifications (Day 3)

- ✅ Email templates
- ✅ Send on request submitted
- ✅ Send on approved
- ✅ Send on rejected
- ✅ Admin notifications

---

### Phase 4: Polish & Testing (Day 4)

- ✅ Error handling
- ✅ Loading states
- ✅ Validation
- ✅ End-to-end testing
- ✅ Documentation

---

## Testing Plan

### Test 1: User Requests Receiving

**Steps:**
1. Login as customer
2. Go to verified domain
3. Click "Request Receiving Access"
4. Check database: request created with status "pending"
5. Check email: confirmation email received

**Expected:**
- ✅ Request stored in database
- ✅ User sees "Pending" status
- ✅ Email received

---

### Test 2: Admin Reviews Request

**Steps:**
1. Login as admin
2. Go to /admin/receiving-requests
3. See pending request
4. Click "Review"
5. Check domain info displayed
6. Enter MX records
7. Click "Approve"

**Expected:**
- ✅ Admin sees all request details
- ✅ Can enter MX records
- ✅ Database updated with status "approved"
- ✅ Domain.receivingEnabled = true
- ✅ MX records stored

---

### Test 3: User Notified of Approval

**Steps:**
1. After admin approves
2. Check user email
3. Check user dashboard

**Expected:**
- ✅ User receives approval email with MX records
- ✅ Dashboard shows "Receiving Enabled"
- ✅ MX records visible in UI
- ✅ Instructions clear

---

### Test 4: Admin Rejects Request

**Steps:**
1. Admin reviews request
2. Clicks "Reject"
3. Enters reason
4. Submits

**Expected:**
- ✅ Request status = "rejected"
- ✅ User receives rejection email
- ✅ Dashboard shows rejected status
- ✅ Reason displayed

---

### Test 5: End-to-End Flow

**Steps:**
1. User adds domain
2. Domain verified for sending
3. User requests receiving
4. Admin approves with MX records
5. User adds MX records to DNS
6. Test email sent to domain
7. Webhook receives email
8. Discord notification appears

**Expected:**
- ✅ Complete flow works
- ✅ Emails received successfully
- ✅ No manual Resend dashboard access needed

---

## Environment Variables

```env
# Admin Authentication
ADMIN_EMAIL=admin@yourapp.com
ADMIN_PASSWORD=secure_password_here

# Or for Clerk-based
CLERK_ADMIN_USER_IDS=user_abc123,user_xyz789

# Email Notifications
RESEND_API_KEY=re_abc123...
NOTIFICATION_FROM_EMAIL=notifications@yourapp.com
ADMIN_NOTIFICATION_EMAIL=admin@yourapp.com

# App URL
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

---

## Future Enhancements

### Phase 5 (Future)

**Auto-Approve for Trusted Domains:**
- Whitelist certain domains
- Auto-approve if criteria met
- Still send MX records via email

**Bulk Actions:**
- Approve multiple requests at once
- Export requests to CSV
- Batch notifications

**Analytics:**
- Request approval rate
- Average review time
- Most common rejection reasons
- Domain activity stats

**Webhook Integration:**
- Notify external systems
- Slack integration for new requests
- Auto-populate MX records from Resend API (if possible)

---

## Success Metrics

**Track:**
- Average time from request to approval
- Approval rate (% approved vs rejected)
- User satisfaction (did they successfully add MX records?)
- Support tickets related to receiving setup

**Goals:**
- Average approval time: < 2 hours
- Approval rate: > 80%
- User success rate: > 90%
- Support tickets: < 5% of requests

---

## FAQs for Users

**Q: How long does approval take?**
A: Typically 1-2 hours during business hours.

**Q: Why do you need to approve manually?**
A: For security - we verify each domain to prevent spam and abuse.

**Q: What if my request is rejected?**
A: We'll email you the reason. Reply to discuss and resubmit.

**Q: Can I speed up the process?**
A: Contact support if urgent. We'll prioritize.

**Q: Do I need to verify for both sending and receiving?**
A: Sending is automatic. Receiving requires admin approval for security.

---

## Summary

**What Gets Built:**

**For Users:**
- ✅ Request receiving button
- ✅ Status tracking
- ✅ Email notifications
- ✅ Clear MX record instructions

**For Admins:**
- ✅ Admin panel for reviews
- ✅ Domain information display
- ✅ MX record input form
- ✅ Approve/reject workflow
- ✅ Email notifications

**Result:** 
- Secure receiving setup
- Manual quality control
- Professional user experience
- Scalable to 100+ customers

**Time:** 3-4 days for complete implementation

---

**END OF PLAN**