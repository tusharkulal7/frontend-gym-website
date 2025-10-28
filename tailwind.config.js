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
      screens: {
        'xs': '375px',
        '3xl': '1600px',
      },
    },
  },
  plugins: [],
}
