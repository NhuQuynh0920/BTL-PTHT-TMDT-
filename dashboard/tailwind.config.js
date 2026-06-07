/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        highlands: {
          red: '#B22830', // Màu đỏ đặc trưng Highlands
          'red-dark': '#8B1C22',
          gold: '#D4A373', // Màu vàng đồng sang trọng
          dark: '#1A0A0A', // Màu nâu đen cà phê
          bg: '#FDFBF7',  // Màu kem nền nhã nhặn
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'premium': '0 10px 40px rgba(178, 40, 48, 0.05)',
        'luxury': '0 20px 50px rgba(26, 10, 10, 0.08)',
        'red-glow': '0 8px 30px rgba(178, 40, 48, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      }
    },
  },
  plugins: [],
}
