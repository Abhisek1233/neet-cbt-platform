/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        nta: {
          navy: '#002b49',
          header: '#003366',
          yellow: '#ff9900',
          canvas: '#f4f6f9',
          card: '#ffffff',
          border: '#cbd5e1',
          answered: '#2e7d32',
          notanswered: '#d32f2f',
          review: '#7b1fa2',
          reviewanswered: '#512da8',
          notvisited: '#e2e8f0',
        }
      }
    },
  },
  plugins: [],
}
