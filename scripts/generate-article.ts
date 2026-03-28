/**
 * generate-article.ts
 * 
 * Generates a complete content package from a topic:
 * 1. MDX article with frontmatter
 * 2. TikTok/Reels script
 * 3. Image generation prompts
 * 
 * Usage: npx tsx scripts/generate-article.ts "topic" "category"
 * Example: npx tsx scripts/generate-article.ts "meal plan με AI" "prompt-lab"
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

const client = new Anthropic();

const CATEGORIES = ["prompt-lab", "tool-drop", "behind-the-prompt"] as const;
type Category = (typeof CATEGORIES)[number];

interface ContentPackage {
  article: string;
  script: string;
  imagePrompts: string;
  slug: string;
  title: string;
}

const SYSTEM_PROMPT = `Είσαι ο content engine του One Prompt Away (onepromptaway.gr), ένα Ελληνικό brand για AI tools και prompts.

## Brand Voice
- Πρώτο πρόσωπο, casual Ελληνικά ("Δοκίμασα αυτό...", "Βρήκα ότι...")
- Tech terms στα Αγγλικά (prompt, tool, API — ποτέ μετάφραση)
- Πάντα actionable takeaway στο τέλος
- Σύντομες προτάσεις, σύντομες παράγραφοι
- Zero hype, zero jargon χωρίς εξήγηση

## Target Audience
Έλληνες 22-40: marketers, φοιτητές, freelancers, μικροεπιχειρηματίες. ΟΧΙ developers-only.

Παράγεις content σε τρεις μορφές ταυτόχρονα. Απάντησε ΜΟΝΟ σε JSON format χωρίς markdown backticks.`;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[άαà]/g, "a").replace(/[έε]/g, "e").replace(/[ήηίι]/g, "i")
    .replace(/[όο]/g, "o").replace(/[ύυ]/g, "y").replace(/[ώω]/g, "o")
    .replace(/[σς]/g, "s").replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
    .slice(0, 60);
}

async function generateContent(topic: string, category: Category): Promise<ContentPackage> {
  const today = new Date().toISOString().split("T")[0];

  const userPrompt = `Topic: "${topic}"
Category: ${category}
Date: ${today}

Παράγαγε ένα πλήρες content package. Απάντησε σε JSON με αυτή τη δομή:

{
  "title": "Ελληνικός τίτλος — catchy, practical",
  "slug": "english-slug-for-url",
  "description": "SEO description, 150-160 chars, Ελληνικά",
  "tags": ["tag1", "tag2", "tag3"],
  "article_body": "Ολόκληρο το article body σε MDX format. Χρησιμοποίησε ## για headings. Βάλε prompts σε \`\`\`prompt code blocks. 600-1000 λέξεις.",
  "tiktok_script": {
    "hook": "Μια πρόταση που σταματάει το scroll (0-3s)",
    "body": "Step-by-step demo με [VISUAL DIRECTIONS] σε brackets (3-48s)",
    "cta": "Call to action (48-60s)"
  },
  "hero_image_prompt": "Detailed DALL-E prompt, dark theme, brand colors #0D1117 #2DD4BF, tech aesthetic",
  "thumbnail_prompt": "Square crop version, bold, high contrast, minimal text"
}`;

  console.log("🤖 Generating content for:", topic);
  console.log("📂 Category:", category);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

  // Parse JSON (handle potential markdown wrapping)
  const cleanJson = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const data = JSON.parse(cleanJson);

  // Build MDX article
  const frontmatter = `---
title: "${data.title}"
description: "${data.description}"
date: "${today}"
category: "${category}"
tags: ${JSON.stringify(data.tags)}
hero: "/images/articles/${data.slug}-hero.webp"
readingTime: "${Math.ceil(data.article_body.split(/\s+/).length / 200)} λεπτά"
---`;

  const article = `${frontmatter}\n\n${data.article_body}`;

  // Build TikTok script
  const script = `# TikTok/Reels Script: ${data.title}
## Duration: 60 seconds

### HOOK (0-3s)
${data.tiktok_script.hook}

### BODY (3-48s)
${data.tiktok_script.body}

### CTA (48-60s)
${data.tiktok_script.cta}`;

  // Build image prompts
  const imagePrompts = `# Image Prompts: ${data.title}

## Hero Image (16:9)
${data.hero_image_prompt}

## Thumbnail (1:1)
${data.thumbnail_prompt}`;

  return {
    article,
    script,
    imagePrompts,
    slug: data.slug || slugify(data.title),
    title: data.title,
  };
}

async function saveContent(content: ContentPackage): Promise<void> {
  const contentDir = path.join(process.cwd(), "..", "content");
  const articlesDir = path.join(contentDir, "articles");
  const draftsDir = path.join(contentDir, "drafts");

  // Ensure directories exist
  [articlesDir, draftsDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // Save article
  const articlePath = path.join(articlesDir, `${content.slug}.mdx`);
  fs.writeFileSync(articlePath, content.article, "utf-8");
  console.log("📝 Article saved:", articlePath);

  // Save TikTok script
  const scriptPath = path.join(draftsDir, `${content.slug}-script.md`);
  fs.writeFileSync(scriptPath, content.script, "utf-8");
  console.log("🎬 Script saved:", scriptPath);

  // Save image prompts
  const promptsPath = path.join(draftsDir, `${content.slug}-images.md`);
  fs.writeFileSync(promptsPath, content.imagePrompts, "utf-8");
  console.log("🖼️  Image prompts saved:", promptsPath);
}

async function main() {
  const topic = process.argv[2];
  const category = (process.argv[3] || "prompt-lab") as Category;

  if (!topic || topic === "auto") {
    console.error("Usage: npx tsx scripts/generate-article.ts \"topic\" \"category\"");
    console.error("Categories:", CATEGORIES.join(", "));
    process.exit(1);
  }

  if (!CATEGORIES.includes(category)) {
    console.error("Invalid category. Use:", CATEGORIES.join(", "));
    process.exit(1);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ ANTHROPIC_API_KEY not set. Export it or add to .env");
    process.exit(1);
  }

  try {
    const content = await generateContent(topic, category);
    await saveContent(content);

    console.log("\n✅ Content package generated successfully!");
    console.log(`   Title: ${content.title}`);
    console.log(`   Slug: ${content.slug}`);

    // Output slug for GitHub Actions
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `slug=${content.slug}\n`);
    }
  } catch (error) {
    console.error("❌ Generation failed:", error);
    process.exit(1);
  }
}

main();
