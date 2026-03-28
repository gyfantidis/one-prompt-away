import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Sequence,
} from "remotion";
import { BRAND } from "./theme";

// Fade in from bottom
export const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
}> = ({ children, delay = 0, duration = 20, direction = "up" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 100, mass: 0.5 },
  });

  const offsets = {
    up: { x: 0, y: 40 },
    down: { x: 0, y: -40 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  const offset = offsets[direction];

  return (
    <div
      style={{
        opacity: progress,
        transform: `translate(${offset.x * (1 - progress)}px, ${offset.y * (1 - progress)}px)`,
      }}
    >
      {children}
    </div>
  );
};

// Typewriter effect
export const TypeWriter: React.FC<{
  text: string;
  startFrame: number;
  speed?: number;
  style?: React.CSSProperties;
}> = ({ text, startFrame, speed = 2, style }) => {
  const frame = useCurrentFrame();
  const charsToShow = Math.floor((frame - startFrame) / speed);
  const displayText = frame >= startFrame ? text.slice(0, Math.max(0, charsToShow)) : "";
  const showCursor = frame >= startFrame && charsToShow <= text.length;

  return (
    <div style={{ fontFamily: BRAND.fonts.mono, ...style }}>
      {displayText}
      {showCursor && (
        <span
          style={{
            display: "inline-block",
            width: 3,
            height: "1em",
            backgroundColor: BRAND.colors.teal,
            marginLeft: 2,
            opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
          }}
        />
      )}
    </div>
  );
};

// Brand watermark (bottom of every video)
export const BrandWatermark: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: BRAND.fonts.mono,
          fontSize: 28,
          color: BRAND.colors.muted,
        }}
      >
        <span style={{ color: BRAND.colors.muted }}>{">"} </span>
        One<span style={{ color: BRAND.colors.teal }}>Prompt</span>Away
      </div>
    </div>
  );
};

// Category badge
export const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const color = BRAND.categoryColors[category] || BRAND.colors.teal;
  const label = BRAND.categoryLabels[category] || category.toUpperCase();

  return (
    <div
      style={{
        display: "inline-flex",
        padding: "8px 20px",
        borderRadius: 8,
        backgroundColor: `${color}20`,
        border: `2px solid ${color}50`,
        fontFamily: BRAND.fonts.mono,
        fontSize: 24,
        fontWeight: 700,
        color: color,
        letterSpacing: 2,
      }}
    >
      {label}
    </div>
  );
};

// Terminal window
export const TerminalWindow: React.FC<{
  children: React.ReactNode;
  title?: string;
}> = ({ children, title = "terminal" }) => {
  return (
    <div
      style={{
        backgroundColor: BRAND.colors.surface,
        border: `2px solid ${BRAND.colors.border}`,
        borderRadius: 16,
        overflow: "hidden",
        margin: "0 40px",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 20px",
          borderBottom: `1px solid ${BRAND.colors.border}`,
        }}
      >
        <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#EF444480" }} />
        <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#EAB30880" }} />
        <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#22C55E80" }} />
        <span
          style={{
            marginLeft: 10,
            fontFamily: BRAND.fonts.mono,
            fontSize: 18,
            color: BRAND.colors.muted,
          }}
        >
          {title}
        </span>
      </div>
      {/* Content */}
      <div style={{ padding: "24px 28px" }}>{children}</div>
    </div>
  );
};

// Pulse dot (for "live" indicators)
export const PulseDot: React.FC<{ color?: string }> = ({
  color = BRAND.colors.teal,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.8, 1.2]);

  return (
    <div
      style={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: color,
        transform: `scale(${scale})`,
      }}
    />
  );
};
