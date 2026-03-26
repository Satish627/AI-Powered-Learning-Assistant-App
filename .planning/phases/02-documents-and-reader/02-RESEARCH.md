# Phase 02: Documents and Reader - Research

**Researched:** 2026-03-27
**Domain:** Durable PDF storage, document lifecycle design, library UX, and embedded reader workspace
**Confidence:** MEDIUM

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Store PDF binaries outside the app filesystem in durable object storage, while keeping document metadata and ownership records in MongoDB.
- **D-02:** Use an S3-compatible storage integration boundary so Phase 2 is not coupled to local disk semantics and can stay production-oriented from the start.
- **D-03:** All document upload, read, and delete actions must stay behind the existing authenticated backend boundary and remain scoped to the signed-in user only.
- **D-04:** Deleting a document in Phase 2 should be a real delete of both metadata and the stored file for that user rather than a soft-delete/archive flow.
- **D-05:** Phase 2 should support single-PDF uploads per action, not batch upload or multi-file ingestion.
- **D-06:** Newly submitted documents should appear in the library immediately with visible lifecycle states: `uploading`, `processing`, `ready`, and `failed`.
- **D-07:** Non-ready documents should stay visible in the library with clear status messaging, but only `ready` documents should open into the study workspace.
- **D-08:** The processing-state model should be designed to extend cleanly into later AI ingestion stages without forcing a Phase 3 redesign of the document record or UI badges.
- **D-09:** Keep the dashboard as the authenticated home screen, and add a dedicated document library surface rather than overloading the dashboard with the full document-management experience.
- **D-10:** The primary navigation added in Phase 2 should expose only live product areas: `Dashboard` and `Library`.
- **D-11:** The document library should use a responsive card-based presentation instead of a dense admin-style table so it stays aligned with the existing visual system and works well on mobile.
- **D-12:** Each document card should surface the key study-ready metadata directly in the list: title, file size, upload date, processing status, and quick open/delete actions.
- **D-13:** Opening a document should take the user into a dedicated study workspace route, not a modal viewer and not the browser's native PDF tab.
- **D-14:** The reader workspace should prioritize the embedded PDF viewer as the main pane, with a secondary companion panel reserved for document context and the future AI study tools.
- **D-15:** Phase 2 should include in-app page navigation controls and document context in the workspace so the reader already feels like part of the eventual study loop rather than an isolated file preview.
- **D-16:** The workspace should include a clear route back to the library and show document identity/state in the header area.

### Claude's Discretion
- The exact object storage provider and SDK details, as long as the implementation stays durable and S3-compatible in shape
- The exact PDF rendering library and page-navigation mechanics, as long as the reading experience remains embedded in-app
- The exact visual treatment of status badges, upload progress, empty states, and reader chrome within the established product direction
- Whether the library uses subtle supporting search-ready structure internally, as long as no out-of-scope search/filter UI is added in Phase 2

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DOC-01 | User can upload a PDF document from the web app | Auth-gated upload session, S3-compatible storage boundary, status model, file validation, env contract |
| DOC-02 | User can see each uploaded document's title, file size, upload date, and processing status | Document schema, library card metadata shape, timestamps, metadata extraction, status badges |
| DOC-03 | User can view a list of their uploaded documents in a library/dashboard view | `GET /api/documents`, owner-scoped indexes, responsive card library route under app shell |
| DOC-04 | User can open a document from their library into the study workspace | Ready-only open flow, signed viewer access URL, dedicated `/library/[documentId]` route |
| DOC-05 | User can remove a document from their library | Owner-only delete endpoint, object-store delete plus metadata delete, idempotency guidance |
| READ-01 | User can read an uploaded PDF inside the app without leaving the platform | Client-only `react-pdf` reader island, embedded workspace layout, signed read access |
| READ-02 | User can navigate between pages in the embedded PDF viewer | `Document` + `Page` usage, page state, reader controls, mobile/desktop layout constraints |
| READ-03 | User can study a selected document with the reader and AI tools in the same workflow | Reserved right-side companion panel, route/header context, state model that extends into Phase 3 |
</phase_requirements>

## Summary

