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
        'dcoral-pink': '#b37262',
        'raisin-black': '#1e1e24',
        'hover-dgreen': '#0D4533',
        'whitesmoke': '#f5f5f5'
      },
      animation: {
        'bounce': 'bounce 2.5s infinite',
        'text': 'text 5s ease infinite'
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
        },
        text: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
      fontFamily: {
        'header': ['Helvetica Neue'],
        'custom': ['fake-receipt'],
      }
    },
  },
  plugins: [],
}

