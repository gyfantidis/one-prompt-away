// Brand colors and styles for all video compositions

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
  fonts: {
    mono: "'JetBrains Mono', 'Fira Code', monospace",
    sans: "'Inter', system-ui, sans-serif",
  },
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
