# Goenkai

A RAG-powered chatbot that answers everyday life questions using the Vipassana teachings of S.N. Goenka. Ask it about meditation practice, dealing with difficult emotions, or the nature of suffering, and it responds in Goenka's characteristic voice: direct, compassionate, and always pointing back to personal experience.

## Why I built this

I'm a Product Manager learning to build with AI. I wanted to understand every layer of the "AI on your docs" product pattern that's becoming standard in enterprise software.

Every decision here — from which embedding model to use, to how to chunk text, to where to position instructions in a system prompt — is one I'd need to evaluate as a PM working on AI products. Building it myself means I can have those conversations from experience, not theory.

## Why is this better than ChatGPT?

ChatGPT and Claude can answer basic questions about Vipassana, but their training data is thin on Goenka's specific teachings. Most of his material lives in books (*The Art of Living*, *The Discourse Summaries*, *Chronicles of Dhamma*), Q&A collections from Vipassana centers, and transcripts of 10-day course discourses — sources that aren't well-represented in general LLM training data.

Goenkai's knowledge base is 1.37 million words drawn from 20+ of these sources, chunked and embedded for semantic retrieval. When you ask a question, the answer is grounded in specific passages from Goenka's actual teachings, not the model's general knowledge of Buddhism. The model generates the response, but the source material — and the voice — come from Goenka. The [knowledge base doc](docs/data-corpus.md) covers the full ingestion pipeline, chunking strategy and trade-offs, and a quality analysis of the resulting 4,936 chunks.

## Architecture and tech stack

| Layer      | Choice                          | Why                                                                      |
| ---------- | ------------------------------- | ------------------------------------------------------------------------ |
| Framework  | Next.js 16                      | App router, API routes, server-side streaming                            |
| LLM        | Claude Haiku                    | Fast, cost-efficient, strong instruction following for voice consistency |
| Embeddings | OpenAI `text-embedding-3-small` | Best price/performance ratio for semantic search                         |
| Vector DB  | Supabase pgvector (HNSW index)  | Good enough at ~5K chunks, co-located with future auth needs             |
| Styling    | Tailwind CSS v4 + shadcn/ui     | Rapid iteration on a custom design system                                |
| Animation  | Framer Motion                   | Welcome screen transitions and staggered reveals                         |

Every choice optimizes for the same thing: fast, cheap responses that stay faithful to the source material. See [docs/architecture.md](docs/architecture.md) for the full trade-off analysis.

## Design philosophy

**"Frame, don't compete."** Goenka's words are the star — the UI should be invisible when you're reading. This led to a warm earthy palette (cream parchment, sand and sage chat bubbles, muted rust accents) inspired by meditation hall aesthetics, generous spacing, and zero gamification.

See [docs/design-and-experience.md](docs/design-and-experience.md) for the full design rationale, including the streaming animation and the [7 visual references](docs/design-inspiration.md) I analyzed to arrive at this direction.

## Current status

Goenkai is a functional prototype — the RAG pipeline works, the UX is polished, and the voice feels right. But it's not yet a production product. Not only are basic features like authentication, multi-session memory and feedback mechanisms missing, but the AI build also currently lacks basics required for rollout. The table below covers what would be next.

| Requirement                | Current state                 | What's needed                                       |
| -------------------------- | ----------------------------- | --------------------------------------------------- |
| **AI evals**               | None                          | Golden set, scoring pipeline, iteration loop        |
| **Per-user rate limiting** | Per-server, in-memory         | Database-backed, tied to user identity              |
| **Error monitoring**       | Console logs only             | Sentry or equivalent — error tracking, alerting     |
| **Cost monitoring**        | Manual API dashboard checks   | Automated cost tracking per-day, alerts on spikes   |
| **Content safety**         | System prompt guardrails only | Moderation layer for user inputs, output filtering  |
| **Analytics**              | None                          | Usage patterns, popular questions, drop-off points  |
| **Performance monitoring** | None                          | Latency percentiles (embedding, search, LLM, total) |

## Documentation

| Document                                             | What's in it                                                                               |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [Architecture](docs/architecture.md)                 | RAG pipeline deep-dive, component choices, trade-offs, and alternatives considered         |
| [Design & Experience](docs/design-and-experience.md) | Design philosophy, streaming animation, and the visual research that shaped the direction  |
| [Prompt Engineering](docs/prompt-engineering.md)     | System prompt design, instruction ordering, voice calibration                              |
| [Knowledge Base](docs/data-corpus.md)             | Corpus curation, chunking strategy, quality analysis                                       |
| [Design Inspiration](docs/design-inspiration.md)     | Visual references analyzed to define the design direction                                  |

## A note of caution

When I typed in my first question to test the bot, I was shocked. The bot's voice actually sounded like the teacher from the video taped lectures in our course. After some quick research, I found that there is an "afterlife indsutry". Companies recreate people from the dead for profit. Families continue to live with the AI-version of their loved ones who have passed. Be careful when using or building with this technology.