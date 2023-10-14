/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'khaki': '#c4af9a',
        'jungle-green': '#21a179',
        'cambridge-blue': '#81ae9d',
        'coral-pink': '#fb9f89',
        'raisin-black': '#1e1e24',
        'hover-dgreen': '#0D4533',
      },
      animation: {
        'bounce': 'bounce 2.5s'
      },
      keyframes: {
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.1, 0, 1, 0.1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          },
        }
      }
    },
  },
  plugins: [],
}

