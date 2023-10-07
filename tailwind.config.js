module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        rotateIn: {
          from: {
            transform: 'rotate(-15deg) translateY(-50%)',
            opacity: '0',
          },
          to: {
            transform: 'rotate(0deg) translateY(0)',
            opacity: '1',
          },
        },
        pulse: {
          '0%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(1.05)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
      },
      animation: {
        rotateIn: 'rotateIn 5s forwards',
        pulse: 'pulse 2.5s infinite alternate',
      },
    },
  },
  plugins: [],
};
