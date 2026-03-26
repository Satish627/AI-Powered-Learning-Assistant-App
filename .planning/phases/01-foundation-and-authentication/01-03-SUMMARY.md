# Plan 01-03 Summary

## Outcome

Wave 3 completed the user-facing Phase 1 experience:

- Built a public marketing landing page at `/` with the primary CTA `Start Studying`.
- Built a single auth page at `/auth` with a shared sign up / log in form.
- Added cookie-aware frontend auth helpers targeting the live backend `/api/auth/*` endpoints with `credentials: "include"`.
- Added protected-route handling through frontend middleware and server-side current-user resolution.
- Built the authenticated shell on `/dashboard` with a left sidebar, top header, user menu, logout flow, and the approved empty-state copy.

## Verification

- `cd frontend && bun run build`
- `rg -n 'credentials: "include"|Start Studying|No documents yet|Upload your first PDF to start studying.' frontend`

## Notes

- The authenticated home route was implemented at `/dashboard` instead of a second root-level `page.tsx` because Next.js App Router does not allow both a public landing page and an authenticated dashboard to exist as separate root pages at `/`.
