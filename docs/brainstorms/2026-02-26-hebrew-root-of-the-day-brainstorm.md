# Brainstorm: Hebrew Root of the Day

**Date:** 2026-02-26
**Status:** Draft

## What We're Building

A website that helps people learn Hebrew — both modern and biblical — through a daily "shoresh (root) of the day" tied to the weekly Torah portion (parashat hashavua). The site has two main pillars:

1. **Shoresh of the Day:** Each day features a Hebrew root extracted from the current parsha. The root is displayed with its definition, example words with nikud (vowel points), and practice problems where users identify the root from conjugated words.

2. **Cantillation (Trope) Practice:** Users hear a synthesized trope melody and match it to the correct cantillation mark. This uses Web Audio API to generate trope sounds programmatically.

The site is fully public with no user accounts — everyone sees the same content each day.

## Why This Approach

**Next.js + Sefaria API + Claude API, deployed on Vercel.**

- **Sefaria API** provides free, structured access to Torah text for each parsha — no need to manually curate or store Torah data.
- **Claude API** generates high-quality Hebrew linguistic content (root extraction, definitions with nikud, practice problems) from the parsha text. Content is generated once per parsha cycle and cached.
- **Next.js on Vercel** gives us serverless functions for the generation pipeline, SSR for fast initial loads, and trivial deployment.
- **No accounts** keeps the architecture simple — no auth, no database for user state.

This approach was chosen over:
- **Static pre-generation (Astro):** Would work but loses the dynamic parsha-aware content generation. Would need to pre-generate all 54 weeks upfront.
- **Vanilla JS:** Too minimal for the interactive features needed (audio synthesis, practice problem UX).

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Target audience | Both modern Hebrew learners and Torah students | Broader reach, roots are relevant to both |
| Daily content source | Current parashat hashavua | Natural learning cadence tied to Jewish calendar |
| Content generation | AI-generated via Claude API | Scalable, consistent quality, handles nikud correctly |
| Practice problem type | "Identify the shoresh" from conjugated words | Core skill for Hebrew learners, clear right/wrong answers |
| Cantillation practice | Audio matching (hear melody, pick the trope mark) | Builds aural recognition, which is the hardest skill |
| Audio source | Synthesized via Web Audio API | No dependency on external recordings, programmable |
| User accounts | None | Simplicity; everyone sees the same daily content |
| Tech stack | Next.js + Vercel | Modern, serverless, easy deployment |
| Data source | Sefaria API for parsha text | Free, well-structured, comprehensive |
| Hosting | Vercel (serverless) | Native Next.js support, generous free tier |
| Trope tradition | Ashkenazi first, add others later | Most common in target demographic, expandable |
| Roots per day | 1 root on weekdays, review on Shabbat | Deep focus daily, reinforcement on Shabbat (5 roots/week) |
| Content caching | Vercel KV / Redis | Fast reads, easy invalidation, managed |
| Content QA | Manual review before publishing | All AI-generated content is staged for human review before going live |

## Content Pipeline

Since all content requires manual review before publishing, the workflow is:

1. **Generate:** A scheduled serverless function (or manual trigger) calls Sefaria API for the upcoming parsha text, then sends it to Claude API to generate 5 roots with definitions, nikud examples, and practice problems.
2. **Stage:** Generated content is stored in Vercel KV with a "draft" status.
3. **Review:** You review staged content via an admin page (simple, password-protected or local-only), approve or edit.
4. **Publish:** Approved content becomes live on the scheduled day.

This means we need a lightweight admin interface for reviewing/approving generated content.

## Open Questions

1. **Trope audio synthesis:** How do we map Ashkenazi cantillation marks to specific melodies/frequencies in Web Audio API? This requires musical/acoustic research.
2. **Parsha calendar:** How do we determine which parsha is current? Use a library (like hebcal) or call an API?

## Resolved Questions

1. **Trope tradition:** Start with Ashkenazi, add Sephardi and others later.
2. **Caching strategy:** Vercel KV / Redis for generated content storage.
3. **Content quality:** Manual review before publishing — all content is staged as drafts.
4. **Roots per day:** 1 root on weekdays with 3-5 practice problems, Shabbat shows a review of the week's 5 roots.
