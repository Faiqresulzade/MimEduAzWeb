/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1b58c4',
          blueDark: '#14418f',
          navy: '#10243d',
          navyDeep: '#0e2c61',
          ink: '#26405c',
          slate: '#3a5470',
          muted: '#5b7086',
          faint: '#6b8098',
          border: '#d7e0ee',
          borderLight: '#e3e9f2',
          bg: '#faf9f5',
          surface: '#ffffff',
          chipBg: '#f5f8fc',
          hoverBg: '#f2f6fc',
        },
        live: { bg: '#e7f5f2', text: '#0e7c6b' },
        online: { bg: '#eef4ff', text: '#14418f' },
        video: { bg: '#f0edfd', text: '#4b3fa8' },
        paid: { bg: '#fdf0e7', text: '#a1532a' },
        free: { bg: '#e7f5f2', text: '#0e7c6b' },
        danger: { bg: '#fdf0e7', text: '#8f4520' },
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 26px rgba(16,36,61,.11)',
        toast: '0 12px 34px rgba(16,36,61,.24)',
      },
      borderRadius: {
        pill: '999px',
      },
      maxWidth: {
        shell: '1120px',
      },
    },
  },
  plugins: [],
}
