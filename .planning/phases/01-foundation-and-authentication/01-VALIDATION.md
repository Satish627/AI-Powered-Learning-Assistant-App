---
phase: 1
slug: foundation-and-authentication
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest + build/lint smoke checks |
| **Config file** | `backend/vitest.config.ts` (Wave 0 if missing) |
| **Quick run command** | `cd backend && npm run test -- --runInBand` |
| **Full suite command** | `cd backend && npm run test && cd ../frontend && bun run lint && bun run build` |
| **Estimated runtime** | ~45-90 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd backend && npm run test -- --runInBand` for backend-touching tasks, or the most relevant single build/lint command for frontend-only tasks
- **After every plan wave:** Run `cd backend && npm run test && cd ../frontend && bun run lint && bun run build`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 90 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | AUTH-01 | build/smoke | `cd frontend && bun run build && cd ../backend && npm run build` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | AUTH-02 | unit/integration | `cd backend && npm run test -- auth` | ❌ W0 | ⬜ pending |
| 1-01-03 | 01 | 2 | AUTH-03 | middleware/integration | `cd backend && npm run test -- auth` | ❌ W0 | ⬜ pending |
| 1-01-04 | 01 | 2 | AUTH-04 | unit/integration | `cd backend && npm run test -- auth` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `backend/vitest.config.ts` — base Vitest config for backend tests
- [ ] `backend/src/modules/auth/auth.service.test.ts` — auth service coverage for signup/login/logout behavior
- [ ] `backend/src/modules/auth/auth.middleware.test.ts` — protected-route middleware checks
- [ ] `frontend/package.json` scripts include `lint` and `build`
- [ ] `backend/package.json` scripts include `test` and `build`

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Landing page to auth CTA flow works | AUTH-01 | UX flow spans public UI and auth entry routing | Open landing page, click CTA, confirm auth view loads correctly |
| Signup redirects into authenticated shell | AUTH-01, AUTH-02 | End-to-end redirect behavior is easiest to confirm manually in Phase 1 | Create account, confirm redirect to dashboard/home workspace |
| Sidebar shell shows only live sections | AUTH-03 | UI composition and nav visibility are presentation-level checks | Log in and inspect sidebar/header in app shell |
| Logout clears current browser session | AUTH-04 | Cookie/session clearing is simplest to verify manually initially | Log in, click logout, refresh protected route, confirm access is denied |

*If none: "All phase behaviors have automated verification."*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 90s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
