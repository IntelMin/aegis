import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'background-shine': {
          from: {
            backgroundPosition: '0 0',
          },
          to: {
            backgroundPosition: '-200% 0',
          },
        },
        rotatee: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translate(0%, 0%)' },
          '20%': { transform: 'translate(10%, 2%)' },
          '40%': { transform: 'translate(6%, -6%)' },
          '60%': { transform: 'translate(-2%, -7%)' },
          '80%': { transform: 'translate(3%, 7%)' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'background-shine': 'background-shine 2s linear infinite',
        rotatee: 'rotatee 6s ease infinite',
        'rotatee-reverse': 'rotatee 6s ease infinite reverse',
        bounce: 'bounce 8s ease infinite',
        'bounce-6s': 'bounce 6s ease infinite',
        'bounce-4s': 'bounce 4s ease infinite',
        'bounce-reverse': 'bounce 6s ease infinite reverse',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
