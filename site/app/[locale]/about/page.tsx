import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import { pillars } from "@/lib/pillars";
import { getTranslations, isValidLocale, defaultLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const t = getTranslations(locale);
  return {
    title: t.about.metaTitle,
    description: t.about.metaDesc,
  };
}

export default function AboutPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const t = getTranslations(locale);

  return (
    <main className="min-h-screen">
      <Nav locale={locale} />

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl">

          {/* Header */}
          <div className="mb-12">
            <p className="font-mono text-brand-teal text-sm mb-3">
              {t.about.whoami}
            </p>
            <h1 className="font-mono font-bold text-3xl md:text-4xl mb-6">
              {t.about.title}{" "}
              <span className="text-brand-teal">One Prompt Away</span>
            </h1>
            <p className="text-brand-muted text-lg leading-relaxed">
              {t.about.intro}
            </p>
          </div>

          {/* About text */}
          <div className="bg-brand-surface border border-brand-border rounded-xl p-8 mb-8 space-y-4">
            <p className="text-brand-text leading-relaxed">{t.about.p1}</p>
            <p className="text-brand-text leading-relaxed">{t.about.p2}</p>
            <p className="text-brand-text leading-relaxed">{t.about.p3}</p>
          </div>

          {/* Pillars */}
          <h2 className="font-mono font-bold text-xl mb-5">
            {t.about.pillarsTitle}
          </h2>
          <div className="flex flex-col gap-4 mb-12">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              const pillarT =
                t.pillars[pillar.slug as keyof typeof t.pillars];
              return (
                <div
                  key={pillar.slug}
                  className={`flex gap-4 p-5 rounded-xl border ${pillar.bg} ${pillar.border}`}
                >
                  <div className={`mt-0.5 ${pillar.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className={`font-mono font-semibold text-sm mb-1 ${pillar.color}`}
                    >
                      {pillar.name}
                    </p>
                    <p className="text-brand-muted text-sm leading-relaxed">
                      {pillarT.longDescription}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact / Social */}
          <div className="bg-brand-surface border border-brand-border rounded-xl p-8">
            <h2 className="font-mono font-bold text-lg mb-2">
              {t.about.contactTitle}
            </h2>
            <p className="text-brand-muted text-sm mb-6">
              {t.about.contactText}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.tiktok.com/@oneprompt.gr"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-brand-teal text-brand-dark font-semibold text-sm rounded-lg hover:bg-brand-teal-light transition-colors font-mono"
              >
                TikTok
              </a>
              <a
                href="https://www.instagram.com/oneprompt.gr/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-brand-border text-brand-text text-sm rounded-lg hover:border-brand-muted transition-colors font-mono"
              >
                Instagram
              </a>
              <Link
                href={`/${locale}/articles`}
                className="px-4 py-2 border border-brand-border text-brand-text text-sm rounded-lg hover:border-brand-muted transition-colors font-mono"
              >
                {t.about.articlesLink}
              </Link>
              <a
                href="mailto:info@oneprompt.gr"
                className="px-4 py-2 border border-brand-teal text-brand-teal text-sm rounded-lg hover:bg-brand-teal hover:text-brand-dark transition-colors font-mono"
              >
                info@oneprompt.gr
              </a>
            </div>
          </div>

          </div>
        </div>
      </section>
    </main>
  );
}
