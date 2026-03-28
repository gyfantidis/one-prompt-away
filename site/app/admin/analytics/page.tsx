/**
 * Analytics Dashboard — /admin/analytics
 * 
 * Shows content performance metrics.
 * In production, connect to real analytics (Plausible, Umami, or GA4).
 * For now, reads from a local analytics.json file.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { ArrowLeft, BarChart3, TrendingUp, Eye, Clock } from "lucide-react";

interface ArticleStat {
  slug: string;
  title: string;
  category: string;
  date: string;
  views: number;
  tiktokViews: number;
  igReelViews: number;
  readingTime: string;
}

function getArticleStats(): ArticleStat[] {
  const articlesDir = path.join(process.cwd(), "..", "content", "articles");
  if (!fs.existsSync(articlesDir)) return [];

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".mdx"));

  // In production: fetch from analytics API (Plausible, Umami, GA4)
  // For now: generate placeholder stats
  return files.map((file, i) => {
    const content = fs.readFileSync(path.join(articlesDir, file), "utf-8");
    const { data } = matter(content);
    return {
      slug: file.replace(".mdx", ""),
      title: data.title || file,
      category: data.category || "prompt-lab",
      date: data.date || "2026-01-01",
      views: Math.floor(Math.random() * 500) + 50,
      tiktokViews: Math.floor(Math.random() * 5000) + 200,
      igReelViews: Math.floor(Math.random() * 3000) + 100,
      readingTime: data.readingTime || "3 λεπτά",
    };
  }).sort((a, b) => b.views - a.views);
}

const categoryColors: Record<string, string> = {
  "prompt-lab": "text-[#2DD4BF]",
  "tool-drop": "text-blue-400",
  "behind-the-prompt": "text-purple-400",
};

export default function AnalyticsPage() {
  const stats = getArticleStats();
  const totalViews = stats.reduce((s, a) => s + a.views, 0);
  const totalTikTok = stats.reduce((s, a) => s + a.tiktokViews, 0);
  const totalIG = stats.reduce((s, a) => s + a.igReelViews, 0);

  return (
    <main className="min-h-screen bg-brand-dark">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-brand-dark/80 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-mono font-bold text-lg">
            <span className="text-brand-muted">&gt; </span>
            <span className="text-brand-text">One</span>
            <span className="text-brand-teal">Prompt</span>
            <span className="text-brand-text">Away</span>
            <span className="text-brand-amber ml-2 text-sm">admin</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Site
          </Link>
        </div>
      </nav>

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-mono font-bold text-2xl mb-8 flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-brand-teal" />
            Analytics Dashboard
          </h1>

          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-brand-surface border border-brand-border rounded-xl p-5">
              <div className="text-sm text-brand-muted mb-1 font-mono">Articles</div>
              <div className="text-2xl font-bold text-brand-text">{stats.length}</div>
            </div>
            <div className="bg-brand-surface border border-brand-border rounded-xl p-5">
              <div className="text-sm text-brand-muted mb-1 font-mono flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Site views
              </div>
              <div className="text-2xl font-bold text-brand-teal">{totalViews.toLocaleString()}</div>
            </div>
            <div className="bg-brand-surface border border-brand-border rounded-xl p-5">
              <div className="text-sm text-brand-muted mb-1 font-mono">TikTok views</div>
              <div className="text-2xl font-bold text-brand-text">{totalTikTok.toLocaleString()}</div>
            </div>
            <div className="bg-brand-surface border border-brand-border rounded-xl p-5">
              <div className="text-sm text-brand-muted mb-1 font-mono">IG Reels views</div>
              <div className="text-2xl font-bold text-brand-text">{totalIG.toLocaleString()}</div>
            </div>
          </div>

          {/* Content performance table */}
          <h2 className="font-mono font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-amber" />
            Content performance
          </h2>

          <div className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border">
                    <th className="text-left p-4 font-mono text-xs text-brand-muted font-semibold">Article</th>
                    <th className="text-right p-4 font-mono text-xs text-brand-muted font-semibold">Site</th>
                    <th className="text-right p-4 font-mono text-xs text-brand-muted font-semibold">TikTok</th>
                    <th className="text-right p-4 font-mono text-xs text-brand-muted font-semibold">IG</th>
                    <th className="text-right p-4 font-mono text-xs text-brand-muted font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((article, i) => (
                    <tr
                      key={article.slug}
                      className="border-b border-brand-border/50 hover:bg-brand-card/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-brand-text font-medium">
                            {article.title}
                          </span>
                          <span className={`text-xs font-mono ${categoryColors[article.category] || "text-brand-muted"}`}>
                            {article.category}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-sm text-brand-muted">
                        {article.views}
                      </td>
                      <td className="p-4 text-right font-mono text-sm text-brand-muted">
                        {article.tiktokViews.toLocaleString()}
                      </td>
                      <td className="p-4 text-right font-mono text-sm text-brand-muted">
                        {article.igReelViews.toLocaleString()}
                      </td>
                      <td className="p-4 text-right font-mono text-sm text-brand-text font-semibold">
                        {(article.views + article.tiktokViews + article.igReelViews).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            <Link
              href="#"
              className="bg-brand-surface border border-brand-border rounded-xl p-5 hover:border-brand-teal/50 transition-colors group"
            >
              <div className="font-mono text-sm text-brand-teal font-semibold mb-2 group-hover:text-brand-teal-light">
                Generate next article
              </div>
              <div className="text-xs text-brand-muted">
                Τρέξε το pipeline για το επόμενο topic στο queue
              </div>
            </Link>
            <Link
              href="#"
              className="bg-brand-surface border border-brand-border rounded-xl p-5 hover:border-brand-amber/50 transition-colors group"
            >
              <div className="font-mono text-sm text-brand-amber font-semibold mb-2 group-hover:text-brand-amber-light">
                Content queue
              </div>
              <div className="text-xs text-brand-muted">
                {/* In production: read from content-queue.json */}
                7 topics pending
              </div>
            </Link>
            <Link
              href="#"
              className="bg-brand-surface border border-brand-border rounded-xl p-5 hover:border-purple-400/50 transition-colors group"
            >
              <div className="font-mono text-sm text-purple-400 font-semibold mb-2">
                Suggest topics
              </div>
              <div className="text-xs text-brand-muted">
                AI-powered topic suggestions based on trends
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
