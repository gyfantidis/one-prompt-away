import { Composition } from "remotion";
import { computeTiming } from "./theme";
import type { VideoContent } from "./theme";
import { OPAVideo } from "./OPAVideo";
import { PromptLabVideo } from "./templates/PromptLabVideo";
import { ToolDropVideo } from "./templates/ToolDropVideo";

// TikTok/Reels: 1080x1920 (9:16) στα 30fps.
//
// Η διάρκεια ΔΕΝ είναι πια σταθερή. Το calculateMetadata τρέχει πριν
// το render και τη βγάζει από το ίδιο το κείμενο, με την ίδια
// συνάρτηση που χρησιμοποιεί και το component — ώστε να μη γίνεται
// ποτέ το βίντεο μακρύτερο από όσο κρατάει το νόημά του.

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main dynamic video — reads props from CLI */}
      <Composition
        id="OPAVideo"
        component={OPAVideo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeTiming(props as unknown as VideoContent, 30).total,
        })}
        defaultProps={{
          hook: "Ξέρεις πόσο χρόνο χάνεις γράφοντας emails;",
          steps: [
            "Άνοιξε το ChatGPT ή Claude",
            "Κάνε paste αυτό το prompt",
            "Πάρε ένα τέλειο email σε 10 δευτερόλεπτα",
          ],
          prompt:
            'Γράψε ένα professional email στα Ελληνικά που ζητάει παράταση deadline. Tone: polite but firm.',
          result: "Email ready σε 8 δευτερόλεπτα. Copy-paste και στείλε.",
          cta: "Follow για περισσότερα AI prompts!",
          category: "prompt-lab" as const,
          brandTag: "@onepromptaway",
        }}
      />

      {/* Template: Prompt Lab (problem → solution) */}
      <Composition
        id="PromptLab"
        component={PromptLabVideo}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: "Meal plan σε 30 δευτερόλεπτα",
          problem: "Κάθε Κυριακή βράδυ: τι θα μαγειρέψω;",
          prompt: "Φτιάξε μου εβδομαδιαίο meal plan...",
          result: "5 ημέρες, 23 items, €47.50",
        }}
      />

      {/* Template: Tool Drop (tool showcase) */}
      <Composition
        id="ToolDrop"
        component={ToolDropVideo}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          toolName: "Claude Code",
          tagline: "Ο AI pair programmer",
          features: ["Terminal integration", "Auto-fix errors", "Full codebase context"],
          verdict: "9/10 — Must have για developers",
        }}
      />
    </>
  );
};