Phase 2 should be planned as a durable document lifecycle, not as a one-off file upload feature. The cleanest production-oriented design is an auth-gated document service that persists a MongoDB record first, stores PDF binaries in an S3-compatible bucket, and separates the user-facing lifecycle badge (`uploading`, `processing`, `ready`, `failed`) from a more detailed internal processing stage that later phases can extend into extraction, chunking, and embeddings.

The strongest implementation shape here is an `init upload -> direct object upload -> finalize -> metadata extraction` flow. That recommendation is an inference from the locked need for a real `uploading` state plus the S3 presigned URL patterns in the AWS SDK docs. It keeps large file transfer off the app server, lets the library show a truthful upload lifecycle, and still preserves the auth boundary because only the backend can mint upload and read access.

For the reader, use a dedicated `/library/[documentId]` workspace inside the existing authenticated shell. Render the PDF in a client-only `react-pdf` island, and reserve a fixed companion panel for document context and future AI actions now so Phase 3 does not force a layout reset.

**Primary recommendation:** Use a Mongo-backed document lifecycle with S3-compatible presigned upload/read URLs and a client-only `react-pdf` reader route inside the existing app shell.

## Project Constraints (from CLAUDE.md)

- Use Next.js + Tailwind CSS in `frontend/`, Node.js/Express in `backend/`, and MongoDB for persistence.
- Preserve shadcn/ui as the UI system; do not replace it with ad hoc component patterns.
- Keep Gemini server-side only.
- Use JWT-based auth and keep document actions scoped to the signed-in user.
- Keep PDFs in durable object storage in production; do not rely on local disk.
- Prefer document-grounded behavior over generic answers.
- Keep v1 focused on the single-user, single-document study loop.
- Treat speed, responsiveness, and visual polish as product requirements, not optional polish.
- Use the GSD phase workflow and per-phase branching when implementation starts.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `mongoose` | `9.3.3` | Document metadata, ownership, lifecycle persistence | Already in the backend; official schema timestamps and indexes fit this phase well |
| `@aws-sdk/client-s3` | `3.1018.0` | S3-compatible object operations | Official JS SDK for `PutObject`, `GetObject`, and `DeleteObject` patterns |
| `@aws-sdk/s3-request-presigner` | `3.1018.0` | Presigned upload and read URLs | Official presigned URL flow keeps large file transfer off the Express app |
| `react-pdf` | `10.4.1` | Embedded PDF rendering in the reader workspace | Current mainstream React wrapper around PDF.js with explicit Next.js guidance |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `pdfjs-dist` | `5.5.207` | PDF worker and future extraction utility | Use for the reader worker and Phase 3-adjacent PDF parsing needs |
| `supertest` | `7.2.2` | Express route integration tests | Use for auth, ownership, upload-init, finalize, and delete route tests |
| `multer` | `2.1.1` | Multipart fallback upload parsing | Use only if planning rejects the presigned upload session approach |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Presigned PUT/GET through S3 SDK | Backend multipart upload plus backend byte proxy | Simpler initial backend code, but weaker `uploading` truthfulness, more server bandwidth, and worse scaling |
| `react-pdf` | `@pdf-viewer/react` `1.19.0` | Richer out-of-box viewer chrome, but heavier than needed for a custom study workspace in Phase 2 |
| Signed read URL after auth check | Backend streaming proxy | Proxy keeps all bytes on the backend, but adds range-request complexity and app-server load |

**Installation:**
```bash
npm --prefix backend install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner pdfjs-dist
npm --prefix backend install -D supertest
npm --prefix frontend install react-pdf
```

**Version verification:** Current package versions were verified with `npm view` on 2026-03-27.
- `mongoose` `9.3.3` — modified `2026-03-25`
- `@aws-sdk/client-s3` `3.1018.0` — modified `2026-03-26`
- `@aws-sdk/s3-request-presigner` `3.1018.0` — modified `2026-03-26`
- `react-pdf` `10.4.1` — modified `2026-02-25`
- `pdfjs-dist` `5.5.207` — modified `2026-03-01`
- `supertest` `7.2.2` — modified `2026-01-06`
- `multer` `2.1.1` — modified `2026-03-04`

## Architecture Patterns

