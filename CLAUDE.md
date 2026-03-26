<!-- GSD:project-start source:PROJECT.md -->
## Project

**AI-Powered Learning Assistant**

AI-Powered Learning Assistant is a public web app for readers, students, professors, and other knowledge-heavy users who want to study PDF documents with fast, modern AI assistance. It combines document upload and reading with AI chat, summaries, concept explainers, flashcards, quizzes, and progress tracking in a cleaner and more responsive experience than the typical AI study tool.

The product is being built as a Next.js frontend in `frontend/` and a Node/Express backend in `backend/`, with MongoDB for application data and Google Gemini powering the AI workflows. The frontend should use Tailwind CSS with shadcn/ui as the base component system.

**Core Value:** Make studying PDF documents feel fast, visually polished, and genuinely useful instead of slow, cluttered, and frustrating.

### Constraints

- **Tech stack**: Next.js + Tailwind CSS in `frontend/`, Node.js/Express in `backend/`, MongoDB for persistence — chosen to match the intended architecture and repo structure.
- **UI system**: shadcn/ui on top of Tailwind CSS — required to keep the app visually strong and consistent from the first phase.
- **AI provider**: Google Gemini — required for chat, summaries, explanations, flashcards, and quiz generation.
- **Authentication**: JWT-based auth — required for secure account access and user-specific documents/progress.
- **Performance**: Core flows must feel fast — improving speed versus typical AI study apps is a primary product goal.
- **UX quality**: Responsive, polished UI is a must-have — visual quality is part of the product differentiation, not a nice-to-have.
- **Scope discipline**: v1 must stay focused on the single-user PDF study loop — defer collaboration and multi-document complexity.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.x | Frontend framework for the public web app | Current Next.js guidance is built around App Router, and Bun has an official Next.js guide. Good fit for a fast, polished, SEO-friendly public product. |
| React | 19.2 via Next.js 16 | UI runtime | Next.js 16 ships with current React capabilities and strong support for modern app patterns. |
| Bun | 1.3.x | Frontend package manager and runtime for Next.js scripts | Official Bun docs explicitly support running Next.js apps and note strong Node compatibility. It aligns with the requirement to use Bun in `frontend/`. |
| Node.js | 24 LTS | Backend runtime for the API server | Node’s official release schedule recommends LTS lines for production. Node 24 is the current Active LTS. |
| Express | 5.x | Backend HTTP/API framework | Express 5 is current and requires Node 18+, which fits the planned backend. It keeps the server simple and predictable. |
| MongoDB Atlas | Current | Primary database | Fits the requested MongoDB stack and can also power semantic retrieval with Atlas Vector Search, avoiding a second database for v1. |
| MongoDB Atlas Vector Search | Current | Vector retrieval for document-grounded chat | Official MongoDB docs explicitly position Atlas Vector Search for semantic search and RAG, which is the core need for document chat. |
| Google Gemini API | Gemini 3 Flash + `gemini-embedding-001` | Generation and embeddings | Gemini’s document support is strong for PDF understanding, and the embeddings API supports RAG-friendly workflows. |
### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Tailwind CSS | 4.x | Responsive styling system | Use for the entire UI layer; current official Next.js integration uses the PostCSS path. |
| shadcn/ui | latest stable | Component system and design primitives | Use as the primary component foundation for forms, dialogs, cards, navigation, and dashboard surfaces. |
| `@google/genai` | latest stable | Gemini JavaScript SDK | Use for summaries, explanations, quiz generation, flashcards, and fallback full-document analysis flows. |
| Mongoose | 9.x | MongoDB ODM | Use for app-domain modeling, validation, timestamps, and relational references between users, documents, flashcards, quizzes, and activity. |
| `jsonwebtoken` | latest stable | JWT auth | Use for secure access and refresh/session handling in the backend. |
| `bcrypt` or `bcryptjs` | latest stable | Password hashing | Use for local auth credentials. |
| `multer` | latest stable | Multipart upload handling | Use for PDF uploads on the Express side. |
| `pdfjs-dist` | latest stable | PDF parsing and page/text extraction | Use for ingestion and viewer-related metadata extraction. |
| `react-pdf` or `@pdf-viewer/react` | latest stable | Embedded PDF reading UI | Use when implementing the in-app PDF viewer. |
| Zod | 4.x | Request and environment validation | Use across frontend and backend boundaries to keep API contracts strict. |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| TypeScript | Type safety across frontend and backend | Use in both `frontend/` and `backend/`; this is worth the extra setup for a multi-surface AI app. |
| ESLint | Static analysis | Next.js and Express both benefit from consistent linting early. |
| Prettier | Formatting | Keep formatting automatic so UI and API work do not drift stylistically. |
| Vitest | Unit/integration tests | Strong fit with Bun-friendly workflows and modern TypeScript projects. |
## Installation
# Frontend core
# Backend core
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| MongoDB Atlas Vector Search | Pinecone / Weaviate / Qdrant | Use a dedicated vector DB only if retrieval scale or ranking complexity outgrows Atlas. For v1, Atlas keeps the system simpler. |
| Express 5 | Fastify | Use Fastify if backend throughput becomes the main bottleneck and you want schema-first performance tuning. |
| Bun for frontend workflow | npm / pnpm | Use pnpm if Bun-specific tooling compatibility becomes a problem in your deployment environment. |
| Mongoose 9 | Native MongoDB driver | Use the native driver if you want less abstraction and are willing to manage validation/model conventions yourself. |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Filesystem PDF storage in production | Public deployable apps need durable object storage and safer deployment behavior | Use S3-compatible object storage for PDF files |
| Separate vector database in v1 by default | Adds infrastructure and sync complexity too early | Use MongoDB Atlas Vector Search first |
| Pure keyword search for document chat | Misses semantic relevance and produces weak grounding | Use embeddings + vector search + metadata filters |
| PDF-only Gemini Files API persistence as the main storage model | Gemini Files are stored for 48 hours, which is not durable enough for user libraries | Persist files and chunks yourself; use Files API selectively |
## Stack Patterns by Variant
- Use one Express API service
- Use MongoDB Atlas for both application data and vector retrieval
- Process uploads inline or with lightweight background status updates
- Because it minimizes operational overhead while still supporting RAG
- Add a job queue and worker process
- Move chunking, embedding, and summary pre-generation off the request path
- Because upload UX will otherwise feel blocked and slow
## Version Compatibility
| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Next.js 16.x | React 19.2 | Next.js 16 release notes call out React 19.2 support |
| Bun 1.3.x | Next.js 16 / Express 5 | Bun docs explicitly call out compatibility with Next.js and Express |
| Express 5.x | Node.js 18+ | Official Express docs require Node 18 or higher |
| Tailwind CSS 4.2.x | Next.js 16 via PostCSS | Official Tailwind guide uses `@tailwindcss/postcss` for Next.js |
| shadcn/ui latest | Next.js 16 + Tailwind CSS | Official shadcn docs provide a Next.js install path and Bun-compatible init flow |
| `gemini-embedding-001` | MongoDB Atlas Vector Search | Good fit for semantic chunk retrieval in a single-database RAG design |
## Sources
- https://nextjs.org/blog/next-16 — current stable Next.js release
- https://nextjs.org/docs/app/getting-started/installation — current Next.js installation guidance
- https://bun.sh/guides/ecosystem/nextjs — official Bun + Next.js guide
- https://bun.sh/docs/runtime/nodejs-compat — Bun compatibility with Node ecosystem packages
- https://tailwindcss.com/docs/installation/framework-guides/nextjs — official Tailwind + Next.js setup
- https://ui.shadcn.com/docs/installation/next — official shadcn/ui Next.js setup
- https://nodejs.org/en/download/releases/ — current Node.js LTS guidance
- https://expressjs.com/en/starter/installing.html — Express install/runtime requirements
- https://expressjs.com/en/guide/migrating-5.html — Express 5 guidance
- https://mongoosejs.com/docs/version-support.html — current Mongoose version support
- https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-overview/ — Atlas Vector Search and RAG guidance
- https://ai.google.dev/gemini-api/docs/document-processing — Gemini PDF/document support
- https://ai.google.dev/gemini-api/docs/embeddings — Gemini embeddings model guidance
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
