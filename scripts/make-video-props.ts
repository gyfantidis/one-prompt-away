/**
 * make-video-props.ts — βγάζει τα δεδομένα του βίντεο από ένα άρθρο.
 *
 *   npm run video:props                → το πιο πρόσφατο άρθρο
 *   npm run video:props -- <slug>      → συγκεκριμένο άρθρο
 *   npm run video:props -- <slug> --force   → ξαναγράφει υπάρχον αρχείο
 *
 * Γράφει content/drafts/<slug>-video.json. Μετά το επεξεργάζεσαι όπως
 * θες και κάνεις `npm run video`.
 *
 * ΚΟΣΤΟΣ: μία κλήση στο Claude API ανά τρέξιμο — λίγα λεπτά του ευρώ.
 * Το render του βίντεο παραμένει δωρεάν.
 *
 * Σημείωση: χρησιμοποιεί το ίδιο μοτίβο "ζήτα JSON και κάνε parse" με
 * το generate-article.ts, γιατί το εγκατεστημένο SDK (0.30.x) δεν έχει
 * τους structured-output helpers. Δεν το αναβαθμίζουμε εδώ: από αυτό
 * εξαρτάται το εβδομαδιαίο workflow.
 */
import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARTICLES = path.join(ROOT, "site", "content", "articles", "el");
const DRAFTS = path.join(ROOT, "content", "drafts");

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("❌ Λείπει το ANTHROPIC_API_KEY.");
  console.error("   Βάλ' το στο scripts/.env (είναι στο .gitignore):");
  console.error("   ANTHROPIC_API_KEY=sk-ant-...");
  process.exit(1);
}

const client = new Anthropic();

type VideoProps = {
  hook: string;
  steps: string[];
  prompt: string;
  result: string;
  cta: string;
  category: string;
  brandTag: string;
};

function newestSlug(): string {
  const dated = fs
    .readdirSync(ARTICLES)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const head = fs.readFileSync(path.join(ARTICLES, file), "utf-8").slice(0, 600);
      return {
        slug: file.replace(/\.mdx$/, ""),
        date: head.match(/^date:\s*"([^"]+)"/m)?.[1] ?? "",
      };
    });
  dated.sort((a, b) => b.date.localeCompare(a.date));
  return dated[0].slug;
}

const SYSTEM = `Είσαι ο συντάκτης του One Prompt Away, ελληνικού brand για AI tools και prompts.

Φτιάχνεις το κείμενο για ένα κάθετο βίντεο 15-25 δευτερολέπτων (TikTok/Reels) από ένα άρθρο.

ΚΑΝΟΝΕΣ ΥΦΟΥΣ:
- Πρώτο πρόσωπο, καθημερινά ελληνικά. "Δοκίμασα", "Βρήκα ότι".
- Αγγλικά ΜΟΝΟ για τεχνικούς όρους: prompt, tool, AI, workflow.
- Μηδέν hype, μηδέν υπερβολές, μηδέν θαυμαστικά.
- Ό,τι δεν εξηγείται, δεν μπαίνει.

ΚΑΝΟΝΕΣ ΜΗΚΟΥΣ — το κείμενο μπαίνει πάνω σε εικόνα κινητού:
- hook: μία πρόταση, ΤΟ ΠΟΛΥ 60 χαρακτήρες. Πρέπει να σταματά το scroll.
- steps: ΑΚΡΙΒΩΣ 3, το καθένα ΤΟ ΠΟΛΥ 48 χαρακτήρες. Συγκεκριμένα, όχι γενικόλογα.
- prompt: ένα αληθινό prompt από το άρθρο, ΤΟ ΠΟΛΥ 90 χαρακτήρες.
- result: τι κέρδισε ο αναγνώστης, ΤΟ ΠΟΛΥ 50 χαρακτήρες.
- cta: μία προτροπή να δοκιμάσει, ΤΟ ΠΟΛΥ 60 χαρακτήρες.

Τα όρια είναι απόλυτα. Μεγαλύτερο κείμενο κόβεται στην οθόνη.
Απαντάς ΜΟΝΟ με JSON, χωρίς σχόλια, χωρίς markdown fences.`;

function buildPrompt(article: string, script: string | null): string {
  return `Άρθρο:
---
${article.slice(0, 6000)}
---
${script ? `\nΥπάρχον σενάριο TikTok (χρησιμοποίησέ το ως βάση):\n---\n${script.slice(0, 2000)}\n---\n` : ""}
Δώσε JSON με αυτή ακριβώς τη δομή:

{
  "hook": "...",
  "steps": ["...", "...", "..."],
  "prompt": "...",
  "result": "...",
  "cta": "..."
}`;
}

/** Κόβει τυχόν markdown fences γύρω από το JSON. */
function parseJson(text: string): Partial<VideoProps> {
  const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    console.error("❌ Το μοντέλο δεν επέστρεψε έγκυρο JSON. Τι γύρισε:\n");
    console.error(clean.slice(0, 800));
    process.exit(1);
  }
}

/**
 * Τιμές ανά 1 εκατομμύριο tokens, σε δολάρια.
 * Πηγή: επίσημος τιμοκατάλογος Anthropic, στιγμιότυπο Ιουνίου 2026.
 * Αν αλλάξουν, ενημέρωσε εδώ.
 */
