/**
 * process-queue.ts
 *
 * Picks the next pending topic from content-queue.json,
 * generates content, and marks it as done.
 *
 * Exit codes:
 *   0 = άρθρο παρήχθη κανονικά
 *   1 = άδεια ουρά ή αποτυχία παραγωγής  → το GitHub Actions βγαίνει ΚΟΚΚΙΝΟ
 *       και στέλνει email. Ποτέ σιωπηλή αποτυχία.
 *
 * Used by: GitHub Actions cron job (every Monday 9am Athens)
 * Usage: npx tsx scripts/process-queue.ts
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

interface Topic {
  topic: string;
  category: string;
  status: "pending" | "done";
  published: string | null;
}

interface Queue {
  topics: Topic[];
}

/** Κάτω από αυτό το όριο βγάζουμε προειδοποίηση στο build log. */
const LOW_QUEUE_THRESHOLD = 3;

const queuePath = path.join(process.cwd(), "..", "content", "content-queue.json");

function loadQueue(): Queue {
  const raw = fs.readFileSync(queuePath, "utf-8");
  return JSON.parse(raw);
}

function saveQueue(queue: Queue): void {
  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2) + "\n", "utf-8");
}

async function main() {
  const queue = loadQueue();
  const next = queue.topics.find((t) => t.status === "pending");

  if (!next) {
    console.error("");
    console.error("❌ ΑΔΕΙΑ ΟΥΡΑ — δεν υπάρχει pending topic, δεν παρήχθη άρθρο.");
    console.error("");
    console.error("   Διόρθωση, με έναν από τους δύο τρόπους:");
    console.error("   1) Πρόσθεσε topics με το χέρι στο content/content-queue.json:");
    console.error('      { "topic": "...", "category": "prompt-lab", "status": "pending", "published": null }');
    console.error("   2) Άσε το AI να προτείνει:");
    console.error("      npx tsx suggest-topics.ts 10 --auto");
    console.error("");
    process.exit(1);
  }

  console.log(`📋 Next topic: "${next.topic}" [${next.category}]`);

  // Run the generation script
  try {
    execSync(
      `npx tsx generate-article.ts "${next.topic}" "${next.category}"`,
      {
        stdio: "inherit",
        cwd: process.cwd(),
        env: { ...process.env },
      }
    );

    // Mark as done
    next.status = "done";
    next.published = new Date().toISOString().split("T")[0];
    saveQueue(queue);

    console.log(`\n✅ Topic processed and marked as done`);

    // Count remaining
    const remaining = queue.topics.filter((t) => t.status === "pending").length;
    console.log(`📊 Remaining in queue: ${remaining} topics`);

    if (remaining <= LOW_QUEUE_THRESHOLD) {
      console.warn(
        `⚠️  Χαμηλό απόθεμα (${remaining}). Σε ${remaining} εβδομάδες αδειάζει η ουρά.`
      );
    }
  } catch (error) {
    console.error("❌ Failed to process topic:", error);
    process.exit(1);
  }
}

main();
