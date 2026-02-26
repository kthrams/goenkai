# Goenkai — Project Context

## Status
Active. Sprint 2 learning project (ai-skills curriculum).

## What this is
A Vipassana RAG chatbot — answers questions about Dhamma/meditation using S.N. Goenka's teachings. Built as a hands-on learning project (Sprint 2 of ai-skills curriculum). Technically equivalent to any enterprise "AI on our docs" product.

## Current state

### Frontend UI — DONE
- Next.js 16 + Tailwind v4 + shadcn/ui + Lora/Inter fonts
- Warm earthy design system (cream parchment, sand/sage chat bubbles, muted rust accents)
- Chat interface with typing indicator, suggestion chips, welcome screen
- "Goenkai" header button clears chat and returns to welcome screen
- Currently uses **mock responses** (hardcoded keyword matching, no API)
- Dev server runs on `localhost:3333`

### Knowledge base — DONE
- 1.37M words across 130+ files from 20+ sources in `sources/`
- See `docs/content-sources-research.md` for full inventory

### Backend — NOT STARTED
Next steps (from previous session planning):

| Step | What | Status |
|---|---|---|
| 1. Anthropic API key | Get key from console.anthropic.com, store in `.env.local` | Not started |
| 2. Ingestion script | Split 1.37M words into chunks, generate embeddings | Not started |
| 3. Supabase pgvector | Vector column + similarity search function | Not started |
| 4. API route | `/api/chat` — search chunks → send to Claude → return answer | Not started |
| 5. Connect frontend | Replace mock responses with real API calls | Not started |

**Pick up here: Step 1 — Kevin needs to provide an Anthropic API key.**

## Key design decisions
- Design moodboard at `docs/design-moodboard.md` (12 references analyzed)
- Philosophy: "Frame, don't compete" — UI is invisible, Goenka's words are the star
- Dark mode tokens defined but not yet implemented

## Tech stack
- Framework: Next.js 16
- Styling: Tailwind CSS v4
- Components: shadcn/ui (Radix primitives)
- Fonts: Inter (body) + Lora (brand/serif)
- Icons: Lucide React
- Backend: TBD (Anthropic API + Supabase pgvector planned)