### Recommended Project Structure
```text
backend/src/modules/documents/
├── documents.model.ts        # Mongoose schema, enums, and indexes
├── documents.routes.ts       # Auth-protected document routes
├── documents.controller.ts   # HTTP parsing, response shape, error mapping
├── documents.service.ts      # Ownership checks and lifecycle transitions
├── documents.storage.ts      # S3-compatible adapter and signed URL helpers
├── documents.schemas.ts      # Zod contracts for init/finalize/list/delete
└── documents.pdf.ts          # Page count/title extraction from the uploaded PDF

frontend/app/(app)/
├── dashboard/page.tsx        # Existing home surface
├── library/page.tsx          # Document library
└── library/[documentId]/page.tsx  # Reader workspace

frontend/components/
├── library/                  # Upload card, status cards, empty state
└── reader/                   # PDF viewer, page controls, companion panel

frontend/lib/
└── documents.ts              # Typed document API client and upload helpers
```

### Recommended API Shape
| Method | Path | Purpose | Notes |
|--------|------|---------|-------|
| `POST` | `/api/documents` | Initialize upload session | Auth required. Accept `{ fileName, sizeBytes, contentType }`. Create record with `status='uploading'` and return `{ document, uploadUrl, headers }` |
| `POST` | `/api/documents/:id/finalize` | Verify object upload and move to processing | Auth + owner required. `HEAD` object, persist storage metadata, extract page count/title, transition to `processing` then `ready` or `failed` |
| `GET` | `/api/documents` | List the signed-in user's documents | Sort newest first. Return only owner-scoped docs |
| `GET` | `/api/documents/:id` | Fetch document metadata | Used by reader route and delete confirmations |
| `GET` | `/api/documents/:id/access-url` | Mint short-lived viewer URL | Only for `ready` docs. Return `{ url, expiresAt }` with `Cache-Control: no-store` |
| `DELETE` | `/api/documents/:id` | Delete object and metadata | Owner-only, idempotent, and logs partial-failure repair needs |

### Pattern 1: Upload Session + Finalize
**What:** Create the document record before file transfer, upload the PDF to object storage with a short-lived signed PUT URL, then finalize the record after the object exists.

**When to use:** All new uploads in Phase 2.

**Why this is the recommendation:** This is the only design that naturally supports a truthful persistent `uploading` state without holding large file bytes open on the Express app. This is an inference from Phase 2 decisions plus the AWS presigned URL guidance.

**Example:**
```typescript
// Source: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({ region, endpoint, forcePathStyle });
const command = new PutObjectCommand({
  Bucket: bucket,
  Key: objectKey,
  ContentType: "application/pdf",
});

const uploadUrl = await getSignedUrl(client, command, { expiresIn: 900 });
```

### Pattern 2: Dual-State Document Lifecycle
**What:** Store a simple badge status for the current UI and a more detailed internal processing stage for future ingestion work.

**When to use:** On every document record.

**Recommended shape:**
```typescript
type DocumentStatus = "uploading" | "processing" | "ready" | "failed";
type ProcessingStage =
  | "uploaded"
  | "metadata_extraction"
  | "text_extraction"
  | "chunking"
  | "embedding"
  | "complete"
  | "failed";
```

**Minimal schema fields:**
- `ownerId`
- `title`
- `originalFilename`
- `mimeType`
- `sizeBytes`
- `pageCount`
- `status`
- `processing.stage`
- `processing.errorCode`
- `processing.errorMessage`
- `storage.provider`
- `storage.bucket`
- `storage.key`
- `storage.etag`
- `createdAt`
- `updatedAt`

**Indexes to add:**
- `{ ownerId: 1, createdAt: -1 }`
- `{ ownerId: 1, status: 1 }`

**Example:**
```typescript
// Source: https://mongoosejs.com/docs/guide.html
import { Schema } from "mongoose";

const documentSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    status: {
      type: String,
      enum: ["uploading", "processing", "ready", "failed"],
      required: true,
    },
    processing: {
      stage: { type: String, required: true },
      errorCode: String,
      errorMessage: String,
    },
  },
  { timestamps: true },
);

documentSchema.index({ ownerId: 1, createdAt: -1 });
documentSchema.index({ ownerId: 1, status: 1 });
```

### Pattern 3: Reader as a Client-Only Island
**What:** Keep the route/page itself server-authenticated, but render the PDF viewer in a client component with SSR skipped.

**When to use:** `/library/[documentId]`.

**Why:** React-PDF requires PDF.js worker configuration in the same module as the rendered components, and its docs explicitly note Next.js should skip SSR for that module.

