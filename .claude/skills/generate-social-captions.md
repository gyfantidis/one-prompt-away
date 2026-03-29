# Skill: Generate Social Captions

## Trigger
When the user asks to generate captions, social posts, hashtags, or social media content for One Prompt Away.

## Instructions

Generate social media captions for an existing One Prompt Away article.

### Input
Read the article from `site/content/articles/{slug}.mdx` and create captions for all platforms.

### Output Format

#### Instagram Caption (max 2200 chars)
- Hook line (first line visible before "more")
- 2-3 short paragraphs summarizing the value
- Call to action ("Link στο bio" or "Save αυτό το post")
- Line break, then hashtags

#### TikTok Caption (max 300 chars)
- Ultra short hook
- 1 sentence value prop
- CTA
- 3-5 hashtags inline

#### Hashtag Set (15-20 hashtags)
Mix of:
- Brand: #onepromptaway #enaprompt
- Topic-specific: based on article content
- Greek audience: #ai #τεχνολογια #ελληνικα
- Discovery: #aitools #productivity #chatgpt #promptengineering

### Brand Voice (Social)
- Casual, friendly, direct
- Emoji OK but not excessive (2-3 per caption)
- Question hooks work best ("Ξέρεις πόσο χρόνο χάνεις...")
- Always actionable

### Output
Save to `content/drafts/{slug}-captions.md`
