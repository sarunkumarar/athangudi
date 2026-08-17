/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Oxide-inspired UI chrome (not the tile palette itself — see src/palette).
        clay: '#A6371F',
        bottle: '#1B4D3E',
        indigo: '#21408B',
        mustard: '#D99A2B',
        charcoal: '#2B2B2B',
        cream: '#F2E8D5',
        parchment: '#EFE6D0',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        // The header wordmark only — a decorative western/wood-block face.
        title: ['"Rye"', 'cursive'],
      },
      boxShadow: {
        sheet: '0 -8px 30px rgba(0,0,0,0.18)',
      },
    },
  },
  plugins: [],
};
