import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import { getTranslations, isValidLocale, defaultLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import "../globals.css";

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

export async function generateStaticParams() {
  return [{ locale: "el" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const t = getTranslations(locale);

  return {
    title: {
      default: t.meta.title,
      template: "%s | One Prompt Away",
    },
    description: t.meta.description,
    metadataBase: new URL("https://oneprompt.gr"),
    icons: { icon: "/logo-icon.png" },
    openGraph: {
      type: "website",
      locale: t.meta.locale,
      url: "https://oneprompt.gr",
      siteName: "One Prompt Away",
      title: t.meta.ogTitle,
      description: t.meta.ogDesc,
    },
    twitter: {
      card: "summary_large_image",
      title: "One Prompt Away",
      description: t.meta.twitterDesc,
    },
    robots: { index: true, follow: true },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased min-h-screen flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
