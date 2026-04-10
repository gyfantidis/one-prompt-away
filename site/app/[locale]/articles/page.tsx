import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { Clock } from "lucide-react";
import Nav from "@/components/Nav";
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
      <Nav
        locale={locale}
        backHref={`/${locale}`}
        backLabel={t.nav.backHome}
      />

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
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
            <div className="flex flex-col gap-4">
              {articles.map((article) => {
                const catLabel =
                  t.categories[
                    article.category as keyof typeof t.categories
                  ] ?? article.category;
                const catClass =
                  article.category === "prompt-lab"
                    ? "badge-prompt-lab"
                    : article.category === "tool-drop"
                    ? "badge-tool-drop"
                    : "badge-behind-the-prompt";
                return (
                  <Link
                    key={article.slug}
                    href={`/${locale}/articles/${article.slug}`}
                    className="group block bg-brand-surface border border-brand-border rounded-xl p-6 hover:border-brand-teal/50 transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded text-xs font-mono font-semibold ${catClass}`}
                      >
                        {catLabel}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-brand-muted font-mono">
                        <Clock className="w-3 h-3" />
                        {article.readingTime} {t.articles.readingTime}
                      </span>
                    </div>
                    <h2 className="font-mono font-bold text-lg mb-2 group-hover:text-brand-teal transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-sm text-brand-muted leading-relaxed mb-3">
                      {article.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-brand-muted/60 font-mono">
                        {new Date(article.date).toLocaleDateString(
                          t.meta.dateLocale,
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                      <div className="flex gap-2">
                        {article.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-brand-muted/40 font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
