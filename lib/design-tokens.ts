export const colors = {
  bg: "#F4EFE6",
  surface: "#FFFFFF",
  surfaceAlt: "#CFC6B8",
  text: "#101010",
  textSoft: "rgba(16, 16, 16, 0.72)",
  muted: "#8A8175",
  accent: "#B58A3C",
  accentHover: "#9A7532",
  olive: "#3B4A39",
  sea: "#6B8F9C",
  onImage: "#F4EFE6",
  border: "rgba(59, 74, 57, 0.14)",
  shadow: "rgba(59, 74, 57, 0.1)",
} as const;

export const fonts = {
  serif: "var(--font-serif)",
  sans: "var(--font-sans)",
} as const;

export const spacing = {
  xs: "8px",
  sm: "16px",
  md: "24px",
  lg: "40px",
  xl: "64px",
  "2xl": "96px",
  "3xl": "140px",
} as const;

export const layout = {
  maxWidth: "1200px",
} as const;

export const animation = {
  ease: [0.22, 1, 0.36, 1] as const,
  fadeIn: { duration: 1, ease: [0.22, 1, 0.36, 1] as const },
  pageEnter: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  pageExit: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  scrollReveal: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const },
  hover: { scale: 1.02, duration: 0.45 },
} as const;
