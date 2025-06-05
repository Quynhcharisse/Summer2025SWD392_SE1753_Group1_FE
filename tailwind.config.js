/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],  theme: {
    extend: {
      colors: {
        'sunshine-green': '#042818',     // Xanh lá đậm nhất cho contrast cao
        'sunshine-yellow': '#d4af37',    // Vàng đậm hơn cho contrast tốt
        'sunshine-orange': '#cc5500',    // Cam đậm hơn
        'sunshine-light-green': '#16a34a', // Xanh lá sáng hơn nhưng vẫn đậm
        'sunshine-cream': '#fef3c7'      // Kem nhạt cho background
      },
      fontWeight: {
        'extra-bold': '800',
        'black': '900'
      }
    },
  },
  plugins: [],
};
