/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderGradient: {
        'br-purple-pink': ['to right', 'rgba(147, 51, 234, 0.5)', 'rgba(236, 72, 153, 0.5)'],
      },
    },
  },
  plugins: [],
};
