/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./commons/**/*.{html,js}",
    "./pages/**/*.{html,js}",
    "./assets/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#33a852',
        'primary-color': '#dd6f00',
        'light-green': '#e8f6e8',
        'dark-gray': '#242424',
        'medium-gray': '#989898',
        'light-gray': '#c1c1c1',
        'white': '#ffffff',
        // Hospital and orange colors
        'hospital-blue': '#2563eb',
        'hospital-green': '#059669',
        'hospital-gray': '#64748b',
        'orange-300': '#fdba74', 
        'orange-900': '#7c2d12',
        'app-orange': '#fb8716',
        // Colors for the gradient
        'gradient-green-light': 'rgba(51, 168, 82, 0.4)',
        'gradient-green-transparent': 'rgba(51, 168, 82, 0)',
        'gradient-dark-green': '#2b8a42',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
