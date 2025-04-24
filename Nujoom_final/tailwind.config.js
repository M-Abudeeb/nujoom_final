/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kaff: ['Kaff', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 