/**
 * generate-video.ts
 * 
 * Reads a TikTok script markdown file and converts it to 
 * Remotion render props, then triggers video rendering.
 * 
 * Usage: npx tsx scripts/generate-video.ts "article-slug"
 * Example: npx tsx scripts/generate-video.ts "5-prompts-emails"
 */
import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface VideoProps {
  hook: string;
  steps: string[];
  prompt: string;
  result: string;
  cta: string;
  category: string;
  brandTag: string;
}

async function scriptToProps(scriptContent: string, articleContent: string): Promise<VideoProps> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: `Μετατρέπεις TikTok scripts σε structured video props. Απάντησε ΜΟΝΟ σε JSON.`,
    messages: [
      {
        role: "user",
        content: `Δες αυτό το TikTok script και το article frontmatter, και δημιούργησε video props.

Script:
${scriptContent}

Article:
${articleContent.slice(0, 500)}

Απάντησε σε JSON:
{
  "hook": "Μια πρόταση hook (max 60 chars)",
  "steps": ["Step 1 (max 40 chars)", "Step 2", "Step 3"],
  "prompt": "The actual prompt to show (max 100 chars)",
  "result": "Result summary (max 50 chars)",
  "cta": "Call to action (max 40 chars)",
  "category": "prompt-lab|tool-drop|behind-the-prompt"
}`,
      },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const props = JSON.parse(clean);

  return {
    ...props,
    brandTag: "@onepromptaway",
  };
}

async function main() {
  const slug = process.argv[2];

  if (!slug) {
    console.error("Usage: npx tsx scripts/generate-video.ts <article-slug>");
    process.exit(1);
  }

  const scriptPath = path.join(process.cwd(), "..", "content", "drafts", `${slug}-script.md`);
  const articlePath = path.join(process.cwd(), "..", "content", "articles", `${slug}.mdx`);

  if (!fs.existsSync(scriptPath)) {
    console.error(`Script not found: ${scriptPath}`);
    console.error("Run generate-article.ts first to create the script.");
    process.exit(1);
  }

  const scriptContent = fs.readFileSync(scriptPath, "utf-8");
  const articleContent = fs.existsSync(articlePath)
    ? fs.readFileSync(articlePath, "utf-8")
    : "";

  console.log("🎬 Converting script to video props...");
  const props = await scriptToProps(scriptContent, articleContent);
  console.log("📋 Props:", JSON.stringify(props, null, 2));

  // Save props for reference
  const propsPath = path.join(process.cwd(), "..", "content", "drafts", `${slug}-video-props.json`);
  fs.writeFileSync(propsPath, JSON.stringify(props, null, 2), "utf-8");
  console.log("💾 Props saved:", propsPath);

  // Render video
  const videoDir = path.join(process.cwd(), "..", "video");
  const outPath = path.join(videoDir, "out", `${slug}.mp4`);

  // Ensure output dir exists
  const outDir = path.join(videoDir, "out");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log("🎥 Rendering video...");
  try {
    execSync(
      `npx remotion render src/index.ts OPAVideo "${outPath}" --props='${JSON.stringify(props)}'`,
      {
        stdio: "inherit",
        cwd: videoDir,
      }
    );
    console.log(`\n✅ Video rendered: ${outPath}`);
  } catch (error) {
    console.error("❌ Render failed. Make sure Remotion is installed:");
    console.error("   cd video && npm install");
    process.exit(1);
  }
}

main();
