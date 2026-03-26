# Project Research Summary

**Project:** AI-Powered Learning Assistant
**Domain:** AI-powered PDF learning assistant
**Researched:** 2026-03-26
**Confidence:** HIGH

## Executive Summary

This product sits in the document-AI learning space, where users already expect uploadable sources, grounded chat, summaries, and study-oriented outputs. The strongest current pattern is not “generic chatbot plus PDF upload,” but a source-grounded workflow where the AI stays anchored to uploaded material and converts it into usable study artifacts.

For this project, the recommended architecture is a Next.js 16 frontend in `frontend/`, an Express 5 API in `backend/`, MongoDB Atlas as both application database and vector store, and Google Gemini for generation and embeddings. This is the cleanest way to satisfy the requested stack while keeping v1 deployable and avoiding premature infrastructure sprawl.

The main risk is not model capability. It is product quality: slow ingestion, weak retrieval, and a UI that feels like every other clumsy AI study app. The roadmap should therefore prioritize durable upload architecture, retrieval quality, and polished user flows before expanding scope into multi-file chat or collaboration.

## Key Findings

### Recommended Stack

The frontend should use Next.js 16 with Bun-based scripts, Tailwind CSS, and shadcn/ui as the base component system. The backend should use Node 24 LTS with Express 5 and Mongoose 9. MongoDB Atlas should hold both operational data and vector embeddings through Atlas Vector Search, which MongoDB explicitly supports for RAG use cases. Gemini should handle PDF-aware summarization/explanations and `gemini-embedding-001` should power semantic retrieval.

**Core technologies:**
- Next.js 16 + React 19.2: public-facing app shell and authenticated workspace
- Bun 1.3.x: frontend package/runtime workflow
- shadcn/ui + Tailwind CSS: UI component foundation and styling system
- Node 24 LTS + Express 5: backend API
- MongoDB Atlas + Atlas Vector Search: persistence and retrieval
- Google Gemini API: document understanding, generation, embeddings
- Tailwind CSS 4.2.x: responsive UI system

### Expected Features

The user’s requested feature set is already well aligned with category expectations. The most important product distinction is not more features, but better execution quality.

**Must have (table stakes):**
- Authentication and personal study workspace
- PDF upload, management, and embedded reading
- Grounded AI chat on uploaded documents
- AI summaries and concept explanations
- Responsive, fast UI

**Should have (competitive):**
- Flashcards with favorites
- Configurable quizzes with explanations and score breakdowns
- Progress dashboard and recent activity
- Clear performance and design quality throughout the product

**Defer (v2+):**
- Multi-file chat
- Team collaboration
- OCR/scanned PDF support
- Native mobile app

### Architecture Approach

The recommended structure is a two-app repo: Next.js frontend and Express backend. PDFs should be stored durably in object storage, then parsed, chunked, embedded, and indexed in MongoDB Atlas Vector Search. Chat, explanations, summaries, flashcards, and quizzes should operate on persisted document context and stored artifacts rather than ad hoc one-off prompts.

**Major components:**
1. Next.js client — product UI and reading/study surfaces
2. Express API — auth, uploads, orchestration, persistence
3. Ingestion pipeline — parse, chunk, embed, status tracking
4. MongoDB Atlas — app data and vector retrieval
5. Gemini integration — generation, embeddings, document-aware analysis

### Critical Pitfalls

1. **Ungrounded answers** — prevent with document-scoped retrieval and clear prompt policy
2. **Temporary file dependency** — Gemini Files API is useful, but not durable enough for long-lived user libraries
3. **Slow upload-to-ready UX** — track ingestion states and push heavy work off the request path
4. **Weak chunking strategy** — preserve metadata and semantic structure during ingestion
5. **Scope creep into collaboration/multi-file chat** — keep v1 focused on the single-document study loop

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation and Document Pipeline
**Rationale:** Nothing else matters until users can authenticate, upload a PDF, and get a durable, ready-to-use study asset.
**Delivers:** Auth, storage, document ingestion, processing states, and basic viewer foundation
**Addresses:** Authentication, PDF upload/management
**Avoids:** Temporary-file and slow-ingestion pitfalls

### Phase 2: Grounded AI Study Core
**Rationale:** Chat, summaries, and explanations depend on retrieval quality and document processing.
**Delivers:** Chunking, embeddings, vector retrieval, grounded chat, summaries, explainers
**Uses:** Gemini + Atlas Vector Search
**Implements:** Retrieval architecture

### Phase 3: Active Recall Tools
**Rationale:** Once AI grounding is solid, flashcards and quizzes become reliable and valuable.
**Delivers:** Flashcards, favorites, quiz generation, grading, explanations

### Phase 4: Dashboard, Analytics, and Polish
**Rationale:** Product retention and quality differentiation require persisted activity, analytics, and refined UI.
**Delivers:** Progress dashboard, recent activity, quiz analytics, responsive/performance polish

### Phase Ordering Rationale

- Auth and document durability must come before any serious AI workflow.
- Retrieval quality must come before study artifact generation.
- Dashboard/analytics become meaningful only after documents, artifacts, and quiz results are persisted.
- UX quality should be present from the beginning, but final polish belongs after the primary user loop exists end-to-end.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** object storage provider choice and upload security details
- **Phase 2:** chunking strategy, citation UX, and prompt design for grounded answers
- **Phase 3:** structured output reliability for quiz/flashcard generation

Phases with standard patterns (skip research-phase):
- **Phase 4:** dashboard aggregation and responsive UI refinement

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Based on current official docs across Next.js, Bun, Express, MongoDB, Gemini |
| Features | HIGH | User intent is clear and category expectations are visible in current products |
| Architecture | HIGH | Strong alignment between requested stack and RAG-style document apps |
| Pitfalls | HIGH | Risks are concrete and directly tied to this category |

**Overall confidence:** HIGH

### Gaps to Address

- Pick the exact object storage provider during phase planning
- Decide how explicit answer citations/page references should be in v1
- Validate chunking and prompt quality against real PDFs early

## Sources

### Primary (HIGH confidence)
- https://nextjs.org/blog/next-16
- https://nextjs.org/docs/app/getting-started/installation
- https://bun.sh/guides/ecosystem/nextjs
- https://bun.sh/docs/runtime/nodejs-compat
- https://tailwindcss.com/docs/installation/framework-guides/nextjs
- https://ui.shadcn.com/docs/installation/next
- https://nodejs.org/en/download/releases/
- https://expressjs.com/en/starter/installing.html
- https://expressjs.com/en/guide/migrating-5.html
- https://mongoosejs.com/docs/version-support.html
- https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-overview/
- https://ai.google.dev/gemini-api/docs/document-processing
- https://ai.google.dev/gemini-api/docs/embeddings

### Secondary (MEDIUM confidence)
- https://support.google.com/notebooklm/answer/16164461?hl=en
- https://support.google.com/notebooklm/answer/16296687?hl=en
- https://chatpdf.me/

### Tertiary (LOW confidence)
- Product positioning inference from the user’s feature list and demo reference

---
*Research completed: 2026-03-26*
*Ready for roadmap: yes*
