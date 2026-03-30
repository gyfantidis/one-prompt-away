import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { Clock } from "lucide-react";
import Nav from "@/components/Nav";
import { categoryLabels } from "@/lib/categories";
import { pillars } from "@/lib/pillars";

interface ArticleMeta {
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  readingTime: string;
  slug: string;
}

function getArticles(): ArticleMeta[] {
  const articlesDir = path.join(process.cwd(), "content", "articles");

  if (!fs.existsSync(articlesDir)) return [];

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const content = fs.readFileSync(path.join(articlesDir, file), "utf-8");
      const { data } = matter(content);
      return {
        ...data,
        slug: file.replace(".mdx", ""),
      } as ArticleMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function ArticlesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const allArticles = getArticles();
  const activeCategory = searchParams.category ?? null;
  const articles = activeCategory
    ? allArticles.filter((a) => a.category === activeCategory)
    : allArticles;

  return (
    <main className="min-h-screen">
      <Nav backHref="/" backLabel="Αρχική" />

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-mono font-bold text-3xl mb-4">Άρθρα</h1>
          <p className="text-brand-muted mb-8">
            Πρακτικοί οδηγοί για AI tools και prompts. Κάθε εβδομάδα κάτι
            καινούριο.
          </p>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/articles"
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors ${
                !activeCategory
                  ? "bg-brand-teal text-brand-dark border-brand-teal"
                  : "text-brand-muted border-brand-border hover:border-brand-muted"
              }`}
            >
              Όλα
            </Link>
            {pillars.map((pillar) => (
              <Link
                key={pillar.slug}
                href={`/articles?category=${pillar.slug}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors ${
                  activeCategory === pillar.slug
                    ? `${categoryLabels[pillar.slug].class} border-current`
                    : "text-brand-muted border-brand-border hover:border-brand-muted"
                }`}
              >
                {pillar.name}
              </Link>
            ))}
          </div>

          {articles.length === 0 ? (
            <div className="bg-brand-surface border border-brand-border rounded-xl p-10 text-center">
              <p className="text-brand-muted font-mono">
                Δεν υπάρχουν άρθρα σε αυτή την κατηγορία ακόμα.
              </p>
              <p className="text-brand-muted/50 text-sm mt-2">
                Ένα prompt σε χωρίζει.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {articles.map((article) => {
                const cat = categoryLabels[article.category] || {
                  label: article.category,
                  class: "badge-prompt-lab",
                };
                return (
                  <Link
                    key={article.slug}
                    href={`/articles/${article.slug}`}
                    className="group block bg-brand-surface border border-brand-border rounded-xl p-6 hover:border-brand-teal/50 transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded text-xs font-mono font-semibold ${cat.class}`}
                      >
                        {cat.label}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-brand-muted font-mono">
                        <Clock className="w-3 h-3" />
                        {article.readingTime} ανάγνωση
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
                        {new Date(article.date).toLocaleDateString("el-GR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
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
