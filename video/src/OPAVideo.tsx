import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { BRAND, TIMING } from "./theme";
import {
  FadeIn,
  TypeWriter,
  BrandWatermark,
  CategoryBadge,
  TerminalWindow,
} from "./components";

interface OPAVideoProps {
  hook: string;
  steps: string[];
  prompt: string;
  result: string;
  cta: string;
  category: "prompt-lab" | "tool-drop" | "behind-the-prompt";
  brandTag: string;
}

export const OPAVideo: React.FC<OPAVideoProps> = ({
  hook,
  steps,
  prompt,
  result,
  cta,
  category,
  brandTag,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const catColor = BRAND.categoryColors[category] || BRAND.colors.teal;

  return (
    <div
      style={{
        flex: 1,
        width,
        height,
        backgroundColor: BRAND.colors.dark,
        display: "flex",
        flexDirection: "column",
        fontFamily: BRAND.fonts.sans,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${catColor}08 1px, transparent 1px),
            linear-gradient(90deg, ${catColor}08 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orb */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -150,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${catColor}15, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      {/* ===== SECTION 1: HOOK (0-3s) ===== */}
      <Sequence from={TIMING.hookStart} durationInFrames={TIMING.hookEnd}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 60px",
            gap: 30,
          }}
        >
          <FadeIn delay={5}>
            <CategoryBadge category={category} />
          </FadeIn>
          <FadeIn delay={15}>
            <div
              style={{
                fontFamily: BRAND.fonts.mono,
                fontSize: 52,
                fontWeight: 700,
                color: BRAND.colors.text,
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              {hook}
            </div>
          </FadeIn>
        </div>
      </Sequence>

      {/* ===== SECTION 2: BODY — Steps + Prompt (3-48s) ===== */}
      <Sequence from={TIMING.bodyStart} durationInFrames={TIMING.bodyEnd - TIMING.bodyStart}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 40px",
            gap: 40,
          }}
        >
          {/* Steps */}
          {steps.map((step, i) => (
            <FadeIn key={i} delay={i * 60 + 10}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "0 20px",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: `${catColor}20`,
                    border: `2px solid ${catColor}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: BRAND.fonts.mono,
                    fontSize: 24,
                    fontWeight: 700,
                    color: catColor,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    fontSize: 36,
                    color: BRAND.colors.text,
                    lineHeight: 1.4,
                  }}
                >
                  {step}
                </div>
              </div>
            </FadeIn>
          ))}

          {/* Terminal with prompt */}
          <FadeIn delay={steps.length * 60 + 40}>
            <TerminalWindow title="prompt">
              <TypeWriter
                text={`> ${prompt}`}
                startFrame={steps.length * 60 + 60}
                speed={1}
                style={{
                  fontSize: 28,
                  color: BRAND.colors.text,
                  lineHeight: 1.6,
                }}
              />
            </TerminalWindow>
          </FadeIn>

          {/* Result */}
          <FadeIn delay={steps.length * 60 + 200}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "0 60px",
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  color: "#4ADE80",
                  fontFamily: BRAND.fonts.mono,
                }}
              >
                ✓
              </div>
              <div
                style={{
                  fontSize: 34,
                  color: BRAND.colors.text,
                  fontWeight: 600,
                }}
              >
                {result}
              </div>
            </div>
          </FadeIn>
        </div>
      </Sequence>

      {/* ===== SECTION 3: CTA (48-60s) ===== */}
      <Sequence from={TIMING.ctaStart} durationInFrames={TIMING.ctaEnd - TIMING.ctaStart}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 60px",
            gap: 40,
          }}
        >
          <FadeIn delay={5}>
            <div
              style={{
                fontFamily: BRAND.fonts.mono,
                fontSize: 48,
                fontWeight: 700,
                color: BRAND.colors.text,
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              {cta}
            </div>
          </FadeIn>
          <FadeIn delay={20}>
            <div
              style={{
                padding: "16px 40px",
                borderRadius: 12,
                backgroundColor: catColor,
                fontFamily: BRAND.fonts.mono,
                fontSize: 32,
                fontWeight: 700,
                color: BRAND.colors.dark,
              }}
            >
              {brandTag}
            </div>
          </FadeIn>
        </div>
      </Sequence>

      {/* Persistent watermark */}
      <BrandWatermark />
    </div>
  );
};
