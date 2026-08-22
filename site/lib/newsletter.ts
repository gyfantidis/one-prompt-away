import { createHmac, timingSafeEqual } from "crypto";
import type { Locale } from "@/lib/i18n";

/**
 * Το link απεγγραφής υπογράφεται, ώστε να μη μπορεί ο καθένας να
 * διαγράψει ξένο email αλλάζοντας το query string.
 *
 * Το κλειδί είναι το NEWSLETTER_SECRET· αν δεν οριστεί, πέφτει στο
 * RESEND_API_KEY που ούτως ή άλλως υπάρχει και δεν φεύγει ποτέ από
 * τον server — έτσι δεν χρειάζεται νέα ρύθμιση για να δουλέψει.
 */
function signingSecret(): string {
  const secret = process.env.NEWSLETTER_SECRET || process.env.RESEND_API_KEY;
  if (!secret) {
    throw new Error("Λείπει NEWSLETTER_SECRET / RESEND_API_KEY");
  }
  return secret;
}

/**
 * Κάθε γλώσσα έχει δική της λίστα στο Resend, ώστε τη Δευτέρα να φεύγει
 * το ελληνικό άρθρο στους Έλληνες και το αγγλικό στους Άγγλους.
 */
export function audienceIdFor(locale: Locale): string | undefined {
  return locale === "en"
    ? process.env.RESEND_AUDIENCE_ENGLISH_ID
    : process.env.RESEND_AUDIENCE_ID;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Αρκετά αυστηρό ώστε να κόβει το "a@" — όχι πλήρες RFC 5322. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email) && email.length <= 254;
}

export function unsubscribeToken(email: string, locale: Locale): string {
  return createHmac("sha256", signingSecret())
    .update(`${normalizeEmail(email)}|${locale}`)
    .digest("hex")
    .slice(0, 32);
}

export function verifyUnsubscribeToken(
  email: string,
  locale: Locale,
  token: string
): boolean {
  const expected = Buffer.from(unsubscribeToken(email, locale));
  const given = Buffer.from(token ?? "");
  // Σύγκριση σταθερού χρόνου — αλλιώς διαρρέει πληροφορία μέσω timing.
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/**
 * Προτιμά το SITE_URL: τα NEXT_PUBLIC_* ενσωματώνονται τη στιγμή του
 * build, οπότε σε Docker/Coolify θα έπρεπε να περαστούν ως build arg.
 * Το SITE_URL διαβάζεται κανονικά σε runtime από τα env του container.
 */
export function siteUrl(): string {
  const url =
    process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://oneprompt.gr";
  return url.replace(/\/$/, "");
}

export function unsubscribeUrl(email: string, locale: Locale): string {
  const params = new URLSearchParams({
    email: normalizeEmail(email),
    locale,
    token: unsubscribeToken(email, locale),
  });
  return `${siteUrl()}/api/unsubscribe?${params.toString()}`;
}
