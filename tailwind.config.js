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
        primary: "#305450", 
        primary2: "#95ab3c",
        primaryMuted: "#426561",
        secondary: "#f3efd4", 
        accent: "#fe6603", 
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        exo: ['"Exo 2"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
