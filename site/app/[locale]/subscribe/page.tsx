import type { Metadata } from "next";
import { Check } from "lucide-react";
import Nav from "@/components/Nav";
import NewsletterForm from "@/components/NewsletterForm";
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
    title: t.subscribe.metaTitle,
    description: t.subscribe.metaDesc,
    alternates: {
      canonical: `https://oneprompt.gr/${locale}/subscribe`,
      languages: {
        el: "https://oneprompt.gr/el/subscribe",
        en: "https://oneprompt.gr/en/subscribe",
      },
    },
    openGraph: {
      title: t.subscribe.metaTitle,
      description: t.subscribe.metaDesc,
      url: `https://oneprompt.gr/${locale}/subscribe`,
      type: "website",
    },
  };
}

export default function SubscribePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const t = getTranslations(locale);

  return (
    <main className="min-h-screen">
      <Nav locale={locale} />

      {/* Η φόρμα πρέπει να χωράει πάνω από το fold ακόμα και σε μικρό
          κινητό — ο χρήστης έρχεται από social έχοντας ήδη αποφασίσει. */}
      <section className="px-6 pt-28 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="mb-3 font-mono text-sm text-brand-teal">
              {t.subscribe.kicker}
            </p>
            <h1 className="mb-4 font-mono text-3xl font-bold leading-tight md:text-4xl">
              {t.subscribe.title}
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-brand-muted">
              {t.subscribe.intro}
            </p>

            <div className="rounded-xl border border-brand-border bg-brand-surface p-6 sm:p-8">
              <NewsletterForm
                locale={locale}
                placeholder={t.home.newsletterPlaceholder}
                buttonText={t.home.newsletterButton}
                successText={t.home.newsletterSuccess}
                errorText={t.home.newsletterError}
              />
              <p className="mt-4 font-mono text-xs text-brand-muted">
                {t.subscribe.reassurance}
              </p>
            </div>

            <ul className="mt-10 flex flex-col gap-4">
              {t.subscribe.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <Check
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-brand-teal"
                  />
                  <span className="leading-relaxed text-brand-muted">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

          </div>
        </div>
      </section>
    </main>
  );
}
