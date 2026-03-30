# One Prompt Away — Claude Code Context

## Brand Overview

**One Prompt Away** (oneprompt.gr) is a Greek-language content brand about AI tools and prompts.
Tagline: "Ένα prompt σε χωρίζει."

Target audience: Greeks 22–40 who want to use AI practically — marketers, students, freelancers, small business owners. Not necessarily developers.

## Brand Voice

- First person, casual Greek ("Δοκίμασα αυτό...", "Βρήκα ότι...")
- English for tech terms only (prompt, tool, API, workflow — never translate these)
- Always end with an actionable takeaway
- No unexplained jargon
- Short sentences, short paragraphs
- Friendly, practical, zero hype

## Content Pillars

1. **Prompt Lab** — Real-world problem → prompt solution. "Πώς έφτιαξα meal plan σε 30 δευτερόλεπτα"
2. **Tool Drop** — AI tool reviews. Quick, opinionated, hands-on.
3. **Behind the Prompt** — Deep dives on prompting techniques and mental models.

## Visual Identity

### Colors
- Base Dark: `#0D1117` (backgrounds)
- Surface: `#161B22` (cards, elevated)
- Card: `#21262D` (secondary surfaces)
- Border: `#30363D`
- Teal/Cyan: `#2DD4BF` (primary accent, CTAs, links)
- Teal Dark: `#14B8A6` (hover states)
- Amber: `#F59E0B` (highlights, badges)
- Light Text: `#E6EDF3` (primary text)
- Muted: `#8B949E` (secondary text)

### Typography
- Headings: `JetBrains Mono` or `Fira Code` — Bold
- Body: `Inter` — Regular, 16px
- Mono/code: `JetBrains Mono` — Regular

### Imagery
- Clean screenshots, dark-mode UI mockups
- No stock photos ever
- Minimal illustrations with brand colors

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, MDX, Tailwind CSS
- **Video**: Remotion (React-based video generation)
- **CI/CD**: GitHub Actions, Docker
- **AI**: Claude API (Anthropic)
- **Images**: DALL-E / Flux API
- **Social**: TikTok Content API, Instagram Graph API
- **Hosting**: Vercel or Docker on VPS

## Project Structure

```
onepromptaway/
  site/                    # Next.js app
    app/                   # App Router pages
    components/            # React components
    styles/                # Tailwind config + brand theme
    public/                # Static assets (logo, favicon)
  content/                 # Content files
    articles/              # Published MDX articles
    drafts/                # Draft articles
    images/                # Generated images
  scripts/                 # Automation scripts
    generate-article.ts    # Claude API → MDX article
    generate-video.ts      # Script → Remotion composition
    publish-social.ts      # Upload to TikTok/IG
  video/                   # Remotion project
    src/                   # Video components
    templates/             # Brand video templates
  .github/workflows/       # CI/CD pipelines
    publish-article.yml    # Article generation + deploy
    publish-video.yml      # Video render + social upload
    content-pipeline.yml   # Full end-to-end pipeline
```

## Article Format (MDX)

Every article must have this frontmatter:

```yaml
---
title: "Πώς έφτιαξα meal plan σε 30 δευτερόλεπτα"
description: "SEO description in Greek, 150-160 chars"
date: "2026-03-28"
category: "prompt-lab"  # prompt-lab | tool-drop | behind-the-prompt
tags: ["meal-planning", "chatgpt", "productivity"]
hero: "/images/articles/meal-plan-hero.webp"
---
```

## Code Conventions

- TypeScript everywhere
- ESLint + Prettier
- Tailwind CSS utility-first (no custom CSS unless necessary)
- Components in PascalCase, utilities in camelCase
- Use CSS variables from Tailwind config for brand colors
- All images optimized as WebP
- Semantic HTML, accessible by default

## Commands

```bash
# Development
cd site && npm run dev        # Start Next.js dev server
cd video && npx remotion dev  # Start Remotion preview

# Build
cd site && npm run build      # Production build
cd video && npx remotion render  # Render video

# Content
npx tsx scripts/generate-article.ts "topic here"
npx tsx scripts/generate-video.ts "topic here"
npx tsx scripts/publish-social.ts --platform tiktok --file video.mp4
```