**Example:**
```typescript
// Source: https://github.com/wojtekmaj/react-pdf/blob/main/packages/react-pdf/README.md
"use client";

import { pdfjs, Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();
```

### Pattern 4: Workspace Layout That Survives Phase 3
**What:** Keep the PDF as the dominant pane and reserve a secondary companion panel now.

**When to use:** Desktop and tablet reader layouts.

**Recommended layout:**
- Desktop: `minmax(0, 1fr)` viewer pane + `360px` to `420px` companion pane
- Tablet: same split, but let the companion pane collapse
- Mobile: stack the viewer first and move document context into a sheet or section below the controls

### Anti-Patterns to Avoid
- **Backend-local file storage:** Conflicts with locked durable-storage decisions and breaks production portability.
- **Creating the document record only after upload finishes:** You lose a truthful `uploading` state and complicate retry logic.
- **Using the browser's native PDF tab or an `<iframe>` as the primary reader:** It breaks the study-workspace requirement and later AI side-panel integration.
- **Letting `ready` and internal processing details be the same field:** Phase 3 will force a schema/UI redesign.
- **Reusing `frontend/lib/api.ts` unchanged for upload flows:** That helper always sets JSON headers, which is wrong for signed PUT or multipart file transfer.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| S3 URL signing | Custom HMAC signing logic | `@aws-sdk/s3-request-presigner` | Canonical request and expiry bugs are easy to get wrong |
| PDF renderer | Custom canvas/iframe viewer | `react-pdf` + `pdfjs-dist` | Worker setup, page rendering, text layer, and page primitives already exist |
| Express route integration harness | Custom request mocks for every route | `supertest` | Cookie-auth and route-level assertions are much simpler |
| Multipart fallback parsing | Hand-written multipart parser | `multer` | Limits, file filtering, and request wiring are already solved |

**Key insight:** Object access, PDF rendering, and lifecycle state transitions all look simple until range requests, worker loading, CORS, retries, and dual-write failures appear. Use the ecosystem defaults for those edges.

## Common Pitfalls

### Pitfall 1: `uploading` Exists Only in a Spinner, Not in the Data Model
**What goes wrong:** A document appears only after transfer completes, so refreshes or route changes lose the user's in-flight state.
**Why it happens:** The backend writes the record after receiving all bytes.
**How to avoid:** Create the record first, set `status='uploading'`, then finalize after object storage confirms the upload.
**Warning signs:** The library cannot show an in-progress upload after navigation or reload.

### Pitfall 2: React-PDF Fails Because the Worker Is Configured in the Wrong Place
**What goes wrong:** The reader shows a blank area, worker errors, or hydration/runtime issues.
**Why it happens:** React-PDF requires `workerSrc` in the same module where `Document` and `Page` render, and the module must skip SSR in Next.js.
**How to avoid:** Keep the viewer in a client-only module and set `pdfjs.GlobalWorkerOptions.workerSrc` there.
**Warning signs:** Console errors about `workerSrc`, `window` access, or PDF.js worker boot failures.

### Pitfall 3: Signed Viewer URLs Work in cURL but Fail in the Browser
**What goes wrong:** The PDF cannot render or only partially loads.
**Why it happens:** Object storage CORS, `Content-Type`, or range-request behavior was never validated for browser PDF loading.
**How to avoid:** Validate a real browser load early. If provider CORS or range support becomes painful, keep a backend proxy fallback in reserve.
**Warning signs:** `403`/CORS errors in the browser network tab or PDFs that only load after full download.

### Pitfall 4: Delete Is Treated Like a Single-System Operation
**What goes wrong:** MongoDB and object storage drift apart after partial failure.
**Why it happens:** Deleting across two systems is not transactional.
**How to avoid:** Make delete idempotent, log partial failures, and prefer deterministic object keys so repair is easy.
**Warning signs:** Library records that reference missing files or storage objects that no record owns.

### Pitfall 5: Original Filenames Become Object Keys
**What goes wrong:** Collisions, unsafe characters, and awkward renames appear.
**Why it happens:** The display title and storage key are treated as the same field.
**How to avoid:** Use an object key derived from `userId` and `documentId`; keep the visible title separate.
**Warning signs:** Duplicate uploads overwrite each other or keys contain spaces, slashes, or user-controlled surprises.

