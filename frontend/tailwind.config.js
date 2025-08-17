/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: "#007BFF",
          '100': '#E0F2FF',
          '200': '#B9E2FF',
          '300': '#8FD2FF',
          '400': '#64C2FF',
          '500': '#3A9EFF',
          '600': '#007BFF',
          '700': '#005ECC',
          '800': '#004499',
          '900': '#002B66',
        },
        secondary: {
          DEFAULT: "#F8F9FA",
          '100': '#F8F9FA',
          '200': '#E9ECEF',
          '300': '#DEE2E6',
        },
        success: '#28A745',
        warning: '#FFC107',
        danger: '#DC3545',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
