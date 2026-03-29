import { Composition } from "remotion";
import { OPAVideo } from "./OPAVideo";
import { PromptLabVideo } from "./templates/PromptLabVideo";
import { ToolDropVideo } from "./templates/ToolDropVideo";

// 60 seconds at 30fps = 1800 frames
// TikTok/Reels: 1080x1920 (9:16)

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main dynamic video — reads props from CLI */}
      <Composition
        id="OPAVideo"
        component={OPAVideo}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
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