### Pitfall 6: Library and Reader Routes Do Not Extend the Existing Auth Shell Cleanly
**What goes wrong:** The new surfaces bypass route protection or visually drift from Phase 1.
**Why it happens:** New routes are built outside `frontend/app/(app)` or the current sidebar/header patterns are ignored.
**How to avoid:** Add `Library` inside the existing shell, update the proxy matcher, and make the header route-aware rather than replacing it.
**Warning signs:** `Library` looks like a separate app or unauthenticated route access becomes possible.

## Code Examples

Verified patterns from official sources:

### Generate a Signed Upload URL
```typescript
// Source: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({ region });
const command = new PutObjectCommand({ Bucket: bucket, Key: key });
const url = await getSignedUrl(client, command, { expiresIn: 3600 });
```

### Use Mongoose Timestamps and Indexes
```typescript
// Source: https://mongoosejs.com/docs/guide.html
import { Schema } from "mongoose";

const schema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true },
);

schema.index({ ownerId: 1, createdAt: -1 });
schema.index({ ownerId: 1, status: 1 });
```

### Render a Page in React-PDF
```tsx
// Source: https://github.com/wojtekmaj/react-pdf/blob/main/packages/react-pdf/README.md
import { useState } from "react";
import { Document, Page } from "react-pdf";

export function Reader({ file }: { file: string }) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);

  return (
    <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
      <Page pageNumber={pageNumber} />
    </Document>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| App-local upload directory | S3-compatible durable object storage | Current SaaS baseline | Stateless deploys, safer persistence, production portability |
| Backend-only file relay for every read | Auth-gated signed read URL | Current common storage pattern | Lower API bandwidth and better PDF delivery |
| Browser-native PDF tab | Embedded PDF.js/React-PDF workspace | Modern in-app reader pattern | Keeps reading and study actions in one route |
| Single boolean `processed` flag | User badge status plus internal pipeline stage | Current AI ingestion pattern | Phase 3 can add chunking/embedding without schema reset |

**Deprecated/outdated:**
- Filesystem PDF storage in production: conflicts with locked durable-storage requirements.
- Reader modal or native tab: conflicts with the dedicated-workspace requirement.
- Full-width viewer with no companion panel: creates unnecessary layout churn in Phase 3.

## Open Questions

1. **Which S3-compatible provider is the Phase 2 target?**
   - What we know: The phase requires an S3-compatible boundary, not local disk.
   - What's unclear: Exact provider, endpoint, region semantics, path-style needs, and CORS defaults.
   - Recommendation: Lock the provider during planning and add env names for `bucket`, `endpoint`, `region`, `access key`, `secret`, and `forcePathStyle`.

2. **What is the v1 PDF size limit?**
   - What we know: Phase 2 is single-file only, and Multer docs explicitly recommend `limits` for DoS protection.
   - What's unclear: Product-acceptable max size and whether scanned/image-heavy PDFs are rejected or simply unsupported.
   - Recommendation: Set a concrete size limit in planning, enforce it in init validation, and mirror it in the frontend upload UI.

3. **Does metadata extraction stay inline in `finalize`, or become async immediately?**
   - What we know: Phase 2 only needs enough processing to reach `ready`, and the phase already wants visible `processing`.
   - What's unclear: Typical PDF size and latency budget for page-count/title extraction.
   - Recommendation: Plan inline metadata extraction first, but keep the service boundary ready for a queue if real PDFs push finalize latency too high.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Backend API, scripts, tests | ✓ | `v22.20.0` | — |
| Bun | Frontend app workflow | ✓ | `1.3.10` | npm scripts work for installs, but frontend dev flow is Bun-oriented |
| npm | Backend package installs and tests | ✓ | `10.9.3` | — |
| MongoDB server or Atlas URI | Document persistence and integration tests | ✗ local binary | — | Mock Mongoose/service boundaries until Atlas or local Mongo is available |
| Docker daemon | Local Mongo fallback | ✗ daemon unavailable | — | None currently |
| S3-compatible bucket credentials | Durable upload/open/delete integration | ✗ not configured in `backend/src/config/env.ts` | — | Mock storage adapter until provider/env is chosen |

**Missing dependencies with no fallback:**
- None for planning or initial implementation.

**Missing dependencies with fallback:**
- MongoDB runtime for true integration tests
- S3-compatible bucket credentials for true storage integration
- Dockerized local Mongo fallback

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | `Vitest 2.1.9` in `backend/` only |
| Config file | `backend/vitest.config.ts` |
| Quick run command | `npm --prefix backend test -- src/modules/documents/document.service.test.ts` |
| Full suite command | `npm --prefix backend test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DOC-01 | Initialize upload session, enforce PDF-only validation, create owner-scoped record | integration | `npm --prefix backend test -- src/modules/documents/documents.routes.test.ts -t "initializes a PDF upload"` | ❌ Wave 0 |
| DOC-02 | Persist title, size, upload date, and lifecycle status | unit | `npm --prefix backend test -- src/modules/documents/document.service.test.ts -t "persists metadata and status"` | ❌ Wave 0 |
| DOC-03 | List only the signed-in user's documents in newest-first order | integration | `npm --prefix backend test -- src/modules/documents/documents.routes.test.ts -t "lists only owner documents"` | ❌ Wave 0 |
| DOC-04 | Mint viewer access only for `ready` owner documents | integration | `npm --prefix backend test -- src/modules/documents/documents.routes.test.ts -t "returns a read URL only for ready docs"` | ❌ Wave 0 |
| DOC-05 | Delete stored object plus metadata for owner docs | integration | `npm --prefix backend test -- src/modules/documents/documents.routes.test.ts -t "deletes storage and metadata"` | ❌ Wave 0 |
| READ-01 | Render an uploaded PDF inside the app shell | manual-only | — browser smoke required | ❌ Wave 0 |
| READ-02 | Navigate between pages inside the embedded viewer | manual-only | — browser smoke required | ❌ Wave 0 |
| READ-03 | Reader layout keeps document context and future AI panel in the same workflow | manual-only | — browser smoke required | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm --prefix backend test -- src/modules/documents/document.service.test.ts`
- **Per wave merge:** `npm --prefix backend test`
- **Phase gate:** Backend suite green plus manual browser verification of upload, library, open, page navigation, and delete

### Wave 0 Gaps
- [ ] `backend/src/modules/documents/document.service.test.ts` — covers lifecycle transitions and storage adapter coordination
- [ ] `backend/src/modules/documents/documents.routes.test.ts` — covers auth, ownership, and route contracts
- [ ] Backend test dependency: `npm --prefix backend install -D supertest`
- [ ] Frontend browser automation is absent — either add Playwright for reader smoke tests or keep READ-* manual for this phase

## Sources

### Primary (HIGH confidence)
- `.planning/phases/02-documents-and-reader/02-CONTEXT.md` - locked phase decisions and scope
- `.planning/REQUIREMENTS.md` - DOC-* and READ-* requirements
- `.planning/ROADMAP.md` - plan boundaries and success criteria
- `.planning/PROJECT.md` - product-level storage and scope constraints
- `backend/src/app.ts`, `backend/src/middleware/require-auth.ts`, `backend/src/lib/jwt.ts` - current auth boundary and route composition
- `frontend/app/(app)/layout.tsx`, `frontend/components/app-shell/app-sidebar.tsx`, `frontend/components/app-shell/app-header.tsx` - existing app shell extension points
- https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html - `S3Client`, `PutObjectCommand`, `GetObjectCommand`, and presigned URL patterns
- https://expressjs.com/en/resources/middleware/multer.html - route-scoped upload middleware, memory/disk storage, `limits`, and `fileFilter`
- https://github.com/wojtekmaj/react-pdf/blob/main/packages/react-pdf/README.md - worker configuration, Next.js SSR note, and `Document`/`Page` usage
- https://mongoosejs.com/docs/guide.html - schema indexes, `autoIndex`, and timestamps

### Secondary (MEDIUM confidence)
- `npm view` registry checks on 2026-03-27 for current package versions:
  `mongoose`, `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `react-pdf`, `pdfjs-dist`, `supertest`, `multer`

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - current package versions were verified and the main recommendations are backed by official docs
- Architecture: MEDIUM - the init/upload/finalize flow and signed read URL choice are strong inferences from the locked phase constraints plus official storage docs
- Pitfalls: HIGH - backed by official Multer/React-PDF/Mongoose guidance and current repo structure

**Research date:** 2026-03-27
**Valid until:** 2026-04-26
