import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "usmc-scarlet": "var(--color-usmc-scarlet)",
        "usmc-scarlet-700": "var(--color-usmc-scarlet-700)",
        "usmc-scarlet-300": "var(--color-usmc-scarlet-300)",
        "marine-blue": "var(--color-marine-blue)",
        "marine-blue-700": "var(--color-marine-blue-700)",
        "marine-blue-300": "var(--color-marine-blue-300)",
        "marine-blue-100": "var(--color-marine-blue-100)",
        parchment: "var(--color-parchment)",
        "parchment-700": "var(--color-parchment-700)",
        "parchment-300": "var(--color-parchment-300)",
        brass: "var(--color-brass)",
        "brass-700": "var(--color-brass-700)",
        "brass-300": "var(--color-brass-300)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        card: "var(--color-card)",
        border: "var(--color-border)",
        "border-strong": "var(--color-border-strong)",
        muted: "var(--color-muted)",
        "muted-foreground": "var(--color-muted-foreground)",
        "subtle-foreground": "var(--color-subtle-foreground)",
        surface: "var(--color-surface)",
        "surface-2": "var(--color-surface-2)",
        "surface-3": "var(--color-surface-3)",
        primary: "var(--color-primary)",
        "primary-foreground": "var(--color-primary-foreground)",
        accent: "var(--color-accent)",
        "accent-foreground": "var(--color-accent-foreground)",
        ring: "var(--color-ring)",
        "status-fresh": "var(--color-status-fresh)",
        "status-aging": "var(--color-status-aging)",
        "status-stale": "var(--color-status-stale)",
        "status-info": "var(--color-status-info)"
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-mono)"
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        card: "var(--radius-card)",
        button: "var(--radius-button)",
        chip: "var(--radius-chip)"
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        card: "var(--shadow-card)",
        "card-strong": "var(--shadow-card-strong)"
      },
      spacing: {
        "topbar": "var(--topbar-h)",
        "tree": "var(--tree-w)",
        "toc": "var(--toc-w)"
      }
    }
  },
  plugins: []
};

export default config;
