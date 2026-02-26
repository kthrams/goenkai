# Goenkai RAG Chatbot: Content Sources Research

**Date:** 2026-02-22
**Purpose:** Identify unique online sources of S.N. Goenka / Vipassana content that general AI models are LESS likely to have been trained on. Catalog for future scraping/ingestion.

---

## Already Collected

You already have 12 YouTube discourse transcript files (VTT format) in `goenkai/sources/discourses/`, covering 10 days of the 10-day course plus two bonus stories. Estimated ~4.8MB of raw transcript text.

---

## Tier 1: Highest-Value Unique Sources

These are the sources most likely to contain content NOT in general AI training data, and most directly relevant to a Goenka chatbot.

### 1. vridhamma.org — "A Store-House of Answers" (Q&A Bank)
- **URL:** https://www.vridhamma.org/A-store-house-of-answers-by-Shri-S-N-Goenka
- **Type:** Massive Q&A collection — Goenka's answers to thousands of questions from students since 1969
- **Categories:** 25+ sections including Addiction, Attachment, Beliefs, Cause & Effect, Concentration, Craving, Daily Life, Dhamma & Sect, Ego, Equanimity, Enlightenment, Food, Health, Mantras, Metta, Mind, Morality, Noble Truths, Other Techniques, Rites & Rituals, Society, Spread of Vipassana, The Buddha, Tipitaka, and Vipassana Practice
- **Estimated volume:** Very large — likely 50,000-100,000+ words across all categories
- **Scrapeable?** Yes — standard HTML pages organized by category
- **Uniqueness: HIGH** — This is a niche organizational website. Unlikely to be heavily scraped by AI training crawlers. The Q&A format is perfect for a chatbot.

### 2. vridhamma.org — Full Discourses (70+ public talks)
- **URL:** https://www.vridhamma.org/Discourses-by-Mr-S-N-Goenka
- **Type:** Full-text transcripts of ~70 public discourses organized into 12 categories
- **Categories:** Daily Life (12), Dhamma (8), Noble Truths (4), Morality (3), Concentration (7), Wisdom (5), Metta (2), Society (15), Buddha's Teachings (8), The Buddha (8), Tipitaka (4), Spread of Vipassana (9)
- **Estimated volume:** 70+ full discourse texts, likely 150,000-300,000+ words total
- **Scrapeable?** Yes — individual HTML pages per discourse
- **Uniqueness: HIGH** — These are not the same as the 10-day course discourse summaries. These are public talks on specific topics. Very high-value unique content.

### 3. vridhamma.org — VRI Newsletters (1965-2026)
- **URL:** https://www.vridhamma.org/newsletters
- **Type:** Monthly newsletters as downloadable PDFs
- **Languages:** English, Hindi, Kannada, Marathi
- **Estimated volume:** 700+ monthly issues spanning 60+ years. Each issue ~4-8 pages. Total: potentially 500,000+ words of English content alone
- **Scrapeable?** PDFs — need download + OCR/text extraction
- **Uniqueness: VERY HIGH** — Monthly organizational newsletters from 1965 to present. Almost certainly NOT in AI training data. Contains articles by Goenka, center updates, student experiences, Pali translations.

### 4. vridhamma.org — Free Books (PDF downloads)
- **URL:** https://www.vridhamma.org/free-books
- **Type:** Full books and pamphlets as PDF downloads
- **Key English titles available:**
  - "For the Benefit of Many" (talks + Q&A, 1983-2000)
  - "Gotama the Buddha: His Life and Teaching"
  - "Meditation Now: Inner Peace through Inner Wisdom"
  - "The Discourse Summaries"
  - "The Gem Set in Gold" (Pali chanting with English translations + Hindi dohas)
  - "The Gracious Flow of Dharma"
  - "Sayagyi U Ba Khin Journal"
  - "The Manuals of Dhamma" (Ledi Sayadaw)
  - Morning Chanting in Pali (Pali-English)
  - Multiple pamphlets on vipassana in prisons, health, corporate management, government
