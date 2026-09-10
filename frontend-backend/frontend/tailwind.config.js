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
        brand: {
          DEFAULT: "#E11D48",
          dark: "#BE123C",
          light: "#FFE4E8",
        },
        accent: {
          DEFAULT: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.06), 0 1px 6px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};
