/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#b45309",      // Amber / desert brown
        secondary: "#facc15",    // Yellow / golden
        sand: "#f8f5ef",         // Soft desert background
        dark: "#1f2937",         // Slate / deep neutral
      },
    },
  },
  plugins: [],
};
