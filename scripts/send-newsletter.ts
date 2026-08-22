/**
 * send-newsletter.ts
 *
 * Στέλνει Resend broadcast για το άρθρο που μόλις δημοσιεύτηκε.
 *
 * Καλείται από το weekly-publish.yml μετά το commit. Στέλνει ΜΟΝΟ αν
 * το νεότερο άρθρο έχει τη σημερινή ημερομηνία — αλλιώς ένα δεύτερο
 * τρέξιμο (π.χ. χειροκίνητο) θα ξανάστελνε παλιό άρθρο στους πάντες.
 *
 * Usage:
 *   npx tsx send-newsletter.ts              # στέλνει αν υπάρχει σημερινό άρθρο
 *   npx tsx send-newsletter.ts --dry-run    # δείχνει τι θα έστελνε
 *   npx tsx send-newsletter.ts --force      # στέλνει το νεότερο ό,τι ημερομηνία κι αν έχει
 */

import { Resend } from "resend";
import * as fs from "fs";
import * as path from "path";

const SITE = "https://oneprompt.gr";
const FROM = "Giannis @ One Prompt Away <hello@oneprompt.gr>";

const CATEGORY_LABEL: Record<string, string> = {
  "prompt-lab": "PROMPT LAB",
  "tool-drop": "TOOL DROP",
  "behind-the-prompt": "BEHIND THE PROMPT",
};

const CATEGORY_COLOR: Record<string, string> = {
  "prompt-lab": "#2DD4BF",
  "tool-drop": "#60A5FA",
  "behind-the-prompt": "#C084FC",
};

interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
}

/** Μικρός parser — αποφεύγει νέα εξάρτηση για 4 πεδία. */
function readField(source: string, field: string): string {
  const match = source.match(new RegExp(`^${field}:\\s*"(.*)"\\s*$`, "m"));
  return match ? match[1] : "";
}

function newestArticle(): Article | null {
  const dir = path.join(process.cwd(), "..", "site", "content", "articles", "el");
  if (!fs.existsSync(dir)) return null;

  const articles = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      return {
        slug: file.replace(".mdx", ""),
        title: readField(raw, "title"),
        description: readField(raw, "description"),
        date: readField(raw, "date"),
        category: readField(raw, "category"),
      };
    })
    .filter((a) => a.title && a.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return articles[0] ?? null;
}

function buildHtml(article: Article): string {
  const color = CATEGORY_COLOR[article.category] ?? "#2DD4BF";
  const label = CATEGORY_LABEL[article.category] ?? "ONE PROMPT AWAY";
  const url = `${SITE}/el/articles/${article.slug}`;

  return `
  <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1117; color: #E6EDF3; padding: 40px 32px; border-radius: 12px;">
    <h1 style="font-family: monospace; color: #2DD4BF; font-size: 20px; margin: 0 0 4px;">&gt; One<span style="color:#2DD4BF">Prompt</span>Away</h1>
    <p style="color: #8B949E; margin: 0 0 32px; font-size: 13px;">Το άρθρο της εβδομάδας</p>

    <p style="font-family: monospace; color: ${color}; font-size: 12px; letter-spacing: 2px; margin: 0 0 12px;">${label}</p>
    <h2 style="font-family: monospace; font-size: 22px; line-height: 1.3; margin: 0 0 12px;">${article.title}</h2>
    <p style="color: #8B949E; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">${article.description}</p>

    <a href="${url}" style="display: inline-block; background: ${color}; color: #0D1117; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Διάβασέ το →</a>

    <p style="margin-top: 48px; font-size: 14px; color: #8B949E;">Giannis<br>One Prompt Away</p>
    <p style="font-size: 12px; color: #8B949E; margin-top: 32px;">
      Έλαβες αυτό το email γιατί εγγράφτηκες στο oneprompt.gr.<br>
      <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color: #8B949E;">Απεγγραφή</a>
    </p>
  </div>`;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.error("❌ Λείπει RESEND_API_KEY ή RESEND_AUDIENCE_ID");
    process.exit(1);
  }

  const article = newestArticle();
  if (!article) {
    console.error("❌ Δεν βρέθηκε άρθρο στο site/content/articles/el");
    process.exit(1);
  }

  const today = new Date().toISOString().split("T")[0];
  if (article.date !== today && !force) {
    console.log(
      `📭 Το νεότερο άρθρο είναι της ${article.date}, όχι σημερινό (${today}). Δεν στέλνω newsletter.`
    );
    process.exit(0);
  }

  console.log(`📧 Άρθρο: "${article.title}" [${article.category}]`);

  if (dryRun) {
    console.log(`\n--- dry run, δεν στάλθηκε τίποτα ---\n${buildHtml(article)}`);
    return;
  }

  const resend = new Resend(apiKey);

  // Το Resend SDK επιστρέφει { data, error } — δεν πετάει exception.
  const created = await resend.broadcasts.create({
    audienceId,
    from: FROM,
    subject: article.title,
    previewText: article.description.slice(0, 120),
    name: `${article.date} — ${article.slug}`,
    html: buildHtml(article),
  });

  if (created.error || !created.data?.id) {
    console.error("❌ Αποτυχία δημιουργίας broadcast:", created.error);
    process.exit(1);
  }

  const sent = await resend.broadcasts.send(created.data.id);
  if (sent.error) {
    console.error("❌ Αποτυχία αποστολής broadcast:", sent.error);
    process.exit(1);
  }

  console.log(`✅ Το newsletter στάλθηκε (broadcast ${created.data.id})`);
}

main().catch((err) => {
  console.error("❌ send-newsletter απέτυχε:", err);
  process.exit(1);
});
