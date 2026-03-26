# Plan 01-02 Summary

## Outcome

Wave 2 implemented the real backend auth contract:

- Added a Mongoose user model with lowercase unique email storage and `passwordHash`.
- Added Zod request schemas for sign up and log in payload validation.
- Added JWT helpers with a shared `auth_token` cookie contract.
- Implemented `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`, and `/api/auth/me`.
- Added `requireAuth` middleware that verifies the cookie token and returns `401 Unauthorized` for missing or invalid sessions.
- Added auth-focused Vitest coverage for service logic and middleware behavior.

## Verification

- `cd backend && npm run test -- auth`
- `cd backend && npm run build`
- `rg -n '/api/auth|auth_token|Unauthorized' backend/src/app.ts backend/src/modules/auth backend/src/middleware/require-auth.ts`

## Notes

- `vitest@4` was incompatible with the local `Node 20.11.1` runtime exposed by `npm`, so Vitest was downgraded to a compatible `2.1.9` release to keep the planned `npm run test -- auth` workflow passing.
