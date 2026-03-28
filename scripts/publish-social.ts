/**
 * publish-social.ts
 * 
 * Publishes video to TikTok and/or Instagram.
 * 
 * Usage:
 *   npx tsx scripts/publish-social.ts --platform tiktok --file video/out/video.mp4 --slug "article-slug"
 *   npx tsx scripts/publish-social.ts --platform instagram --file video/out/video.mp4 --slug "article-slug"
 *   npx tsx scripts/publish-social.ts --platform all --file video/out/video.mp4 --slug "article-slug"
 * 
 * Required env vars:
 *   TIKTOK_ACCESS_TOKEN - TikTok Content Posting API token
 *   INSTAGRAM_ACCESS_TOKEN - Instagram Graph API token
 *   INSTAGRAM_ACCOUNT_ID - Instagram Business Account ID
 */

import * as fs from "fs";
import * as path from "path";

// Parse CLI args
const args = process.argv.slice(2);
const getArg = (name: string): string | undefined => {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : undefined;
};

const platform = getArg("platform") || "all";
const videoFile = getArg("file");
const slug = getArg("slug");

if (!videoFile) {
  console.error("Usage: npx tsx publish-social.ts --platform <tiktok|instagram|all> --file <path> --slug <slug>");
  process.exit(1);
}

// Load caption from script file if available
function getCaption(): string {
  if (slug) {
    const scriptPath = path.join(process.cwd(), "..", "content", "drafts", `${slug}-script.md`);
    if (fs.existsSync(scriptPath)) {
      const content = fs.readFileSync(scriptPath, "utf-8");
      // Extract hook line for caption
      const hookMatch = content.match(/### HOOK.*?\n(.+)/);
      const hook = hookMatch ? hookMatch[1].trim() : "";
      return `${hook}\n\n#AI #prompts #productivity #onepromptaway #ελληνικά`;
    }
  }
  return "Ένα prompt σε χωρίζει. #AI #prompts #onepromptaway";
}

// ===== TikTok Content Posting API =====
async function publishToTikTok(videoPath: string, caption: string) {
  const token = process.env.TIKTOK_ACCESS_TOKEN;
  if (!token) {
    console.error("❌ TIKTOK_ACCESS_TOKEN not set");
    return false;
  }

  console.log("📱 Publishing to TikTok...");

  try {
    // Step 1: Initialize upload
    const initRes = await fetch("https://open.tiktokapis.com/v2/post/publish/inbox/video/init/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_info: {
          source: "FILE_UPLOAD",
          video_size: fs.statSync(videoPath).size,
          chunk_size: fs.statSync(videoPath).size,
          total_chunk_count: 1,
        },
      }),
    });

    const initData = await initRes.json();

    if (initData.error?.code) {
      console.error("❌ TikTok init error:", initData.error.message);
      return false;
    }

    const uploadUrl = initData.data?.upload_url;
    const publishId = initData.data?.publish_id;

    // Step 2: Upload video
    const videoBuffer = fs.readFileSync(videoPath);
    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "video/mp4",
        "Content-Range": `bytes 0-${videoBuffer.length - 1}/${videoBuffer.length}`,
      },
      body: videoBuffer,
    });

    console.log("✅ TikTok: Video uploaded, publish_id:", publishId);
    console.log("   Note: Video will appear in TikTok Creator Inbox for final review.");
    return true;
  } catch (error) {
    console.error("❌ TikTok publish failed:", error);
    return false;
  }
}

// ===== Instagram Graph API (Reels) =====
async function publishToInstagram(videoPath: string, caption: string) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;

  if (!token || !accountId) {
    console.error("❌ INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_ACCOUNT_ID not set");
    return false;
  }

  console.log("📸 Publishing to Instagram Reels...");

  try {
    // Note: Instagram requires a public URL for the video.
    // In production, upload to a temporary hosting (S3, GCS) first.
    // For now, this assumes the video is available at a public URL.
    
    // Step 1: Create media container
    const containerRes = await fetch(
      `https://graph.facebook.com/v19.0/${accountId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_type: "REELS",
          video_url: videoPath, // Must be a public URL in production
          caption,
          access_token: token,
        }),
      }
    );

    const containerData = await containerRes.json();
    const containerId = containerData.id;

    if (!containerId) {
      console.error("❌ Instagram container creation failed:", containerData);
      return false;
    }

    // Step 2: Wait for processing (poll status)
    console.log("   Waiting for Instagram to process video...");
    let status = "IN_PROGRESS";
    let attempts = 0;

    while (status === "IN_PROGRESS" && attempts < 30) {
      await new Promise((r) => setTimeout(r, 5000));
      const statusRes = await fetch(
        `https://graph.facebook.com/v19.0/${containerId}?fields=status_code&access_token=${token}`
      );
      const statusData = await statusRes.json();
      status = statusData.status_code;
      attempts++;
    }

    if (status !== "FINISHED") {
      console.error("❌ Instagram processing failed, status:", status);
      return false;
    }

    // Step 3: Publish
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${accountId}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: token,
        }),
      }
    );

    const publishData = await publishRes.json();
    console.log("✅ Instagram: Reel published, id:", publishData.id);
    return true;
  } catch (error) {
    console.error("❌ Instagram publish failed:", error);
    return false;
  }
}

// ===== Main =====
async function main() {
  const absoluteVideoPath = path.resolve(videoFile!);

  if (!fs.existsSync(absoluteVideoPath)) {
    console.error(`❌ Video file not found: ${absoluteVideoPath}`);
    process.exit(1);
  }

  const caption = getCaption();
  console.log(`📝 Caption: ${caption.split("\n")[0]}...`);

  const results: Record<string, boolean> = {};

  if (platform === "tiktok" || platform === "all") {
    results.tiktok = await publishToTikTok(absoluteVideoPath, caption);
  }

  if (platform === "instagram" || platform === "all") {
    results.instagram = await publishToInstagram(absoluteVideoPath, caption);
  }

  console.log("\n📊 Results:", results);

  const allSuccess = Object.values(results).every(Boolean);
  process.exit(allSuccess ? 0 : 1);
}

main();
