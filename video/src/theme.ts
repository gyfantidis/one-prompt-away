// Brand colors and styles for all video compositions
import { FONT_FAMILY } from "./fonts";

export const BRAND = {
  colors: {
    dark: "#0D1117",
    surface: "#161B22",
    card: "#21262D",
    border: "#30363D",
    teal: "#2DD4BF",
    tealDark: "#14B8A6",
    tealLight: "#5EEAD4",
    amber: "#F59E0B",
    amberDark: "#D97706",
    text: "#E6EDF3",
    muted: "#8B949E",
    blue: "#60A5FA",
    purple: "#C084FC",
  },
  // Έρχονται από το fonts.ts, που τις φορτώνει πραγματικά. Τα ονόματα
  // τα δίνει το Remotion μετά τη φόρτωση — δεν τα γράφουμε με το χέρι.
  fonts: FONT_FAMILY,
  categoryColors: {
    "prompt-lab": "#2DD4BF",
    "tool-drop": "#60A5FA",
    "behind-the-prompt": "#C084FC",
  } as Record<string, string>,
  categoryLabels: {
    "prompt-lab": "PROMPT LAB",
    "tool-drop": "TOOL DROP",
    "behind-the-prompt": "BEHIND THE PROMPT",
  } as Record<string, string>,
} as const;

// Animation timing helpers (in frames at 30fps)
export const TIMING = {
  fps: 30,
  hookStart: 0,
  hookEnd: 90, // 3 seconds
  bodyStart: 90,
  bodyEnd: 1440, // 48 seconds
  ctaStart: 1440,
  ctaEnd: 1800, // 60 seconds
  fadeIn: 15, // 0.5s
  fadeOut: 10,
  typeSpeed: 2, // frames per character
} as const;

// ── Χρονισμός βάσει περιεχομένου ────────────────────────────────
//
// Πριν: το TIMING παραπάνω ήταν σταθερό — 60 δευτερόλεπτα ό,τι κι αν
// έγραφε το βίντεο. Με τρία βήματα, όλη η πληροφορία είχε εμφανιστεί
// γύρω στο 13ο δευτερόλεπτο και η εικόνα έμενε ακίνητη για 31.
//
// Τώρα κάθε κομμάτι παίρνει χρόνο ανάλογο με το πόσο κείμενο έχει,
// μέσα σε λογικά όρια. Το βίντεο τελειώνει όταν τελειώνει το νόημα.

export interface VideoContent {
  hook: string;
  steps: string[];
  prompt: string;
  result: string;
  cta: string;
  subscribeCta?: string;
  subscribeNote?: string;
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

export function computeTiming(content: VideoContent, fps: number) {
  const sec = (s: number) => Math.round(s * fps);

  // Ο hook θέλει χρόνο να διαβαστεί, αλλά ποτέ πάνω από 3.6" —
  // μετά από αυτό ο θεατής έχει ήδη αποφασίσει αν μένει.
  const hookDur = sec(clamp(1.2 + content.hook.length / 18, 2.2, 3.6));

  // Τα βήματα συσσωρεύονται στην οθόνη· ο χρόνος είναι η απόσταση
  // ανάμεσα στις εμφανίσεις, όχι πόσο μένει το καθένα.
  const stepDurs = content.steps.map((s) =>
    sec(clamp(0.7 + s.length / 30, 1.2, 2.4))
  );
  const stepsTotal = stepDurs.reduce((a, b) => a + b, 0);

  // Οι θέσεις εκκίνησης κάθε βήματος, σχετικά με την αρχή του body.
  const stepDelays: number[] = [];
  let acc = 0;
  for (const d of stepDurs) {
    stepDelays.push(acc);
    acc += d;
  }

  // Καρέ ανά χαρακτήρα στο typing. Μακρύ prompt γράφεται πιο γρήγορα,
  // αλλιώς το βίντεο το τρώει ολόκληρο.
  const typeSpeed = content.prompt.length > 200 ? 0.5 : 1;
  const promptIn = sec(0.4);
  const typingDur = Math.ceil(content.prompt.length * typeSpeed);
  const promptHold = sec(1.3);
  const promptDur = promptIn + typingDur + promptHold;

  const resultDur = sec(2);
  // Η τελική κάρτα έχει τώρα τρία πράγματα να διαβάσει κανείς:
  // το μήνυμα, το κουμπί εγγραφής και τη σημείωση από κάτω.
  const ctaChars =
    content.cta.length +
    (content.subscribeCta?.length ?? 0) +
    (content.subscribeNote?.length ?? 0);
  const ctaDur = sec(clamp(1.6 + ctaChars / 20, 3.2, 5));

  const bodyDur = stepsTotal + promptDur + resultDur;

  return {
    fps,
    hookStart: 0,
    hookDur,
    bodyStart: hookDur,
    bodyDur,
    stepDelays,
    promptDelay: stepsTotal,
    typeStart: stepsTotal + promptIn,
    typeSpeed,
    resultDelay: stepsTotal + promptDur,
    ctaStart: hookDur + bodyDur,
    ctaDur,
    total: hookDur + bodyDur + ctaDur,
  };
}
