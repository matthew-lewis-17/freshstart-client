/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/Table.js",
    "./src/Homepage.js",
    "./src/TableView.js",
    "./src/App.js",
    "./src/Filters.js",
    "./src/Navigation.js"
  ],
  theme: {
    extend: {
      colors: {
        'soft-green': '#3b544e',
        'soft-grey': '#ffffff',
      },
    },
  },
  plugins: [],
}
