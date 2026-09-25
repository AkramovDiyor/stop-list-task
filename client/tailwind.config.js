/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F6F3EE',       // Фон из ТЗ
        accent: '#C6462F',   // Акцент из ТЗ
        text: '#171512',     // Текст из ТЗ
        error: '#DC2626',    // Красный для ошибок
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}