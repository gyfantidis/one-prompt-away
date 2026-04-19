import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      unsubscribed: false,
    });

    await resend.emails.send({
      from: "Giannis @ One Prompt Away <hello@oneprompt.gr>",
      to: email,
      subject: "Καλώς ήρθες στο One Prompt Away 👋",
      html: `
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
          <p style="font-size: 12px; color: #30363D; margin-top: 32px;">Έλαβες αυτό το email γιατί εγγράφτηκες στο oneprompt.gr</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
