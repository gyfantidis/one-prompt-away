import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

import Nav from "@/components/Nav";
import ArticleCard from "@/components/ArticleCard";
import { pillars } from "@/lib/pillars";
import { getTranslations, isValidLocale, defaultLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface ArticleMeta {
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  readingTime: string;
  slug: string;
}

function getArticles(locale: Locale): ArticleMeta[] {
  const articlesDir = path.join(
    process.cwd(),
    "content",
    "articles",
    locale
  );
  if (!fs.existsSync(articlesDir)) return [];

  return fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const content = fs.readFileSync(
        path.join(articlesDir, file),
        "utf-8"
      );
      const { data } = matter(content);
      return { ...data, slug: file.replace(".mdx", "") } as ArticleMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function ArticlesPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { category?: string };
}) {
  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const t = getTranslations(locale);

  const allArticles = getArticles(locale);
  const activeCategory = searchParams.category ?? null;
  const articles = activeCategory
    ? allArticles.filter((a) => a.category === activeCategory)
    : allArticles;

  return (
    <main className="min-h-screen">
      <Nav locale={locale} />

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-mono font-bold text-3xl mb-4">
            {t.articles.title}
          </h1>
          <p className="text-brand-muted mb-8">{t.articles.subtitle}</p>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href={`/${locale}/articles`}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors ${
                !activeCategory
                  ? "bg-brand-teal text-brand-dark border-brand-teal"
                  : "text-brand-muted border-brand-border hover:border-brand-muted"
              }`}
            >
              {t.articles.allFilter}
            </Link>
            {pillars.map((pillar) => (
              <Link
                key={pillar.slug}
                href={`/${locale}/articles?category=${pillar.slug}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors ${
                  activeCategory === pillar.slug
                    ? `${
                        pillar.slug === "prompt-lab"
                          ? "badge-prompt-lab"
                          : pillar.slug === "tool-drop"
                          ? "badge-tool-drop"
                          : "badge-behind-the-prompt"
                      } border-current`
                    : "text-brand-muted border-brand-border hover:border-brand-muted"
                }`}
              >
                {pillar.name}
              </Link>
            ))}
          </div>

          {articles.length === 0 ? (
            <div className="bg-brand-surface border border-brand-border rounded-xl p-10 text-center">
              <p className="text-brand-muted font-mono">{t.articles.empty}</p>
              <p className="text-brand-muted/50 text-sm mt-2">
                {t.articles.emptyTagline}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* Το πιο πρόσφατο άρθρο (της τρέχουσας κατηγορίας) ξεχωρίζει */}
              <ArticleCard
                featured
                locale={locale}
                slug={articles[0].slug}
                title={articles[0].title}
                description={articles[0].description}
                category={articles[0].category}
                categoryLabel={
                  t.categories[
                    articles[0].category as keyof typeof t.categories
                  ] ?? articles[0].category
                }
                readingTime={articles[0].readingTime}
                readingTimeLabel={t.articles.readingTime}
                date={articles[0].date}
                dateLocale={t.meta.dateLocale}
                tags={articles[0].tags}
              />

              {articles.length > 1 && (
                <div className="grid gap-5 md:grid-cols-2">
                  {articles.slice(1).map((article) => (
                    <ArticleCard
                      key={article.slug}
                      locale={locale}
                      slug={article.slug}
                      title={article.title}
                      description={article.description}
                      category={article.category}
                      categoryLabel={
                        t.categories[
                          article.category as keyof typeof t.categories
                        ] ?? article.category
                      }
                      readingTime={article.readingTime}
                      readingTimeLabel={t.articles.readingTime}
                      date={article.date}
                      dateLocale={t.meta.dateLocale}
                      tags={article.tags}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