- **Also available in Hindi:** ~17 pamphlets, including dohas in Rajasthani
- **Estimated volume:** 15+ English books/pamphlets. Probably 300,000-500,000 words total
- **Scrapeable?** PDF download links available directly. Text extraction needed.
- **Uniqueness: HIGH** — Free VRI publications. Some may overlap with Internet Archive versions, but the pamphlets and smaller publications are very niche.

### 5. Chronicles of Dhamma (PDF — free download)
- **URL:** https://www.dhammabooks.org.au/uploads/b/9e2456c0-456b-11ee-9075-d368fbaed29a/Chronicles%20of%20Dhamma.pdf
- **Also at:** http://dhammadownloads.com.au/chronicles_of_dhamma.pdf
- **Type:** Compiled book — selected articles from the Vipassana Newsletter, organized thematically
- **Sections:** Vipassana Teachings; Messenger of Dhamma; In the Footsteps of the Buddha; Applied Dhamma; The Spread of Dhamma
- **Estimated volume:** Full book, likely 80,000-120,000 words
- **Scrapeable?** Direct PDF download. Text extraction needed.
- **Uniqueness: VERY HIGH** — This is a curated compilation from decades of newsletters. Even if the book exists on Amazon, the PDF on an Australian Dhamma center website is very unlikely to be in training data.

---

## Tier 2: High-Value Sources (Some Training Data Overlap Possible)

### 6. Internet Archive — Goenka Books Collection
- **URLs:**
  - Discourse Summaries: https://archive.org/details/6.-the-discourse-summaries-english-dana-0-1
  - Full text version: https://archive.org/stream/6.-the-discourse-summaries-english-dana-0-1/6.-The-Discourse-Summaries-English-Dana_0%20(1)_djvu.txt
  - Satipatthana Sutta Discourses: https://archive.org/details/sati-1 (PDF: https://archive.org/download/sati-1/Sati-1.pdf)
  - For the Benefit of Many: https://archive.org/details/forbenefitofmany00sngo
  - The Gracious Flow of Dhamma: https://archive.org/details/40.-e-08-the-gracious-flow-of-dhamma-dana-0
  - An Ancient Path (public talks): https://archive.org/details/an-ancient-path
  - Art of Living: https://archive.org/details/art-of-living-1
  - Art of Dying: full text at https://archive.org/stream/art-of-dying-by-vipassana-meditation-teacher-s-n-goenka-and-others/
  - Clock of Vipassana Has Struck (U Ba Khin + Goenka): https://archive.org/details/clockofvipassana0000bakh
- **Type:** Full book PDFs and DjVu text files
- **Estimated volume:** 8-10 full books, probably 400,000-600,000 words combined
- **Scrapeable?** Yes — DjVu text streams available for some. PDFs for others.
- **Uniqueness: MEDIUM** — Internet Archive is commonly scraped by AI companies. However, the DjVu text versions and niche uploads may have been missed.

### 7. saraniya.com — Meditation Books Collection
- **URLs:**
  - Discourse Summaries PDF: https://www.saraniya.com/books/meditation/SN_Goenka-The_Discourse_Summaries.pdf
  - Meditation Now PDF: https://www.saraniya.com/books/meditation/SN_Goenka-Meditatio_Now.pdf
  - Clock of Vipassana PDF: https://www.saraniya.com/books/meditation/U_Ba_Khin-The_Clock_of_Vipassana_has_Struck.pdf
  - Full ebook collection page: https://saraniya.com/meditation-ebooks/
- **Type:** PDF books hosted by a Sri Lankan meditation centre
- **Estimated volume:** 3-5 PDFs, overlaps with Internet Archive
- **Scrapeable?** Direct PDF links
- **Uniqueness: MEDIUM** — Small niche site, but content overlaps with Archive.org copies

### 8. Pariyatti — Free Resources Collection
- **URLs:**
  - Free resources hub: https://pariyatti.org/Free-Resources
  - Q&A with Goenka: https://pariyatti.org/Free-Resources/Articles-and-Excerpts/Questions-Answers-with-S-N-Goenka
  - Daily Dhamma Verses RSS: http://feeds.pariyatti.org/dohas
  - Treasures archive: https://pariyatti.org/Free-Resources/Treasures
  - Newsletter archive: https://pariyatti.org/Free-Resources/Newsletter-Archive
