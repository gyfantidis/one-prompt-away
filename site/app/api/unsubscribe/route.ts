import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { normalizeEmail, verifyUnsubscribeToken } from "@/lib/newsletter";

const resend = new Resend(process.env.RESEND_API_KEY);

function page(title: string, message: string, ok: boolean): NextResponse {
  const accent = ok ? "#2DD4BF" : "#F87171";
  return new NextResponse(
    `<!doctype html>
<html lang="el"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} — One Prompt Away</title></head>
<body style="margin:0;background:#0D1117;color:#E6EDF3;font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px">
  <div style="max-width:460px">
    <p style="font-family:ui-monospace,monospace;color:${accent};font-size:14px;margin:0 0 12px">&gt; One<span style="color:#2DD4BF">Prompt</span>Away</p>
    <h1 style="font-family:ui-monospace,monospace;font-size:24px;margin:0 0 12px">${title}</h1>
    <p style="color:#8B949E;line-height:1.6;margin:0 0 28px">${message}</p>
    <a href="https://oneprompt.gr/el" style="display:inline-block;background:#2DD4BF;color:#0D1117;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none">Επιστροφή στο site</a>
  </div>
</body></html>`,
    { status: ok ? 200 : 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

async function unsubscribe(email: string, token: string): Promise<NextResponse> {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
    console.error("Unsubscribe: λείπει RESEND_API_KEY ή RESEND_AUDIENCE_ID");
    return page("Κάτι πήγε στραβά", "Δοκίμασε ξανά αργότερα ή στείλε μας email.", false);
  }

  if (!email || !verifyUnsubscribeToken(email, token)) {
    return page("Μη έγκυρος σύνδεσμος", "Ο σύνδεσμος απεγγραφής δεν είναι έγκυρος. Χρησιμοποίησε αυτόν από το τελευταίο email.", false);
  }

  const result = await resend.contacts.update({
    email: normalizeEmail(email),
    audienceId: process.env.RESEND_AUDIENCE_ID,
    unsubscribed: true,
  });

  if (result.error) {
    console.error("Unsubscribe απέτυχε:", result.error);
    return page("Κάτι πήγε στραβά", "Δεν μπορέσαμε να ολοκληρώσουμε την απεγγραφή. Δοκίμασε ξανά.", false);
  }

  return page("Απεγγράφηκες", "Δεν θα λαμβάνεις άλλα email. Αν αλλάξεις γνώμη, μπορείς να ξαναγραφτείς όποτε θες.", true);
}

/** Το κλικ στον σύνδεσμο μέσα στο email. */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return unsubscribe(searchParams.get("email") ?? "", searchParams.get("token") ?? "");
}

/** One-click unsubscribe: Gmail/Yahoo κάνουν POST στο List-Unsubscribe. */
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return unsubscribe(searchParams.get("email") ?? "", searchParams.get("token") ?? "");
}
