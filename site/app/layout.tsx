import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "greek"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

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
    <html lang="el" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
