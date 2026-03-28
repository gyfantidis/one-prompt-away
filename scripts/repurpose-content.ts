/**
 * repurpose-content.ts
 * 
 * Takes a published article and repurposes it into multiple formats:
 * - Twitter/X thread
 * - LinkedIn post
 * - Newsletter snippet
 * 
 * Usage: npx tsx scripts/repurpose-content.ts "article-slug" [format]
 * Formats: twitter | linkedin | newsletter | all
 * Example: npx tsx scripts/repurpose-content.ts "meal-plan-prompt" "all"
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

const client = new Anthropic();

interface RepurposedContent {
  twitter: string;
  linkedin: string;
  newsletter: string;
}

async function repurpose(articleContent: string, format: string): Promise<RepurposedContent> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: `Είσαι ο content repurposer του One Prompt Away.
Brand voice: casual Ελληνικά, πρώτο πρόσωπο, πρακτικός.
Tech terms στα Αγγλικά.
Απάντησε ΜΟΝΟ σε JSON.`,
    messages: [
      {
        role: "user",
        content: `Πάρε αυτό το article και μετατρέψε το σε 3 formats:

Article:
${articleContent}

Δημιούργησε JSON:
{
  "twitter": "Twitter/X thread (5-8 tweets, κάθε tweet max 280 chars, separated by \\n---\\n)",
  "linkedin": "LinkedIn post (300-500 λέξεις, professional αλλά friendly, με emojis σπάνια)",
  "newsletter": "Newsletter section (150-200 λέξεις, teaser that drives to the full article, με CTA link)"
}`,
      },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(clean);
}

async function main() {
  const slug = process.argv[2];
  const format = process.argv[3] || "all";

  if (!slug) {
    console.error("Usage: npx tsx repurpose-content.ts <slug> [twitter|linkedin|newsletter|all]");
    process.exit(1);
  }

  const articlePath = path.join(process.cwd(), "..", "content", "articles", `${slug}.mdx`);
  if (!fs.existsSync(articlePath)) {
    console.error(`Article not found: ${articlePath}`);
    process.exit(1);
  }

  const articleContent = fs.readFileSync(articlePath, "utf-8");

  console.log(`♻️  Repurposing: ${slug}`);
  console.log(`📄 Format: ${format}`);

  const content = await repurpose(articleContent, format);

  // Save outputs
  const outputDir = path.join(process.cwd(), "..", "content", "repurposed");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  if (format === "twitter" || format === "all") {
    const twitterPath = path.join(outputDir, `${slug}-twitter.md`);
    fs.writeFileSync(twitterPath, `# Twitter Thread: ${slug}\n\n${content.twitter}`, "utf-8");
    console.log(`🐦 Twitter thread saved: ${twitterPath}`);
  }

  if (format === "linkedin" || format === "all") {
    const linkedinPath = path.join(outputDir, `${slug}-linkedin.md`);
    fs.writeFileSync(linkedinPath, `# LinkedIn Post: ${slug}\n\n${content.linkedin}`, "utf-8");
    console.log(`💼 LinkedIn post saved: ${linkedinPath}`);
  }

  if (format === "newsletter" || format === "all") {
    const newsletterPath = path.join(outputDir, `${slug}-newsletter.md`);
    fs.writeFileSync(newsletterPath, `# Newsletter: ${slug}\n\n${content.newsletter}`, "utf-8");
    console.log(`📬 Newsletter snippet saved: ${newsletterPath}`);
  }

  console.log("\n✅ Repurposing complete!");
}

main();
