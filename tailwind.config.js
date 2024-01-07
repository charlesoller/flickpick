/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      "height-sm": { "raw": "(max-height: 700px)"}
    }
  },
  plugins: [],
}
