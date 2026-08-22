import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { isValidLocale, defaultLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "One Prompt Away";

const CATEGORY = {
  "prompt-lab": { color: "#2DD4BF", label: "PROMPT LAB" },
  "tool-drop": { color: "#60A5FA", label: "TOOL DROP" },
  "behind-the-prompt": { color: "#C084FC", label: "BEHIND THE PROMPT" },
} as const;

const ANGLES = [115, 135, 155, 200, 225, 245];

/** Ίδιο hash με το ArticleCover, ώστε cover και OG image να ταιριάζουν. */
function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return hash >>> 0;
}

/**
 * Το next/font δεν δίνει bytes στο ImageResponse, οπότε κατεβάζουμε τη
 * γραμματοσειρά. Το `text=` ζητά υποσύνολο μόνο με τους χαρακτήρες που
 * χρειαζόμαστε — κρατά το αρχείο μικρό και καλύπτει τα ελληνικά.
 */
async function loadFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&text=${encodeURIComponent(
      text
    )}`;
    const css = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    }).then((r) => r.text());

    const src = css.match(/src:\s*url\((.+?)\)\s*format\(['"](?:opentype|truetype)['"]\)/);
    if (!src) return null;

    const res = await fetch(src[1]);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    // Χωρίς δίκτυο στο build: γυρνάμε null και το ImageResponse
    // πέφτει στην προεπιλεγμένη γραμματοσειρά αντί να σκάσει το build.
    return null;
  }
}

export default async function Image({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale: Locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const filePath = path.join(
    process.cwd(),
    "content",
    "articles",
    locale,
    `${params.slug}.mdx`
  );

  let title = "One Prompt Away";
  let category = "prompt-lab";

  if (fs.existsSync(filePath)) {
    const { data } = matter(fs.readFileSync(filePath, "utf-8"));
    title = (data.title as string) ?? title;
    category = (data.category as string) ?? category;
  }

  const cat = CATEGORY[category as keyof typeof CATEGORY] ?? CATEGORY["prompt-lab"];
  const seed = hashString(params.slug);
  const angle = ANGLES[seed % ANGLES.length];
  const glowX = 8 + ((seed >>> 3) % 34);
  const glowY = 6 + ((seed >>> 7) % 26);

  const brand = "> OnePromptAway";
  const fontData = await loadFont(`${title}${cat.label}${brand}`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#161B22",
          backgroundImage: `radial-gradient(60% 95% at ${glowX}% ${glowY}%, ${cat.color}2B 0%, transparent 70%), linear-gradient(${angle}deg, ${cat.color}3D 0%, ${cat.color}0F 45%, transparent 78%)`,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: cat.color, letterSpacing: 4 }}>
          {cat.label}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 70 ? 52 : 64,
            lineHeight: 1.15,
            color: "#E6EDF3",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", fontSize: 28, color: "#8B949E" }}>{brand}</div>

        {/* Γραμμή έμφασης στη βάση — ίδια με το cover */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 10,
            backgroundColor: cat.color,
            opacity: 0.55,
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: "JetBrains Mono", data: fontData, style: "normal", weight: 700 }]
        : [],
    }
  );
}
