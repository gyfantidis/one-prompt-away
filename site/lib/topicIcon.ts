import {
  AlertTriangle, AudioLines, Ban, BookOpen, Braces, Brain, Briefcase,
  ClipboardList, Cpu, FileText, Globe, GraduationCap, Image as ImageIcon,
  Languages, Layers, Link2, Linkedin, Mail, MessageSquare, MessagesSquare,
  Mic, Palette, PenLine, Presentation, RefreshCw, Search, Share2, Sparkles,
  ShoppingCart, Table, Terminal, UtensilsCrossed, Video, Wand2, Workflow,
  Wrench, Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Διαλέγει εικονίδιο για κάθε άρθρο με βάση το θέμα του.
 *
 * Ψάχνει λέξεις-κλειδιά μέσα σε τίτλο + tags μαζί. Δεν βασίζεται στη
 * ΜΟΡΦΗ των tags: το μοντέλο τα γράφει ελεύθερα ("few-shotprompting",
 * "ChatGPTtips", "AIτεχνικές"), οπότε κάθε αντιστοίχιση γίνεται με
 * substring σε πεζά και χωρίς τόνους.
 *
 * Η σειρά μετράει — το πρώτο που ταιριάζει κερδίζει, άρα οι πιο
 * ειδικοί όροι μπαίνουν πριν τους γενικούς.
 */
interface Rule {
  icon: LucideIcon;
  keywords: string[];
  /**
   * Γενικοί όροι (ονόματα μοντέλων) που εμφανίζονται σε πολλά άρθρα.
   * Εξετάζονται ΜΟΝΟ αν δεν ταίριαξε κανένας ειδικός κανόνας.
   */
  generic?: boolean;
}

const RULES: Rule[] = [
  // Εργαλεία & πλατφόρμες
  { icon: Sparkles, keywords: ["gemini"] },
  { icon: Linkedin, keywords: ["linkedin"] },
  { icon: Mail, keywords: ["email", "cold email", "newsletter"] },
  { icon: Mic, keywords: ["whisper", "elevenlabs", "ηχογραφησ", "φωνη μου", "voice"] },
  { icon: AudioLines, keywords: ["suno", "μουσικη", "τραγουδι"] },
  { icon: ImageIcon, keywords: ["midjourney", "flux", "dall-e", "εικονες", "φωτογραφ"] },
  { icon: Video, keywords: ["tiktok", "reel", "runway", "heygen", "βιντεο"] },
  { icon: Presentation, keywords: ["gamma", "slides", "παρουσιαση"] },
  { icon: Palette, keywords: ["canva", "brand identity", "ui design", "design tools"] },
  { icon: Search, keywords: ["perplexity", "ai search", "αναζητηση", "deep research"] },
  { icon: BookOpen, keywords: ["notebooklm", "pdf", "σελιδες", "εγγραφα"] },
  { icon: Cpu, keywords: ["ollama", "lm studio", "τοπικα", "offline", "laptop μου"] },
  { icon: Globe, keywords: ["website", "ιστοσελιδα", "landing page", "site με ai"] },
  { icon: Terminal, keywords: ["cursor", "copilot", "claude code", "v0 by vercel", "vercel", "coding", "developer", "programmer"] },

  // Χρήσεις
  { icon: UtensilsCrossed, keywords: ["meal plan", "διατροφη", "συνταγες"] },
  { icon: FileText, keywords: ["cv", "βιογραφικο", "resume"] },
  { icon: GraduationCap, keywords: ["εξετασεις", "φοιτητ", "πτυχιακη", "study hacks", "εργασια σε"] },
  { icon: MessagesSquare, keywords: ["interview", "συνεντευξη"] },
  { icon: Briefcase, keywords: ["business plan", "startup", "επενδυτ"] },
  { icon: ShoppingCart, keywords: ["e-shop", "προϊοντων", "product description"] },
  { icon: ClipboardList, keywords: ["meeting notes", "action items", "συσκεψ"] },
  { icon: Table, keywords: ["excel", "spreadsheet", "formulas", "google sheets"] },
  { icon: Braces, keywords: ["json", "structured output", "πινακα η json"] },
  { icon: Share2, keywords: ["instagram", "social media", "social post"] },
  { icon: PenLine, keywords: ["blog post", "content creation", "κειμενο", "blogging"] },
  { icon: Workflow, keywords: ["zapier", "automation", "αυτοματοποι", "workflow", "make + ai"] },

  // Τεχνικές prompting
  { icon: Languages, keywords: ["αγγλικα prompts", "ελληνικα η αγγλικα", "μεταφρασ", "γλωσσα"] },
  { icon: Ban, keywords: ["negative prompting", "να μην κανει"] },
  { icon: Link2, keywords: ["prompt chaining", "chain-of-thought", "chain of thought", "αλυσιδ"] },
  { icon: AlertTriangle, keywords: ["hallucin", "ψεματα", "μετριες απαντησεις", "λαθος"] },
  { icon: Layers, keywords: ["context window", "μνημη", "ξεχναει"] },
  { icon: RefreshCw, keywords: ["πρωτο draft", "refine", "loop που"] },
  { icon: Wand2, keywords: ["few-shot", "role prompting", "meta-prompting", "system prompts"] },

  // Μοντέλα — γενικά, μπαίνουν τελευταία
  { icon: MessageSquare, keywords: ["chatgpt"], generic: true },
  { icon: Sparkles, keywords: ["claude"], generic: true },
];

/** Εφεδρικό εικονίδιο ανά κατηγορία — ίδιο με τα pillars. */
const CATEGORY_FALLBACK: Record<string, LucideIcon> = {
  "prompt-lab": Zap,
  "tool-drop": Wrench,
  "behind-the-prompt": Brain,
};

/**
 * Πεζά, χωρίς τόνους, χωρίς σημεία στίξης και κενά.
 *
 * Το τελευταίο είναι σκόπιμο: τα tags γράφονται και κολλητά
 * ("contextwindow", "few-shotprompting"), οπότε ισοπεδώνοντας τα πάντα
 * ταιριάζει το "context window" με το "contextwindow".
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0370-\u03ff]/g, "");
}

export function getTopicIcon(
  title: string,
  tags: string[] | undefined,
  category: string
): LucideIcon {
  const haystack = normalize([title, ...(tags ?? [])].join(" "));

  // Κερδίζει η ΜΑΚΡΥΤΕΡΗ λέξη-κλειδί που ταιριάζει, όχι η πρώτη:
  // με «πρώτη που ταιριάζει», γενικοί όροι όπως "workflow" έκλεβαν
  // άρθρα που ανήκαν σε ειδικότερους όπως "prompt chaining".
  //
  // Τα ονόματα μοντέλων εξετάζονται σε δεύτερο πέρασμα: το "chatgpt"
  // υπάρχει στα tags δεκάδων άρθρων και δεν είναι το θέμα τους.
  const bestIn = (generic: boolean): LucideIcon | null => {
    let icon: LucideIcon | null = null;
    let longest = 0;

    for (const rule of RULES) {
      if (Boolean(rule.generic) !== generic) continue;
      for (const keyword of rule.keywords) {
        const needle = normalize(keyword);
        if (needle.length > longest && haystack.includes(needle)) {
          icon = rule.icon;
          longest = needle.length;
        }
      }
    }
    return icon;
  };

  const best = bestIn(false) ?? bestIn(true);

  return best ?? CATEGORY_FALLBACK[category] ?? Zap;
}
