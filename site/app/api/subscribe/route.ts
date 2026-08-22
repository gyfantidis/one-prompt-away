import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { isValidEmail, normalizeEmail, unsubscribeUrl } from "@/lib/newsletter";
import { clientIp, rateLimit } from "@/lib/rateLimit";

const resend = new Resend(process.env.RESEND_API_KEY);

/** Το Resend επιστρέφει σφάλμα ήδη-υπάρχουσας επαφής· δεν είναι αποτυχία. */
function isAlreadySubscribed(error: { name?: string; message?: string }): boolean {
  const text = `${error.name ?? ""} ${error.message ?? ""}`.toLowerCase();
  return text.includes("already exists") || text.includes("already_exists");
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
      console.error("Subscribe: λείπει RESEND_API_KEY ή RESEND_AUDIENCE_ID");
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

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // ΠΡΟΣΟΧΗ: το Resend SDK ΔΕΝ πετάει exception σε σφάλμα API — επιστρέφει
    // { data: null, error }. Χωρίς αυτόν τον έλεγχο το endpoint γύριζε 200
    // ακόμη κι όταν η εγγραφή αποτύγχανε, και ο χρήστης έβλεπε «Εγγράφηκες!».
    const contact = await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID,
      unsubscribed: false,
    });

    if (contact.error && !isAlreadySubscribed(contact.error)) {
      console.error("Subscribe: contacts.create απέτυχε:", contact.error);
      return NextResponse.json({ error: "Subscription failed" }, { status: 502 });
    }

    const unsubscribe = unsubscribeUrl(email);

    const welcome = await resend.emails.send({
      from: "Giannis @ One Prompt Away <hello@oneprompt.gr>",
      to: email,
      subject: "Καλώς ήρθες στο One Prompt Away 👋",
      // Gmail/Yahoo απαιτούν List-Unsubscribe από bulk senders· χωρίς
      // αυτό τα emails καταλήγουν στα spam.
      headers: {
        "List-Unsubscribe": `<${unsubscribe}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
      html: welcomeHtml(unsubscribe),
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

function welcomeHtml(unsubscribe: string): string {
  return `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1117; color: #E6EDF3; padding: 40px 32px; border-radius: 12px;">
      <h1 style="font-family: monospace; color: #2DD4BF; font-size: 24px; margin-bottom: 8px;">One Prompt Away</h1>
      <p style="color: #8B949E; margin-bottom: 32px;">oneprompt.gr</p>

      <p style="font-size: 16px; line-height: 1.6;">Γεια σου!</p>
      <p style="font-size: 16px; line-height: 1.6;">Χαρούμενος που είσαι εδώ. Κάθε εβδομάδα θα παίρνεις ένα email με το καλύτερο AI prompt ή tool — χωρίς spam, χωρίς hype.</p>

      <div style="background: #161B22; border: 1px solid #30363D; border-radius: 8px; padding: 20px; margin: 32px 0;">
        <p style="margin: 0; font-family: monospace; color: #2DD4BF; font-size: 14px;">$ next_issue</p>
        <p style="margin: 8px 0 0; color: #E6EDF3; font-size: 15px;">Το επόμενο article έρχεται σύντομα.</p>
      </div>

      <p style="font-size: 16px; line-height: 1.6;">Μέχρι τότε, δες τα άρθρα που έχουν ήδη δημοσιευτεί:</p>
      <a href="https://oneprompt.gr/el/articles" style="display: inline-block; background: #2DD4BF; color: #0D1117; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 8px;">Δες τα άρθρα →</a>

      <p style="margin-top: 48px; font-size: 14px; color: #8B949E;">Giannis<br>One Prompt Away</p>
      <p style="font-size: 12px; color: #8B949E; margin-top: 32px;">
        Έλαβες αυτό το email γιατί εγγράφτηκες στο oneprompt.gr.<br>
        <a href="${unsubscribe}" style="color: #8B949E;">Απεγγραφή</a>
      </p>
    </div>
  `;
}
