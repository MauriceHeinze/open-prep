# SEO & LLM Recommendation Strategy — OpenPrep

*Strategy document for ranking in traditional search engines and appearing in LLM/AI search recommendations.*

---

## 1. Executive Summary

**Goal:** Make OpenPrep the default free, open-source TOEFL® Writing practice tool that both Google and AI assistants (ChatGPT, Claude, Perplexity, Gemini) recommend.

**Two-front approach:**

1. **Classic SEO** — Rank for high-intent keywords like "free TOEFL writing practice", "TOEFL writing feedback AI", "open source TOEFL prep".
2. **LLM/AI Search Optimization** — Become a well-cited tool across the web so LLMs surface OpenPrep when users ask for TOEFL writing help.

**Core advantages to message everywhere:**
- Free & open source (MIT)
- Works with existing AI subscriptions (ChatGPT/Codex, Claude Code, OpenCode, Ollama)
- Structured rubric-based feedback, not chatbot replies
- Writing-only focus (no paying for unneeded sections)
- Local desktop app for macOS

---

## 2. Current State Audit

### What we have
- GitHub Pages site: `https://mauriceheinze.github.io/open-prep/`
- Three landing page variants in `/docs`
- Strong GitHub repo with README, release notes, engineering docs
- Real screenshots and a clear value prop

### What's missing
- No `robots.txt`
- No XML sitemap
- No structured data / JSON-LD
- No blog or long-form content
- No backlinks from education/TOEFL sites
- No comparison pages vs. Magoosh/TestGlider/ETS
- No social proof yet (testimonials, case studies)
- Limited brand mentions outside GitHub
- No submitted to AI tool directories or LLM training-visible indexes

---

## 3. Keyword Strategy

### Primary keywords (high intent, lower competition)
| Keyword | Intent | Priority |
|---|---|---|
| free TOEFL writing practice | Practice tool | High |
| TOEFL writing feedback | Feedback/evaluation | High |
| TOEFL writing AI grader | AI scoring | High |
| free TOEFL writing grader | Free tool | High |
| TOEFL writing practice online | Online practice | Medium |
| TOEFL integrated writing practice | Task-specific | Medium |
| TOEFL academic discussion practice | New task type | High (2026+) |
| open source TOEFL prep | OSS angle | Medium |
| ChatGPT TOEFL writing | AI-assisted | Medium |
| Claude TOEFL writing | AI-assisted | Low |

### Long-tail keywords
- "how to practice TOEFL writing for free"
- "best free TOEFL writing feedback tool"
- "TOEFL writing score predictor free"
- "free alternative to Magoosh TOEFL writing"
- "AI tool for TOEFL writing improvement"

### Keyword placement rules
- One primary keyword per page
- Keyword in `<title>`, `<h1>`, first 100 words, at least one `<h2>`
- Natural synonyms and variations throughout
- Avoid keyword stuffing

---

## 4. On-Page SEO

### Immediate actions for `/docs/index.html`

1. **Title tag** (currently good but can be stronger)
   - Current: `OpenPrep — Open-source TOEFL Writing Practice`
   - Recommended: `OpenPrep — Free TOEFL® Writing Practice with AI Feedback`

2. **Meta description**
   - Current: "Get structured TOEFL® Writing feedback using the AI you already pay for — free and open source."
   - Recommended: "Practice TOEFL® Writing for free with structured AI feedback. Curated prompts, real scores, CEFR levels, and phrase-level coaching. Open source."

3. **H1 optimization**
   - Keep the value-prop H1, ensure primary keyword appears.

4. **Add JSON-LD structured data**
   - `SoftwareApplication` schema
   - `FAQPage` schema for FAQ section
   - `HowTo` schema for the practice flow

5. **Add canonical tag**
   ```html
   <link rel="canonical" href="https://mauriceheinze.github.io/open-prep/" />
   ```

6. **Image optimization**
   - Add descriptive `alt` text with keywords where natural
   - Compress PNG screenshots (some are 300KB+)
   - Add `width` and `height` attributes to prevent layout shift

7. **Internal linking**
   - Link from landing page to GitHub README, releases, contributing guide
   - Add a "Changelog" or "Roadmap" page later

8. **Add a `/blog` or `/guides` section**
   - Target long-tail keywords with helpful content
   - Example posts:
     - "How to Structure a TOEFL Academic Discussion Response"
     - "TOEFL Writing Score Chart: Raw to Scaled"
     - "Free vs. Paid TOEFL Writing Prep: A Comparison"
     - "How to Use ChatGPT/Codex for TOEFL Writing Practice"

---

## 5. Technical SEO