- **Type:** Mix of articles, excerpts, Q&A, and archived historical texts
- **Treasures collection includes:** "The Light of the Dhamma" (10 vols, 1952-1963), "The Light of Buddha" (10 vols, 1956-1965), The Five Nikayas anthology, Chattha Sangayana Souvenir Album, plus dozens of PDFs/ePubs
- **Estimated volume:** 100+ downloadable resources in Treasures alone; Q&A page ~3,000 words; Daily Dohas are ongoing
- **Scrapeable?** Mixed — some HTML, some PDFs. Treasures are downloadable files.
- **Uniqueness: HIGH for Treasures** (1950s-60s Buddhist magazines, very niche), MEDIUM for main site

### 9. holybooks.com — Vipassana eBooks
- **URLs:**
  - Art of Living: https://www.holybooks.com/artlivingvipassana/
  - Clock of Vipassana: https://www.holybooks.com/the-clock-of-vipassana-has-struck/
  - Realizing Change: https://www.holybooks.com/realizing-change-vipassana-meditation-hetherington/
- **Type:** Free PDF downloads
- **Estimated volume:** 3 books, ~150,000 words combined
- **Scrapeable?** PDF downloads
- **Uniqueness: LOW-MEDIUM** — holybooks.com is a known free ebook site, possibly scraped

---

## Tier 3: Supplementary / Community Sources

### 10. Pali Chanting Texts with Translations
- **URL:** https://www.vridhamma.org/sites/default/files/mornenglishweb_0.pdf
- **Type:** Morning chanting text — Pali with English translation
- **Estimated volume:** ~5,000-10,000 words
- **Scrapeable?** Direct PDF download
- **Uniqueness: HIGH** — Very niche PDF on a subdomain

### 11. Individual Dhamma Center Q&A Pages
- **URLs:**
  - Dhamma Mutta: https://mutta.dhamma.org/dhamma-discourses/qa/
  - Dhamma Patapa: https://www.patapa.dhamma.org/qanda/
  - Dhamma Pamoda: https://pamoda.dhamma.org/en/vipassana/questions-answers/
- **Type:** Q&A pages on individual center websites — likely subsets of the master Q&A bank
- **Estimated volume:** ~5,000-15,000 words each
- **Scrapeable?** Standard HTML
- **Uniqueness: HIGH** — Subdomains of dhamma.org, very unlikely to be scraped by AI trainers

### 12. Living Vipassana Blog
- **URL:** https://livingvipassana.com/
- **Type:** Personal blog with discourse notes (Day 1-10), critical analysis, and reflections on Goenka's teachings
- **Estimated volume:** ~30-50 blog posts, ~50,000+ words
- **Scrapeable?** Standard WordPress blog
- **Uniqueness: MEDIUM-HIGH** — Personal blog, contains original discourse notes and critical perspectives not found elsewhere

### 13. Vipassana Forum
- **URL:** https://www.vipassanaforum.net/forum/
- **Type:** Community discussion forum with threads on Goenka's teachings, Satipatthana course, practice questions
- **Estimated volume:** Hundreds of discussion threads, ~100,000+ words
- **Scrapeable?** Standard forum HTML (SMF forum software)
- **Uniqueness: MEDIUM** — Forum content may have been scraped, but niche enough to have gaps

### 14. Ceekr.com — Goenka Content Hub
- **URL:** https://www.ceekr.com/s-n-goenka
- **Type:** Aggregated articles, Q&A, quotes, and ebook links related to Goenka
- **Estimated volume:** ~20,000-40,000 words
- **Scrapeable?** Standard HTML
- **Uniqueness: MEDIUM** — Content is likely mirrored from VRI and other sources

### 15. Dhamma Wheel Buddhist Forum
- **URL:** https://www.dhammawheel.com/ (search for Goenka threads)
- **Type:** Forum discussions about Goenka chanting translations, meditation instructions, comparisons with other traditions
- **Estimated volume:** Dozens of relevant threads
- **Scrapeable?** Standard forum HTML
- **Uniqueness: LOW-MEDIUM** — Large forum, more likely to be in training data

