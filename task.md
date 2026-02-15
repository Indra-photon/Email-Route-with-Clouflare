# Feature 2.1 - Reply from Discord
## Quick Task List

**Goal:** Enable users to reply to customer emails from Discord via web link  
**Time Estimate:** 2-3 days  
**Detailed Plan:** See `FEATURE_2.1_PLAN.md` for complete code and instructions

---

## Day 1: Database & Storage Setup

### Task 1.1: Create Email Storage Model
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create `app/api/models/EmailThreadModel.ts`
- [ ] Copy schema from **FEATURE_2.1_PLAN.md → Step 1.1**
- [ ] Test: Start dev server, verify no errors

**Result:** Database model for storing emails

---

### Task 1.2: Create Auth Helper
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create `lib/authHelpers.ts`
- [ ] Copy helper functions from **FEATURE_2.1_PLAN.md → Step 1.2**
- [ ] Test: Import in any file, verify TypeScript happy

**Result:** Reusable workspace auth checking

---

### Task 1.3: Add Environment Variable
**Time:** 5 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Add `NEXT_PUBLIC_SITE_URL=http://localhost:3000` to `.env.local`
- [ ] See **FEATURE_2.1_PLAN.md → Step 1.3** for instructions
- [ ] Restart dev server

**Result:** Reply URLs will work correctly

---

### Task 1.4: Update Webhook to Save Emails
**Time:** 1.5 hours  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open `app/api/webhooks/resend/route.ts`
- [ ] Follow changes in **FEATURE_2.1_PLAN.md → Step 1.4**
- [ ] Add EmailThread import
- [ ] Save email to database after receiving
- [ ] Add reply link to Discord message
- [ ] Test: Send email, check MongoDB for new EmailThread, check Discord for link

**Result:** Emails saved to database, Discord messages have reply links

---

## Day 2: Reply Page & Form

### Task 2.1: Create Reply Page
**Time:** 1.5 hours  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create `app/reply/[threadId]/page.tsx`
- [ ] Copy code from **FEATURE_2.1_PLAN.md → Step 2.1**
- [ ] Test auth: Try without login → should redirect
- [ ] Test access: Try with wrong workspace → should show error
- [ ] Test success: Try with valid thread → should show form

**Result:** Auth-protected page showing original email

---

### Task 2.2: Create Reply Form Component
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create `components/ReplyForm.tsx`
- [ ] Copy code from **FEATURE_2.1_PLAN.md → Step 2.2**
- [ ] Test: Form renders, can type, shows validation

**Result:** Working form for composing replies

---

## Day 3: Email Sending API

### Task 3.1: Create Reply API
**Time:** 2 hours  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Create `app/api/emails/reply/route.ts`
- [ ] Copy code from **FEATURE_2.1_PLAN.md → Step 3.1**
- [ ] Test: Submit form, check console logs
- [ ] Verify: Email sent via Resend
- [ ] Verify: Customer receives email
- [ ] Verify: Database has outbound EmailThread
- [ ] Verify: Original thread status = "replied"

**Result:** Full reply flow working end-to-end

---

## Testing & Deployment

### Testing Checklist
**Time:** 1 hour  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Follow **Manual Testing Checklist** in FEATURE_2.1_PLAN.md
- [ ] Test all 15 items
- [ ] Fix any bugs found

**Result:** Feature fully tested

---

### Deployment
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Follow **Deployment Checklist** in FEATURE_2.1_PLAN.md
- [ ] Set `NEXT_PUBLIC_SITE_URL` in Vercel
- [ ] Commit and push code
- [ ] Verify deployment successful
- [ ] Run post-deployment tests

**Result:** Feature live in production

---

## Quick Reference

**Files Created:**
1. `app/api/models/EmailThreadModel.ts` - Database model
2. `lib/authHelpers.ts` - Auth checking
3. `app/reply/[threadId]/page.tsx` - Reply page
4. `components/ReplyForm.tsx` - Reply form
5. `app/api/emails/reply/route.ts` - Reply API

**Files Modified:**
1. `app/api/webhooks/resend/route.ts` - Save emails, add links
2. `.env.local` - Add NEXT_PUBLIC_SITE_URL

**Environment Variables:**
- `NEXT_PUBLIC_SITE_URL` - For reply links

---

## Progress Tracking

**Day 1:** ⬜⬜⬜⬜ (4 tasks)  
**Day 2:** ⬜⬜ (2 tasks)  
**Day 3:** ⬜ (1 task)  
**Testing:** ⬜ (1 task)  
**Deploy:** ⬜ (1 task)  

**Total:** 0/9 tasks completed

---

## Need Help?

**For detailed code:** See `FEATURE_2.1_PLAN.md`  
**For overall context:** See `PRD.md` (Phase 2, Feature 2.1)  
**For debugging:** Check Vercel logs, MongoDB, Resend dashboard

---

## Success Criteria

✅ Feature is done when:
- [ ] Email arrives → Discord notification with link
- [ ] Click link → Reply form shows
- [ ] Submit form → Email sent to customer
- [ ] Customer receives email (check inbox)
- [ ] Database has both emails (inbound + outbound)
- [ ] Auth works (can't access other workspace's emails)
- [ ] No errors in production

---

**Let's build this! 🚀**