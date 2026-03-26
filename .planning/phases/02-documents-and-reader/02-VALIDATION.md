---
phase: 02
slug: documents-and-reader
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-27
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 2.1.9 |
| **Config file** | `backend/vitest.config.ts` |
| **Quick run command** | `npm --prefix backend test -- src/modules/documents/documents.service.test.ts` |
| **Full suite command** | `npm --prefix backend test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm --prefix backend test -- src/modules/documents/documents.service.test.ts`
- **After every plan wave:** Run `npm --prefix backend test`
- **Before `$gsd-verify-work`:** Full suite must be green plus manual browser verification of upload, library, open, page navigation, and delete
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 0 | DOC-01 | integration | `npm --prefix backend test -- src/modules/documents/documents.routes.test.ts -t "initializes a PDF upload"` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 0 | DOC-02 | unit | `npm --prefix backend test -- src/modules/documents/documents.service.test.ts -t "persists metadata and status"` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 1 | DOC-03 | integration | `npm --prefix backend test -- src/modules/documents/documents.routes.test.ts -t "lists only owner documents"` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 1 | DOC-04 | integration | `npm --prefix backend test -- src/modules/documents/documents.routes.test.ts -t "returns a read URL only for ready docs"` | ❌ W0 | ⬜ pending |
| 02-02-03 | 02 | 1 | DOC-05 | integration | `npm --prefix backend test -- src/modules/documents/documents.routes.test.ts -t "deletes storage and metadata"` | ❌ W0 | ⬜ pending |
| 02-04-01 | 04 | 3 | READ-01 | manual | — browser smoke required | ❌ W0 | ⬜ pending |
| 02-04-02 | 04 | 3 | READ-02 | manual | — browser smoke required | ❌ W0 | ⬜ pending |
| 02-04-03 | 04 | 3 | READ-03 | manual | — browser smoke required | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `backend/src/modules/documents/documents.service.test.ts` — lifecycle transitions and storage adapter coordination
- [ ] `backend/src/modules/documents/documents.routes.test.ts` — auth, ownership, and route contracts
- [ ] `npm --prefix backend install -D supertest` — backend route test dependency
- [ ] Frontend browser automation is absent — either add Playwright for reader smoke tests or keep READ-* manual for this phase

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Render an uploaded PDF inside the authenticated app shell | READ-01 | No frontend browser automation exists yet | Log in, upload a ready test PDF, open it from `/library`, and confirm the PDF renders in the embedded viewer without leaving the app |
| Navigate between pages in the embedded PDF viewer | READ-02 | Page rendering and worker behavior need real browser validation | In the reader workspace, move forward and backward between pages, verify page count and current page labels update, and confirm mobile/desktop controls both work |
| Keep document context and future AI panel in the same reader workflow | READ-03 | Layout fit and route-level UX are visual behaviors | Open a ready document, verify the viewer remains the primary pane, the companion panel is present/responsive, and the workspace header links back to the library |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
