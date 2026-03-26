# Pitfalls Research

**Domain:** AI-powered PDF learning assistant
**Researched:** 2026-03-26
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Ungrounded AI Answers

**What goes wrong:**
Chat feels impressive in demos but starts inventing answers or mixing in unsupported claims.

**Why it happens:**
Teams skip retrieval quality, use overly broad prompts, or do not separate document-grounded mode from general explanation mode.

**How to avoid:**
Implement document-scoped retrieval first, keep prompts explicit about source grounding, and store source/page metadata with chunks.

**Warning signs:**
Answers sound fluent but cannot be traced back to uploaded content, or users ask “where did that come from?”

**Phase to address:**
Phase 2 or earlier, before advanced study tools depend on AI quality.

---

### Pitfall 2: Relying on Temporary File References

**What goes wrong:**
The app works in short tests but fails to preserve document usability over time.

**Why it happens:**
Teams lean on Gemini Files API URIs as if they are durable storage, even though uploaded files are stored for only 48 hours.

**How to avoid:**
Persist PDFs in your own object storage and persist extracted chunks/embeddings in your own database.

**Warning signs:**
Previously uploaded PDFs stop working after a couple of days, or study artifacts become disconnected from source files.

**Phase to address:**
Phase 1 foundation and upload architecture.

---

### Pitfall 3: Slow Upload-to-Ready Experience

**What goes wrong:**
The product feels slow immediately after upload, undermining the user’s stated differentiation goal.

**Why it happens:**
Parsing, embedding, summarization, and artifact generation all happen synchronously with poor status feedback.

**How to avoid:**
Track explicit ingestion states, return control to the user quickly, and generate heavy artifacts asynchronously where possible.

**Warning signs:**
Uploads hang for long periods, users refresh during ingest, or the UI blocks while background work runs.

**Phase to address:**
Phase 1 and Phase 2.

---

### Pitfall 4: Bad PDF Chunking Strategy

**What goes wrong:**
Chat misses relevant passages, summaries feel generic, and concept explanations ignore structure.

**Why it happens:**
Naive fixed-size chunking breaks headings, tables, and semantic boundaries.

**How to avoid:**
Use structure-aware extraction where possible, keep metadata like page number and section, and tune chunk size/overlap with real documents.

**Warning signs:**
Relevant content exists in the PDF but retrieval repeatedly misses it or returns fragmented nonsense.

**Phase to address:**
Phase 2 retrieval pipeline.

---

### Pitfall 5: Overbuilding v1 Scope

**What goes wrong:**
The project stalls under too many ambitious features before the core study loop is polished.

**Why it happens:**
Document AI products invite adjacent features like collaboration, OCR, multi-file knowledge bases, and social features.

**How to avoid:**
Keep v1 centered on one user, one document session, and high-quality study outputs.

**Warning signs:**
Roadmap items start branching into roles, sharing, syncing, and cross-document orchestration before the single-document flow is reliable.

**Phase to address:**
Roadmap definition and every later phase review.

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Store PDFs on local disk in production | Fastest setup | Fragile deployments and broken persistence | Dev only |
| Generate artifacts on every page load | Less schema design up front | Higher cost, slower UX, inconsistent outputs | Never for core flows |
| Skip chunk/page metadata | Faster initial ingestion | Weak citations and worse debugging | Never |
| Inline business logic inside route handlers | Fast implementation | Hard-to-test backend and tangled AI logic | Small prototypes only |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Gemini API | Calling models directly from the browser | Keep Gemini access server-side |
| Gemini document processing | Using file uploads as durable storage | Treat Files API as transient helper infrastructure |
| MongoDB Vector Search | Forgetting user/document filters in retrieval | Always scope by owner and document metadata |
| JWT auth | Long-lived insecure tokens with weak refresh handling | Use short-lived access tokens and safer refresh/session strategy |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Full-document prompting per query | Expensive, slow chat | Chunk + retrieve + cache | Breaks immediately on larger PDFs |
| Synchronous ingestion UX | Upload page feels frozen | Background state machine and progress messaging | Breaks even at small user counts |
| Recomputing dashboard metrics live from raw activity | Slow dashboard loads | Precompute or aggregate efficiently | Breaks as history grows |
| Large unbounded chat histories in a single prompt | Rising latency and token usage | Window or summarize older turns | Breaks with active users and long sessions |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Trusting uploaded file type without validation | Malicious uploads or parser failures | Validate MIME type, extension, and size; sanitize filenames |
| Missing document ownership checks | User data leakage | Enforce user/document authorization in every read/write route |
| Exposing AI keys to the client | Provider abuse and key compromise | Keep secrets server-side only |
| Weak token/session invalidation | Account takeover persistence | Implement token expiry and logout/session revocation clearly |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No ingestion status | Users think the app is broken | Show `uploading`, `processing`, and `ready` states clearly |
| Chat answers without source cues | Trust drops quickly | Show document grounding, page references, or source hints |
| Janky PDF reader | Core study flow feels second-rate | Invest in reading experience early |
| Cluttered dashboard | Value gets buried | Keep dashboard focused on recent work and obvious next actions |

## "Looks Done But Isn't" Checklist

- [ ] **Upload flow:** PDF is stored durably, not just accepted by the API
- [ ] **Chat:** answers are actually retrieval-grounded, not generic model output
- [ ] **Flashcards:** generated cards can be saved, revisited, and favorited
- [ ] **Quizzes:** score review includes correct answers and explanations
- [ ] **Dashboard:** recent activity reflects real persisted events
- [ ] **Responsive UI:** reader, chat, and quiz flows work on mobile widths

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Ungrounded answers | HIGH | Rework chunking, retrieval filters, and prompt policy |
| Temporary file dependency | HIGH | Migrate to durable storage and re-ingest documents |
| Slow ingestion path | MEDIUM | Add async processing and status tracking |
| Overbuilt scope | MEDIUM | Cut roadmap aggressively and defer non-core features |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Temporary file dependency | Phase 1 | Uploaded PDFs still work after days and deployments |
| Slow upload-to-ready experience | Phase 1 | Upload status is visible and usable |
| Bad chunking / weak retrieval | Phase 2 | Chat answers consistently reference relevant document content |
| Ungrounded AI answers | Phase 2 | Manual QA confirms answer/source alignment |
| Overbuilding v1 scope | Roadmap + later transitions | Deferred items stay deferred unless explicitly promoted |

## Sources

- https://ai.google.dev/gemini-api/docs/document-processing
- https://ai.google.dev/gemini-api/docs/embeddings
- https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-overview/
- https://support.google.com/notebooklm/answer/16164461?hl=en
- Inference from the user’s performance and scope goals

---
*Pitfalls research for: AI-powered PDF learning assistant*
*Researched: 2026-03-26*
