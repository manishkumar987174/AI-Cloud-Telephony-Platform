/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#6366F1', dark: '#4F46E5', light: '#818CF8' },
        secondary: { DEFAULT: '#22D3EE', dark: '#06B6D4' },
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        surface: { DEFAULT: '#1E293B', light: '#334155', dark: '#0F172A' },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
