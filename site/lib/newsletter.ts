import { createHmac, timingSafeEqual } from "crypto";

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

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Αρκετά αυστηρό ώστε να κόβει το "a@" — όχι πλήρες RFC 5322. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email) && email.length <= 254;
}

export function unsubscribeToken(email: string): string {
  return createHmac("sha256", signingSecret())
    .update(normalizeEmail(email))
    .digest("hex")
    .slice(0, 32);
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = Buffer.from(unsubscribeToken(email));
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

export function unsubscribeUrl(email: string): string {
  const params = new URLSearchParams({
    email: normalizeEmail(email),
    token: unsubscribeToken(email),
  });
  return `${siteUrl()}/api/unsubscribe?${params.toString()}`;
}
