# Phase 1: Foundation and Authentication - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 1 establishes the product foundation: a Bun-managed Next.js app in `frontend/`, a Node/Express API in `backend/`, shared environment/config conventions, MongoDB connectivity, JWT-based authentication, and the initial public and authenticated app shells. This phase does not add document upload, AI study features, flashcards, quizzes, or dashboard analytics beyond the shell needed to enter the product successfully.

</domain>

<decisions>
## Implementation Decisions

### Authentication Model
- **D-01:** Use JWT-based authentication via `httpOnly` cookies rather than storing tokens in browser storage.
- **D-02:** Keep users signed in until logout or cookie expiry; do not use an aggressively short session model in Phase 1.
- **D-03:** Logout only needs to end the session on the current device/browser in Phase 1.
- **D-04:** Phase 1 authentication should support email/password only.

### Auth Entry Flow
- **D-05:** Unauthenticated users should see a public landing page first, with sign up/login CTA paths into the product.
- **D-06:** Use a single auth page with a sign up/login switch instead of separate auth pages or modal auth.
- **D-07:** Do not require email verification in Phase 1.
- **D-08:** After successful signup, send the user directly into the authenticated app instead of adding a welcome/onboarding step first.

### Authenticated App Shell
- **D-09:** The first logged-in screen should be the dashboard/home workspace.
- **D-10:** The authenticated app shell should use a left sidebar navigation structure.
- **D-11:** Only show live sections in the Phase 1 navigation; do not show disabled or "coming soon" product areas yet.
- **D-12:** The authenticated header should contain only the app name/logo and user menu in Phase 1.

### the agent's Discretion
- Exact cookie settings, token lifetime values, and refresh implementation details as long as they respect the `httpOnly` cookie decision
- Exact visual design of the landing page, auth page, sidebar, and shell header within the established product direction
- Backend module/file organization details as long as the result is clean and production-ready

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Definition
- `.planning/ROADMAP.md` — Phase 1 goal, success criteria, and plan boundaries
- `.planning/REQUIREMENTS.md` — Authentication requirements `AUTH-01` through `AUTH-04`
- `.planning/PROJECT.md` — Product constraints, stack decisions, and v1 scope boundaries
- `.planning/STATE.md` — Current project status and carried-forward concerns

### Repo Guidance
- `AGENTS.md` — Project-specific workflow guidance, stack expectations, and phase-branching rules

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None yet — `frontend/` and `backend/` exist but contain no implementation files at this stage.

### Established Patterns
- None yet — this phase establishes the initial project patterns for structure, auth, app shell, and frontend/backend integration.

### Integration Points
- `frontend/` will become the Next.js application surface.
- `backend/` will become the Node/Express API surface.
- Phase 1 decisions should create clean handoff points for later document, AI, flashcard, quiz, and dashboard phases.

</code_context>

<specifics>
## Specific Ideas

- Keep the product public-facing from the start with a real landing page rather than an auth-only entry.
- Make the authenticated experience feel like a real app shell immediately, with dashboard-first routing and a left sidebar that can scale as later phases land.
- Keep Phase 1 lean on auth complexity: email/password only, no email verification, no global logout.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-foundation-and-authentication*
*Context gathered: 2026-03-26*
