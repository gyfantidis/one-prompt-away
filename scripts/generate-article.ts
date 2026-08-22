/**
 * generate-article.ts
 *
 * Generates a bilingual content package from a topic:
 * 1. Greek MDX article (el)
 * 2. English MDX article (en)
 * 3. TikTok/Reels script (Greek)
 * 4. Image generation prompts
 *
 * Usage: npx tsx generate-article.ts "topic" "category"
 * Example: npx tsx generate-article.ts "meal plan με AI" "prompt-lab"
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

const client = new Anthropic();

const CATEGORIES = ["prompt-lab", "tool-drop", "behind-the-prompt"] as const;
type Category = (typeof CATEGORIES)[number];

interface ArticleData {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  article_body: string;
  tiktok_script?: {
    hook: string;
    body: string;
    cta: string;
  };
}

interface ContentPackage {
  el: { article: string; data: ArticleData };
  en: { article: string; data: ArticleData };
  script: string;
  slug: string;
}

const SYSTEM_PROMPT_EL = `Είσαι ο content engine του One Prompt Away (oneprompt.gr), ένα Ελληνικό brand για AI tools και prompts.

## Brand Voice
- Πρώτο πρόσωπο, casual Ελληνικά ("Δοκίμασα αυτό...", "Βρήκα ότι...")
- Tech terms στα Αγγλικά (prompt, tool, API — ποτέ μετάφραση)
- Πάντα actionable takeaway στο τέλος
- Σύντομες προτάσεις, σύντομες παράγραφοι
- Zero hype, zero jargon χωρίς εξήγηση

## Target Audience
Έλληνες 22-40: marketers, φοιτητές, freelancers, μικροεπιχειρηματίες. ΟΧΙ developers-only.

Απάντησε ΜΟΝΟ σε JSON format χωρίς markdown backticks.`;

const SYSTEM_PROMPT_EN = `You are the content engine for One Prompt Away (oneprompt.gr), a brand about AI tools and prompts.

## Brand Voice
- First person, casual English ("I tried this...", "I found that...")
- Tech terms stay as-is (prompt, tool, API — never rephrase)
- Always end with an actionable takeaway
- Short sentences, short paragraphs
- Zero hype, zero unexplained jargon

## Target Audience
25-40 year olds: marketers, students, freelancers, small business owners. NOT developers-only.

Reply ONLY in JSON format without markdown backticks.`;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[άαà]/g, "a").replace(/[έε]/g, "e").replace(/[ήηίι]/g, "i")
    .replace(/[όο]/g, "o").replace(/[ύυ]/g, "y").replace(/[ώω]/g, "o")
    .replace(/[σς]/g, "s").replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
    .slice(0, 60);
}

function wordCount(text: string): number {
  return text.split(/\s+/).length;
}

async function generateForLocale(
  topic: string,
  category: Category,
  locale: "el" | "en",
  today: string,
  existingSlug?: string
): Promise<ArticleData> {
  const isGreek = locale === "el";
  const systemPrompt = isGreek ? SYSTEM_PROMPT_EL : SYSTEM_PROMPT_EN;

  const userPrompt = isGreek
    ? `Topic: "${topic}"
Category: ${category}
Date: ${today}

Παράγαγε ένα πλήρες content package. Απάντησε σε JSON με αυτή τη δομή:

{
  "title": "Ελληνικός τίτλος — catchy, practical",
  "slug": "${existingSlug || "english-slug-for-url"}",
  "description": "SEO description, 150-160 chars, Ελληνικά",
  "tags": ["tag1", "tag2", "tag3"],
  "article_body": "Ολόκληρο το article body σε MDX format. Χρησιμοποίησε ## για headings. Βάλε prompts σε \`\`\`prompt code blocks. 600-1000 λέξεις.",
  "tiktok_script": {
    "hook": "Μια πρόταση που σταματάει το scroll (0-3s)",
    "body": "Step-by-step demo με [VISUAL DIRECTIONS] σε brackets (3-48s)",
    "cta": "Call to action (48-60s)"
  },
  "tiktok_script_end": true
}`
    : `Topic: "${topic}"
Category: ${category}
Date: ${today}
Slug (use this exact value): "${existingSlug || ""}"

Generate a complete article. Reply in JSON with this structure:

{
  "title": "English title — catchy, practical",
  "slug": "${existingSlug || "english-slug-for-url"}",
  "description": "SEO description, 150-160 chars, English",
  "tags": ["tag1", "tag2", "tag3"],
  "article_body": "Full article body in MDX format. Use ## for headings. Put prompts in \`\`\`prompt code blocks. 600-1000 words."
}`;

  console.log(`🌐 Generating ${locale.toUpperCase()} article for: ${topic}`);

  const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

  const cleanJson = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleanJson) as ArticleData;
}

function buildMdx(data: ArticleData, category: Category, today: string, locale: "el" | "en"): string {
  const readingTime = locale === "el"
    ? `${Math.ceil(wordCount(data.article_body) / 200)} λεπτά`
    : `${Math.ceil(wordCount(data.article_body) / 200)} min`;

  const frontmatter = `---
title: "${data.title}"
description: "${data.description}"
date: "${today}"
category: "${category}"
tags: ${JSON.stringify(data.tags)}
readingTime: "${readingTime}"
---`;

  return `${frontmatter}\n\n${data.article_body}`;
}

async function generateContent(topic: string, category: Category): Promise<ContentPackage> {
  const today = new Date().toISOString().split("T")[0];

  // Generate Greek first to get the canonical slug
  const elData = await generateForLocale(topic, category, "el", today);
  const slug = elData.slug || slugify(elData.title);

  // Generate English using the same slug
  const enData = await generateForLocale(topic, category, "en", today, slug);

  const elArticle = buildMdx(elData, category, today, "el");
  const enArticle = buildMdx({ ...enData, slug }, category, today, "en");

  // Build TikTok script from Greek data
  const script = elData.tiktok_script
    ? `# TikTok/Reels Script: ${elData.title}
## Duration: 60 seconds

### HOOK (0-3s)
${elData.tiktok_script.hook}

### BODY (3-48s)
${elData.tiktok_script.body}

### CTA (48-60s)
${elData.tiktok_script.cta}`
    : "";

  return {
    el: { article: elArticle, data: elData },
    en: { article: enArticle, data: { ...enData, slug } },
    script,
    slug,
  };
}

async function saveContent(content: ContentPackage): Promise<void> {
  const root = path.join(process.cwd(), "..");
  const siteArticlesEl = path.join(root, "site", "content", "articles", "el");
  const siteArticlesEn = path.join(root, "site", "content", "articles", "en");
  const draftsDir = path.join(root, "content", "drafts");

  [siteArticlesEl, siteArticlesEn, draftsDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // Save Greek article
  const elPath = path.join(siteArticlesEl, `${content.slug}.mdx`);
  fs.writeFileSync(elPath, content.el.article, "utf-8");
  console.log("📝 Greek article saved:", elPath);

  // Save English article
  const enPath = path.join(siteArticlesEn, `${content.slug}.mdx`);
  fs.writeFileSync(enPath, content.en.article, "utf-8");
  console.log("📝 English article saved:", enPath);

  // Save TikTok script
  if (content.script) {
    const scriptPath = path.join(draftsDir, `${content.slug}-script.md`);
    fs.writeFileSync(scriptPath, content.script, "utf-8");
    console.log("🎬 Script saved:", scriptPath);
  }

}

async function main() {
  const topic = process.argv[2];
  const category = (process.argv[3] || "prompt-lab") as Category;

  if (!topic || topic === "auto") {
    console.error('Usage: npx tsx generate-article.ts "topic" "category"');
    console.error("Categories:", CATEGORIES.join(", "));
    process.exit(1);
  }

  if (!CATEGORIES.includes(category)) {
    console.error("Invalid category. Use:", CATEGORIES.join(", "));
    process.exit(1);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ ANTHROPIC_API_KEY not set");
    process.exit(1);
  }

  try {
    const content = await generateContent(topic, category);
    await saveContent(content);

    console.log("\n✅ Bilingual content package generated!");
    console.log(`   EL: ${content.el.data.title}`);
    console.log(`   EN: ${content.en.data.title}`);
    console.log(`   Slug: ${content.slug}`);

    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `slug=${content.slug}\n`);
    }
  } catch (error) {
    console.error("❌ Generation failed:", error);
    process.exit(1);
  }
}

main();
