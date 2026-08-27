/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        mono: ["SpaceMono"],
        space: ["SpaceMono"],
      },
      colors: {
        primary: "var(--primary)",
        "primary-badge": "var(--primary-badge)",
        "progress-track": "var(--progress-track)",
        screen: "var(--screen)",
        card: "var(--card)",
        "card-focus": "var(--card-focus)",
        accent: "var(--accent)",
        "text-main": "var(--text-main)",
        "text-muted": "var(--text-muted)",
        "text-on-primary": "var(--text-on-primary)",
        "text-on-primary-muted": "var(--text-on-primary-muted)",
      },
    },
  },
  plugins: [],
};
