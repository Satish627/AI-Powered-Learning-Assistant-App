# Phase 1: Foundation and Authentication - Research

**Researched:** 2026-03-26
**Domain:** Next.js + Bun frontend foundation, Express/MongoDB backend foundation, and cookie-based JWT authentication
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use JWT-based authentication via `httpOnly` cookies rather than storing tokens in browser storage.
- Keep users signed in until logout or cookie expiry; do not use an aggressively short session model in Phase 1.
- Logout only needs to end the session on the current device/browser in Phase 1.
- Phase 1 authentication should support email/password only.
- Unauthenticated users should see a public landing page first, with sign up/login CTA paths into the product.
- Use a single auth page with a sign up/login switch instead of separate auth pages or modal auth.
- Do not require email verification in Phase 1.
- After successful signup, send the user directly into the authenticated app instead of adding a welcome/onboarding step first.
- The first logged-in screen should be the dashboard/home workspace.
- The authenticated app shell should use a left sidebar navigation structure.
- Only show live sections in the Phase 1 navigation; do not show disabled or "coming soon" product areas yet.
- The authenticated header should contain only the app name/logo and user menu in Phase 1.

### the agent's Discretion
- Exact cookie settings, token lifetime values, and refresh implementation details as long as they respect the `httpOnly` cookie decision
- Exact visual design of the landing page, auth page, sidebar, and shell header within the established product direction
- Backend module/file organization details as long as the result is clean and production-ready

### Deferred Ideas (OUT OF SCOPE)
- None — Phase 1 discussion stayed within scope

</user_constraints>

<research_summary>
## Summary

Phase 1 should use a straightforward split-app architecture: a Bun-managed Next.js App Router frontend with Tailwind CSS and shadcn/ui in `frontend/`, and a TypeScript Express 5 API in `backend/` using MongoDB via Mongoose. The standard public-app auth approach that fits the user's decisions is email/password login with hashed passwords, JWT access/auth state transported in secure `httpOnly` cookies, server-side auth middleware, and a small authenticated session model without full multi-device session management yet.

For the frontend foundation, the current standard path is to scaffold directly with `create-next-app`, keep the app organized around public and authenticated route groups, and initialize shadcn/ui early so layout, form, and shell primitives do not drift into one-off Tailwind implementations. For the backend foundation, experts typically keep Express small but structured: config/bootstrap, modules, middleware, shared utilities, request validation, and explicit environment loading. This is enough for a production-ready base without prematurely splitting into microservices or over-abstracting the auth layer.

The main planning implication is that Phase 1 should not try to solve future auth hardening or product features. It should deliver a stable public landing page, one auth surface, a real authenticated shell, backend auth endpoints, database connectivity, shared environment contracts, and a reliable frontend/backend cookie-auth handshake. Testing should focus on fast feedback: backend auth/unit flows plus frontend build/lint smoke checks.

**Primary recommendation:** Plan Phase 1 as three concrete workstreams: scaffold both apps and shared conventions, implement backend auth and cookie/session middleware, then build the landing/auth/app-shell surfaces with real integration to the API.
</research_summary>

<standard_stack>
## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.x | Frontend app shell and routing | Current official path for React web apps; App Router and route groups fit public/app split well |
| React | 19.2 via Next.js | UI runtime | Current Next.js stable pairing |
| Bun | 1.3.x | Frontend package manager/runtime | Official Bun guidance supports Next.js workflows and keeps the frontend toolchain fast |
| Express | 5.x | Backend HTTP framework | Mature, simple, and sufficient for auth/API foundation work |
| Node.js | 24 LTS | Backend runtime | Use LTS for backend stability |
| MongoDB Atlas + Mongoose | current + 9.x | Persistence and schema modeling | Matches project stack and keeps auth/user modeling straightforward |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Tailwind CSS | 4.x | Styling system | Use across all frontend surfaces from day one |
| shadcn/ui | latest stable | UI primitives and component patterns | Use for auth forms, sidebar, buttons, cards, dialogs, inputs |
| `zod` | 4.x | Request/env validation | Use for API payload parsing and shared frontend/backend schemas where helpful |
| `bcryptjs` | latest stable | Password hashing | Use for email/password storage and comparison |
| `jsonwebtoken` | latest stable | JWT signing/verification | Use for cookie-carried auth tokens |
| `cookie-parser` | latest stable | Read signed/unsigned cookies in Express | Use for auth middleware and logout flows |
| `cors` | latest stable | Cross-origin cookie-aware API access | Use if frontend and backend run on separate origins in development/deployment |
| `helmet` | latest stable | Common HTTP security headers | Use from the start |
| `tsx` | latest stable | TypeScript execution for backend dev scripts | Simple TypeScript backend developer experience |
| Vitest | current | Unit/integration testing | Good fit for both frontend utility tests and backend service tests |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Express 5 | Fastify | Fastify is strong, but Express is simpler for this foundation phase and matches the user's requested stack more directly |
| Custom Tailwind component set | shadcn/ui | Hand-rolling increases design drift; shadcn/ui is the better base because the user explicitly requested it |
| Browser-stored JWTs | `httpOnly` cookie JWTs | Browser storage is simpler but weaker against XSS; `httpOnly` cookies align better with a public app |
| Separate `/login` and `/signup` pages | One auth page with switch | Separate pages are viable, but the locked decision is to keep auth compact in Phase 1 |

