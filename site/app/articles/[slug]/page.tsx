import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import { notFound } from "next/navigation";

const articlesDir = path.join(process.cwd(), "content", "articles");

export async function generateStaticParams() {
  if (!fs.existsSync(articlesDir)) return [];
  return fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => ({ slug: f.replace(".mdx", "") }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const filePath = path.join(articlesDir, `${params.slug}.mdx`);
  if (!fs.existsSync(filePath)) return {};
  const { data } = matter(fs.readFileSync(filePath, "utf-8"));
  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      type: "article",
      publishedTime: data.date,
      tags: data.tags,
    },
  };
}

const categoryLabels: Record<string, { label: string; class: string }> = {
  "prompt-lab": { label: "Prompt Lab", class: "badge-prompt-lab" },
  "tool-drop": { label: "Tool Drop", class: "badge-tool-drop" },
  "behind-the-prompt": { label: "Behind the Prompt", class: "badge-behind-the-prompt" },
};

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const filePath = path.join(articlesDir, `${params.slug}.mdx`);

  if (!fs.existsSync(filePath)) notFound();

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(fileContent);
  const cat = categoryLabels[data.category] || {
    label: data.category,
    class: "badge-prompt-lab",
  };

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
            href="/articles"
            className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Όλα τα άρθρα
          </Link>
        </div>
      </nav>

      <article className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-mono font-semibold mb-4 ${cat.class}`}>
              {cat.label}
            </span>
            <h1 className="font-mono font-bold text-3xl md:text-4xl leading-tight mb-4">
              {data.title}
            </h1>
            <p className="text-brand-muted text-lg mb-6">{data.description}</p>
            <div className="flex flex-wrap items-center gap-5 text-sm text-brand-muted font-mono">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(data.date).toLocaleDateString("el-GR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {data.readingTime}
              </span>
              {data.tags && (
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  {data.tags.join(", ")}
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-brand-border mb-10" />

          {/* MDX Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <MDXRemote source={content} />
          </div>

          {/* Footer CTA */}
          <div className="mt-16 bg-brand-surface border border-brand-border rounded-xl p-8">
            <p className="font-mono text-sm text-brand-teal mb-2">
              Σου άρεσε αυτό;
            </p>
            <p className="text-brand-muted mb-4">
              Κάθε εβδομάδα δημοσιεύω νέο content για AI tools και prompts.
              Follow στο TikTok ή εγγράψου στο newsletter.
            </p>
            <div className="flex gap-3">
              <a
                href="https://tiktok.com/@onepromptaway"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-brand-teal text-brand-dark font-semibold text-sm rounded-lg hover:bg-brand-teal-light transition-colors"
              >
                TikTok
              </a>
              <a
                href="https://instagram.com/onepromptaway"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-brand-border text-brand-text text-sm rounded-lg hover:border-brand-muted transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
