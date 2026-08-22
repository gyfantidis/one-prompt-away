import type { Locale } from "@/lib/i18n";

const BRAND = {
  wrapper:
    "font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1117; color: #E6EDF3; padding: 40px 32px; border-radius: 12px;",
  h1: "font-family: monospace; color: #2DD4BF; font-size: 24px; margin-bottom: 8px;",
  body: "font-size: 16px; line-height: 1.6;",
  box: "background: #161B22; border: 1px solid #30363D; border-radius: 8px; padding: 20px; margin: 32px 0;",
  cta: "display: inline-block; background: #2DD4BF; color: #0D1117; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 8px;",
  footer: "font-size: 12px; color: #8B949E; margin-top: 32px;",
};

const COPY = {
  el: {
    subject: "Καλώς ήρθες στο One Prompt Away 👋",
    hello: "Γεια σου!",
    intro:
      "Χαρούμενος που είσαι εδώ. Κάθε εβδομάδα θα παίρνεις ένα email με το καλύτερο AI prompt ή tool — χωρίς spam, χωρίς hype.",
    boxTitle: "$ next_issue",
    boxText: "Το επόμενο article έρχεται σύντομα.",
    meanwhile: "Μέχρι τότε, δες τα άρθρα που έχουν ήδη δημοσιευτεί:",
    cta: "Δες τα άρθρα →",
    reason: "Έλαβες αυτό το email γιατί εγγράφτηκες στο oneprompt.gr.",
    unsubscribe: "Απεγγραφή",
  },
  en: {
    subject: "Welcome to One Prompt Away 👋",
    hello: "Hi there!",
    intro:
      "Glad you're here. Every week you'll get one email with the best AI prompt or tool — no spam, no hype.",
    boxTitle: "$ next_issue",
    boxText: "The next article is coming soon.",
    meanwhile: "In the meantime, here's what's already published:",
    cta: "Read the articles →",
    reason: "You received this email because you subscribed at oneprompt.gr.",
    unsubscribe: "Unsubscribe",
  },
} as const;

export function welcomeSubject(locale: Locale): string {
  return COPY[locale].subject;
}

export function welcomeHtml(locale: Locale, unsubscribe: string): string {
  const t = COPY[locale];
  return `
    <div style="${BRAND.wrapper}">
      <h1 style="${BRAND.h1}">One Prompt Away</h1>
      <p style="color: #8B949E; margin-bottom: 32px;">oneprompt.gr</p>

      <p style="${BRAND.body}">${t.hello}</p>
      <p style="${BRAND.body}">${t.intro}</p>

      <div style="${BRAND.box}">
        <p style="margin: 0; font-family: monospace; color: #2DD4BF; font-size: 14px;">${t.boxTitle}</p>
        <p style="margin: 8px 0 0; color: #E6EDF3; font-size: 15px;">${t.boxText}</p>
      </div>

      <p style="${BRAND.body}">${t.meanwhile}</p>
      <a href="https://oneprompt.gr/${locale}/articles" style="${BRAND.cta}">${t.cta}</a>

      <p style="margin-top: 48px; font-size: 14px; color: #8B949E;">Giannis<br>One Prompt Away</p>
      <p style="${BRAND.footer}">
        ${t.reason}<br>
        <a href="${unsubscribe}" style="color: #8B949E;">${t.unsubscribe}</a>
      </p>
    </div>
  `;
}

export const UNSUBSCRIBE_PAGE = {
  el: {
    done: { title: "Απεγγράφηκες", body: "Δεν θα λαμβάνεις άλλα email. Αν αλλάξεις γνώμη, μπορείς να ξαναγραφτείς όποτε θες." },
    badLink: { title: "Μη έγκυρος σύνδεσμος", body: "Ο σύνδεσμος απεγγραφής δεν είναι έγκυρος. Χρησιμοποίησε αυτόν από το τελευταίο email." },
    error: { title: "Κάτι πήγε στραβά", body: "Δεν μπορέσαμε να ολοκληρώσουμε την απεγγραφή. Δοκίμασε ξανά αργότερα." },
    back: "Επιστροφή στο site",
  },
  en: {
    done: { title: "You're unsubscribed", body: "You won't receive any more emails. If you change your mind, you can subscribe again anytime." },
    badLink: { title: "Invalid link", body: "This unsubscribe link isn't valid. Please use the one from your most recent email." },
    error: { title: "Something went wrong", body: "We couldn't complete your unsubscribe. Please try again later." },
    back: "Back to the site",
  },
} as const;
