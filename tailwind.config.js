/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        agency: ['"Agency FB"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
