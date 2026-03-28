/**
 * suggest-topics.ts
 * 
 * AI-powered topic suggestion engine.
 * Analyzes existing content, trending AI tools, and audience gaps
 * to suggest new topics for the content queue.
 * 
 * Usage: npx tsx scripts/suggest-topics.ts [count]
 * Example: npx tsx scripts/suggest-topics.ts 5
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

const client = new Anthropic();

interface TopicSuggestion {
  topic: string;
  category: string;
  reasoning: string;
  priority: "high" | "medium" | "low";
}

async function getExistingTopics(): Promise<string[]> {
  const queuePath = path.join(process.cwd(), "..", "content", "content-queue.json");
  if (!fs.existsSync(queuePath)) return [];

  const queue = JSON.parse(fs.readFileSync(queuePath, "utf-8"));
  return queue.topics.map((t: any) => t.topic);
}

async function getPublishedArticles(): Promise<string[]> {
  const articlesDir = path.join(process.cwd(), "..", "content", "articles");
  if (!fs.existsSync(articlesDir)) return [];

  return fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const content = fs.readFileSync(path.join(articlesDir, f), "utf-8");
      const titleMatch = content.match(/title:\s*"(.+?)"/);
      return titleMatch ? titleMatch[1] : f;
    });
}

async function suggestTopics(count: number): Promise<TopicSuggestion[]> {
  const existing = await getExistingTopics();
  const published = await getPublishedArticles();

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: `Είσαι ο content strategist του One Prompt Away, ένα Ελληνικό brand για AI tools και prompts.
Target audience: Έλληνες 22-40, marketers, φοιτητές, freelancers, μικροεπιχειρηματίες.
Content pillars: prompt-lab (how-to), tool-drop (reviews), behind-the-prompt (deep dives).
Απάντησε ΜΟΝΟ σε JSON.`,
    messages: [
      {
        role: "user",
        content: `Πρότεινε ${count} νέα topics για το One Prompt Away.

Ήδη υπάρχουν αυτά τα topics (ΜΗΝ τα επαναλάβεις):
${[...existing, ...published].map((t) => `- ${t}`).join("\n")}

Κανόνες:
- Κάθε topic πρέπει να δουλεύει ΚΑΙ ως blog article ΚΑΙ ως 60s TikTok/Reel
- Κατανομή: 50% prompt-lab, 30% tool-drop, 20% behind-the-prompt
- Σκέψου τι trending AI tools/features υπάρχουν τώρα (2026)
- Προτεραιότητα σε πρακτικά, everyday use cases
- Τίτλοι στα Ελληνικά, catchy, actionable

Απάντησε σε JSON array:
[
  {
    "topic": "Ελληνικός τίτλος",
    "category": "prompt-lab|tool-drop|behind-the-prompt",
    "reasoning": "Γιατί αυτό το topic (1 πρόταση)",
    "priority": "high|medium|low"
  }
]`,
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

async function addToQueue(suggestions: TopicSuggestion[]): Promise<void> {
  const queuePath = path.join(process.cwd(), "..", "content", "content-queue.json");
  const queue = fs.existsSync(queuePath)
    ? JSON.parse(fs.readFileSync(queuePath, "utf-8"))
    : { topics: [] };

  for (const s of suggestions) {
    queue.topics.push({
      topic: s.topic,
      category: s.category,
      status: "pending",
      published: null,
    });
  }

  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), "utf-8");
}

async function main() {
  const count = parseInt(process.argv[2] || "5");

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY not set");
    process.exit(1);
  }

  console.log(`🧠 Generating ${count} topic suggestions...`);

  const suggestions = await suggestTopics(count);

  console.log("\n📋 Suggestions:\n");
  suggestions.forEach((s, i) => {
    const priorityIcon = { high: "🔴", medium: "🟡", low: "🟢" }[s.priority];
    console.log(`${i + 1}. ${priorityIcon} [${s.category}] ${s.topic}`);
    console.log(`   ${s.reasoning}\n`);
  });

  // Ask to add to queue
  const readline = await import("readline");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  rl.question("\nAdd all to content queue? (y/n): ", async (answer) => {
    if (answer.toLowerCase() === "y") {
      await addToQueue(suggestions);
      console.log(`✅ Added ${suggestions.length} topics to queue`);
    } else {
      console.log("Skipped. You can add them manually to content-queue.json");
    }
    rl.close();
  });
}

main();
