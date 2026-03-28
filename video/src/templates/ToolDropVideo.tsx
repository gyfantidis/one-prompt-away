import React from "react";
import { useCurrentFrame, Sequence, interpolate, spring, useVideoConfig } from "remotion";
import { BRAND } from "../theme";
import { FadeIn, BrandWatermark, CategoryBadge } from "../components";

interface ToolDropVideoProps {
  toolName: string;
  tagline: string;
  features: string[];
  verdict: string;
}

export const ToolDropVideo: React.FC<ToolDropVideoProps> = ({
  toolName,
  tagline,
  features,
  verdict,
}) => {
  return (
    <div
      style={{
        flex: 1,
        width: 1080,
        height: 1920,
        backgroundColor: BRAND.colors.dark,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${BRAND.colors.blue}08 1px, transparent 1px),
            linear-gradient(90deg, ${BRAND.colors.blue}08 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Hook: Tool name reveal */}
      <Sequence from={0} durationInFrames={120}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 60px",
            gap: 24,
          }}
        >
          <FadeIn delay={5}>
            <CategoryBadge category="tool-drop" />
          </FadeIn>
          <FadeIn delay={15}>
            <div
              style={{
                fontFamily: BRAND.fonts.mono,
                fontSize: 56,
                fontWeight: 700,
                color: BRAND.colors.text,
                textAlign: "center",
              }}
            >
              {toolName}
            </div>
          </FadeIn>
          <FadeIn delay={30}>
            <div
              style={{
                fontSize: 32,
                color: BRAND.colors.muted,
                textAlign: "center",
              }}
            >
              {tagline}
            </div>
          </FadeIn>
        </div>
      </Sequence>

      {/* Body: Features list */}
      <Sequence from={120} durationInFrames={1200}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 60px",
            gap: 36,
          }}
        >
          <FadeIn delay={5}>
            <div
              style={{
                fontFamily: BRAND.fonts.mono,
                fontSize: 32,
                fontWeight: 700,
                color: BRAND.colors.blue,
                marginBottom: 10,
              }}
            >
              Τι κάνει;
            </div>
          </FadeIn>

          {features.map((feature, i) => (
            <FadeIn key={i} delay={i * 80 + 30}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "20px 28px",
                  backgroundColor: `${BRAND.colors.blue}10`,
                  border: `1px solid ${BRAND.colors.blue}25`,
                  borderRadius: 14,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: `${BRAND.colors.blue}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: BRAND.fonts.mono,
                    fontSize: 22,
                    fontWeight: 700,
                    color: BRAND.colors.blue,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    fontSize: 32,
                    color: BRAND.colors.text,
                    lineHeight: 1.3,
                  }}
                >
                  {feature}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Sequence>

      {/* CTA: Verdict */}
      <Sequence from={1320} durationInFrames={480}>
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
            <div
              style={{
                fontFamily: BRAND.fonts.mono,
                fontSize: 30,
                color: BRAND.colors.muted,
              }}
            >
              Verdict
            </div>
          </FadeIn>
          <FadeIn delay={15}>
            <div
              style={{
                fontFamily: BRAND.fonts.mono,
                fontSize: 44,
                fontWeight: 700,
                color: BRAND.colors.text,
                textAlign: "center",
              }}
            >
              {verdict}
            </div>
          </FadeIn>
          <FadeIn delay={30}>
            <div
              style={{
                padding: "14px 36px",
                borderRadius: 10,
                backgroundColor: BRAND.colors.blue,
                fontFamily: BRAND.fonts.mono,
                fontSize: 28,
                fontWeight: 700,
                color: BRAND.colors.dark,
              }}
            >
              @onepromptaway
            </div>
          </FadeIn>
        </div>
      </Sequence>

      <BrandWatermark />
    </div>
  );
};
