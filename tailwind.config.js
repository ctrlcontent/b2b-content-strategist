/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      colors: {
        'brand-indigo': 'var(--brand-indigo)',
        'brand-magenta': 'var(--brand-magenta)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        ring: 'var(--ring)',
      },
      boxShadow: {
        pro: 'var(--shadow)',
      },
    },
  },
  plugins: [],
};
