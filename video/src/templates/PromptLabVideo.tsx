import React from "react";
import { Sequence } from "remotion";
import { BRAND, TIMING } from "../theme";
import {
  FadeIn,
  TypeWriter,
  BrandWatermark,
  CategoryBadge,
  TerminalWindow,
} from "../components";

interface PromptLabVideoProps {
  title: string;
  problem: string;
  prompt: string;
  result: string;
}

export const PromptLabVideo: React.FC<PromptLabVideoProps> = ({
  title,
  problem,
  prompt,
  result,
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
            linear-gradient(${BRAND.colors.teal}08 1px, transparent 1px),
            linear-gradient(90deg, ${BRAND.colors.teal}08 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Hook: Problem statement */}
      <Sequence from={0} durationInFrames={120}>
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
            <CategoryBadge category="prompt-lab" />
          </FadeIn>
          <FadeIn delay={15}>
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
              {problem}
            </div>
          </FadeIn>
        </div>
      </Sequence>

      {/* Body: Show prompt in terminal */}
      <Sequence from={120} durationInFrames={1200}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 40,
          }}
        >
          <FadeIn delay={5}>
            <div
              style={{
                fontFamily: BRAND.fonts.mono,
                fontSize: 36,
                fontWeight: 700,
                color: BRAND.colors.teal,
                textAlign: "center",
                padding: "0 60px",
              }}
            >
              {title}
            </div>
          </FadeIn>

          <FadeIn delay={30}>
            <TerminalWindow title="prompt">
              <TypeWriter
                text={`> ${prompt}`}
                startFrame={50}
                speed={2}
                style={{
                  fontSize: 30,
                  color: BRAND.colors.text,
                  lineHeight: 1.6,
                }}
              />
            </TerminalWindow>
          </FadeIn>

          <FadeIn delay={250}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                padding: "20px 60px",
              }}
            >
              <div
                style={{
                  padding: "16px 32px",
                  borderRadius: 12,
                  backgroundColor: `${BRAND.colors.teal}15`,
                  border: `2px solid ${BRAND.colors.teal}40`,
                }}
              >
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 700,
                    color: BRAND.colors.teal,
                    fontFamily: BRAND.fonts.mono,
                    textAlign: "center",
                  }}
                >
                  {result}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </Sequence>

      {/* CTA */}
      <Sequence from={1320} durationInFrames={480}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 30,
          }}
        >
          <FadeIn delay={5}>
            <div
              style={{
                fontFamily: BRAND.fonts.mono,
                fontSize: 44,
                fontWeight: 700,
                color: BRAND.colors.text,
                textAlign: "center",
              }}
            >
              Follow για prompts!
            </div>
          </FadeIn>
          <FadeIn delay={20}>
            <div
              style={{
                padding: "14px 36px",
                borderRadius: 10,
                backgroundColor: BRAND.colors.teal,
                fontFamily: BRAND.fonts.mono,
                fontSize: 30,
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
