/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        georgian: ['"Noto Sans Georgian"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
