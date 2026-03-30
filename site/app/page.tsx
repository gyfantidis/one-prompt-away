import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";
import { pillars } from "@/lib/pillars";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full text-xs font-mono bg-brand-amber/10 text-brand-amber border border-brand-amber/30">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-pulse" />
            Νέο brand — Σύντομα περισσότερο content
          </div>

          <h1 className="font-mono font-bold text-4xl md:text-5xl leading-tight mb-6">
            Ένα{" "}
            <span className="text-brand-teal">prompt</span>{" "}
            σε χωρίζει.
          </h1>

          <p className="text-lg text-brand-muted max-w-xl mb-10 leading-relaxed">
            Πρακτικοί οδηγοί για AI tools και prompts στα Ελληνικά.
            Κάθε εβδομάδα, ένα πρόβλημα — μία AI λύση.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-teal text-brand-dark font-semibold rounded-lg hover:bg-brand-teal-light transition-colors"
            >
              Δες τα άρθρα
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#pillars"
              className="inline-flex items-center gap-2 px-6 py-3 border border-brand-border text-brand-text rounded-lg hover:border-brand-muted transition-colors"
            >
              Τι είναι αυτό;
            </a>
          </div>
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
                onepromptaway.gr
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
                <span className="text-green-400">✓</span> Meal plan
                generated in 28s
              </p>
              <p className="text-brand-muted">
                <span className="text-green-400">✓</span> Shopping list:
                23 items, estimated €47.50
              </p>
              <span className="inline-block w-2 h-4 bg-brand-teal mt-2 cursor-blink" />
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
              <div
                key={pillar.slug}
                className={`p-5 rounded-xl border ${pillar.border} ${pillar.bg} hover:scale-[1.02] transition-transform`}
              >
                <pillar.icon className={`w-6 h-6 ${pillar.color} mb-3`} />
                <h3 className={`font-mono font-bold text-sm mb-2 ${pillar.color}`}>
                  {pillar.name}
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed">
                  {pillar.shortDescription}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
