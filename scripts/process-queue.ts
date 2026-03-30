/**
 * process-queue.ts
 * 
 * Picks the next pending topic from content-queue.json,
 * generates content, and marks it as done.
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

const queuePath = path.join(process.cwd(), "..", "content", "content-queue-20.json");

function loadQueue(): Queue {
  const raw = fs.readFileSync(queuePath, "utf-8");
  return JSON.parse(raw);
}

function saveQueue(queue: Queue): void {
  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), "utf-8");
}

async function main() {
  const queue = loadQueue();
  const next = queue.topics.find((t) => t.status === "pending");

  if (!next) {
    console.log("📭 No pending topics in queue. Add more to content-queue.json");
    process.exit(0);
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
  } catch (error) {
    console.error("❌ Failed to process topic:", error);
    process.exit(1);
  }
}

main();
