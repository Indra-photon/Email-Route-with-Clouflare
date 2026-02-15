# Automated Domain Verification - Task List
## Self-Service Domain Setup

**Goal:** Customers verify their own domains without your help  
**Time:** 2-3 days  
**Plan:** See `AUTOMATED_DOMAIN_VERIFICATION_PLAN.md` for details

---

## Day 1: Backend APIs (4 tasks)

### Task 1.1: Update Domain Model
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open `app/api/models/DomainModel.ts`
- [ ] Add `dnsRecords` field (dkim, verification, mx)
- [ ] Add `resendDomainId` field
- [ ] Add `lastCheckedAt` field
- [ ] See **Plan → Step 1.1** for schema

**Result:** Database can store DNS records

---

### Task 1.2: Create Add-to-Resend API
**Time:** 1.5 hours  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create `app/api/domains/add-to-resend/route.ts`
- [ ] Import Resend SDK
- [ ] Call `resend.domains.create({ name: domain })`
- [ ] Store DNS records in database
- [ ] Return records to frontend
- [ ] See **Plan → Step 1.2** for code structure

**Result:** API that adds domain to Resend

---

### Task 1.3: Create Check Verification API
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create `app/api/domains/check-verification/route.ts`
- [ ] Call `resend.domains.get(domainId)`
- [ ] Check each record status
- [ ] Update database with results
- [ ] Return verification status
- [ ] See **Plan → Step 1.3** for logic

**Result:** API that checks if domain verified

---

### Task 1.4: Create Get Domain Details API
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create `app/api/domains/[id]/route.ts`
- [ ] Implement GET endpoint
- [ ] Fetch domain with DNS records
- [ ] Return to frontend
- [ ] See **Plan → Step 1.4** for endpoint

**Result:** API to get single domain data

---

## Day 2: Frontend UI (3 tasks)

### Task 2.1: Create Verification Page
**Time:** 2 hours  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create `app/dashboard/domains/[id]/verify/page.tsx`
- [ ] Fetch domain data on load
- [ ] Show domain name and status
- [ ] Include DNS instructions component
- [ ] Add "Check Verification" button
- [ ] See **Plan → Step 2.1** for layout

**Result:** Page showing DNS instructions

---

### Task 2.2: Create DNS Instructions Component
**Time:** 2 hours  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create `components/DomainVerificationInstructions.tsx`
- [ ] Display DKIM record with copy button
- [ ] Display verification record with copy button
- [ ] Display MX records with copy buttons
- [ ] Add visual status indicators (✅⏳❌)
- [ ] Style with Tailwind
- [ ] See **Plan → Step 2.2** for structure

**Result:** Reusable DNS display component

---

### Task 2.3: Update Domain Creation Flow
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open domain creation handler (wherever domains are added)
- [ ] After creating domain, call add-to-resend API
- [ ] Redirect to verification page
- [ ] Update domains list to show "Verify" button
- [ ] See **Plan → Step 3.1** for flow

**Result:** Seamless flow from add → verify

---

## Day 3: Integration & Polish (4 tasks)

### Task 3.1: Add Auto-Refresh
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] In verification page, add useEffect
- [ ] Poll check-verification API every 30 seconds
- [ ] Stop when status becomes "verified"
- [ ] Show loading indicator during check
- [ ] See **Plan → Step 3.2** for polling logic

**Result:** Page auto-updates when DNS verified

---

### Task 3.2: Add Error Handling
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Handle "domain already exists" error
- [ ] Handle "invalid domain" error
- [ ] Handle "Resend API error"
- [ ] Handle "rate limit" error
- [ ] Show user-friendly error messages
- [ ] See **Plan → Error Handling** section

**Result:** Graceful error handling

---

### Task 3.3: Test End-to-End
**Time:** 2 hours  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Add test domain
- [ ] Verify DNS instructions show
- [ ] Copy DNS records
- [ ] Add to DNS provider
- [ ] Check verification
- [ ] Verify status updates
- [ ] Send test email from verified domain
- [ ] Follow **Plan → Testing Plan** (Tests 1-6)

**Result:** Fully working verification flow

---

### Task 3.4: Create Help Documentation
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Write "How to Verify Your Domain" guide
- [ ] Include screenshots
- [ ] Add troubleshooting section
- [ ] Link from verification page
- [ ] See **Plan → Customer Documentation**

**Result:** Customer help article ready

---

## Environment Setup

### Environment Variables
**Time:** 5 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Verify `RESEND_API_KEY` in `.env.local`
- [ ] Verify `NEXT_PUBLIC_SITE_URL` in `.env.local`
- [ ] Add both to Vercel environment variables
- [ ] Mark RESEND_API_KEY as secret

**Result:** Environment configured

---

## Progress Tracking

