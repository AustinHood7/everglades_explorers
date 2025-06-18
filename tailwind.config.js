/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3C60FF",    // Electric Blue - Primary buttons, links, accents
        accent: "#F72585",     // Neon Magenta - Hover effects, highlights, icons
        secondary: "#7209B7",  // Violet Glow - Secondary buttons, backgrounds
        background: "#1B1B3A", // Deep Space - Page background, navbars
        textLight: "#E6E9F0",  // Neuron White - Headlines, primary readable text
        textMuted: "#A0A5C3",  // Plasma Gray - Subtext, descriptions, muted labels
        alert: "#FF5E5B",      // Coral Pulse - CTA buttons, alerts
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        exo: ['"Exo 2"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
