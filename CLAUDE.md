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
- Dev server runs on `localhost:3333`

### Knowledge base — DONE
- 1.37M words across 130+ files from 20+ sources in `sources/`
- Full source inventory in `_private/content-sources-research.md`

### Backend — DONE
- Anthropic API (Claude Haiku) for LLM responses with Goenka voice system prompt
- OpenAI `text-embedding-3-small` for embeddings (1,536 dimensions)
- Supabase pgvector for vector storage and similarity search
- 4,936 chunks ingested via `scripts/ingest.ts` (paragraph-aware fixed-size splitting, 2,000 char max)
- `/api/chat` route: embed question → vector search (8 chunks, 0.3 threshold) → Claude with context → streamed response
- Rate limiting (hourly + daily) for cost protection
- `.env.local` configured with Anthropic, OpenAI, and Supabase keys

### Portfolio documentation — DONE
- README.md rewritten as portfolio piece (why I built this, how it works, tech stack, design philosophy)
- 5 public docs in `docs/`: architecture, design-and-experience, prompt-engineering, data-corpus, design-inspiration
- 3 Excalidraw diagrams with PNG exports (system-architecture, prompt-structure, ingestion-pipeline)
- 2 internal docs in `_private/` (content-sources-research, suggestion-chips-research) — gitignored
- Nothing committed yet — awaiting Kevin's review in Obsidian

### Next steps
- **Review and commit docs** — Kevin reviewing all docs in Obsidian before pushing to GitHub
- **AI evals** (Sprint 4): Build golden set of 15-20 Q&A pairs, score chatbot quality, iterate on chunking/prompt/config
- Chunk quality investigation: 91 discourse chunks are 3x larger than average, 381 small fragments may be noise (see goenkai memory for full analysis)
- No overlap configured in chunking — potential improvement

## Key design decisions
- Design inspiration at `docs/design-inspiration.md` (7 references analyzed)
- Philosophy: "Frame, don't compete" — UI is invisible, Goenka's words are the star
- Dark mode tokens defined but not yet implemented

## Tech stack
- Framework: Next.js 16
- Styling: Tailwind CSS v4
- Components: shadcn/ui (Radix primitives)
- Fonts: Inter (body) + Lora (brand/serif)
- Icons: Lucide React
- LLM: Anthropic Claude Haiku (`claude-haiku-4-5-20251001`), `temperature: 0.7`, `max_tokens: 800`
- Embeddings: OpenAI `text-embedding-3-small`
- Database: Supabase with pgvector extension

## System prompt structure
The system prompt in `src/app/api/chat/route.ts` is structured with **brevity rules at the top** (RESPONSE FORMAT block) because instruction position matters — rules near the top get stronger compliance. Key lesson from a truncation bug: `max_tokens` is a safety net, not a length shaper. The system prompt controls response length; `max_tokens: 800` just prevents hard cutoffs.
