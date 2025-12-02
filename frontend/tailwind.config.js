/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        animation: {
          'float': 'float 3s ease-in-out infinite',
          'shake': 'shake 0.5s ease-in-out',
          'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(5deg)' },
          },
          shake: {
            '0%, 100%': { transform: 'translateX(0)' },
            '25%': { transform: 'translateX(-5px)' },
            '75%': { transform: 'translateX(5px)' },
          },
          'pulse-glow': {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.7' },
          }
        },
      },
    },
    plugins: [],
  }