import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "One Prompt Away — Ένα prompt σε χωρίζει",
    template: "%s | One Prompt Away",
  },
  description:
    "Ανακάλυψε τα AI tools και prompts που θα αλλάξουν τον τρόπο που δουλεύεις. Πρακτικοί οδηγοί στα Ελληνικά.",
  metadataBase: new URL("https://onepromptaway.gr"),
  openGraph: {
    type: "website",
    locale: "el_GR",
    url: "https://onepromptaway.gr",
    siteName: "One Prompt Away",
    title: "One Prompt Away — Ένα prompt σε χωρίζει",
    description:
      "Ανακάλυψε τα AI tools και prompts που θα αλλάξουν τον τρόπο που δουλεύεις.",
  },
  twitter: {
    card: "summary_large_image",
    title: "One Prompt Away",
    description:
      "AI tools & prompts στα Ελληνικά. Ένα prompt σε χωρίζει.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
