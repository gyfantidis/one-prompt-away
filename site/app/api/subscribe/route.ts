import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import {
  audienceIdFor,
  isValidEmail,
  normalizeEmail,
  unsubscribeUrl,
} from "@/lib/newsletter";
import { welcomeHtml, welcomeSubject } from "@/lib/emails";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { isValidLocale, defaultLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const resend = new Resend(process.env.RESEND_API_KEY);

/** Το Resend επιστρέφει σφάλμα ήδη-υπάρχουσας επαφής· δεν είναι αποτυχία. */
function isAlreadySubscribed(error: { name?: string; message?: string }): boolean {
  const text = `${error.name ?? ""} ${error.message ?? ""}`.toLowerCase();
  return text.includes("already exists") || text.includes("already_exists");
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("Subscribe: λείπει RESEND_API_KEY");
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    const limit = rateLimit(clientIp(request));
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const body = await request.json().catch(() => null);
    const email = normalizeEmail(String(body?.email ?? ""));

    // Η γλώσσα έρχεται από τη φόρμα· ό,τι άλλο σταλεί αγνοείται.
    const requested = String(body?.locale ?? "");
    const locale: Locale = isValidLocale(requested) ? requested : defaultLocale;

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const audienceId = audienceIdFor(locale);
    if (!audienceId) {
      console.error(`Subscribe: λείπει το audience id για locale "${locale}"`);
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    // ΠΡΟΣΟΧΗ: το Resend SDK ΔΕΝ πετάει exception σε σφάλμα API — επιστρέφει
    // { data: null, error }. Χωρίς αυτόν τον έλεγχο το endpoint γύριζε 200
    // ακόμη κι όταν η εγγραφή αποτύγχανε, και ο χρήστης έβλεπε «Εγγράφηκες!».
    const contact = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });

    if (contact.error && !isAlreadySubscribed(contact.error)) {
      console.error("Subscribe: contacts.create απέτυχε:", contact.error);
      return NextResponse.json({ error: "Subscription failed" }, { status: 502 });
    }

    const unsubscribe = unsubscribeUrl(email, locale);

    const welcome = await resend.emails.send({
      from: "Giannis @ One Prompt Away <hello@oneprompt.gr>",
      to: email,
      subject: welcomeSubject(locale),
      // Gmail/Yahoo απαιτούν List-Unsubscribe από bulk senders· χωρίς
      // αυτό τα emails καταλήγουν στα spam.
      headers: {
        "List-Unsubscribe": `<${unsubscribe}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
      html: welcomeHtml(locale, unsubscribe),
    });

    if (welcome.error) {
      // Η επαφή μπήκε — δεν το θεωρούμε αποτυχία εγγραφής.
      console.error("Subscribe: welcome email απέτυχε:", welcome.error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
