# > One**Prompt**Away

**Ένα prompt σε χωρίζει.** — AI tools & prompts στα Ελληνικά.

## Overview

One Prompt Away is an automated content brand that publishes AI tool guides and prompt tutorials in Greek. Content is generated via Claude API, published to a Next.js site, and auto-posted to TikTok/Instagram Reels.

## Structure

```
site/           → Next.js 14 website (App Router, MDX, Tailwind)
content/        → MDX articles + generated images
scripts/        → Automation scripts (Claude API, social posting)
video/          → Remotion video compositions
.github/        → GitHub Actions workflows
CLAUDE.md       → Brand context for Claude Code
```

## Quick Start

```bash
# Install dependencies
cd site && npm install

# Run dev server
npm run dev

# Open http://localhost:3000
```

## Content Pipeline

1. **Input**: Topic (manual or scheduled)
2. **Generate**: Claude API → article + video script + image prompts
3. **Build**: MDX article + Remotion video + AI images
4. **Publish**: Auto-deploy site + auto-post TikTok/IG
5. **Notify**: Email confirmation

Trigger manually:
```bash
gh workflow run content-pipeline.yml -f topic="Your topic" -f category="prompt-lab"
```

## Brand

- **Domain**: onepromptaway.gr
- **Colors**: Dark (#0D1117) + Teal (#2DD4BF) + Amber (#F59E0B)
- **Typography**: JetBrains Mono (headings) + Inter (body)
- **Assets**: Canva folder "One Prompt Away - Brand Assets"

## License

All rights reserved. Content and brand assets are proprietary.
