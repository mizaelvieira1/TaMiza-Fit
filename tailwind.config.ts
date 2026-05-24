import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0F0F0F',
          card: '#1A1A1A',
          border: '#2A2A2A',
        },
        tamires: {
          primary: '#E91E8C',
          secondary: '#FF6EB4',
        },
        mizael: {
          primary: '#FFFFFF',
          secondary: '#AAAAAA',
        },
        success: '#27AE60',
        alert: '#E67E22',
        error: '#E74C3C',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      maxWidth: {
        mobile: '430px',
      },
    },
  },
  plugins: [],
}
export default config
