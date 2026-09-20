import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NavLink from "@/components/NavLink";
import { getTranslations } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface NavProps {
  locale: Locale;
}

export default function Nav({ locale }: NavProps) {
  const t = getTranslations(locale);

  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-dark/80 backdrop-blur-md border-b border-brand-border px-4 sm:px-6">
      <div className="max-w-5xl mx-auto h-16 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="shrink-0 whitespace-nowrap font-mono text-base font-bold sm:text-lg"
        >
          <span className="text-brand-muted">&gt; </span>
          <span className="text-brand-text">One</span>
          <span className="text-brand-teal">Prompt</span>
          <span className="text-brand-text">Away</span>
        </Link>

        {/* Οι σύνδεσμοι μένουν ορατοί σε ΚΑΘΕ σελίδα, ώστε να φαίνεται
            πάντα πού βρίσκεσαι και να μπορείς να πας οπουδήποτε. */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-6">
          <NavLink href={`/${locale}/articles`}>{t.nav.articles}</NavLink>
          {/* Το "Σχετικά" κρύβεται σε πολύ στενή οθόνη ώστε να χωρέσει
              το CTA — παραμένει προσβάσιμο από την αρχική. */}
          <span className="hidden xs:inline">
            <NavLink href={`/${locale}/about`}>{t.nav.about}</NavLink>
          </span>
          <LanguageSwitcher locale={locale} />
          <Link
            href={`/${locale}/subscribe`}
            className="shrink-0 whitespace-nowrap rounded-lg bg-brand-teal px-3 py-1.5 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-teal-light sm:px-4"
          >
            {t.nav.subscribe}
          </Link>
        </div>
      </div>
    </nav>
  );
}
