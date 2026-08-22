import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";
import ArticleCard from "@/components/ArticleCard";
import NewsletterForm from "@/components/NewsletterForm";
import { pillars } from "@/lib/pillars";
import { getTranslations, isValidLocale, defaultLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

function getRecentArticles(locale: Locale) {
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
      const { data } = matter(
        fs.readFileSync(path.join(articlesDir, file), "utf-8")
      );
      return {
        title: data.title as string,
        description: data.description as string,
        date: data.date as string,
        category: data.category as string,
        readingTime: data.readingTime as string,
        slug: file.replace(".mdx", ""),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
}

export default function Home({ params }: { params: { locale: string } }) {
  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const t = getTranslations(locale);
  const recentArticles = getRecentArticles(locale);

  const cardProps = (article: (typeof recentArticles)[number]) => ({
    slug: article.slug,
    title: article.title,
    description: article.description,
    category: article.category,
    categoryLabel:
      t.categories[article.category as keyof typeof t.categories] ??
      article.category,
    readingTime: article.readingTime,
    readingTimeLabel: t.home.readingTime,
  });

  return (
    <main className="min-h-screen">
      <Nav locale={locale} />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-mono font-bold text-4xl md:text-6xl leading-[1.1] mb-6">
            {t.home.heroPrefix}{" "}
            <span className="text-brand-teal">{t.home.heroHighlight}</span>{" "}
            {t.home.heroSuffix}
          </h1>

          <p className="text-lg text-brand-muted mb-10 leading-relaxed">
            {t.home.heroSubtext}
          </p>

          <Link
            href={`/${locale}/articles`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-teal text-brand-dark font-semibold rounded-lg hover:bg-brand-teal-light transition-colors"
          >
            {t.home.cta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Terminal preview */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-brand-border">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs font-mono text-brand-muted">
                oneprompt.gr
              </span>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed">
              <p className="text-brand-muted">
                <span className="text-brand-teal">$</span> prompt --topic{" "}
                {t.home.terminalTopic}
              </p>
              <p className="mt-3 text-brand-text">{t.home.terminalLine1}</p>
              <p className="text-brand-text">{t.home.terminalLine2}</p>
              <p className="mt-3 text-brand-muted">
                <span className="text-green-400">✓</span>{" "}
                {t.home.terminalCheck1}
              </p>
              <p className="text-brand-muted">
                <span className="text-green-400">✓</span>{" "}
                {t.home.terminalCheck2}
              </p>
              <span className="inline-block w-2 h-4 bg-brand-teal mt-2 cursor-blink" />
            </div>
            <div className="px-6 py-3 border-t border-brand-border">
              <Link
                href={`/${locale}/articles/meal-plan-prompt`}
                className="text-xs font-mono text-brand-teal hover:text-brand-teal-light transition-colors"
              >
                {t.home.terminalRead}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content Pillars */}
      <section id="pillars" className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-mono font-bold text-2xl mb-8">
            {t.home.pillarsTitle}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar) => {
              const pillarT =
                t.pillars[pillar.slug as keyof typeof t.pillars];
              return (
                <Link
                  key={pillar.slug}
                  href={`/${locale}/articles?category=${pillar.slug}`}
                  className={`block p-5 rounded-xl border ${pillar.border} ${pillar.bg} hover:scale-[1.02] transition-transform`}
                >
                  <pillar.icon className={`w-6 h-6 ${pillar.color} mb-3`} />
                  <h3
                    className={`font-mono font-bold text-sm mb-2 ${pillar.color}`}
                  >
                    {pillar.name}
                  </h3>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    {pillarT.shortDescription}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <section className="px-6 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-mono font-bold text-2xl">
                {t.home.recentTitle}
              </h2>
              <Link
                href={`/${locale}/articles`}
                className="text-sm text-brand-teal hover:text-brand-teal-light transition-colors font-mono"
              >
                {t.home.seeAll}
              </Link>
            </div>

            <div className="flex flex-col gap-5">
              {/* Το πιο πρόσφατο άρθρο παίρνει όλο το πλάτος */}
              <ArticleCard featured locale={locale} {...cardProps(recentArticles[0])} />

              {recentArticles.length > 1 && (
                <div className="grid gap-5 md:grid-cols-2">
                  {recentArticles.slice(1).map((article) => (
                    <ArticleCard
                      key={article.slug}
                      locale={locale}
                      {...cardProps(article)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-brand-surface border border-brand-border rounded-xl p-8">
            <h2 className="font-mono font-bold text-xl mb-2">
              {t.home.newsletterTitle}
            </h2>
            <p className="text-brand-muted mb-6">{t.home.newsletterText}</p>
            <NewsletterForm
              placeholder={t.home.newsletterPlaceholder}
              buttonText={t.home.newsletterButton}
              successText={t.home.newsletterSuccess}
              errorText={t.home.newsletterError}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
