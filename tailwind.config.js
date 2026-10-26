/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2ff', 100: '#dce7fb', 200: '#bacff7',
          300: '#87adf0', 400: '#4e82e6', 500: '#2a5fd4',
          600: '#1a47b8', 700: '#163896', 800: '#172f79',
          900: '#172b63', 950: '#111c42',
        },
        gold: { 400: '#f5c842', 500: '#e6b020', 600: '#c99510' }
      },
      fontFamily: { arabic: ['Cairo', 'sans-serif'] },
      animation: {
        'fade-in':  'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down':'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity:'0' }, '100%': { opacity:'1' } },
        slideUp:   { '0%': { opacity:'0', transform:'translateY(20px)' }, '100%': { opacity:'1', transform:'translateY(0)' } },
        slideDown: { '0%': { opacity:'0', transform:'translateY(-10px)' },'100%': { opacity:'1', transform:'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
