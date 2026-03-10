# Design & Experience

This document covers the deliberate UX decisions — from color palette to streaming animation — that shape how it feels to interact with Goenkai.

## Design philosophy: "Frame, don't compete"

Goenka's words are the star — the UI should be invisible when you're reading.

This principle came from studying the Amangiri resort in Utah: buildings made from concrete that looks like frozen sand, set against ancient desert landscapes. The architecture doesn't compete with the environment — it frames it. Everything about Goenkai's design follows this: the UI is the frame, the teachings are the landscape.

I considered three other visual directions before settling on this:

- **Dark-mode-first** (like Calm — deep navy, ambient) — felt too "app-like" and techy for a teaching chatbot
- **Vibrant/playful** (like Headspace — bold colors, illustrations) — wrong for Vipassana's gravitas and seriousness
- **Clinical/minimal** (white backgrounds, blue accents) — clean but lacked warmth; felt like a healthcare tool

The warm earthy direction connects to Vipassana center aesthetics — earth, wood, simple materials — and to Goenka's Indian/Burmese heritage. It feels like handmade paper, not a screen.

In practice, this led to:

- **Warm earthy palette** — Cream parchment backgrounds (#F5F0E8), sand and sage chat bubbles, muted rust accents, deep brown text. Inspired by Vipassana center aesthetics: earth, wood, simple materials.
- **Generous spacing** — Every chat bubble has room to breathe. Padding is meditation.
- **Serif + sans-serif pairing** — Lora (serif) for the brand name and headings, Inter (sans-serif) for body text. The serif adds gravitas and connects to the book/teaching tradition. The sans-serif keeps chat readable.
- **Zero gamification** — No streaks, no badges, no points. Antithetical to Vipassana.
- **No bright blues, no pure white** — Blues feel corporate and clinical. Pure white feels stark. Warm cream feels like paper.

## The design inspiration

Before writing any code, I analyzed 7 visual references spanning meditation apps, luxury wellness brands, Buddhist art, and curated color palettes. Each reference contributed something specific to Goenkai's visual language.

See the [full design inspiration](design-inspiration.md) with analysis of each reference.

Key influences:

| Reference | What I took from it |
|---|---|
| **Aesop** | The warm neutral palette — cream, taupe, deep brown. Wabi-Sabi philosophy connecting directly to Buddhist aesthetics. |
| **Amangiri** | The "framing, not competing" principle. The container is beautiful but the content is the star. |
| **Wysa** | Most relevant chatbot reference. Generous bubble padding, deliberate message pacing, typing indicators that feel contemplative. |
| **Thich Nhat Hanh's calligraphy** | "One phrase, lots of space." Cream backgrounds instead of pure white. The warmth of handmade paper. |

## Why streaming with character-level animation

Most chatbots dump text as fast as the API sends it. I deliberately slowed it down.

The API sends response text in bursts — chunks arrive unevenly as the model generates them. Rather than displaying this raw stream (which feels jittery and rushed), I built a two-stage system:

1. **Buffer stage** — Incoming text accumulates in a buffer, decoupled from the display.
2. **Ticker stage** — A small loop runs every 30ms, pulling 2 characters at a time from the buffer and rendering them on screen. Each character appears inside its own element with a 150ms CSS fade-in animation. This creates a smooth, steady reveal at ~66 characters per second — regardless of how fast or slow the API is sending data.

When streaming ends, the message re-renders as formatted text (paragraphs, bold, blockquotes) in a single pass to avoid layout shift.

### Alternatives I tested

I considered four approaches and tested two side-by-side using a URL parameter (`?v=a` vs `?v=b`):

| Approach | Result |
|---|---|
| **Instant text** (standard chatbot behavior) | Too abrupt for a meditation context. Text dumps feel rushed. |
| **Fake typing delay** (wait, then show complete response) | Dishonest — the user is waiting for nothing. Goenkai should be authentic. |
| **Word-level fade-in** (variant B — tested) | Jittery. Words "pop" in at uneven intervals depending on word length. |
| **Character-level fade-in** (variant A — chosen) | Smooth, like ink appearing on paper. Steady rhythm regardless of content. |

This was a deliberate product choice: a meditation chatbot should feel unhurried. The technical implementation (a ticker mechanism decoupling API speed from display speed) serves a specific UX goal.
