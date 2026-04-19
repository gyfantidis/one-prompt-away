"use client";

import { useState } from "react";

interface Props {
  placeholder: string;
  buttonText: string;
  successText: string;
  errorText: string;
}

export default function NewsletterForm({ placeholder, buttonText, successText, errorText }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-brand-teal font-semibold py-3">{successText}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        required
        disabled={status === "loading"}
        className="flex-1 px-4 py-3 bg-brand-dark border border-brand-border rounded-lg text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:border-brand-teal transition-colors disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3 bg-brand-teal text-brand-dark font-semibold rounded-lg hover:bg-brand-teal-light transition-colors whitespace-nowrap disabled:opacity-50"
      >
        {status === "loading" ? "..." : buttonText}
      </button>
      {status === "error" && (
        <p className="text-red-400 text-sm mt-1 sm:col-span-2">{errorText}</p>
      )}
    </form>
  );
}