**Day 1 (Backend):** ⬜⬜⬜⬜ (4 tasks)  
**Day 2 (Frontend):** ⬜⬜⬜ (3 tasks)  
**Day 3 (Integration):** ⬜⬜⬜⬜ (4 tasks)  
**Setup:** ⬜ (1 task)

**Total:** 0/12 tasks completed

---

## Files Summary

### New Files to Create (7 files)

**Backend APIs:**
1. `app/api/domains/add-to-resend/route.ts`
2. `app/api/domains/check-verification/route.ts`
3. `app/api/domains/[id]/route.ts`

**Frontend Pages:**
4. `app/dashboard/domains/[id]/verify/page.tsx`

**Frontend Components:**
5. `components/DomainVerificationInstructions.tsx`
6. `components/DNSRecord.tsx` (helper)
7. `components/VerificationStatusBadge.tsx` (helper)

### Files to Modify (2 files)

1. `app/api/models/DomainModel.ts` - Add DNS fields
2. Domain creation page - Add redirect to verify

---

## Quick Reference

### API Endpoints Created

```
POST /api/domains/add-to-resend
  → Add domain to Resend, store DNS records

POST /api/domains/check-verification
  → Check Resend API, update status

GET /api/domains/[id]
  → Get domain with DNS records
```

### Key Functions

**Add to Resend:**
```typescript
const { data } = await resend.domains.create({
  name: domain.domain
});
```

**Check Verification:**
```typescript
const { data } = await resend.domains.get(
  domain.resendDomainId
);
```

**Update Database:**
```typescript
await Domain.findByIdAndUpdate(domainId, {
  verifiedForSending: data.status === 'verified',
  'dnsRecords.dkim.status': data.records[0].status
});
```

---

## Testing Checklist

**Before Deployment:**
- [ ] Can add domain via UI
- [ ] DNS records display correctly
- [ ] Copy buttons work
- [ ] Can add DNS records to provider
- [ ] Check verification button works
- [ ] Status updates correctly
- [ ] Verified domain shows ✅
- [ ] Can send email from verified domain
- [ ] Unverified domain falls back correctly
- [ ] Error handling works
- [ ] Help documentation clear

---

## Success Criteria

✅ Feature is done when:
- [ ] Customer can add domain in dashboard
- [ ] DNS instructions show automatically
- [ ] Customer can copy all records
- [ ] "Check Verification" button works
- [ ] Status updates from pending → verified
- [ ] Customer never contacts Resend directly
- [ ] Customer never contacts you for help
- [ ] Emails send from verified domain
- [ ] Zero manual work required

---

## Customer Journey (Final)

**What customer experiences:**

```
1. I login to dashboard
2. I click "Add Domain"
3. I enter: mycustomer.com
4. I see DNS instructions
5. I copy each record
6. I add to GoDaddy (or my DNS provider)
7. I wait 10 minutes
8. I click "Check Verification"
9. I see "✅ Verified!"
10. I create alias: support@mycustomer.com
11. I send emails professionally!

Everything self-service! 🎉
```

---

## Troubleshooting Quick Fixes

### DNS not propagating
**Solution:** Wait 30 minutes, check again

### Verification fails
**Solution:** Verify DNS records match exactly

### API errors
**Solution:** Check Resend API key, check logs

### Copy button not working
**Solution:** Check navigator.clipboard permissions

**Full troubleshooting:** See Plan → Error Handling

---

## After Completion

**You'll have:**
- ✅ Fully automated domain verification
- ✅ Self-service for customers
- ✅ Professional onboarding experience
- ✅ Scales to 1000+ customers
- ✅ Zero manual work

**Next steps:**
- Monitor verification success rate
- Gather customer feedback
- Build advanced features (Phase 4)

---

## Daily Schedule

### Day 1 Schedule
```
Morning (3 hours):
- Task 1.1: Update domain model
- Task 1.2: Add-to-Resend API

Afternoon (3 hours):
- Task 1.3: Check verification API
- Task 1.4: Get domain API
- Testing APIs
```

### Day 2 Schedule
```
Morning (3 hours):
- Task 2.1: Verification page
- Task 2.2: DNS instructions component (start)

Afternoon (3 hours):
- Task 2.2: DNS instructions component (finish)
- Task 2.3: Update domain creation flow
- Testing UI
```

### Day 3 Schedule
```
Morning (2 hours):
- Task 3.1: Auto-refresh
- Task 3.2: Error handling

Afternoon (3 hours):
- Task 3.3: End-to-end testing
- Task 3.4: Documentation
- Final polish
```

---

## Need Help?

**For code examples:** See `AUTOMATED_DOMAIN_VERIFICATION_PLAN.md`  
**For API details:** See Plan → API Endpoints Summary  
**For UI layout:** See Plan → UI Components Structure  
**For testing:** See Plan → Testing Plan  

---

**Let's build automated domain verification! 🚀**