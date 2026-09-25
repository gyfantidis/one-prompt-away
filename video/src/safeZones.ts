/**
 * Ζώνες ασφαλείας για TikTok και Instagram Reels — καμβάς 1080×1920.
 *
 * Και οι δύο πλατφόρμες ζωγραφίζουν δικό τους UI ΠΑΝΩ στο βίντεο:
 *
 *   ΠΑΝΩ    tabs ("Για σένα" / "Ακολουθώ"), status bar της συσκευής
 *   ΔΕΞΙΑ   η στήλη ενεργειών: avatar, like, σχόλια, κοινοποίηση
 *   ΚΑΤΩ    όνομα χρήστη, λεζάντα, μπάρα μουσικής, tab bar της εφαρμογής
 *
 * Τα νούμερα είναι η ΧΕΙΡΟΤΕΡΗ περίπτωση από τις δύο πλατφόρμες, ώστε
 * το ίδιο αρχείο να δουλεύει και στις δύο. Το TikTok κρατάει πιο πολύ
 * χώρο κάτω, το Instagram λίγο πιο πολύ πάνω.
 *
 * ΠΡΟΣΟΧΗ: είναι προσεγγίσεις. Αλλάζουν ανά συσκευή, ανά έκδοση της
 * εφαρμογής, και με/χωρίς notch. Πριν βασιστείς σε οριακή τοποθέτηση,
 * ανέβασε μία φορά ως ιδιωτικό/draft και δες το στο κινητό σου.
 */
export const SAFE = {
  top: 210,
  bottom: 470,
  left: 60,
  right: 180,
} as const;

export const CANVAS = { width: 1080, height: 1920 } as const;

/** Το ωφέλιμο κουτί μέσα στο οποίο πρέπει να ζει κάθε κείμενο. */
export const SAFE_BOX = {
  x: SAFE.left,
  y: SAFE.top,
  width: CANVAS.width - SAFE.left - SAFE.right,   // 840
  height: CANVAS.height - SAFE.top - SAFE.bottom, // 1240
} as const;

/** Περιοχές που σκεπάζει το UI — μόνο για το debug overlay. */
export const RESERVED = [
  { label: "tabs / status bar", top: 0, left: 0, right: 0, height: SAFE.top },
  { label: "λεζάντα · μουσική · tab bar", bottom: 0, left: 0, right: 0, height: SAFE.bottom },
  { label: "like\nσχόλια\nshare", top: SAFE.top, right: 0, width: SAFE.right, bottom: SAFE.bottom },
] as const;