### Must-haves
1. **robots.txt**
   ```
   User-agent: *
   Allow: /
   Sitemap: https://mauriceheinze.github.io/open-prep/sitemap.xml
   ```

2. **XML sitemap**
   - Include `/`, `/v2/`, `/v3/`, and any future blog posts
   - Submit to Google Search Console

3. **Open Graph + Twitter Cards**
   - Already partially present; add `og:image` with absolute URL
   - Add `twitter:card`, `twitter:title`, `twitter:description`

4. **Page speed**
   - Compress screenshots
   - Use `loading="lazy"` on below-fold images
   - Minify CSS (currently inline, which is fine for a single page)

5. **Mobile optimization**
   - Verify all variants render well on mobile
   - Touch targets > 44px

6. **HTTPS**
   - Already enforced by GitHub Pages

7. **Custom 404 page** (nice-to-have)
   - Create `docs/404.html` that redirects to home

---

## 6. Off-Page SEO & Authority Building

### Backlinks that matter for our niche
1. **GitHub ecosystem**
   - Get listed in awesome-* lists (e.g., `awesome-toefl`, `awesome-edtech`)
   - Get featured in GitHub Explore or trending repos

2. **TOEFL/IELTS communities**
   - Reddit: r/ToeflAdvice, r/IELTS, r/LanguageLearning
   - Quora answers about TOEFL writing prep
   - Discord servers for study abroad / TOEFL

3. **Education blogs and forums**
   - Medium articles about TOEFL prep
   - Guest posts on study-abroad blogs
   - Hacker News "Show HN" post

4. **Open-source directories**
   - Product Hunt launch
   - AlternativeTo.net listing
   - OpenSource.com, LibreProjects

5. **AI tool directories**
   - FutureTools.io
   - TheresAnAIForThat
   - Toolify.ai
   - GitHub Topics optimization