### 16. Awakin.org — Goenka Excerpts
- **URL:** https://www.awakin.org/v2/read/view.php?tid=213
- **Type:** Short excerpt — "Logical Conclusion of Meditation" by Goenka
- **Estimated volume:** ~1,000-2,000 words
- **Scrapeable?** Standard HTML
- **Uniqueness: MEDIUM** — Small niche community site

### 17. Academic Papers (Goenka-specific)
- **URLs:**
  - McGill thesis: https://escholarship.mcgill.ca/concern/theses/p5547t26d
  - Canadian collections: https://www.collectionscanada.gc.ca/obj/s4/f2/dsk4/etd/MQ79007.pdf
  - Academia.edu papers: Multiple (search "S.N. Goenka vipassana")
  - ResearchGate papers on awareness/equanimity in Goenka's vipassana
  - Analayo paper on U Ba Khin roots: https://host.pariyatti.org/treasures/The_Ancient_Roots_of_the_U_Ba_Khin_Vipassana_Meditation.pdf
- **Type:** Academic theses, journal articles, and research papers
- **Estimated volume:** 5-10 papers, ~100,000+ words combined
- **Scrapeable?** PDFs, some behind academic paywalls
- **Uniqueness: HIGH** — Academic papers on niche repositories are less likely to be in training data

### 18. Pariyatti Learning Center (Pali Courses)
- **URL:** https://learning.pariyatti.org/
- **Type:** Free online Pali courses with terminology from Goenka's 10-day course
- **Estimated volume:** Course materials, vocabulary lists, audio content
- **Scrapeable?** Requires registration (free). Behind login wall.
- **Uniqueness: VERY HIGH** — Behind authentication wall, almost certainly not in training data

### 19. tipitaka.org — VRI Digital Tipitaka
- **URL:** https://www.tipitaka.org/
- **Type:** Complete Pali Tipitaka digitized by VRI, searchable, multiple scripts
- **Estimated volume:** Massive — the entire Pali Canon
- **Scrapeable?** Web-based with search interface
- **Uniqueness: MEDIUM** — The Tipitaka itself is well-known, but VRI's specific digital edition with their translations and annotations adds unique value

### 20. discourses.dhamma.org — Old Student Resources
- **URL:** https://discourses.dhamma.org/
- **Type:** Password-protected site for old students — discourse recordings and possibly text resources
- **Estimated volume:** Unknown — behind login
- **Scrapeable?** No — requires old student login credentials
- **Uniqueness: VERY HIGH** — Completely behind auth wall. If text transcripts exist here, they would be extremely unique for RAG.

---

## Tier 4: Content You Already Have or Can Easily Get

### 21. YouTube Discourse Transcripts
- **Status:** Already collected (12 VTT files in `sources/discourses/`)
- **What's missing:** Day 3 discourse transcript (Days 1-2, 4-10, plus Last Day are present)
- **Additional YouTube content:** Public talks, interviews, shorter clips with auto-generated transcripts

### 22. dhamma.org — Code of Discipline & Public Pages
- **URL:** https://www.dhamma.org/en/docs/core/code-en.pdf and https://www.dhamma.org/en/osguide
- **Type:** Course code of discipline, old student guide
- **Estimated volume:** ~10,000 words
- **Scrapeable?** Mix of PDFs and HTML
- **Uniqueness: MEDIUM** — Public-facing pages of a well-known site

---

## Priority Ranking for Scraping

| Priority | Source | Est. Words | Effort | Uniqueness |
|----------|--------|-----------|--------|------------|
| 1 | vridhamma.org Q&A Bank | 50-100K | Low (HTML) | Very High |
| 2 | vridhamma.org Discourses (70+) | 150-300K | Low (HTML) | Very High |
| 3 | vridhamma.org Free Books PDFs | 300-500K | Medium (PDF) | High |
| 4 | Chronicles of Dhamma PDF | 80-120K | Low (single PDF) | Very High |
| 5 | vridhamma.org Newsletters (PDFs) | 500K+ | High (700+ PDFs) | Very High |
| 6 | Pariyatti Treasures archive | 200K+ | Medium (mixed) | High |
| 7 | Internet Archive books | 400-600K | Medium (PDF/DjVu) | Medium |
| 8 | Pali chanting translations PDF | 5-10K | Low (single PDF) | High |
| 9 | Center Q&A pages (dhamma.org subdomains) | 15-45K | Low (HTML) | High |
| 10 | Academic papers | 100K+ | Medium (PDF) | High |
| 11 | Living Vipassana blog | 50K+ | Low (WordPress) | Medium-High |
| 12 | Pariyatti Q&A + Daily Dohas | 10-20K | Low (HTML/RSS) | Medium |

