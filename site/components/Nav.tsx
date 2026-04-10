import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getTranslations } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface NavProps {
  locale: Locale;
  backHref?: string;
  backLabel?: string;
}

export default function Nav({ locale, backHref, backLabel }: NavProps) {
  const t = getTranslations(locale);

  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-dark/80 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-mono font-bold text-lg">
          <span className="text-brand-muted">&gt; </span>
          <span className="text-brand-text">One</span>
          <span className="text-brand-teal">Prompt</span>
          <span className="text-brand-text">Away</span>
        </Link>

        <div className="flex items-center gap-5">
          {backHref ? (
            <Link
              href={backHref}
              className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {backLabel}
            </Link>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                href={`/${locale}/articles`}
                className="text-sm text-brand-muted hover:text-brand-text transition-colors"
              >
                {t.nav.articles}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="text-sm text-brand-muted hover:text-brand-text transition-colors"
              >
                {t.nav.about}
              </Link>
            </div>
          )}
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </nav>
  );
}
