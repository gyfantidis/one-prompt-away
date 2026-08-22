"use client";

import { useState, isValidElement, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  children?: ReactNode;
  copyLabel: string;
  copiedLabel: string;
}

/**
 * Βγάζει το καθαρό κείμενο από το δέντρο του MDX.
 * Το <pre> δέχεται ένα <code> element, όχι σκέτο string.
 */
function extractText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    return extractText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

/** Βρίσκει τη γλώσσα από το className του <code> (π.χ. "language-prompt"). */
function extractLanguage(node: ReactNode): string | null {
  if (!isValidElement(node)) return null;
  const className = (node.props as { className?: string }).className ?? "";
  const match = className.match(/language-(\w+)/);
  return match ? match[1] : null;
}

export default function CodeBlock({
  children,
  copyLabel,
  copiedLabel,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const code = extractText(children);
  const language = extractLanguage(children);
  const isPrompt = language === "prompt";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Το clipboard API θέλει https ή localhost — σε http απλά δεν κάνουμε τίποτα.
    }
  }

  return (
    <div className="group/code relative my-6">
      {/* Ταμπέλα γλώσσας */}
      {language && (
        <span className="absolute left-4 top-3 font-mono text-[11px] uppercase tracking-wider text-brand-muted/60">
          {language}
        </span>
      )}

      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? copiedLabel : copyLabel}
        className="absolute right-3 top-2.5 z-10 inline-flex items-center gap-1.5 rounded-md border border-brand-border bg-brand-dark/80 px-2.5 py-1.5 font-mono text-xs text-brand-muted backdrop-blur transition-all hover:border-brand-teal/50 hover:text-brand-teal focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/60 md:opacity-0 md:group-hover/code:opacity-100"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-brand-teal" />
            {copiedLabel}
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            {copyLabel}
          </>
        )}
      </button>

      <pre
        className={`overflow-x-auto rounded-xl border bg-brand-surface px-5 pb-5 pt-10 font-mono text-sm leading-relaxed text-brand-text ${
          isPrompt
            ? "border-brand-teal/30 border-l-[3px] border-l-brand-teal"
            : "border-brand-border"
        }`}
      >
        {children}
      </pre>
    </div>
  );
}