const PRICING: Record<string, { input: number; output: number }> = {
  "claude-opus-5": { input: 5, output: 25 },
  "claude-sonnet-5": { input: 2, output: 10 },
  "claude-haiku-4-5": { input: 1, output: 5 },
};

function costOf(model: string, inputTokens: number, outputTokens: number) {
  const rate = PRICING[model];
  if (!rate) return null;
  return (inputTokens * rate.input + outputTokens * rate.output) / 1_000_000;
}

const LIMITS: Record<string, number> = {
  hook: 60,
  prompt: 90,
  result: 50,
  cta: 60,
};

/** Προειδοποιεί για κείμενα που θα βγουν πολύ μεγάλα στην οθόνη. */
function warnOnLength(props: VideoProps): void {
  const over: string[] = [];
  for (const [field, max] of Object.entries(LIMITS)) {
    const value = props[field as keyof VideoProps] as string;
    if (value.length > max) over.push(`${field}: ${value.length}/${max}`);
  }
  props.steps.forEach((s, i) => {
    if (s.length > 48) over.push(`steps[${i}]: ${s.length}/48`);
  });

  if (over.length > 0) {
    console.warn(`\n⚠️  Κάποια κείμενα ξεπερνούν το όριο — δες τα πριν το render:`);
    over.forEach((o) => console.warn(`   ${o}`));
  }
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");

  const flagValue = (name: string): string | undefined => {
    const i = args.indexOf(`--${name}`);
    return i !== -1 ? args[i + 1] : undefined;
  };

  const model = flagValue("model") ?? "claude-opus-5";
  const outOverride = flagValue("out");

  // Τα ορίσματα των flags δεν είναι slug.
  const flagArgs = new Set<string>();
  args.forEach((a, i) => {
    if (a.startsWith("--")) {
      flagArgs.add(a);
      if (args[i + 1] && !args[i + 1].startsWith("--")) flagArgs.add(args[i + 1]);
    }
  });
  const slug = args.find((a) => !flagArgs.has(a)) ?? newestSlug();

  const articlePath = path.join(ARTICLES, `${slug}.mdx`);
  if (!fs.existsSync(articlePath)) {
    console.error(`❌ Δεν υπάρχει άρθρο με slug "${slug}".`);
    process.exit(1);
  }

  const outPath = outOverride ?? path.join(DRAFTS, `${slug}-video.json`);
  if (fs.existsSync(outPath) && !force) {
    console.log(`ℹ️  Υπάρχει ήδη: content/drafts/${slug}-video.json`);
    console.log(`   Για να το ξαναφτιάξω:  npm run video:props -- ${slug} --force`);
    process.exit(0);
  }

  const article = fs.readFileSync(articlePath, "utf-8");
  const category = article.match(/^category:\s*"([^"]+)"/m)?.[1] ?? "prompt-lab";

  const scriptPath = path.join(DRAFTS, `${slug}-script.md`);
  const script = fs.existsSync(scriptPath)
    ? fs.readFileSync(scriptPath, "utf-8")
    : null;

  console.log(`📝 ${slug}`);
  console.log(`   κατηγορία: ${category}`);
  console.log(`   σενάριο TikTok: ${script ? "βρέθηκε" : "δεν υπάρχει, το βγάζω από το άρθρο"}`);
  console.log(`   μοντέλο: ${model}`);
  console.log(`   ρωτάω το Claude...`);

  const response = await client.messages.create({
    model,
    max_tokens: 2000,
    system: SYSTEM,
    messages: [{ role: "user", content: buildPrompt(article, script) }],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  const parsed = parseJson(text);

  if (
    !parsed.hook ||
    !Array.isArray(parsed.steps) ||
    parsed.steps.length !== 3 ||
    !parsed.prompt ||
    !parsed.result ||
    !parsed.cta
  ) {
    console.error("❌ Λείπουν πεδία από την απάντηση:");
    console.error(JSON.stringify(parsed, null, 2));
    process.exit(1);
  }

  const props: VideoProps = {
    hook: parsed.hook,
    steps: parsed.steps,
    prompt: parsed.prompt,
    result: parsed.result,
    cta: parsed.cta,
    category,
    brandTag: "@oneprompt.gr",
  };

  fs.mkdirSync(DRAFTS, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(props, null, 2) + "\n", "utf-8");

  console.log(`\n✅ ${path.relative(ROOT, outPath)}\n`);
  console.log(`   hook:   ${props.hook}`);
  props.steps.forEach((s, i) => console.log(`   ${i + 1}.      ${s}`));
  console.log(`   prompt: ${props.prompt}`);
  console.log(`   result: ${props.result}`);
  console.log(`   cta:    ${props.cta}`);

  warnOnLength(props);

  const { input_tokens: inTok, output_tokens: outTok } = response.usage;
  const cost = costOf(model, inTok, outTok);
  console.log(
    `\n   tokens: ${inTok} in / ${outTok} out` +
      (cost === null
        ? `  (άγνωστη τιμή για ${model})`
        : `  ≈ $${cost.toFixed(5)}`)
  );
  // Γραμμή για scripts που μαζεύουν στατιστικά:
  console.log(`USAGE model=${model} in=${inTok} out=${outTok} cost=${cost ?? ""}`);

  console.log(`\n   Άλλαξε ό,τι θες στο αρχείο, μετά:  npm run video -- ${slug}`);
}

main().catch((err) => {
  console.error("❌", err instanceof Error ? err.message : err);
  process.exit(1);
});
