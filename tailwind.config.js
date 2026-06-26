/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0f1419',
        'dark-card': '#1a202c',
        'dark-border': '#2d3748',
        'industrial-red': '#dc2626',
        'industrial-orange': '#ea580c',
        'industrial-yellow': '#eab308',
        'industrial-green': '#22c55e',
        'industrial-blue': '#0284c7',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        spin: 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}
