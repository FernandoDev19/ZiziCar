/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    './node_modules/preline/preline.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1c0444",
        secondary: "#eb1373",
      }
    },
  },
  plugins: [
    require('preline/plugin'),
  ],
}

