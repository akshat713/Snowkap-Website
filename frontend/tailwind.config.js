/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      // Inter in every role — one brand typeface. The display / body / label
      // distinction is now carried by size, weight, case and tracking rather
      // than by three separate families.
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["Inter", "system-ui", "sans-serif"],
      },
      // Only 400 / 500 / 700 are loaded, so the scale is folded onto those three.
      // Without this, `font-semibold` (600) and `font-extrabold` (800) would ask
      // for weights that do not exist and the browser would synthesise them —
      // faux-bold smears the stems and is exactly what makes self-hosted Inter
      // look worse than the linked version it replaced.
      fontWeight: {
        thin: "400",
        extralight: "400",
        light: "400",
        normal: "400",
        medium: "500",
        semibold: "500",
        bold: "700",
        extrabold: "700",
        black: "700",
      },
      colors: {
        // Brand palette. The percentages are delivered structurally: `bg` is the
        // page and most sections (Clarity white, ~55%), `surface` carries the
        // alternating bands and cards (Signal off-white, ~20%), `signal` is
        // reserved for accents and calls to action (Now Orange, ~15%), and `ink`
        // covers type plus the few deliberately dark blocks (Dark grey, ~10%).
        bg: "#FFFFFF",
        surface: "#FFF4E0",
        surface2: "#F6E8CE",
        ink: "#222222",
        signal: {
          DEFAULT: "#DF5900",
          hover: "#B44700",
        },
        terracotta: "#c8481e",
        warning: "#B26A00",
        // Neutrals biased warm so they sit with the off-white rather than
        // fighting it — a cool grey next to #FFF4E0 reads as a mistake.
        ink3: "#8A8177",
        ink2: "#5B554D",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "rgba(34,34,34,0.12)",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