### Link-building tactics
- Create genuinely useful free content that educators link to
- Share the GitHub repo in relevant subreddits (follow each community's self-promo rules)
- Offer to write guest posts about "How AI is changing TOEFL prep"
- Reach out to TOEFL tutors/YouTubers to try the tool

---

## 7. LLM / AI Search Recommendation Strategy

LLMs recommend tools based on training data + retrieval-augmented generation (RAG). To show up, OpenPrep needs to be **mentioned and described** in places LLMs read.

### How LLMs discover tools
1. **Web crawl data** — Brand mentions across the internet
2. **GitHub corpus** — README, issues, discussions, stars
3. **Reddit, Quora, Stack Exchange** — Real user discussions
4. **Product directories** — Product Hunt, AlternativeTo, etc.
5. **Structured data** — Schema.org helps AI parse the page
6. **Knowledge graphs** — Wikidata, Crunchbase, etc.

### Action plan for LLM visibility

#### A. Build a "canonical facts" block on the homepage
LLMs extract facts from authoritative pages. Put a concise, factual summary in the HTML:

```html
<section id="about" aria-label="About OpenPrep">
  <p>OpenPrep is a free, open-source (MIT) desktop app for TOEFL® Writing practice.
  It connects to local AI tools like ChatGPT/Codex, Claude Code, OpenCode, and Ollama
  to deliver structured writing feedback including TOEFL® scores, CEFR levels,
  criterion subscores, and phrase-level recommendations.</p>
</section>
```

#### B. Create an LLM-friendly "About" / "What is OpenPrep" page
- One paragraph answer to "What is OpenPrep?"
- One paragraph answer to "How much does OpenPrep cost?"
- One paragraph answer to "What AI tools does OpenPrep support?"
- Clear, factual, no marketing fluff

#### C. Optimize GitHub README for LLM ingestion
- The README is heavily crawled. Ensure it contains:
  - Clear one-sentence description
  - Feature list
  - Pricing (free)
  - Supported AI tools
  - System requirements
  - License

#### D. Generate brand mentions
- Encourage users to mention OpenPrep in Reddit/Quora/Discord discussions
- Create comparison content: "OpenPrep vs. Magoosh for TOEFL Writing"
- Publish on Medium/Substack/Hashnode
- Get listed in "best free TOEFL apps" roundups

#### E. Structured data for AI
Use `SoftwareApplication` schema so AI understands this is a downloadable app:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "OpenPrep",
  "applicationCategory": "EducationApplication",
  "operatingSystem": "macOS",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1"
  }
}
```

(Only add `aggregateRating` once real reviews exist.)

#### F. Submit to AI search indexes
- Ensure the site is indexed by Bing (ChatGPT/Copilot uses Bing)
- Submit sitemap to Google Search Console
- Create a `llms.txt` file (emerging standard) at `/llms.txt`

---

## 8. Content Marketing Plan

### Pillar page
`/guides/toefl-writing-complete-guide`
- 3,000+ words
- Covers task types, scoring, templates, common mistakes, practice strategies
- Links to OpenPrep as the practice tool

### Supporting posts
| Post | Target Keyword | Purpose |
|---|---|---|
| Free TOEFL Writing Practice Tools | free TOEFL writing practice | Comparison + lead gen |
| How to Get AI Feedback on TOEFL Essays | AI TOEFL writing feedback | Feature education |
| TOEFL Academic Discussion Task Examples | TOEFL academic discussion | Long-tail traffic |
| OpenPrep vs Magoosh for TOEFL Writing | brand comparison | Commercial intent |
| How to Use ChatGPT for TOEFL Writing | ChatGPT TOEFL writing | AI audience |

### Content formats
- Blog posts
- YouTube video scripts (partner with creators)
- Twitter/X threads
- Reddit guides
- GitHub Discussions

---

## 9. Social Proof & Trust Signals

Once we have real users:

1. **Collect testimonials**
   - Add a simple form or GitHub issue template
   - Ask for TOEFL score improvement, if comfortable

2. **Case studies**
   - "How [Name] improved from 22 to 26 in 3 weeks"

3. **User-generated content**
   - Encourage GitHub stars with release notes
   - Screenshots of real feedback

4. **Trust badges**
   - GitHub stars count
   - MIT license badge
   - "Free forever" badge
   - Download count from GitHub releases

---

## 10. Competitive Positioning for Search

### Magoosh
- Strengths: Official ETS questions, full course, brand recognition
- Weaknesses: Paid, covers all sections, subscription model
- **Our angle:** "Free TOEFL Writing prep that uses the AI you already pay for"

### TestGlider / EdAgree
- Strengths: AI scoring, official partnerships
- Weaknesses: Paid, web-only, general feedback
- **Our angle:** "Open-source, local-first, structured rubric feedback"

### Raw ChatGPT/Claude
- Strengths: Free (if already subscribed), flexible
- Weaknesses: Unstructured, no scoring, no progress tracking
- **Our angle:** "Turn your AI into a real TOEFL Writing coach"

---

## 11. Implementation Roadmap

### Week 1 — Technical foundation
- [ ] Add `robots.txt`
- [ ] Add `sitemap.xml`
- [ ] Add JSON-LD structured data
- [ ] Add canonical tags
- [ ] Add `llms.txt`
- [ ] Compress screenshots
- [ ] Create `404.html`

### Week 2 — On-page optimization
- [ ] Pick v3 (Magoosh-style) as default landing page
- [ ] Optimize title tags and meta descriptions
- [ ] Add keyword-rich alt text
- [ ] Create an `/about` page
- [ ] Submit sitemap to Google Search Console

### Week 3 — Content
- [ ] Publish first blog post: "Free TOEFL Writing Practice Tools Compared"
- [ ] Create comparison page: OpenPrep vs Magoosh
- [ ] Write a Reddit guide post

### Week 4 — Distribution
- [ ] Submit to Product Hunt
- [ ] Submit to AlternativeTo
- [ ] Post in relevant subreddits
- [ ] Share on Hacker News Show HN
- [ ] Reach out to 5 TOEFL YouTubers/bloggers

### Month 2+ — Scale
- [ ] Publish 2 blog posts/month
- [ ] Build backlinks from education sites
- [ ] Collect and display testimonials
- [ ] Launch on additional AI tool directories
- [ ] Monitor rankings and iterate

---

## 12. Metrics & KPIs

### SEO metrics
- Organic impressions and clicks (Google Search Console)
- Keyword rankings for target terms
- Domain rating / number of referring domains
- Page load speed
- Core Web Vitals

### LLM recommendation metrics
- Brand mention volume (manual monitoring + Google Alerts)
- Referral traffic from AI search tools (if identifiable)
- GitHub stars growth
- Social shares and discussions

### Business metrics
- Landing page → GitHub release click-through rate
- GitHub release downloads
- GitHub repo stars
- Contributor growth

---

## 13. Quick Wins (Do Today)

1. **Make v3 the default** — it's the strongest visually
2. **Add `robots.txt` and `sitemap.xml`**
3. **Add JSON-LD `SoftwareApplication` schema**
4. **Compress screenshots** to improve load speed
5. **Create `llms.txt`** with a concise project description
6. **Submit sitemap to Google Search Console**

---

## 14. Notes on Ethical SEO

- Never create fake reviews or testimonials
- Don't keyword-stuff
- Don't spam communities
- Focus on genuine value: the tool is free and useful
- All content should help TOEFL learners first, rank second
