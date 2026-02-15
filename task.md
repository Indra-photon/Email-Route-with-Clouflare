# Domain Verification Task List
## Setup Custom Sending Domain (git-cv.com)

**Goal:** Enable sending emails from support@git-cv.com (or any verified domain)  
**Time Estimate:** 4-6 hours  
**Detailed Plan:** See `DOMAIN_VERIFICATION_PLAN.md` for complete instructions

---

## Quick Overview

**Problem:**
```
❌ Current: Reply FROM onboarding@resend.dev (test only)
✅ Goal: Reply FROM support@git-cv.com (professional)
```

**Solution:**
1. Verify domain with Resend
2. Update database schema
3. Update reply API to use verified domain
4. Test end-to-end

---

## Task Checklist

### Task 1: Add Domain to Resend
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Go to https://resend.com/domains
- [ ] Click "Add Domain"
- [ ] Enter: `git-cv.com`
- [ ] Copy DNS records shown (DKIM, verification, MX)
- [ ] See **DOMAIN_VERIFICATION_PLAN.md → Step 1** for details

**Result:** Resend shows DNS records to add

---

### Task 2: Add DNS Records
**Time:** 20 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Login to your domain registrar (Namecheap/Cloudflare/etc.)
- [ ] Add DKIM TXT record: `resend._domainkey`
- [ ] Add Verification TXT record: `_resend`
- [ ] Add MX records: `mx1.resend.dev` (priority 10), `mx2.resend.dev` (priority 20)
- [ ] Save all records
- [ ] See **DOMAIN_VERIFICATION_PLAN.md → Step 2** for exact values

**Result:** DNS records live (may take 5-30 min to propagate)

---

### Task 3: Wait for DNS Propagation
**Time:** 5-30 minutes (passive waiting)  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Wait 5-30 minutes
- [ ] Check propagation: `dig TXT resend._domainkey.git-cv.com`
- [ ] Or use: https://dnschecker.org
- [ ] See **DOMAIN_VERIFICATION_PLAN.md → Step 3** for checking

**Result:** DNS records visible globally

---

### Task 4: Verify in Resend Dashboard
**Time:** 5 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Go back to https://resend.com/domains
- [ ] Find `git-cv.com`
- [ ] Click "Verify" or wait for auto-verification
- [ ] Status should show: ✅ Verified
- [ ] See **DOMAIN_VERIFICATION_PLAN.md → Step 4** for troubleshooting

**Result:** Domain verified in Resend ✅

---

### Task 5: Update Database Schema
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Update `app/api/models/DomainModel.ts`
- [ ] Add fields: `verifiedForSending`, `verifiedForReceiving`, `resendDomainId`
- [ ] Copy schema from **DOMAIN_VERIFICATION_PLAN.md → Database Schema Updates**
- [ ] Restart dev server to load new schema

**Result:** Database model supports verification tracking

---

### Task 6: Mark Domain as Verified in Database
**Time:** 10 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open MongoDB Compass (or use script)
- [ ] Find `git-cv.com` in `domains` collection
- [ ] Set: `verifiedForSending: true`, `status: "verified"`
- [ ] See **DOMAIN_VERIFICATION_PLAN.md → Step: Update Existing Domain** for methods

**Result:** Database knows domain is verified

---

### Task 7: Update Reply API
**Time:** 45 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Open `app/api/emails/reply/route.ts`
- [ ] Add imports: `Alias`, `Domain`
- [ ] Add logic to fetch alias and domain
- [ ] Check `domain.verifiedForSending`
- [ ] Use customer domain if verified, fallback if not
- [ ] Copy code from **DOMAIN_VERIFICATION_PLAN.md → Reply API Updates**

**Result:** API sends from verified domain

---

### Task 8: Add Environment Variables
**Time:** 5 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Add to `.env.local`:
  ```
  REPLY_FROM_EMAIL=onboarding@resend.dev
  REPLY_FROM_NAME=Email Router
  ```
- [ ] Add same to Vercel environment variables
- [ ] See **DOMAIN_VERIFICATION_PLAN.md → Environment Variables**

**Result:** Fallback sender configured

---

