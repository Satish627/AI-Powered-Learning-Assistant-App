# Roadmap: AI-Powered Learning Assistant

## Overview

This roadmap takes the project from empty `frontend/` and `backend/` folders to a public, deployable AI-powered PDF learning product. The sequence is intentionally strict: first establish the app foundation and secure auth, then make documents durable and usable, then add grounded AI, then layer in study tools, and only after the full learning loop works end-to-end, finish the dashboard, polish, responsiveness, and launch hardening.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation and Authentication** - Create the Next.js + shadcn/ui frontend base, Node/Express backend base, and secure JWT auth flow.
- [ ] **Phase 2: Documents and Reader** - Build PDF upload, durable storage, document management, processing states, and embedded reading.
- [ ] **Phase 3: AI Document Intelligence** - Add document-grounded chat, summaries, concept explanations, and retrieval infrastructure.
- [ ] **Phase 4: Study Tools** - Generate flashcards and quizzes, persist results, and support favorites/review loops.
- [ ] **Phase 5: Dashboard, Polish, and Launch Readiness** - Add analytics, recent activity, responsive refinement, loading states, and production launch hardening.

## Phase Details

### Phase 1: Foundation and Authentication
**Goal**: Establish the repo as a real product foundation with Bun-powered Next.js in `frontend/`, Node/Express in `backend/`, shared environment/config conventions, MongoDB connectivity, JWT auth, and the initial public/app shells.
**Depends on**: Nothing (first phase)
**Requirements**: [AUTH-01, AUTH-02, AUTH-03, AUTH-04]
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. A Bun-managed Next.js app exists in `frontend/` with Tailwind CSS and shadcn/ui wired in.
  2. A Node/Express API exists in `backend/` with MongoDB connectivity, environment config, and a production-ready folder structure.
  3. User can sign up, log in, access protected app routes, and log out successfully.
  4. Frontend and backend communicate through a working authenticated flow rather than isolated stubs.
**Plans**: 3 plans

Plans:
- [x] 01-01: Scaffold `frontend/` and `backend/`, configure TypeScript/tooling, and establish shared conventions
- [x] 01-02: Implement backend auth, user model, JWT handling, and protected API middleware
- [x] 01-03: Build landing/auth screens, app shell, and protected route handling with shadcn/ui

### Phase 2: Documents and Reader
**Goal**: Make uploaded PDFs durable, visible, and usable through a library and in-app reading experience.
**Depends on**: Phase 1
**Requirements**: [DOC-01, DOC-02, DOC-03, DOC-04, DOC-05, READ-01, READ-02, READ-03]
**Success Criteria** (what must be TRUE):
  1. User can upload a PDF and see title, size, upload date, and processing state.
  2. User can browse their library, open a document, and delete a document they own.
  3. User can read the PDF inside the app and navigate between pages.
  4. The document workspace is ready for later AI actions rather than being a disconnected viewer.
**Plans**: 4 plans

Plans:
- [ ] 02-01-PLAN.md — Establish backend storage/env contracts, document schema, and PDF/storage helpers
- [ ] 02-02-PLAN.md — Implement the backend lifecycle API, async finalize flow, and backend tests
- [ ] 02-03-PLAN.md — Build the authenticated library route, upload UX, visible processing-state polling, and delete confirmation flow
- [ ] 02-04-PLAN.md — Add the reader workspace, embedded PDF viewer, and final browser verification checkpoint

### Phase 3: AI Document Intelligence
**Goal**: Turn uploaded PDFs into grounded AI study surfaces using chunking, embeddings, retrieval, and Gemini generation.
**Depends on**: Phase 2
**Requirements**: [AIST-01, AIST-02, AIST-03, AIST-04]
**Success Criteria** (what must be TRUE):
  1. User can ask a question about a selected document and receive a grounded answer inside the app.
  2. User can generate a document summary and a focused concept explanation on demand.
  3. Retrieval is document-scoped and robust enough that answers are based on uploaded content rather than random generic output.
  4. AI responses integrate naturally with the study workspace rather than feeling bolted on.
**Plans**: 3 plans

Plans:
- [ ] 03-01: Build PDF parsing, chunking, embeddings, and Atlas Vector Search retrieval
- [ ] 03-02: Implement grounded chat and concept explanation APIs/UI
- [ ] 03-03: Implement summary generation, response caching, and answer-quality guardrails

### Phase 4: Study Tools
**Goal**: Add active-recall and self-testing capabilities from document content through flashcards, favorites, and quizzes.
**Depends on**: Phase 3
**Requirements**: [FLSH-01, FLSH-02, FLSH-03, QUIZ-01, QUIZ-02, QUIZ-03]
**Success Criteria** (what must be TRUE):
  1. User can generate flashcards from a document and flip through them naturally.
  2. User can favorite important flashcards and revisit them later.
  3. User can generate a quiz with a configurable number of multiple-choice questions.
  4. User can submit quiz answers and review score, correct answers, and explanations.
**Plans**: 3 plans

Plans:
- [ ] 04-01: Implement flashcard generation, storage, and flip-review UI
- [ ] 04-02: Implement favorites system and flashcard review workflows
- [ ] 04-03: Implement quiz generation, submission, scoring, and explanation review

### Phase 5: Dashboard, Polish, and Launch Readiness
**Goal**: Make the app feel complete and public-ready with analytics, recent activity, responsive refinement, processing feedback, and deployment hardening.
**Depends on**: Phase 4
**Requirements**: [DASH-01, DASH-02, DASH-03, UX-01, UX-02, UX-03]
**Success Criteria** (what must be TRUE):
  1. User can open a dashboard that shows document, flashcard, and quiz totals plus recent study activity.
  2. User can review prior quiz outcomes from a history-oriented surface.
  3. Core flows feel polished across desktop and mobile, with clear loading and processing states.
  4. The project can be configured and deployed as a public app with production-safe environment and storage assumptions.
**Plans**: 3 plans

Plans:
- [ ] 05-01: Implement dashboard aggregations, recent activity feed, and quiz history views
- [ ] 05-02: Apply responsive and UX polish across landing, dashboard, reader, chat, flashcards, and quizzes
- [ ] 05-03: Harden deployment configuration, env management, and final launch readiness checks

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation and Authentication | 3/3 | Completed | 2026-03-26 |
| 2. Documents and Reader | 0/3 | Not started | - |
| 3. AI Document Intelligence | 0/3 | Not started | - |
| 4. Study Tools | 0/3 | Not started | - |
| 5. Dashboard, Polish, and Launch Readiness | 0/3 | Not started | - |
