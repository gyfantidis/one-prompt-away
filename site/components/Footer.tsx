export default function Footer() {
  return (
    <footer className="border-t border-brand-border px-6 py-10">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-mono text-sm text-brand-muted">
          <span className="text-brand-muted">&gt; </span>
          One<span className="text-brand-teal">Prompt</span>Away
          <span className="ml-2 text-brand-muted/50">© 2026</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-brand-muted">
          <a
            href="https://tiktok.com/@onepromptaway"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-text transition-colors"
          >
            TikTok
          </a>
          <a
            href="https://instagram.com/onepromptaway"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-text transition-colors"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