---

## Total Estimated Content Volume

| Category | Est. Words |
|----------|-----------|
| Already collected (YouTube transcripts) | ~200K (raw VTT) |
| Tier 1 sources (vridhamma.org + Chronicles) | 1M-1.5M |
| Tier 2 sources (Archive, Pariyatti, etc.) | 500K-800K |
| Tier 3 sources (community, academic) | 200K-400K |
| **Total potential corpus** | **~2-3 million words** |

---

## Key Observations

1. **vridhamma.org is the mother lode.** The VRI website alone could provide 1M+ words of highly unique content across Q&A, discourses, newsletters, and free books. This should be the primary scraping target.

2. **The Q&A Bank is perfect for RAG.** It's already organized in question-answer format across 25+ categories. This maps directly to chatbot retrieval.

3. **Newsletters are the hidden gem.** 60+ years of monthly newsletters is a massive corpus that almost certainly isn't in AI training data. The effort to process 700+ PDFs is high but the payoff is enormous.

4. **Overlap between sources is significant.** "For the Benefit of Many" appears on vridhamma.org, Internet Archive, and holybooks.com. De-duplication will be important.

5. **The 10-day course discourse FULL transcripts (not summaries) are the most valuable single piece.** You already have YouTube auto-generated transcripts. The official "Discourse Summaries" book is a condensed version — the full hour-long discourse transcripts (if they exist in text form) would be far richer.

6. **Behind-auth content (discourses.dhamma.org, learning.pariyatti.org) is the most unique but least accessible.** Worth investigating if you have old student credentials.

---

## Sources

- [VRI Free Books](https://www.vridhamma.org/free-books)
- [VRI Discourses](https://www.vridhamma.org/Discourses-by-Mr-S-N-Goenka)
- [VRI Q&A Bank](https://www.vridhamma.org/A-store-house-of-answers-by-Shri-S-N-Goenka)
- [VRI Newsletters](https://www.vridhamma.org/newsletters)
- [Chronicles of Dhamma PDF](https://www.dhammabooks.org.au/uploads/b/9e2456c0-456b-11ee-9075-d368fbaed29a/Chronicles%20of%20Dhamma.pdf)
- [Pariyatti Free Resources](https://pariyatti.org/Free-Resources)
- [Pariyatti Treasures](https://pariyatti.org/Free-Resources/Treasures)
- [Pariyatti Q&A](https://pariyatti.org/Free-Resources/Articles-and-Excerpts/Questions-Answers-with-S-N-Goenka)
- [Internet Archive Goenka Collection](https://archive.org/search?query=S.N.+Goenka+vipassana)
- [Saraniya Meditation Books](https://saraniya.com/meditation-ebooks/)
- [Living Vipassana Blog](https://livingvipassana.com/)
- [Dhamma Wheel Forum](https://www.dhammawheel.com/)
- [Vipassana Forum](https://www.vipassanaforum.net/forum/)
- [Ceekr Goenka Hub](https://www.ceekr.com/s-n-goenka)
- [Holy Books Vipassana](https://www.holybooks.com/artlivingvipassana/)
- [Dhamma Resources (Old Students)](https://discourses.dhamma.org/)
- [Pariyatti Learning Center](https://learning.pariyatti.org/)
- [VRI Digital Tipitaka](https://www.tipitaka.org/)
- [Awakin.org Goenka excerpt](https://www.awakin.org/v2/read/view.php?tid=213)
- [McGill Thesis on Goenka](https://escholarship.mcgill.ca/concern/theses/p5547t26d)
