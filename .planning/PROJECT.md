# AI-Powered Learning Assistant

## What This Is

AI-Powered Learning Assistant is a public web app for readers, students, professors, and other knowledge-heavy users who want to study PDF documents with fast, modern AI assistance. It combines document upload and reading with AI chat, summaries, concept explainers, flashcards, quizzes, and progress tracking in a cleaner and more responsive experience than the typical AI study tool.

The product is being built as a Next.js frontend in `frontend/` and a Node/Express backend in `backend/`, with MongoDB for application data and Google Gemini powering the AI workflows. The frontend should use Tailwind CSS with shadcn/ui as the base component system.

## Core Value

Make studying PDF documents feel fast, visually polished, and genuinely useful instead of slow, cluttered, and frustrating.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Users can securely create accounts and sign in to access their study workspace.
- [ ] Users can upload and manage PDF documents, then read and study them inside the app.
- [ ] Users can use AI features grounded in their uploaded documents, including chat, summaries, concept explanations, flashcards, and quizzes.
- [ ] Users can review their learning progress, quiz outcomes, favorites, and recent study activity from a clear dashboard.
- [ ] The product feels modern, fast, and responsive on mobile and desktop.

### Out of Scope

- Team collaboration — defer until the single-user study flow is strong and validated.
- Multi-file chat — defer until single-document understanding and retrieval quality are reliable.
- Native mobile apps — responsive web experience is the v1 priority.
- Payments and subscriptions — validate product value before monetization work.

## Context

This project is inspired by an existing YouTube demo of an AI-powered learning product, but the goal is not to clone it mechanically. The goal is to ship a public, deployable app with the same core utility while improving visual quality, responsiveness, and overall product feel.

The repository already contains `frontend/` and `backend/` folders for the two application surfaces. The intended stack is Next.js with Bun for the frontend workflow, Tailwind CSS plus shadcn/ui for the UI system, and Node.js/Express with MongoDB for the backend. JWT-based authentication is required. Google Gemini will power the AI assistant features.

The first release should focus on document-grounded learning from PDFs. General Gemini knowledge can support the experience where helpful, but the product should primarily anchor answers and generated study artifacts in uploaded document content. The day-one user flow is: sign up, upload a PDF, read it inside the app, ask questions, generate study aids, and review progress.

## Constraints

- **Tech stack**: Next.js + Tailwind CSS in `frontend/`, Node.js/Express in `backend/`, MongoDB for persistence — chosen to match the intended architecture and repo structure.
- **UI system**: shadcn/ui on top of Tailwind CSS — required to keep the app visually strong and consistent from the first phase.
- **AI provider**: Google Gemini — required for chat, summaries, explanations, flashcards, and quiz generation.
- **Authentication**: JWT-based auth — required for secure account access and user-specific documents/progress.
- **Performance**: Core flows must feel fast — improving speed versus typical AI study apps is a primary product goal.
- **UX quality**: Responsive, polished UI is a must-have — visual quality is part of the product differentiation, not a nice-to-have.
- **Scope discipline**: v1 must stay focused on the single-user PDF study loop — defer collaboration and multi-document complexity.
- **Git workflow**: Create a dedicated git branch before each phase starts — keep phase work isolated from the main working flow.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Build the frontend as Next.js instead of a plain React client | Matches the desired app structure and gives a strong base for a modern public web product | — Pending |
| Keep the repo split into `frontend/` and `backend/` directories | Clear separation of frontend and API concerns while staying in one repo | — Pending |
| Use shadcn/ui as the frontend component base | Gives the app a stronger default UI foundation than ad hoc Tailwind-only implementation | — Pending |
| Use one git branch per phase | Keeps each phase isolated and reduces workflow collisions while building incrementally | — Pending |
| Make document-grounded PDF study the core workflow | This is the main value proposition and the core day-one user journey | — Pending |
| Prioritize speed and visual quality as product differentiators | Existing AI learning tools often feel slow and ugly, which is the problem this product wants to fix | — Pending |
| Defer team collaboration and multi-file chat out of v1 | They add complexity before the single-document learning loop is proven | — Pending |
| Allow Gemini general knowledge as a secondary enhancement, not the primary source of truth | The app should feel smart, but still stay anchored to the uploaded documents | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `$gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `$gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-26 after initialization*
