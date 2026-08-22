/**
 * Απλό rate limit ανά IP, σε μνήμη.
 *
 * Το site τρέχει σε ένα μόνιμο container (Docker/Coolify), οπότε ο
 * μετρητής είναι αξιόπιστος: μία διεργασία, μία μνήμη, χωρίς cold starts.
 *
 * ΠΕΡΙΟΡΙΣΜΟΣ: αν κάποτε τρέξουν πολλαπλά replicas, καθένα θα κρατά δικό
 * του μετρητή και το πραγματικό όριο πολλαπλασιάζεται. Τότε αντικατάστησε
 * μόνο αυτό το αρχείο με Redis — η υπόλοιπη λογική δεν αλλάζει.
 */
const WINDOW_MS = 60 * 60 * 1000; // 1 ώρα
const MAX_REQUESTS = 5;
const MAX_TRACKED_IPS = 10_000;

const hits = new Map<string, number[]>();

export function rateLimit(key: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - recent[0])) / 1000);
    hits.set(key, recent);
    return { ok: false, retryAfter };
  }

  recent.push(now);
  hits.set(key, recent);

  // Φραγμός μνήμης: πετάμε την παλαιότερη εγγραφή αν ξεφύγει ο χάρτης.
  if (hits.size > MAX_TRACKED_IPS) {
    const oldest = hits.keys().next().value;
    if (oldest !== undefined) hits.delete(oldest);
  }

  return { ok: true, retryAfter: 0 };
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}
