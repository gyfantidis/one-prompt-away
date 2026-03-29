---
name: generate-article
description: Generate a complete MDX article for One Prompt Away
---

# Skill: Generate OPA Article

## Trigger
When the user asks to generate an article, blog post, or content for One Prompt Away.

## Instructions

Generate a complete MDX article for the One Prompt Away brand (oneprompt.gr).

### Brand Voice
- Casual Ελληνικά, πρώτο πρόσωπο ("Δοκίμασα αυτό...", "Βρήκα ότι...")
- Tech terms stay in English (prompt, tool, API, workflow)
- Always end with actionable takeaway
- Short sentences, short paragraphs
- Zero hype, zero unexplained jargon

### Article Structure
1. **Hook** (1-2 sentences — grab attention)
2. **Problem** (what are we solving)
3. **Solution** (step-by-step with actual prompts in ```prompt code blocks)
4. **Result** (what we got, concrete numbers/output)
5. **Takeaway** (actionable, 2-3 sentences)

### Frontmatter Format
```yaml
---
title: "Catchy Ελληνικός τίτλος"
description: "SEO description, 150-160 chars, Ελληνικά"
date: "YYYY-MM-DD"
category: "prompt-lab | tool-drop | behind-the-prompt"
tags: ["tag1", "tag2", "tag3"]
hero: "/images/articles/SLUG-hero.webp"
readingTime: "X λεπτά"
---
```

### Content Pillars
- **prompt-lab**: Real problem → prompt solution. Practical how-to.
- **tool-drop**: AI tool review. Quick, opinionated, hands-on.
- **behind-the-prompt**: Deep dive on prompting techniques.

### Rules
- Every article must contain at least one copy-paste ready prompt
- Prompts go in ```prompt code blocks
- Length: 600-1000 words
- No emoji in articles
- SEO: natural keyword placement

### Output
Save the article to `site/content/articles/{slug}.mdx`
