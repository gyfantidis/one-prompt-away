import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import ArticleCover from "@/components/ArticleCover";
import type { Locale } from "@/lib/i18n";

const BADGE_CLASS: Record<string, string> = {
  "prompt-lab": "badge-prompt-lab",
  "tool-drop": "badge-tool-drop",
  "behind-the-prompt": "badge-behind-the-prompt",
};

interface ArticleCardProps {
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  readingTime?: string;
  readingTimeLabel: string;
  /** ISO date — αν δοθεί, εμφανίζεται στο footer της κάρτας. */
  date?: string;
  dateLocale?: string;
  tags?: string[];
  /** Μεγάλη κάρτα πλήρους πλάτους για το πιο πρόσφατο άρθρο. */
  featured?: boolean;
}

export default function ArticleCard({
  locale,
  slug,
  title,
  description,
  category,
  categoryLabel,
  readingTime,
  readingTimeLabel,
  date,
  dateLocale,
  tags,
  featured = false,
}: ArticleCardProps) {
  const badgeClass = BADGE_CLASS[category] ?? BADGE_CLASS["prompt-lab"];

  return (
    <Link
      href={`/${locale}/articles/${slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-brand-border bg-brand-surface transition-all hover:-translate-y-0.5 hover:border-brand-teal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/60"
    >
      <ArticleCover
        slug={slug}
        category={category}
        title={title}
        tags={tags}
        className={`border-b border-brand-border ${
          featured ? "h-40 sm:h-52 lg:h-60" : "h-24 sm:h-28"
        }`}
      />

      <div className={`flex flex-1 flex-col ${featured ? "p-7 sm:p-8" : "p-6"}`}>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex rounded px-2.5 py-0.5 font-mono text-xs font-semibold ${badgeClass}`}
          >
            {categoryLabel}
          </span>
          {readingTime && (
            <span className="flex items-center gap-1 font-mono text-xs text-brand-muted">
              <Clock className="h-3 w-3" />
              {readingTime} {readingTimeLabel}
            </span>
          )}
        </div>

        <h3
          className={`mb-2 font-mono font-bold leading-tight transition-colors group-hover:text-brand-teal ${
            featured ? "text-xl sm:text-2xl lg:text-3xl" : "text-lg"
          }`}
        >
          {title}
        </h3>

        <p
          className={`leading-relaxed text-brand-muted ${
            featured ? "text-base sm:text-lg" : "text-sm"
          }`}
        >
          {description}
        </p>

        {(date || (tags && tags.length > 0)) && (
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {date && dateLocale && (
              <span className="font-mono text-xs text-brand-muted/60">
                {new Date(date).toLocaleDateString(dateLocale, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="font-mono text-xs text-brand-muted/40">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {featured && (
          <span className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-brand-teal">
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </div>
    </Link>
  );
}
