/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dfeaff",
          200: "#bfd4ff",
          300: "#93b7ff",
          400: "#638cff",
          500: "#3d68f5",
          600: "#2c4fe8",
          700: "#2640bf",
          800: "#243a96",
          900: "#23377a",
        },
      },
      boxShadow: {
        soft: "0 20px 45px rgba(18, 28, 58, 0.12)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #0b1020 0%, #1f2a44 35%, #3f4bd8 100%)",
      },
    },
  },
  plugins: [],
};
