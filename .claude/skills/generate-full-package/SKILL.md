---
name: generate-full-package
description: Generate a complete content package for One Prompt Away — article, video script, social captions, and image prompts
---

# Skill: Generate Full Content Package

## Trigger
When the user asks to generate a "full package", "complete content", or "everything" for a topic.

## Instructions

Generate a complete content package for One Prompt Away. This includes ALL of the following:

1. **MDX Article** — Full blog post (use generate-article skill guidelines)
2. **TikTok/Reels Script** — 60-second video script (use generate-video-script skill guidelines)
3. **Social Captions** — Instagram + TikTok captions with hashtags (use generate-social-captions skill guidelines)
4. **Image Prompts** — Hero image + thumbnail prompts for DALL-E/Flux

### Parallel Execution
Use subagents to generate these in parallel when possible:
- Subagent 1: Article (MDX)
- Subagent 2: Video script
- Subagent 3: Social captions + image prompts

### Image Prompt Format
```
HERO IMAGE (16:9):
Dark background (#0D1117), [specific visual related to topic],
teal (#2DD4BF) accent elements, tech aesthetic, minimal,
no text overlay, clean composition

THUMBNAIL (1:1):
Square crop, dark background, bold visual element,
high contrast, brand colors (#0D1117, #2DD4BF, #F59E0B)
```

### Output Files
- `site/content/articles/{slug}.mdx` — Article
- `content/drafts/{slug}-script.md` — Video script
- `content/drafts/{slug}-captions.md` — Social captions
- `content/drafts/{slug}-images.md` — Image prompts

### After Generation
1. Verify article frontmatter has all required fields
2. Verify article contains at least one ```prompt code block
3. Report word count and reading time
4. Ask if user wants to commit and push to trigger auto-deploy
