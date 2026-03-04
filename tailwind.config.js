/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lime: '#C8FF00',
        'bg-primary': '#161616',
        'bg-secondary': '#1e1e1e',
        'bg-card': '#242424',
        'border-dim': '#2e2e2e',
      },
      fontFamily: {
        'barlow-condensed': ['"Barlow Condensed"', 'sans-serif'],
        'barlow': ['Barlow', 'sans-serif'],
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
