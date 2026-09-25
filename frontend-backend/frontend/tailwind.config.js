/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#171717",
          700: "#3F3F3F",
          500: "#737373",
          200: "#E5E5E5",
          100: "#F5F5F4",
        },
        sage: {
          900: "#173F35",
          700: "#286052",
          200: "#D6E7DF",
          100: "#EEF6F1",
        },
        brand: {
          DEFAULT: "#E76F51",
          dark: "#C9563B",
          light: "#FCE4DB",
        },
        accent: {
          DEFAULT: "#F7C948",
        },
      },
      fontFamily: {
        sans: ["'Manrope'", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "'Manrope'", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.06), 0 1px 6px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};
