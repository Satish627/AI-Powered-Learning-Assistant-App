---
phase: 1
slug: foundation-and-authentication
status: approved
shadcn_initialized: false
preset: new-york
created: 2026-03-26
reviewed_at: 2026-03-26T21:00:00+01:00
---

# Phase 1 — UI Design Contract

> Visual and interaction contract for frontend phases. Generated for Phase 1 planning and treated as approved design context.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn |
| Preset | new-york |
| Component library | radix |
| Icon library | lucide-react |
| Font | Plus Jakarta Sans |

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, inline padding |
| sm | 8px | Compact element spacing |
| md | 16px | Default form and card spacing |
| lg | 24px | Section padding |
| xl | 32px | Layout gaps between major shell regions |
| 2xl | 48px | Hero and auth card breathing room |
| 3xl | 64px | Page-level vertical rhythm |

Exceptions: none

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 16px | 400 | 1.5 |
| Label | 14px | 600 | 1.4 |
| Heading | 20px | 600 | 1.25 |
| Display | 32px | 600 | 1.1 |

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | #F8F6F1 | App background, landing background, auth page surface |
| Secondary (30%) | #E6EDF5 | Cards, sidebar surface, auth panels, bordered sections |
| Accent (10%) | #0F766E | Primary CTA, active nav item, focus ring, inline text links |
| Destructive | #C2410C | Logout confirmation emphasis and destructive states only |

Accent reserved for: primary CTA, active sidebar item, keyboard focus ring, inline text links

---

## Visual Hierarchy

| Surface | Focal Point | Supporting Elements |
|---------|-------------|---------------------|
| Landing page | Display headline + primary CTA | Supporting proof points and auth CTA secondary action |
| Auth page | Auth card title + primary submit action | Form fields, auth mode switch, inline validation |
| Authenticated dashboard shell | Page heading and main workspace card | Sidebar navigation, user menu, empty-state support copy |

Rules:
- Never use accent color for every interactive element.
- Use one primary action per screen.
- Icon-only actions must include text labels or tooltip/accessible label fallback.

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA | Start Studying |
| Empty state heading | No documents yet |
| Empty state body | Upload your first PDF to start studying. |
| Error state | We couldn't sign you in. Check your email and password, then try again. |
| Destructive confirmation | Log out: End this session on this device? |

Tone rules:
- Academic but not stiff
- Playful in warmth, not in novelty gimmicks
- Clear action verbs over vague product language

---

## Interaction Contract

| Area | Contract |
|------|----------|
| Landing page entry | Public-first with clear sign-up/login path |
| Auth form | Single auth page with mode switch between sign up and login |
| Post-signup routing | Successful signup drops directly into the authenticated app |
| App shell | Left sidebar, top header with app name/logo + user menu only |
| Navigation visibility | Only show live sections in Phase 1; no disabled future nav items |
| Empty state action | Empty library/dashboard state should point directly to upload as the next obvious action |

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | button, input, label, card, form, sheet or sidebar primitives, dropdown-menu | not required |

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-03-26
