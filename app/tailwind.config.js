/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: {
          light: "#fff",
          dark: "#1e1846",
          DEFAULT: "#fff",
        },
        tint: {
          light: "#2f95dc",
          dark: "#4d4af0",
          DEFAULT: "#2f95dc",
        },
      },
    },
  },
  plugins: [],
};
