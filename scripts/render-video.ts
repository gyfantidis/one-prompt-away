/**
 * render-video.ts — φτιάχνει το MP4 ενός άρθρου, τοπικά.
 *
 *   npm run video              → το πιο πρόσφατο άρθρο
 *   npm run video -- <slug>    → συγκεκριμένο άρθρο
 *
 * Διαβάζει τα δεδομένα από content/drafts/<slug>-video.json και τα
 * δίνει στο Remotion. Καμία κλήση σε API, κανένα κόστος — ο headless
 * Chrome τρέχει στον υπολογιστή σου.
 *
 * Το MP4 μένει στο video/out/, που είναι στο .gitignore. Δεν ανεβαίνει
 * πουθενά· το ανεβάζεις εσύ όπου θες.
 */
import { spawnSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARTICLES = path.join(ROOT, "site", "content", "articles", "el");
const DRAFTS = path.join(ROOT, "content", "drafts");
const VIDEO_DIR = path.join(ROOT, "video");

/** Το slug του πιο πρόσφατου άρθρου, με βάση το date του frontmatter. */
function newestSlug(): string {
  const files = fs.readdirSync(ARTICLES).filter((f) => f.endsWith(".mdx"));
  if (files.length === 0) {
    throw new Error(`Δεν βρέθηκαν άρθρα στο ${ARTICLES}`);
  }

  const dated = files.map((file) => {
    const head = fs.readFileSync(path.join(ARTICLES, file), "utf-8").slice(0, 600);
    const match = head.match(/^date:\s*"([^"]+)"/m);
    return { slug: file.replace(/\.mdx$/, ""), date: match?.[1] ?? "" };
  });

  dated.sort((a, b) => b.date.localeCompare(a.date));
  return dated[0].slug;
}

function main() {
  const args = process.argv.slice(2);
  const flagValue = (name: string): string | undefined => {
    const i = args.indexOf(`--${name}`);
    return i !== -1 ? args[i + 1] : undefined;
  };

  const propsOverride = flagValue("props");
  const outOverride = flagValue("out");

  const flagArgs = new Set<string>();
  args.forEach((a, i) => {
    if (a.startsWith("--")) {
      flagArgs.add(a);
      if (args[i + 1] && !args[i + 1].startsWith("--")) flagArgs.add(args[i + 1]);
    }
  });

  const slug = args.find((a) => !flagArgs.has(a)) ?? newestSlug();
  const propsPath = propsOverride ?? path.join(DRAFTS, `${slug}-video.json`);
  const outPath = outOverride ?? path.join(VIDEO_DIR, "out", `${slug}.mp4`);

  if (!fs.existsSync(path.join(ARTICLES, `${slug}.mdx`))) {
    console.error(`❌ Δεν υπάρχει άρθρο με slug "${slug}".`);
    console.error(`   Δες τα διαθέσιμα:  ls site/content/articles/el`);
    process.exit(1);
  }

  if (!fs.existsSync(propsPath)) {
    console.error(`❌ Λείπουν τα δεδομένα του βίντεο για το "${slug}".`);
    console.error(`   Περίμενα το αρχείο: content/drafts/${slug}-video.json`);
    console.error(``);
    console.error(`   Φτιάξ' το με:  npm run video:props -- ${slug}`);
    process.exit(1);
  }

  console.log(`🎬 ${slug}`);
  console.log(`   δεδομένα: content/drafts/${slug}-video.json`);

  const result = spawnSync(
    "npx",
    ["remotion", "render", "OPAVideo", outPath, `--props=${propsPath}`],
    { cwd: VIDEO_DIR, stdio: "inherit" }
  );

  if (result.status !== 0) {
    console.error(`\n❌ Το render απέτυχε.`);
    process.exit(result.status ?? 1);
  }

  console.log(`\n✅ Έτοιμο: video/out/${slug}.mp4`);
  console.log(`   Άνοιξέ το:  open video/out/${slug}.mp4`);
}

main();
