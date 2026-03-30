import { Zap, Wrench, Brain } from "lucide-react";

export const pillars = [
  {
    name: "Prompt Lab",
    slug: "prompt-lab",
    shortDescription: "Πρόβλημα → prompt λύση. Πρακτικό, copy-paste ready.",
    longDescription:
      "Πραγματικά προβλήματα, πραγματικές λύσεις. Κάθε άρθρο έχει prompt που μπορείς να κάνεις copy-paste αμέσως.",
    icon: Zap,
    color: "text-brand-teal",
    bg: "bg-brand-teal/10",
    border: "border-brand-teal/30",
  },
  {
    name: "Tool Drop",
    slug: "tool-drop",
    shortDescription: "AI tool reviews. Quick, opinionated, hands-on.",
    longDescription:
      "Δοκιμάζω AI tools και σου λέω αν αξίζει ο χρόνος σου. Χωρίς hype, χωρίς affiliate links.",
    icon: Wrench,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
  },
  {
    name: "Behind the Prompt",
    slug: "behind-the-prompt",
    shortDescription: "Deep dives σε prompting techniques και mental models.",
    longDescription:
      "Πώς δουλεύει το prompting στ' αλήθεια. Mental models και τεχνικές που κάνουν τη διαφορά.",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/30",
  },
];
