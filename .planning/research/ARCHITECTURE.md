# Architecture Research

**Domain:** AI-powered PDF learning assistant
**Researched:** 2026-03-26
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Web Client                      │
├─────────────────────────────────────────────────────────────┤
│  Auth UI  PDF Library  Reader  Chat  Flashcards  Quizzes   │
│  Dashboard  Settings  Activity Views                        │
├─────────────────────────────────────────────────────────────┤
│                     Express API Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Auth  Documents  AI Orchestration  Flashcards  Quizzes     │
│  Progress  Analytics  Uploads  Retrieval                    │
├─────────────────────────────────────────────────────────────┤
│                   Processing / Storage Layer                │
│  PDF Parsing  Chunking  Embeddings  Object Storage          │
│  MongoDB Collections  Atlas Vector Search                   │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Next.js app | Public product UI and authenticated study workspace | App Router with route-grouped product areas |
| Express API | Auth, uploads, orchestration, persistence, analytics | REST API with service-layer business logic |
| Ingestion pipeline | Parse PDFs, create chunks, generate embeddings, track status | API-managed worker/service flow |
| Retrieval layer | Semantic search over document chunks | Atlas Vector Search with metadata filters |
| Artifact generation layer | Summaries, explainers, flashcards, quizzes | Gemini prompt workflows on retrieved content |
| Persistence layer | Users, documents, chunks, flashcards, quizzes, activity | MongoDB + Mongoose |
| Object storage | Durable PDF file storage | S3-compatible bucket in production |

## Recommended Project Structure

```text
frontend/
├── app/                    # Next.js routes and layouts
│   ├── (marketing)/        # Landing and public pages
│   ├── (app)/              # Authenticated product shell
│   └── api/                # Only if frontend-side route handlers are needed
├── components/             # Shared UI components
├── features/               # Feature-specific UI modules
├── lib/                    # Client utilities, API wrappers, schemas
├── styles/                 # Global styling and design tokens
└── public/                 # Static assets

backend/
├── src/
│   ├── config/             # Env, db, app bootstrap
│   ├── modules/
│   │   ├── auth/           # Auth routes, services, models
│   │   ├── documents/      # Upload, metadata, storage, parsing
│   │   ├── ai/             # Gemini orchestration, prompting, retrieval
│   │   ├── flashcards/     # Flashcard generation and favorites
│   │   ├── quizzes/        # Quiz generation and grading
│   │   └── dashboard/      # Activity and progress aggregation
│   ├── middleware/         # Auth, errors, request validation
│   ├── shared/             # Base utilities, types, helpers
│   └── server.ts           # App entrypoint
└── uploads/                # Local dev only; do not use in production
```

### Structure Rationale

- **Feature-oriented modules:** keeps related routes, services, schemas, and prompts together.
- **Separate frontend/backend surfaces:** matches the repo structure already chosen by the user.
- **Dedicated AI module:** prevents Gemini, retrieval, and prompt logic from leaking across the whole backend.
- **Marketing vs app route groups in Next.js:** keeps public pages and authenticated product UI isolated.

## Architectural Patterns

### Pattern 1: Retrieval-Augmented Generation Per Document

**What:** Embed document chunks, retrieve relevant chunks for a user query, and pass only the best context to Gemini.
**When to use:** For chat, topic explanation, and targeted question answering.
**Trade-offs:** Better grounding and lower hallucination risk, but requires ingestion/chunking/indexing work.

**Example:**
```typescript
const chunks = await vectorSearch({
  userId,
  documentId,
  queryEmbedding,
  limit: 8,
});

const answer = await gemini.generate({
  system: GROUNDED_CHAT_SYSTEM,
  context: chunks.map((chunk) => chunk.text),
  question,
});
```

### Pattern 2: Persisted Study Artifacts

**What:** Store generated summaries, flashcards, quizzes, answers, and results instead of regenerating every time.
**When to use:** For dashboards, favorites, quiz review, and repeat study sessions.
**Trade-offs:** More schema design up front, but much better product continuity and analytics.

**Example:**
```typescript
await QuizModel.create({
  userId,
  documentId,
  questionCount,
  questions,
  createdAt: new Date(),
});
```

### Pattern 3: Async Ingestion State Machine

**What:** Track document upload states like `uploaded -> parsing -> chunked -> embedded -> ready`.
**When to use:** Immediately, even if the first implementation runs in-process.
**Trade-offs:** Slightly more modeling up front, but much better UX and observability.

## Data Flow

### Request Flow

```text
[User uploads PDF]
    ↓
[Next.js form] → [Express upload route] → [Storage + metadata save]
    ↓
[Parse PDF] → [Chunk text] → [Embed chunks] → [Store vectors in MongoDB]
    ↓
[Document status = ready]
```

### State Management

```text
[Server state via API]
    ↓
[Route-level data fetching]
    ↓
[Feature components] ←→ [User actions] → [Mutations] → [API]
```

### Key Data Flows

1. **Upload flow:** PDF file is uploaded, stored durably, parsed, chunked, embedded, and marked ready.
2. **Chat flow:** User question is embedded, relevant chunks are retrieved, Gemini answers with document-grounded context, and the interaction is optionally stored.
3. **Summary flow:** Whole-document or section-level content is summarized and cached for reuse.
4. **Flashcard/quiz flow:** Structured study artifacts are generated from document content, stored, and later reviewed.
5. **Progress flow:** Every completed quiz, favorite, and document interaction feeds dashboard aggregations.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | Single API service, Atlas, object storage, inline/background ingestion is fine |
| 1k-100k users | Add dedicated worker processes, better caching, and isolate heavy AI jobs from request threads |
| 100k+ users | Consider splitting AI processing, analytics, and core API concerns into separate deployables |

### Scaling Priorities

1. **First bottleneck:** document ingestion and AI generation latency — fix with async workers and caching.
2. **Second bottleneck:** vector retrieval and hot documents — fix with indexing, query tuning, and read-path optimization.

## Anti-Patterns

### Anti-Pattern 1: One Giant Prompt Per Document

**What people do:** Send the entire PDF to the model for every chat turn.
**Why it's wrong:** Expensive, slow, and not durable for repeated interaction.
**Do this instead:** Parse once, chunk once, embed once, retrieve per query.

### Anti-Pattern 2: Stateless Artifact Generation

**What people do:** Re-generate flashcards, summaries, or quizzes every time the user opens a page.
**Why it's wrong:** Wastes tokens, creates inconsistent results, and weakens analytics.
**Do this instead:** Store artifacts and refresh only when needed.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Google Gemini API | Backend-only SDK integration | Keep API keys off the client; centralize prompt and fallback logic |
| MongoDB Atlas | Primary data + vector retrieval | Use metadata filters for user and document scoping |
| S3-compatible object storage | Upload/read PDFs | Production-safe file durability |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Next.js ↔ Express API | HTTP/JSON + multipart uploads | Keep API contracts typed and validated |
| Documents ↔ AI module | Service calls | Retrieval and prompting should be isolated from route handlers |
| Quizzes/Flashcards ↔ Dashboard | Shared persistence models | Dashboard should aggregate stored events, not recompute from scratch |

## Sources

- https://nextjs.org/docs/app/getting-started/project-structure
- https://bun.sh/guides/ecosystem/nextjs
- https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-overview/
- https://ai.google.dev/gemini-api/docs/document-processing
- https://ai.google.dev/gemini-api/docs/embeddings
- Inference from the user’s requested repo structure and product scope

---
*Architecture research for: AI-powered PDF learning assistant*
*Researched: 2026-03-26*
