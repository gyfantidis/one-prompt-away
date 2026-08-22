import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Clock, Calendar, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import CodeBlock from "@/components/CodeBlock";
import ReadingProgress from "@/components/ReadingProgress";
import ArticleCover from "@/components/ArticleCover";
import { getTranslations, isValidLocale, defaultLocale, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

function articlesDir(locale: Locale) {
  return path.join(process.cwd(), "content", "articles", locale);
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const dir = articlesDir(locale);
    if (!fs.existsSync(dir)) continue;
    fs.readdirSync(dir)
      .filter((f) => f.endsWith(".mdx"))
      .forEach((f) => {
        params.push({ locale, slug: f.replace(".mdx", "") });
      });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const filePath = path.join(articlesDir(locale), `${params.slug}.mdx`);
  if (!fs.existsSync(filePath)) return {};
  const { data } = matter(fs.readFileSync(filePath, "utf-8"));
  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      type: "article",
      publishedTime: data.date,
      tags: data.tags,
    },
    // Χωρίς αυτό, το X/Twitter έπαιρνε τον τίτλο του site αντί του άρθρου.
    // Την εικόνα τη συμπληρώνει μόνο του το opengraph-image.tsx.
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const t = getTranslations(locale);

  const filePath = path.join(articlesDir(locale), `${params.slug}.mdx`);
  if (!fs.existsSync(filePath)) notFound();

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(fileContent);

  const catLabel =
    t.categories[data.category as keyof typeof t.categories] ?? data.category;
  const catClass =
    data.category === "prompt-lab"
      ? "badge-prompt-lab"
      : data.category === "tool-drop"
      ? "badge-tool-drop"
      : "badge-behind-the-prompt";

  return (
    <main className="min-h-screen">
      <ReadingProgress />
      <Nav locale={locale} />

      <article className="pt-28 pb-20 px-6">
        {/* Container ίδιου πλάτους με το nav· το κείμενο περιορίζεται
            ΜΕΣΑ του και μένει αριστερά, ώστε το αριστερό άκρο να
            συμπίπτει με το λογότυπο σε κάθε σελίδα. */}
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl">
          {/* Header */}
          <div className="mb-10">
            <ArticleCover
              slug={params.slug}
              category={data.category as string}
              title={data.title as string}
              tags={data.tags as string[] | undefined}
              className="mb-8 aspect-[5/2] rounded-xl border border-brand-border"
            />
            <span
              className={`inline-flex px-2.5 py-0.5 rounded text-xs font-mono font-semibold mb-4 ${catClass}`}
            >
              {catLabel}
            </span>
            <h1 className="font-mono font-bold text-3xl md:text-4xl leading-tight mb-4">
              {data.title}
            </h1>
            <p className="text-brand-muted text-lg mb-6">{data.description}</p>
            <div className="flex flex-wrap items-center gap-5 text-sm text-brand-muted font-mono">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(data.date).toLocaleDateString(t.meta.dateLocale, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {data.readingTime}
              </span>
              {data.tags && (
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  {data.tags.join(", ")}
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-brand-border mb-10" />

          {/* MDX Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <MDXRemote
              source={content}
              components={{
                pre: (props) => (
                  <CodeBlock
                    {...props}
                    copyLabel={t.article.copy}
                    copiedLabel={t.article.copied}
                  />
                ),
              }}
            />
          </div>

          {/* Footer CTA */}
          <div className="mt-16 bg-brand-surface border border-brand-border rounded-xl p-8">
            <p className="font-mono text-sm text-brand-teal mb-2">
              {t.article.ctaTitle}
            </p>
            <p className="text-brand-muted mb-4">{t.article.ctaText}</p>
            <div className="flex gap-3">
              <a
                href="https://www.tiktok.com/@oneprompt.gr"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-brand-teal text-brand-dark font-semibold text-sm rounded-lg hover:bg-brand-teal-light transition-colors"
              >
                TikTok
              </a>
              <a
                href="https://www.instagram.com/oneprompt.gr/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-brand-border text-brand-text text-sm rounded-lg hover:border-brand-muted transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
          </div>
        </div>
      </article>
    </main>
  );
}
