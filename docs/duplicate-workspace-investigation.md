# Duplicate Workspace Investigation
**Date:** 2026-04-27  
**User:** `user_3BpwdqPgdTzsuLk1sAFNgixyZZH`

---

## Root Cause

Both workspaces share the exact same `createdAt: 2026-04-03T06:56:59.126Z` — created at the same millisecond. This was a race condition in `getOrCreateWorkspaceForCurrentUser()` — two concurrent API requests fired on first login before either could see the other's upsert, resulting in two workspace documents for the same user.

---

## Workspace 1 — ACTIVE (keep this)

| Field | Value |
|-------|-------|
| `_id` | `69ea2fcdc22c4c9e73a8d090` |
| `ownerUserId` | `user_3BpwdqPgdTzsuLk1sAFNgixyZZH` |
| `planId` | `growth` |
| `createdAt` | 2026-04-03T06:56:59.126Z |
| `updatedAt` | 2026-04-26T22:20:29.230Z |

### Domain
| domain | status | createdAt |
|--------|--------|-----------|
| `syncsupport.app` | verified | 2026-04-24 |

### Integrations (5)
| `_id` | name | type | createdAt |
|-------|------|------|-----------|
| `69eb8779a588f95cb1f6f185` | SyncSupport · #support | slack | 2026-04-24 |
| `69eb8a45078fc30f58e86534` | SyncSupport · #live-chat | slack | 2026-04-24 |
| `69eb8d77a7911ad146151dba` | SyncSupport · #billing | slack | 2026-04-24 |
| `69ec3910caba583b9d36b031` | Aditya · #finaltest | slack | 2026-04-25 |
| `69edf54a7fdc50e0cf8b09b4` | SyncSupport · #pricing | slack | 2026-04-26 |

### Aliases (4) — all healthy ✅
| email | integrationId | status | createdAt |
|-------|---------------|--------|-----------|
| `support@syncsupport.app` | `69eb8779a588f95cb1f6f185` | active | 2026-04-24 |
| `billing@syncsupport.app` | `69eb8d77a7911ad146151dba` | active | 2026-04-24 |
| `finaltest@syncsupport.app` | `69ec3910caba583b9d36b031` | active | 2026-04-25 |
| `pricing@syncsupport.app` | `69edf54a7fdc50e0cf8b09b4` | active | 2026-04-26 |

### Email Threads
- **38 threads** — current active tickets

---

## Workspace 2 — GHOST (delete this)

| Field | Value |
|-------|-------|
| `_id` | `69ea2ff5dfad33fec4979593` |
| `ownerUserId` | `user_3BpwdqPgdTzsuLk1sAFNgixyZZH` |
| `planId` | `starter` |
| `createdAt` | 2026-04-03T06:56:59.126Z |
| `updatedAt` | 2026-04-23T14:42:52.129Z |

### Domain
| domain | status | createdAt |
|--------|--------|-----------|
| `syncsupport.app` | verified | 2026-04-23 |

### Integrations (5) — integration documents deleted from DB, only IDs remain as references
| `_id` | name | type | createdAt |
|-------|------|------|-----------|
| `69ea2ff7dfad33fec4979598` | Aditya · #testing | slack | 2026-04-09 |
| `69ea2ff7dfad33fec4979599` | SyncSupport · #support | slack | 2026-04-15 |
| `69ea2ff7dfad33fec497959a` | SyncSupport · #pricing | slack | 2026-04-15 |
| `69ea2ff7dfad33fec497959b` | SyncSupport · #billing | slack | 2026-04-15 |
| `69ea2ff7dfad33fec497959c` | SyncSupport · #live-chat | slack | 2026-04-15 |

### Aliases (3) — all broken ❌
| email | integrationId (deleted) | status | createdAt |
|-------|-------------------------|--------|-----------|
| `support@syncsupport.app` | `69df6e7dc364a3fcda2e3bc0` ❌ | active | 2026-04-23 |
| `billing@syncsupport.app` | `69df7113b4685c749a27307a` ❌ | active | 2026-04-23 |
| `pricing@syncsupport.app` | `69df70f7046c1ab57b3ac51b` ❌ | active | 2026-04-23 |

### Email Threads
- **24 threads** — old tickets from the ghost workspace

---

## Impact

The webhook `POST /api/webhooks/resend/route.ts` uses `Alias.findOne()` without filtering by `workspaceId`. When an email arrives at `support@syncsupport.app`, MongoDB returns the ghost workspace's broken alias first, causing:

```
⚠️ Integration not found for alias: support@syncsupport.app
```

---

## Cleanup Plan

1. **Delete** the 3 broken aliases from workspace `69ea2ff5...`
2. **Decide** what to do with the 24 orphaned email threads
3. **Delete** the ghost workspace `69ea2ff5...` and its domain + integrations
4. **Fix** the race condition in `getOrCreateWorkspaceForCurrentUser()` to prevent recurrence
