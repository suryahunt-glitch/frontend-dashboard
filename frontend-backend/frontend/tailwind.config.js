/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#1C1917",
          700: "#44403C",
          500: "#78716C",
          200: "#E7E5E4",
          100: "#F5F5F4",
        },
        // Tema "Toko Kelontong": hijau segar daun sebagai warna utama.
        sage: {
          900: "#14532D",
          800: "#166534",
          700: "#15803D",
          500: "#22C55E",
          400: "#4ADE80",
          300: "#86EFAC",
          200: "#BBF7D0",
          100: "#DCFCE7",
        },
        // Aksi utama: oranye hangat seperti label harga kelontong.
        brand: {
          DEFAULT: "#EA580C",
          dark: "#C2410C",
          light: "#FFEDD5",
        },
        // Aksen: kuning cerah.
        accent: {
          DEFAULT: "#FACC15",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        display: ["'Sora'", "'Plus Jakarta Sans'", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,83,45,0.08), 0 8px 24px rgba(20,83,45,0.08)",
      },
    },
  },
  plugins: [],
};
