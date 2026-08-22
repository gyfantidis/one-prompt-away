import type { Metadata } from "next";
import Nav from "@/components/Nav";
import { getTranslations, isValidLocale, defaultLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const t = getTranslations(locale);
  return { title: t.privacy.metaTitle, description: t.privacy.metaDesc };
}

export default function PrivacyPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const t = getTranslations(locale);

  return (
    <main className="min-h-screen">
      <Nav locale={locale} />

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl">
            <p className="mb-3 font-mono text-sm text-brand-teal">{t.privacy.kicker}</p>
            <h1 className="mb-6 font-mono text-3xl font-bold md:text-4xl">
              {t.privacy.title}
            </h1>
            <p className="mb-3 text-lg leading-relaxed text-brand-muted">
              {t.privacy.intro}
            </p>
            <p className="mb-12 font-mono text-xs text-brand-muted/60">
              {t.privacy.updated}
            </p>

            <div className="flex flex-col gap-8">
              {t.privacy.sections.map((section) => (
                <div key={section.h}>
                  <h2 className="mb-2 font-mono text-lg font-bold">{section.h}</h2>
                  <p className="leading-relaxed text-brand-muted">{section.p}</p>
                </div>
              ))}
            </div>

            <p className="mt-12 text-brand-muted">
              {t.privacy.contactLabel}{" "}
              <a
                href="mailto:info@oneprompt.gr"
                className="text-brand-teal transition-colors hover:text-brand-teal-light"
              >
                info@oneprompt.gr
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
