import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const BASE_URL = "https://oneprompt.gr";

// Οι σελίδες που υπάρχουν σε κάθε locale, πέρα από τα άρθρα.
const STATIC_PATHS = ["", "/articles", "/subscribe", "/about", "/privacy"];

function articlesDir(locale: Locale) {
  return path.join(process.cwd(), "content", "articles", locale);
}

/** slug → ημερομηνία του frontmatter, για μία γλώσσα. */
function slugDates(locale: Locale): Record<string, string> {
  const dir = articlesDir(locale);
  const result: Record<string, string> = {};
  if (!fs.existsSync(dir)) return result;

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".mdx")) continue;
    const { data } = matter(fs.readFileSync(path.join(dir, file), "utf-8"));
    result[file.replace(".mdx", "")] = data.date as string;
  }
  return result;
}

function languagesFor(suffix: string, availableIn: Locale[]) {
  const languages: Record<string, string> = {};
  for (const locale of availableIn) {
    languages[locale] = `${BASE_URL}/${locale}${suffix}`;
  }
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const dates: Record<string, Record<string, string>> = {};
  for (const locale of locales) dates[locale] = slugDates(locale);

  const entries: MetadataRoute.Sitemap = [];

  // Στατικές σελίδες — υπάρχουν σε κάθε γλώσσα, άρα πλήρη alternates.
  for (const suffix of STATIC_PATHS) {
    const languages = languagesFor(suffix, locales);
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${suffix}`,
        alternates: { languages },
      });
    }
  }

  // Άρθρα — δεν μεταφράζονται όλα, οπότε το alternates χτίζεται ανά slug
  // και δείχνει μόνο σε γλώσσες όπου το αρχείο όντως υπάρχει.
  for (const locale of locales) {
    for (const slug of Object.keys(dates[locale])) {
      const availableIn = locales.filter((l) => dates[l][slug] !== undefined);
      entries.push({
        url: `${BASE_URL}/${locale}/articles/${slug}`,
        lastModified: new Date(dates[locale][slug]),
        alternates: { languages: languagesFor(`/articles/${slug}`, availableIn) },
      });
    }
  }

  return entries;
}