### Task 9: Test Full Flow
**Time:** 30 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Send email to: `support@git-cv.com`
- [ ] Check Discord for notification
- [ ] Click reply link
- [ ] Fill form and send reply
- [ ] Check your email - should receive from `support@git-cv.com`
- [ ] Verify headers show correct domain
- [ ] Follow **DOMAIN_VERIFICATION_PLAN.md → Testing Plan**

**Result:** End-to-end flow working ✅

---

### Task 10: Verify Email Quality
**Time:** 15 minutes  
**Status:** ⬜ Not Started

**What to do:**
- [ ] Check email source/headers
- [ ] Verify From: `support@git-cv.com` ✅
- [ ] Verify DKIM signature present
- [ ] Verify email threads correctly
- [ ] Verify no spam warnings
- [ ] See **DOMAIN_VERIFICATION_PLAN.md → Test 2** for details

**Result:** Professional emails with no issues ✅

---

## Progress Tracking

**Setup:** ⬜⬜⬜⬜ (Tasks 1-4)  
**Code:** ⬜⬜⬜ (Tasks 5-7)  
**Config:** ⬜ (Task 8)  
**Testing:** ⬜⬜ (Tasks 9-10)  

**Total:** 0/10 tasks completed

---

## Quick Reference

### Files to Modify

**1. Domain Model:**
- File: `app/api/models/DomainModel.ts`
- Add: `verifiedForSending`, `verifiedForReceiving`, `resendDomainId`

**2. Reply API:**
- File: `app/api/emails/reply/route.ts`
- Add: Domain verification check logic
- Use: Customer domain if verified

**3. Environment:**
- File: `.env.local`
- Add: `REPLY_FROM_EMAIL`, `REPLY_FROM_NAME`

---

### DNS Records Needed

**DKIM (for email signing):**
```
Type: TXT
Host: resend._domainkey
Value: [from Resend dashboard]
```

**Verification (for ownership):**
```
Type: TXT
Host: _resend
Value: [from Resend dashboard]
```

**MX (for receiving):**
```
Type: MX
Host: @
Value: mx1.resend.dev
Priority: 10

Type: MX
Host: @
Value: mx2.resend.dev
Priority: 20
```

---

### Database Updates

**Mark domain as verified:**
```javascript
db.domains.updateOne(
  { domain: "git-cv.com" },
  { 
    $set: { 
      verifiedForSending: true,
      verifiedForReceiving: true,
      status: "verified"
    }
  }
);
```

---

### Testing Commands

**Check DNS propagation:**
```bash
dig TXT resend._domainkey.git-cv.com
dig MX git-cv.com
```

**Verify domain in database:**
```javascript
db.domains.findOne({ domain: "git-cv.com" })
```

---

## Troubleshooting Quick Guide

### Issue: Domain not verified in Resend
**Fix:** 
- Wait longer (DNS can take 24 hours)
- Check DNS records are correct
- Click "Verify" button in Resend

### Issue: Still sending from onboarding@resend.dev
**Fix:**
- Check database: `verifiedForSending: true`
- Check logs show "Using customer domain"
- Restart application

### Issue: Emails go to spam
**Fix:**
- Add SPF record: `v=spf1 include:_spf.resend.com ~all`
- Wait for DKIM to fully propagate
- Ask recipient to mark as "Not Spam"

**Full troubleshooting:** See DOMAIN_VERIFICATION_PLAN.md → Troubleshooting

---

## Success Criteria

✅ Feature is done when:
- [ ] Domain verified in Resend dashboard
- [ ] DNS records all showing as verified
- [ ] Database shows `verifiedForSending: true`
- [ ] Reply API uses customer domain
- [ ] Test email sends from `support@git-cv.com`
- [ ] Email headers show correct domain
- [ ] No spam warnings
- [ ] Email threads correctly
- [ ] Customer can reply back (full loop)

---

## After Completion

**You'll have:**
- ✅ Professional email sending from your domain
- ✅ Full email loop (receive → reply → customer replies back)
- ✅ No "via resend.dev" warnings
- ✅ Proper DKIM signatures
- ✅ Production-ready setup

**Next steps:**
- Add more aliases (sales@, billing@, etc.)
- Test with different domains
- Build automated verification UI (Phase 3)

---

## Need Help?

**For detailed instructions:** `DOMAIN_VERIFICATION_PLAN.md`  
**For code examples:** See plan sections with full code  
**For troubleshooting:** Plan has extensive troubleshooting section  

---

**Let's verify your domain! 🚀**