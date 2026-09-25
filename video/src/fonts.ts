/**
 * Φόρτωση γραμματοσειρών για το render.
 *
 * ΠΡΟΣΟΧΗ: χωρίς αυτό το αρχείο, ο headless Chrome που κάνει το render
 * δεν έχει JetBrains Mono ούτε Inter και πέφτει σιωπηλά στις default
 * του συστήματος. Τα βίντεο μέχρι τον Μάρτιο 2026 βγήκαν έτσι.
 *
 * Το "greek" subset είναι υποχρεωτικό — αλλιώς λείπουν τόνοι και
 * ελληνικοί χαρακτήρες.
 */
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";

const mono = loadMono("normal", {
  subsets: ["greek", "latin"],
  weights: ["400", "500", "700"],
});

const sans = loadSans("normal", {
  subsets: ["greek", "latin"],
  weights: ["400", "500", "600", "700"],
});

/** Τα πραγματικά ονόματα που επιστρέφει το Remotion μετά τη φόρτωση. */
export const FONT_FAMILY = {
  mono: `${mono.fontFamily}, "Fira Code", monospace`,
  sans: `${sans.fontFamily}, system-ui, sans-serif`,
} as const;

/** Το render δεν πρέπει να ξεκινά πριν κατέβουν οι γραμματοσειρές. */
export const fontsReady = Promise.all([mono.waitUntilDone(), sans.waitUntilDone()]);
