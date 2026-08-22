/**
 * send-newsletter.ts
 *
 * Στέλνει Resend broadcast για το άρθρο που μόλις δημοσιεύτηκε — ένα
 * ανά γλώσσα, στη δική της λίστα.
 *
 * Καλείται από το weekly-publish.yml μετά το commit. Στέλνει ΜΟΝΟ αν
 * το νεότερο άρθρο της γλώσσας είναι σημερινό, ώστε ένα δεύτερο
 * τρέξιμο να μην ξαναστείλει παλιό άρθρο σε όλους.
 *
 * Usage:
 *   npx tsx send-newsletter.ts              # κανονική αποστολή
 *   npx tsx send-newsletter.ts --dry-run    # δείχνει τι θα έστελνε
 *   npx tsx send-newsletter.ts --force      # αγνοεί τον έλεγχο ημερομηνίας
 */

import { Resend } from "resend";
import * as fs from "fs";
import * as path from "path";

const SITE = "https://oneprompt.gr";
const FROM = "Giannis @ One Prompt Away <hello@oneprompt.gr>";

type Locale = "el" | "en";

const LOCALES: Locale[] = ["el", "en"];

const AUDIENCE_ENV: Record<Locale, string> = {
  el: "RESEND_AUDIENCE_ID",
  en: "RESEND_AUDIENCE_ENGLISH_ID",
};

const COPY: Record<Locale, { kicker: string; cta: string; reason: string; unsub: string }> = {
  el: {
    kicker: "Το άρθρο της εβδομάδας",
    cta: "Διάβασέ το →",
    reason: "Έλαβες αυτό το email γιατί εγγράφτηκες στο oneprompt.gr.",
    unsub: "Απεγγραφή",
  },
  en: {
    kicker: "This week's article",
    cta: "Read it →",
    reason: "You received this email because you subscribed at oneprompt.gr.",
    unsub: "Unsubscribe",
  },
};

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

function newestArticle(locale: Locale): Article | null {
  const dir = path.join(process.cwd(), "..", "site", "content", "articles", locale);
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

function buildHtml(article: Article, locale: Locale): string {
  const color = CATEGORY_COLOR[article.category] ?? "#2DD4BF";
  const label = CATEGORY_LABEL[article.category] ?? "ONE PROMPT AWAY";
  const t = COPY[locale];
  const url = `${SITE}/${locale}/articles/${article.slug}`;

  return `
  <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1117; color: #E6EDF3; padding: 40px 32px; border-radius: 12px;">
    <h1 style="font-family: monospace; color: #2DD4BF; font-size: 20px; margin: 0 0 4px;">&gt; One<span style="color:#2DD4BF">Prompt</span>Away</h1>
    <p style="color: #8B949E; margin: 0 0 32px; font-size: 13px;">${t.kicker}</p>

    <p style="font-family: monospace; color: ${color}; font-size: 12px; letter-spacing: 2px; margin: 0 0 12px;">${label}</p>
    <h2 style="font-family: monospace; font-size: 22px; line-height: 1.3; margin: 0 0 12px;">${article.title}</h2>
    <p style="color: #8B949E; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">${article.description}</p>

    <a href="${url}" style="display: inline-block; background: ${color}; color: #0D1117; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none;">${t.cta}</a>

    <p style="margin-top: 48px; font-size: 14px; color: #8B949E;">Giannis<br>One Prompt Away</p>
    <p style="font-size: 12px; color: #8B949E; margin-top: 32px;">
      ${t.reason}<br>
      <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color: #8B949E;">${t.unsub}</a>
    </p>
  </div>`;
}

/** @returns true αν έγινε αποστολή, false αν παραλείφθηκε */
async function sendFor(
  locale: Locale,
  opts: { dryRun: boolean; force: boolean; today: string }
): Promise<boolean> {
  const audienceId = process.env[AUDIENCE_ENV[locale]];
  if (!audienceId) {
    console.log(`⏭️  [${locale}] Δεν έχει οριστεί ${AUDIENCE_ENV[locale]} — παραλείπεται.`);
    return false;
  }

  const article = newestArticle(locale);
  if (!article) {
    console.log(`⏭️  [${locale}] Δεν βρέθηκε άρθρο — παραλείπεται.`);
    return false;
  }

  // Δεν έχουν όλα τα άρθρα αγγλική έκδοση: αν λείπει η σημερινή, οι
  // αγγλόφωνοι απλώς δεν παίρνουν email αυτή τη βδομάδα.
  if (article.date !== opts.today && !opts.force) {
    console.log(
      `📭 [${locale}] Το νεότερο άρθρο είναι της ${article.date}, όχι σημερινό (${opts.today}) — παραλείπεται.`
    );
    return false;
  }

  console.log(`📧 [${locale}] "${article.title}" [${article.category}]`);

  if (opts.dryRun) {
    console.log(`   (dry run — δεν στάλθηκε)`);
    return false;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  // Το Resend SDK επιστρέφει { data, error } — δεν πετάει exception.
  const created = await resend.broadcasts.create({
    audienceId,
    from: FROM,
    subject: article.title,
    previewText: article.description.slice(0, 120),
    name: `${article.date} — ${locale} — ${article.slug}`,
    html: buildHtml(article, locale),
  });

  if (created.error || !created.data?.id) {
    throw new Error(`[${locale}] δημιουργία broadcast: ${created.error?.message ?? "χωρίς id"}`);
  }

  const sent = await resend.broadcasts.send(created.data.id);
  if (sent.error) {
    throw new Error(`[${locale}] αποστολή broadcast: ${sent.error.message}`);
  }

  console.log(`   ✅ στάλθηκε (broadcast ${created.data.id})`);
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");
  const today = new Date().toISOString().split("T")[0];

  if (!process.env.RESEND_API_KEY) {
    console.error("❌ Λείπει RESEND_API_KEY");
    process.exit(1);
  }

  let sentCount = 0;
  const failures: string[] = [];

  // Μια αποτυχία σε μία γλώσσα δεν εμποδίζει την άλλη.
  for (const locale of LOCALES) {
    try {
      if (await sendFor(locale, { dryRun, force, today })) sentCount++;
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }

  if (failures.length) {
    console.error("\n❌ Αποτυχίες:");
    for (const f of failures) console.error(`   ${f}`);
    process.exit(1);
  }

  console.log(`\n📊 Στάλθηκαν ${sentCount} newsletter.`);
}

main().catch((err) => {
  console.error("❌ send-newsletter απέτυχε:", err);
  process.exit(1);
});
