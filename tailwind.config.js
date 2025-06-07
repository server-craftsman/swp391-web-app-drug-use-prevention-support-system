/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
      colors: {
        primary: {
          DEFAULT: "#0056b3",
          50: "#e6f0f9",
          100: "#cce0f3",
          200: "#99c2e6",
          300: "#66a3da",
          400: "#3385cd",
          500: "#0056b3",
          600: "#00458f",
          700: "#00346b",
          800: "#002248",
          900: "#001124",
        },
        secondary: {
          DEFAULT: "#153759",
          50: "#e6eaef",
          100: "#ccd5df",
          200: "#99abBF",
          300: "#66829f",
          400: "#33587f",
          500: "#153759",
          600: "#112c47",
          700: "#0d2135",
          800: "#091623",
          900: "#040b12",
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b",
        },
        accent: {
          DEFAULT: "#f59e0b",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
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