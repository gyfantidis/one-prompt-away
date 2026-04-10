import { Zap, Wrench, Brain } from "lucide-react";

export const pillars = [
  {
    slug: "prompt-lab",
    name: "Prompt Lab",
    icon: Zap,
    color: "text-brand-teal",
    bg: "bg-brand-teal/10",
    border: "border-brand-teal/30",
  },
  {
    slug: "tool-drop",
    name: "Tool Drop",
    icon: Wrench,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
  },
  {
    slug: "behind-the-prompt",
    name: "Behind the Prompt",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/30",
  },
] as const;

export type PillarSlug = (typeof pillars)[number]["slug"];