**Installation:**
```bash
# frontend
cd frontend
bun create next-app@latest .
bun add tailwindcss @tailwindcss/postcss postcss zod
bunx shadcn@latest init

# backend
cd ../backend
npm init -y
npm install express mongoose jsonwebtoken bcryptjs cookie-parser cors helmet zod dotenv
npm install -D typescript tsx vitest @types/node @types/express @types/cookie-parser @types/jsonwebtoken
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```text
frontend/
├── app/
│   ├── (marketing)/      # landing/public routes
│   ├── (auth)/           # auth page(s)
│   ├── (app)/            # authenticated shell and dashboard home
│   └── globals.css
├── components/
│   ├── ui/               # shadcn/ui components
│   └── app-shell/        # sidebar/header/auth-specific composition
├── lib/                  # API client, env helpers, schemas
└── hooks/                # client hooks if needed

backend/
├── src/
│   ├── config/           # env, db, app config
│   ├── modules/
│   │   └── auth/         # routes, controller/service, model
│   ├── middleware/       # auth, errors, request guards
│   ├── shared/           # base utils/constants
│   └── server.ts         # entrypoint
└── vitest.config.ts
```

### Pattern 1: Route-grouped Next.js shell
**What:** Separate public, auth, and app surfaces with App Router route groups.
**When to use:** Immediately in Phase 1, because the product already needs a landing page, an auth page, and an authenticated workspace.
**Example:**
```typescript
// frontend/app/(app)/layout.tsx
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1">
        <AppHeader />
        <main>{children}</main>
      </div>
    </div>
  );
}
```

### Pattern 2: Service-layer auth in Express
**What:** Keep routes thin and move password/JWT/cookie logic into an auth service plus middleware.
**When to use:** For Phase 1 auth endpoints so the planner can separate setup, business logic, and protected-route behavior.
**Example:**
```typescript
// backend/src/modules/auth/auth.service.ts
export async function loginUser(input: LoginInput) {
  const user = await UserModel.findOne({ email: input.email.toLowerCase() });
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw new Error("INVALID_CREDENTIALS");

  return signAuthToken({ userId: user.id, email: user.email });
}
```

### Anti-Patterns to Avoid
- **Putting raw token handling in the frontend:** the locked decision is `httpOnly` cookies; do not build a client-managed token store as the main auth path.
- **Scaffolding UI without shadcn/ui from the start:** this leads to a fragmented visual system and extra refactor work in Phase 1 itself.
- **Combining public/auth/app concerns into one flat route layer:** use route-group boundaries early so later phases slot into a stable shell.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Basic UI primitives | A one-off internal button/input/card library in Phase 1 | shadcn/ui | Faster to establish a consistent visual system and form handling base |
| Password hashing | Custom hash/encryption logic | `bcryptjs` | Password hashing has well-known edge cases and should use a battle-tested library |
| Request validation | Ad hoc `if` chains in every route | `zod` schemas | Keeps payload handling explicit and easier to test |
| App shell layout system | One-off nav/header/page wrappers per route | Shared sidebar/header layout components | Prevents early duplication and keeps later phases consistent |

**Key insight:** Phase 1 succeeds by establishing standards quickly, not by inventing infrastructure that mature libraries already solve cleanly.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Cookie auth configured incorrectly across frontend/backend boundaries
**What goes wrong:** Login appears to succeed but protected routes fail because cookies are not sent or read correctly.
**Why it happens:** Missing `credentials` handling on the frontend, incorrect CORS config, or wrong cookie flags for the dev environment.
**How to avoid:** Plan explicit frontend fetch settings, backend CORS with credentials support, and environment-aware cookie options.
**Warning signs:** Login response returns success but authenticated requests act like the user is logged out.

### Pitfall 2: Overbuilding auth before core product foundation is ready
**What goes wrong:** Phase 1 drifts into email verification, OAuth, password reset, or multi-device session management and loses momentum.
**Why it happens:** Auth work naturally invites extra “while we’re here” additions.
**How to avoid:** Keep planning anchored to `AUTH-01` through `AUTH-04` only.
**Warning signs:** Tasks start mentioning email service providers, social login, or session dashboards.

### Pitfall 3: Weak shell foundation that later phases have to replace
**What goes wrong:** Dashboard, library, and later product areas end up reworking the entire navigation/header/layout system.
**Why it happens:** Teams treat Phase 1 shell work as temporary scaffolding rather than the real product frame.
**How to avoid:** Plan a durable sidebar + header + route-group shell now, even if only a few sections are live.
**Warning signs:** “We’ll just hardcode a placeholder page” starts to replace layout/system decisions.
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from official sources and current ecosystem practice:

### Cookie-aware frontend request
```typescript
// Source basis: current browser fetch + cookie-auth API patterns
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

