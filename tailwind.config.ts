import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'comic-red':    '#ED1D24',
        'comic-blue':   '#0476F2',
        'comic-yellow': '#FFD700',
        'comic-cream':  '#FFF8E7',
        'comic-black':  '#1A1A1A',
      },
      fontFamily: {
        bangers: ['Bangers', 'cursive'],
        comic:   ['Comic Neue', 'cursive'],
      },
    },
  },
  plugins: [],
} satisfies Config
