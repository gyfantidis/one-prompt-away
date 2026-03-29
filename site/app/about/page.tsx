import Link from "next/link";
import { ArrowLeft, Zap, Wrench, Brain } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Σχετικά",
  description:
    "Τι είναι το One Prompt Away, ποιος το φτιάχνει και γιατί. Πρακτικοί οδηγοί για AI tools και prompts στα ελληνικά.",
};

const pillars = [
  {
    name: "Prompt Lab",
    description:
      "Πραγματικά προβλήματα, πραγματικές λύσεις. Κάθε άρθρο έχει prompt που μπορείς να κάνεις copy-paste αμέσως.",
    icon: Zap,
    color: "text-brand-teal",
    bg: "bg-brand-teal/10",
    border: "border-brand-teal/30",
  },
  {
    name: "Tool Drop",
    description:
      "Δοκιμάζω AI tools και σου λέω αν αξίζει ο χρόνος σου. Χωρίς hype, χωρίς affiliate links.",
    icon: Wrench,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
  },
  {
    name: "Behind the Prompt",
    description:
      "Πώς δουλεύει το prompting στ' αλήθεια. Mental models και τεχνικές που κάνουν τη διαφορά.",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/30",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-brand-dark/80 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-mono font-bold text-lg">
            <span className="text-brand-muted">&gt; </span>
            <span className="text-brand-text">One</span>
            <span className="text-brand-teal">Prompt</span>
            <span className="text-brand-text">Away</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Αρχική
          </Link>
        </div>
      </nav>

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-12">
            <p className="font-mono text-brand-teal text-sm mb-3">
              &gt; whoami
            </p>
            <h1 className="font-mono font-bold text-3xl md:text-4xl mb-6">
              Σχετικά με το{" "}
              <span className="text-brand-teal">One Prompt Away</span>
            </h1>
            <p className="text-brand-muted text-lg leading-relaxed">
              Ένα ελληνικό blog για όσους θέλουν να χρησιμοποιούν τα AI tools
              σωστά — όχι θεωρητικά, αλλά στην πράξη.
            </p>
          </div>

          {/* About text */}
          <div className="bg-brand-surface border border-brand-border rounded-xl p-8 mb-8 space-y-4">
            <p className="text-brand-text leading-relaxed">
              Βρίσκομαι στα AI tools κάθε μέρα — δοκιμάζω, σπάω πράγματα,
              βρίσκω τι δουλεύει. Το One Prompt Away είναι ο τρόπος μου να
              μοιράζομαι αυτά που μαθαίνω, στα ελληνικά, χωρίς υπερβολές.
            </p>
            <p className="text-brand-text leading-relaxed">
              Δεν χρειάζεται να είσαι developer για να βγάλεις αποτέλεσμα από
              το ChatGPT, το Claude ή οποιοδήποτε AI tool. Χρειάζεσαι τον
              σωστό τρόπο να ρωτάς. Αυτό ακριβώς διδάσκει κάθε άρθρο εδώ.
            </p>
            <p className="text-brand-text leading-relaxed">
              Κάθε post έχει κάτι που μπορείς να χρησιμοποιήσεις σήμερα —
              prompt, workflow, ή ιδέα. Όχι θεωρία για το μέλλον του AI.
            </p>
          </div>

          {/* Pillars */}
          <h2 className="font-mono font-bold text-xl mb-5">
            Τι θα βρεις εδώ
          </h2>
          <div className="flex flex-col gap-4 mb-12">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.name}
                  className={`flex gap-4 p-5 rounded-xl border ${pillar.bg} ${pillar.border}`}
                >
                  <div className={`mt-0.5 ${pillar.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`font-mono font-semibold text-sm mb-1 ${pillar.color}`}>
                      {pillar.name}
                    </p>
                    <p className="text-brand-muted text-sm leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact / Social */}
          <div className="bg-brand-surface border border-brand-border rounded-xl p-8">
            <h2 className="font-mono font-bold text-lg mb-2">
              Βρες με εδώ
            </h2>
            <p className="text-brand-muted text-sm mb-6">
              Δημοσιεύω νέο content κάθε εβδομάδα. Follow για να μην χάνεις
              τίποτα.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://tiktok.com/@onepromptaway"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-brand-teal text-brand-dark font-semibold text-sm rounded-lg hover:bg-brand-teal-light transition-colors font-mono"
              >
                TikTok
              </a>
              <a
                href="https://instagram.com/onepromptaway"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-brand-border text-brand-text text-sm rounded-lg hover:border-brand-muted transition-colors font-mono"
              >
                Instagram
              </a>
              <Link
                href="/articles"
                className="px-4 py-2 border border-brand-border text-brand-text text-sm rounded-lg hover:border-brand-muted transition-colors font-mono"
              >
                Άρθρα
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
