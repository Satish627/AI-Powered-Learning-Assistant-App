# Phase 2: Documents and Reader - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 2 adds the first real document workflow: authenticated users can upload a PDF, see it in a durable library with visible metadata and processing state, remove documents they own, and open a document into an in-app reader workspace. This phase does not add document-grounded chat, summaries, concept explainers, flashcards, quizzes, or advanced OCR. It prepares the product structure those later study features will plug into.

</domain>

<decisions>
## Implementation Decisions

### Document Storage and Ownership
- **D-01:** Store PDF binaries outside the app filesystem in durable object storage, while keeping document metadata and ownership records in MongoDB.
- **D-02:** Use an S3-compatible storage integration boundary so Phase 2 is not coupled to local disk semantics and can stay production-oriented from the start.
- **D-03:** All document upload, read, and delete actions must stay behind the existing authenticated backend boundary and remain scoped to the signed-in user only.
- **D-04:** Deleting a document in Phase 2 should be a real delete of both metadata and the stored file for that user rather than a soft-delete/archive flow.

### Upload Flow and Processing States
- **D-05:** Phase 2 should support single-PDF uploads per action, not batch upload or multi-file ingestion.
- **D-06:** Newly submitted documents should appear in the library immediately with visible lifecycle states: `uploading`, `processing`, `ready`, and `failed`.
- **D-07:** Non-ready documents should stay visible in the library with clear status messaging, but only `ready` documents should open into the study workspace.
- **D-08:** The processing-state model should be designed to extend cleanly into later AI ingestion stages without forcing a Phase 3 redesign of the document record or UI badges.

### Library Structure and Navigation
- **D-09:** Keep the dashboard as the authenticated home screen, and add a dedicated document library surface rather than overloading the dashboard with the full document-management experience.
- **D-10:** The primary navigation added in Phase 2 should expose only live product areas: `Dashboard` and `Library`.
- **D-11:** The document library should use a responsive card-based presentation instead of a dense admin-style table so it stays aligned with the existing visual system and works well on mobile.
- **D-12:** Each document card should surface the key study-ready metadata directly in the list: title, file size, upload date, processing status, and quick open/delete actions.

### Reader Workspace
- **D-13:** Opening a document should take the user into a dedicated study workspace route, not a modal viewer and not the browser's native PDF tab.
- **D-14:** The reader workspace should prioritize the embedded PDF viewer as the main pane, with a secondary companion panel reserved for document context and the future AI study tools.
- **D-15:** Phase 2 should include in-app page navigation controls and document context in the workspace so the reader already feels like part of the eventual study loop rather than an isolated file preview.
- **D-16:** The workspace should include a clear route back to the library and show document identity/state in the header area.

### the agent's Discretion
- The exact object storage provider and SDK details, as long as the implementation stays durable and S3-compatible in shape
- The exact PDF rendering library and page-navigation mechanics, as long as the reading experience remains embedded in-app
- The exact visual treatment of status badges, upload progress, empty states, and reader chrome within the established product direction
- Whether the library uses subtle supporting search-ready structure internally, as long as no out-of-scope search/filter UI is added in Phase 2

</decisions>

<specifics>
## Specific Ideas

- Keep the product feeling like a focused study workspace, not a generic file manager.
- Let the library feel polished and calm, with enough metadata to scan quickly without turning into a spreadsheet.
- Make the document workspace look obviously ready for the next phase by reserving space for AI actions instead of forcing a layout reset later.
- Preserve the existing dashboard-first app structure from Phase 1 while making `Library` the operational entry point for document work.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Definition
- `.planning/ROADMAP.md` — Phase 2 goal, success criteria, and plan boundaries
- `.planning/REQUIREMENTS.md` — Document and reader requirements `DOC-01` through `DOC-05` and `READ-01` through `READ-03`
- `.planning/PROJECT.md` — Product constraints, stack decisions, v1 scope, and durable-storage expectations
- `.planning/STATE.md` — Current project status and carried-forward Phase 2 concerns

### Repo Guidance
- `AGENTS.md` — Project-specific workflow guidance, storage constraints, and phase-branching rules

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend/app/(app)/layout.tsx` — Existing authenticated shell already provides the protected app frame that the library and reader should live inside.
- `frontend/components/app-shell/app-sidebar.tsx` — Sidebar is intentionally minimal and ready to expand with the Phase 2 `Library` navigation entry.
- `frontend/components/app-shell/app-header.tsx` — Header pattern already establishes workspace labeling and user-menu behavior for authenticated surfaces.
- `frontend/lib/api.ts` and `frontend/lib/auth.ts` — Existing frontend fetch/auth utilities already assume cookie-based authenticated API access and server-side protected-route checks.
- `backend/src/app.ts` — Backend router composition is already set up for new feature modules under `/api/...`.
- `backend/src/middleware/require-auth.ts` — Auth middleware provides the ownership boundary Phase 2 document routes should reuse.

### Established Patterns
- The frontend product shell is dashboard-first, card-oriented, and intentionally sparse rather than admin-table heavy.
- Protected app routes rely on server-side user resolution before rendering, so document surfaces should follow the same guarded pattern.
- Backend modules are organized by feature area with shared config/middleware rather than one large route file.

### Integration Points
- Phase 2 should extend the authenticated frontend shell in `frontend/app/(app)/...` rather than inventing a separate document app surface.
- New backend document routes should plug into the existing Express app alongside auth routes and use the auth middleware for user scoping.
- Document records should become the durable handoff point for Phase 3 retrieval and study-tool work, so the schema must support later processing evolution.

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-documents-and-reader*
*Context gathered: 2026-03-27*
