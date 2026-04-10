"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

const labels: Record<Locale, string> = {
  el: "GR",
  en: "EN",
};

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: Locale) {
    if (newLocale === locale) return;
    // Replace the current locale prefix with the new one
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  }

  return (
    <div className="flex items-center gap-0.5 font-mono text-xs">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && (
            <span className="text-brand-border mx-1 select-none">|</span>
          )}
          <button
            onClick={() => switchLocale(l)}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              locale === l
                ? "text-brand-teal font-semibold"
                : "text-brand-muted hover:text-brand-text"
            }`}
            aria-label={`Switch to ${l === "el" ? "Greek" : "English"}`}
          >
            {labels[l]}
          </button>
        </span>
      ))}
    </div>
  );
}
