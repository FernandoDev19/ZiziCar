/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: [
    "./src/**/*.{html,ts}",
    './node_modules/preline/preline.js'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#eb1074',
        secondary: '#401987',
        lettersGray: '#606060',
        lightGray: '#f4f4f4'
      }
    },
  },
  plugins: [
    require('preline/plugin'),
  ],
}

