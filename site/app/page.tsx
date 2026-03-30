import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import Nav from "@/components/Nav";
import { pillars } from "@/lib/pillars";
import { categoryLabels } from "@/lib/categories";

function getRecentArticles() {
  const articlesDir = path.join(process.cwd(), "content", "articles");
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

export default function Home() {
  const recentArticles = getRecentArticles();

  return (
    <main className="min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-mono font-bold text-4xl md:text-5xl leading-tight mb-6">
            Ένα{" "}
            <span className="text-brand-teal">prompt</span>{" "}
            σε χωρίζει.
          </h1>

          <p className="text-lg text-brand-muted max-w-xl mb-10 leading-relaxed">
            Πρακτικοί οδηγοί για AI tools και prompts στα Ελληνικά.
            Κάθε εβδομάδα, ένα πρόβλημα — μία AI λύση.
          </p>

          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-teal text-brand-dark font-semibold rounded-lg hover:bg-brand-teal-light transition-colors"
          >
            Δες τα άρθρα
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Terminal preview */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
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
                <span className="text-brand-teal">$</span> prompt
                --topic &quot;weekly meal plan&quot;
              </p>
              <p className="mt-3 text-brand-text">
                Φτιάξε μου ένα εβδομαδιαίο meal plan για 2 άτομα,
              </p>
              <p className="text-brand-text">
                μεσογειακή διατροφή, budget €50, με λίστα για σούπερ μάρκετ.
              </p>
              <p className="mt-3 text-brand-muted">
                <span className="text-green-400">✓</span> Meal plan generated in 28s
              </p>
              <p className="text-brand-muted">
                <span className="text-green-400">✓</span> Shopping list: 23 items, estimated €47.50
              </p>
              <span className="inline-block w-2 h-4 bg-brand-teal mt-2 cursor-blink" />
            </div>
            <div className="px-6 py-3 border-t border-brand-border">
              <Link
                href="/articles/meal-plan-prompt"
                className="text-xs font-mono text-brand-teal hover:text-brand-teal-light transition-colors"
              >
                Διάβασε πώς το έφτιαξα →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content Pillars */}
      <section id="pillars" className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-mono font-bold text-2xl mb-8">
            Τι θα βρεις εδώ
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar) => (
              <Link
                key={pillar.slug}
                href={`/articles?category=${pillar.slug}`}
                className={`block p-5 rounded-xl border ${pillar.border} ${pillar.bg} hover:scale-[1.02] transition-transform`}
              >
                <pillar.icon className={`w-6 h-6 ${pillar.color} mb-3`} />
                <h3 className={`font-mono font-bold text-sm mb-2 ${pillar.color}`}>
                  {pillar.name}
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed">
                  {pillar.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <section className="px-6 pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-mono font-bold text-2xl">Τελευταία άρθρα</h2>
              <Link
                href="/articles"
                className="text-sm text-brand-teal hover:text-brand-teal-light transition-colors font-mono"
              >
                Όλα →
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {recentArticles.map((article) => {
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
                      <span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-mono font-semibold ${cat.class}`}>
                        {cat.label}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-brand-muted font-mono">
                        <Clock className="w-3 h-3" />
                        {article.readingTime} ανάγνωση
                      </span>
                    </div>
                    <h3 className="font-mono font-bold text-lg mb-2 group-hover:text-brand-teal transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-brand-muted leading-relaxed">
                      {article.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-brand-surface border border-brand-border rounded-xl p-8">
            <h2 className="font-mono font-bold text-xl mb-2">
              Μείνε updated
            </h2>
            <p className="text-brand-muted mb-6">
              Ένα email την εβδομάδα με το καλύτερο AI prompt ή tool.
              Χωρίς spam, χωρίς hype.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="to-email-sou@example.gr"
                className="flex-1 px-4 py-3 bg-brand-dark border border-brand-border rounded-lg text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:border-brand-teal transition-colors"
              />
              <button className="px-6 py-3 bg-brand-teal text-brand-dark font-semibold rounded-lg hover:bg-brand-teal-light transition-colors whitespace-nowrap">
                Εγγραφή
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
