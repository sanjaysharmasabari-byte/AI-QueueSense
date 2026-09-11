/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#070A11',
        foreground: '#F1F5F9',
        card: {
          DEFAULT: 'rgba(15, 23, 42, 0.65)',
          foreground: '#F8FAFC',
        },
        popover: {
          DEFAULT: '#0F172A',
          foreground: '#F8FAFC',
        },
        primary: {
          DEFAULT: '#00F2FE',
          foreground: '#030712',
          light: '#38BDF8',
          dark: '#0284C7',
        },
        secondary: {
          DEFAULT: '#0EA5E9',
          foreground: '#FFFFFF',
        },
        teal: {
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
        muted: {
          DEFAULT: '#1E293B',
          foreground: '#94A3B8',
        },
        accent: {
          DEFAULT: 'rgba(0, 242, 254, 0.12)',
          foreground: '#00F2FE',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#030712',
        },
        success: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },
        border: 'rgba(255, 255, 255, 0.08)',
        input: 'rgba(255, 255, 255, 0.12)',
        ring: '#00F2FE',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'radar-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-spin': 'radar-spin 10s linear infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        scanline: 'scanline 4s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(circle at 50% 0%, rgba(0, 242, 254, 0.15) 0%, rgba(7, 10, 17, 0) 70%)',
        'teal-glow': 'radial-gradient(circle at 50% 50%, rgba(0, 242, 254, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
      },
    },
  },
  plugins: [],
}
