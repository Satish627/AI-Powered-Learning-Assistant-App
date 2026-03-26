# Phase 1: Foundation and Authentication - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-26
**Phase:** 1-Foundation and Authentication
**Areas discussed:** Auth session model, Auth entry flow, App shell after login

---

## Auth Session Model

### JWT storage

| Option | Description | Selected |
|--------|-------------|----------|
| `httpOnly` cookie | Better default security for a public app; frontend doesn’t manage raw tokens directly | ✓ |
| Browser storage token | Simpler to reason about at first, but weaker against XSS | |
| Access token in memory + refresh cookie | Stronger pattern, but more moving parts in Phase 1 | |

**User's choice:** `httpOnly` cookie  
**Notes:** User accepted the recommended option.

### Login persistence

| Option | Description | Selected |
|--------|-------------|----------|
| Stay signed in until logout or cookie expiry | Standard public-app behavior | ✓ |
| Short session that expires aggressively | More secure feel, but more friction | |
| `Remember me` toggle | More control, but extra UI and session logic in Phase 1 | |

**User's choice:** Stay signed in until logout or cookie expiry  
**Notes:** Keep persistence simple in Phase 1.

### Logout behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Log out only on the current device/browser for now | Simplest solid Phase 1 behavior | ✓ |
| Log out everywhere | Stronger session control, but adds session tracking work now | |
| Let the agent decide | Defer implementation choice | |

**User's choice:** Current-device logout only  
**Notes:** Global logout can wait for a later auth hardening phase if needed.

### Auth options

| Option | Description | Selected |
|--------|-------------|----------|
| Email + password only | Enough to satisfy Phase 1 auth requirements cleanly | ✓ |
| Email + password + Google sign-in | Stronger UX, but adds OAuth setup immediately | |
| Magic link only | Clean UX, but changes the auth shape substantially | |

**User's choice:** Email + password only  
**Notes:** OAuth and alternate methods are deferred.

---

## Auth Entry Flow

### Unauthenticated entry

| Option | Description | Selected |
|--------|-------------|----------|
| Public landing page first | Better fit for a public deployable app | ✓ |
| Go straight to auth page | Simpler, but weaker as a public product | |
| Split by route: landing at `/`, auth at `/auth` | Similar to landing-first, but explicitly structured from the start | |

**User's choice:** Public landing page first  
**Notes:** Product should feel public-facing from day one.

### Auth page structure

| Option | Description | Selected |
|--------|-------------|----------|
| One auth page with sign up/login switch | Clean and fast for Phase 1 | ✓ |
| Separate `/login` and `/signup` pages | Clearer route separation, but more duplicated surface area | |
| Modal auth from the landing page | Slicker feel, but adds UI complexity too early | |

**User's choice:** One auth page with sign up/login switch  
**Notes:** Keep the surface compact.

### Email verification

| Option | Description | Selected |
|--------|-------------|----------|
| No email verification in Phase 1 | Keeps the foundation/auth phase moving and avoids mail delivery setup immediately | ✓ |
| Require email verification before app access | Stronger account validation, but adds backend/email infrastructure now | |
| Allow app access first, but prompt for verification later | Adds extra state handling | |

**User's choice:** No email verification in Phase 1  
**Notes:** Mail delivery setup is intentionally deferred.

### Post-signup routing

| Option | Description | Selected |
|--------|-------------|----------|
| Straight into the authenticated app shell | Fastest path to first value | ✓ |
| Show a lightweight welcome/onboarding step first | Better framing, but more Phase 1 UI work | |
| Return to landing page and ask them to log in | Unnecessary friction | |

**User's choice:** Straight into the authenticated app shell  
**Notes:** New users should enter the product immediately.

---

## App Shell After Login

### First logged-in screen

| Option | Description | Selected |
|--------|-------------|----------|
| Dashboard/home workspace | Best fit because later phases already depend on a dashboard as the product anchor | ✓ |
| Empty document library first | Very direct, but narrower than a real app home | |
| Open a `create/upload first document` screen immediately | Useful for activation, but abrupt | |

**User's choice:** Dashboard/home workspace  
**Notes:** User initially selected the library option by mistake, then corrected this to dashboard/home workspace.

### Authenticated navigation

| Option | Description | Selected |
|--------|-------------|----------|
| Left sidebar navigation | Scalable for dashboard, library, flashcards, quizzes, and settings | ✓ |
| Top navigation bar only | Simpler at first, but tighter once product surfaces grow | |
| Hybrid: top bar + minimal side nav | Stronger structure, but more setup in Phase 1 | |

**User's choice:** Left sidebar navigation  
**Notes:** Chosen after clarifying the prior corrected dashboard decision.

### Future sections in nav

| Option | Description | Selected |
|--------|-------------|----------|
| Show only live sections in Phase 1 | Cleaner and avoids dead-end UI | ✓ |
| Show future sections as disabled/coming soon items | Communicates product shape early | |
| Let the agent decide | Defer decision | |

**User's choice:** Show only live sections in Phase 1  
**Notes:** Avoid premature dead-end navigation.

### Header content

| Option | Description | Selected |
|--------|-------------|----------|
| App name/logo + user menu only | Enough for Phase 1 without inventing extra controls too early | ✓ |
| Search bar + app name + user menu | Anticipates future library/search needs, but adds noise now | |
| App name + quick upload button + user menu | Useful later, but upload is Phase 2 | |

**User's choice:** App name/logo + user menu only  
**Notes:** Keep the shell header intentionally minimal at first.

---

## the agent's Discretion

- Cookie/token lifetime tuning
- Exact UI styling and shell composition details
- Backend module organization

## Deferred Ideas

None — discussion stayed within phase scope.
