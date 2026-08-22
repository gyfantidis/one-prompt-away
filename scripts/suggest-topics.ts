/**
 * suggest-topics.ts
 *
 * AI-powered topic suggestion engine.
 * Analyzes existing content, trending AI tools, and audience gaps
 * to suggest new topics for the content queue.
 *
 * Usage:
 *   npx tsx suggest-topics.ts 10                    # interactive — ρωτάει πριν σώσει
 *   npx tsx suggest-topics.ts 10 --auto             # non-interactive — σώζει κατευθείαν (CI)
 *   npx tsx suggest-topics.ts 10 --auto --min-pending 3
 *                                                   # τρέχει ΜΟΝΟ αν pending < 3
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

const client = new Anthropic();

const MODEL = "claude-opus-5";

const queuePath = path.join(process.cwd(), "..", "content", "content-queue.json");
const articlesDir = path.join(process.cwd(), "..", "content", "articles");

interface TopicSuggestion {
  topic: string;
  category: string;
  reasoning: string;
  priority: "high" | "medium" | "low";
}

interface QueueTopic {
  topic: string;
  category: string;
  status: "pending" | "done";
  published: string | null;
}

interface Queue {
  topics: QueueTopic[];
}

function loadQueue(): Queue {
  if (!fs.existsSync(queuePath)) return { topics: [] };
  return JSON.parse(fs.readFileSync(queuePath, "utf-8"));
}

function getExistingTopics(queue: Queue): string[] {
  return queue.topics.map((t) => t.topic);
}

/**
 * Τα άρθρα ζουν σε υποφακέλους ανά γλώσσα (articles/el, articles/en),
 * οπότε χρειάζεται recursive walk — ένα σκέτο readdir επιστρέφει
 * μόνο τα ονόματα των φακέλων και κανένα .mdx.
 */
function findMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const found: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...findMdxFiles(full));
    else if (entry.name.endsWith(".mdx")) found.push(full);
  }
  return found;
}

function getPublishedArticles(): string[] {
  const titles = findMdxFiles(articlesDir).map((file) => {
    const content = fs.readFileSync(file, "utf-8");
    const titleMatch = content.match(/title:\s*"(.+?)"/);
    return titleMatch ? titleMatch[1] : path.basename(file);
  });

  return [...new Set(titles)];
}

/** Κανονικοποίηση για σύγκριση τίτλων — αγνοεί κεφαλαία και κενά. */
function normalize(topic: string): string {
  return topic.trim().toLowerCase().replace(/\s+/g, " ");
}

async function suggestTopics(count: number, avoid: string[]): Promise<TopicSuggestion[]> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: `Είσαι ο content strategist του One Prompt Away, ένα Ελληνικό brand για AI tools και prompts.
Target audience: Έλληνες 22-40, marketers, φοιτητές, freelancers, μικροεπιχειρηματίες.
Content pillars: prompt-lab (how-to), tool-drop (reviews), behind-the-prompt (deep dives).
Απάντησε ΜΟΝΟ σε JSON.`,
    messages: [
      {
        role: "user",
        content: `Πρότεινε ${count} νέα topics για το One Prompt Away.

Ήδη υπάρχουν αυτά τα topics (ΜΗΝ τα επαναλάβεις):
${avoid.map((t) => `- ${t}`).join("\n")}

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

  try {
    const parsed = JSON.parse(clean);
    if (!Array.isArray(parsed)) throw new Error("Το μοντέλο δεν επέστρεψε JSON array");
    return parsed;
  } catch (err) {
    console.error("❌ Δεν μπόρεσα να διαβάσω την απάντηση ως JSON:\n");
    console.error(clean.slice(0, 500));
    throw err;
  }
}

/** Γράφει στην ουρά, παραλείποντας τίτλους που υπάρχουν ήδη. */
function addToQueue(suggestions: TopicSuggestion[]): number {
  const queue = loadQueue();
  const existing = new Set(queue.topics.map((t) => normalize(t.topic)));

  let added = 0;
  for (const s of suggestions) {
    if (existing.has(normalize(s.topic))) {
      console.log(`   ↩︎  παραλείπω διπλότυπο: ${s.topic}`);
      continue;
    }
    queue.topics.push({
      topic: s.topic,
      category: s.category,
      status: "pending",
      published: null,
    });
    existing.add(normalize(s.topic));
    added++;
  }

  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2) + "\n", "utf-8");
  return added;
}

async function main() {
  const args = process.argv.slice(2);
  const auto = args.includes("--auto");

  const minPendingIdx = args.indexOf("--min-pending");
  const minPending = minPendingIdx !== -1 ? parseInt(args[minPendingIdx + 1], 10) : null;

  const countArg = args.find((a) => /^\d+$/.test(a));
  const count = parseInt(countArg || "5", 10);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ ANTHROPIC_API_KEY not set");
    process.exit(1);
  }

  const queue = loadQueue();
  const pending = queue.topics.filter((t) => t.status === "pending").length;

  // Gate: σε CI τρέχουμε μόνο όταν η ουρά κοντεύει να αδειάσει.
  if (minPending !== null) {
    if (Number.isNaN(minPending)) {
      console.error("❌ Το --min-pending θέλει αριθμό, π.χ. --min-pending 3");
      process.exit(1);
    }
    if (pending >= minPending) {
      console.log(`✅ Η ουρά έχει ${pending} pending topics (όριο: ${minPending}). Δεν χρειάζεται refill.`);
      process.exit(0);
    }
    console.log(`⚠️  Μόνο ${pending} pending topics (όριο: ${minPending}) — γεμίζω την ουρά.`);
  }

  const avoid = [...getExistingTopics(queue), ...getPublishedArticles()];
  console.log(`🧠 Generating ${count} topic suggestions (αποφεύγω ${avoid.length} υπάρχοντα)...`);

  const suggestions = await suggestTopics(count, avoid);

  console.log("\n📋 Suggestions:\n");
  suggestions.forEach((s, i) => {
    const priorityIcon = { high: "🔴", medium: "🟡", low: "🟢" }[s.priority] ?? "⚪";
    console.log(`${i + 1}. ${priorityIcon} [${s.category}] ${s.topic}`);
    console.log(`   ${s.reasoning}\n`);
  });

  // --auto, ή μη-διαδραστικό terminal (CI): σώζουμε χωρίς ερώτηση.
  if (auto || !process.stdin.isTTY) {
    const added = addToQueue(suggestions);
    console.log(`✅ Added ${added} topics to queue`);
    if (added === 0) {
      console.error("❌ Καμία νέα πρόταση — όλες ήταν διπλότυπα.");
      process.exit(1);
    }
    return;
  }

  const readline = await import("readline");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  rl.question("\nAdd all to content queue? (y/n): ", (answer) => {
    if (answer.trim().toLowerCase() === "y") {
      const added = addToQueue(suggestions);
      console.log(`✅ Added ${added} topics to queue`);
    } else {
      console.log("Skipped. You can add them manually to content-queue.json");
    }
    rl.close();
  });
}

main().catch((err) => {
  console.error("❌ suggest-topics failed:", err);
  process.exit(1);
});
