/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './src/**/*.{ts,tsx}',
    './index.html',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        border: "var(--border-color)",
        input: "var(--border-color)",
        ring: "var(--accent-color)",
        background: "var(--background-primary)",
        foreground: "var(--text-primary)",
        primary: {
          DEFAULT: "var(--accent-color)",
          foreground: "white",
        },
        secondary: {
          DEFAULT: "var(--background-secondary)",
          foreground: "var(--text-primary)",
        },
        destructive: {
          DEFAULT: "var(--error-color)",
          foreground: "white",
        },
        muted: {
          DEFAULT: "var(--background-secondary)",
          foreground: "var(--text-secondary)",
        },
        accent: {
          DEFAULT: "var(--reward-highlight)",
          foreground: "var(--text-primary)",
        },
        popover: {
          DEFAULT: "var(--background-secondary)",
          foreground: "var(--text-primary)",
        },
        card: {
          DEFAULT: "var(--background-secondary)",
          foreground: "var(--text-primary)",
        },
        // PointFlow Brand Colors
        'flow-teal': "var(--flow-teal)",
        'deep-ink': "var(--deep-ink)",
        'snow-white': "var(--snow-white)",
        'cloud-grey': "var(--cloud-grey)",
        'soft-mint': "var(--soft-mint)",
        'success-green': "var(--success-green)",
        'alert-coral': "var(--alert-coral)",
        success: "var(--success-color)",
        reward: "var(--reward-highlight)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}