### Express cookie-backed auth response
```typescript
// Source basis: Express + cookie-parser + JWT patterns
res.cookie("auth_token", token, {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 7,
});

res.status(200).json({ user: safeUser });
```

### Protected route middleware
```typescript
// Source basis: standard Express JWT middleware structure
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    req.auth = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

What's changed recently:

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router-first Next.js guidance | App Router-first Next.js guidance | Next.js 13+ and current 2026 docs | Phase 1 should plan around route groups and layouts, not legacy page-only assumptions |
| Tailwind-only custom component stacks by default | Tailwind + shadcn/ui for many product teams | Widely normalized over the last few years | Better to initialize the component system immediately |
| Separate vector DB assumptions for AI products | Single-database start with Atlas Vector Search is increasingly normal for MVPs | 2024-2026 | Helps keep future auth/data work aligned without early infra sprawl |

**New tools/patterns to consider:**
- Bun-native Next.js workflow: good fit for fast frontend setup and scripts in this repo
- Route-grouped App Router shell design: lets the product separate marketing, auth, and app concerns immediately

**Deprecated/outdated:**
- Browser-stored JWTs as the default public-app recommendation
- Treating Phase 1 shell/layout as disposable scaffolding
</sota_updates>

## Validation Architecture

### Testing Approach
- **Primary framework:** Vitest for backend logic and small shared utility tests
- **Frontend safety checks:** `bun run lint` and `bun run build`
- **Backend safety checks:** `npm run test` and `npm run build` (or equivalent TypeScript compile script)

### Fast Feedback Contract
- Add backend auth/service tests in the same phase that introduces auth logic
- Ensure the frontend can build successfully once the landing/auth/app shell exists
- Ensure the backend boots with environment validation and MongoDB connection wiring even if integration tests remain shallow in Phase 1

### Wave 0 Expectation
- If no test harness exists after scaffolding, Phase 1 planning should include Wave 0 work to install/configure Vitest and add the first auth-focused tests

### Validation Focus
- Auth input validation and password handling
- JWT creation/verification utility behavior
- Protected-route middleware behavior
- Frontend shell/lint/build smoke validation

<open_questions>
## Open Questions

1. **Exact cookie lifetime and refresh model**
   - What we know: user wants long-lived login until logout or expiry, using `httpOnly` cookies
   - What's unclear: whether Phase 1 should use one long-lived JWT or short-lived access plus refresh cookie
   - Recommendation: planner should choose the simpler secure variant that still fits the locked decisions and Phase 1 scope

2. **Frontend-to-backend origin strategy in development**
   - What we know: frontend and backend live in separate folders and may run on different local ports
   - What's unclear: whether the phase should normalize dev via proxy/rewrites or explicit API base URL + CORS
   - Recommendation: planner should make one clear convention part of the foundation tasks to prevent auth-cookie drift
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- https://nextjs.org/docs/app/getting-started — current App Router and installation guidance
- https://nextjs.org/blog/next-16 — current stable release direction
- https://bun.sh/docs/runtime/nodejs-apis — Bun compatibility for Next.js/Express ecosystem packages
- https://ui.shadcn.com/docs/installation/next — current shadcn/ui Next.js installation path
- https://nodejs.org/en/download/releases/ — Node LTS guidance
- https://expressjs.com/en/starter/installing.html — Express runtime guidance
- https://expressjs.com/en/guide/migrating-5.html — Express 5 guidance
- https://mongoosejs.com/docs/version-support.html — current Mongoose support guidance

### Secondary (MEDIUM confidence)
- Project-level research already captured in `.planning/research/STACK.md`
- Project-level research already captured in `.planning/research/SUMMARY.md`

### Tertiary (LOW confidence - needs validation)
- Exact cookie lifetime and refresh strategy should be finalized during planning, not research
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Next.js + Bun + shadcn/ui, Express 5, MongoDB/Mongoose, cookie JWT auth
- Ecosystem: validation, security middleware, auth foundation, route/group shell setup
- Patterns: route-group shell, service-layer auth, cookie-aware frontend/backend integration
- Pitfalls: CORS/cookie drift, auth scope creep, disposable shell design

**Confidence breakdown:**
- Standard stack: HIGH - current official docs and project-level research already align strongly
- Architecture: HIGH - phase scope is foundational and well-understood
- Pitfalls: HIGH - these are common and concrete for split frontend/backend auth setups
- Code examples: MEDIUM - examples reflect standard patterns but exact implementation remains project-specific

**Research date:** 2026-03-26
**Valid until:** 2026-04-25
</metadata>

---

*Phase: 01-foundation-and-authentication*
*Research completed: 2026-03-26*
*Ready for planning: yes*
