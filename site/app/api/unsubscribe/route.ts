import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { audienceIdFor, normalizeEmail, verifyUnsubscribeToken } from "@/lib/newsletter";
import { UNSUBSCRIBE_PAGE } from "@/lib/emails";
import { isValidLocale, defaultLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const resend = new Resend(process.env.RESEND_API_KEY);

function page(locale: Locale, kind: "done" | "badLink" | "error"): NextResponse {
  const copy = UNSUBSCRIBE_PAGE[locale];
  const { title, body } = copy[kind];
  const ok = kind === "done";
  const accent = ok ? "#2DD4BF" : "#F87171";

  return new NextResponse(
    `<!doctype html>
<html lang="${locale}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} — One Prompt Away</title></head>
<body style="margin:0;background:#0D1117;color:#E6EDF3;font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px">
  <div style="max-width:460px">
    <p style="font-family:ui-monospace,monospace;color:${accent};font-size:14px;margin:0 0 12px">&gt; One<span style="color:#2DD4BF">Prompt</span>Away</p>
    <h1 style="font-family:ui-monospace,monospace;font-size:24px;margin:0 0 12px">${title}</h1>
    <p style="color:#8B949E;line-height:1.6;margin:0 0 28px">${body}</p>
    <a href="https://oneprompt.gr/${locale}" style="display:inline-block;background:#2DD4BF;color:#0D1117;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none">${copy.back}</a>
  </div>
</body></html>`,
    { status: ok ? 200 : 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

async function unsubscribe(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") ?? "";
  const raw = searchParams.get("locale") ?? "";
  const locale: Locale = isValidLocale(raw) ? raw : defaultLocale;
  const token = searchParams.get("token") ?? "";

  if (!process.env.RESEND_API_KEY) {
    console.error("Unsubscribe: λείπει RESEND_API_KEY");
    return page(locale, "error");
  }

  // Το token υπογράφει email + γλώσσα, ώστε να μη γίνεται πείραγμα του URL.
  if (!email || !verifyUnsubscribeToken(email, locale, token)) {
    return page(locale, "badLink");
  }

  const audienceId = audienceIdFor(locale);
  if (!audienceId) {
    console.error(`Unsubscribe: λείπει το audience id για locale "${locale}"`);
    return page(locale, "error");
  }

  const result = await resend.contacts.update({
    email: normalizeEmail(email),
    audienceId,
    unsubscribed: true,
  });

  if (result.error) {
    console.error("Unsubscribe απέτυχε:", result.error);
    return page(locale, "error");
  }

  return page(locale, "done");
}

/** Το κλικ στον σύνδεσμο μέσα στο email. */
export async function GET(request: NextRequest) {
  return unsubscribe(request);
}

/** One-click unsubscribe: Gmail/Yahoo κάνουν POST στο List-Unsubscribe. */
export async function POST(request: NextRequest) {
  return unsubscribe(request);
}
