/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0B2D6B',
          purple: '#5B2BE0',
          pink: '#FF4FA3',
          yellow: '#FFC300',
          dark: '#081C42',
          light: '#F4F7FE',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0B2D6B 0%, #5B2BE0 45%, #FF4FA3 80%, #FFC300 100%)',
        'brand-gradient-radial': 'radial-gradient(circle, #5B2BE0 0%, #0B2D6B 100%)',
      },
      boxShadow: {
        'glow-pink': '0 8px 25px -5px rgba(255, 79, 163, 0.4)',
        'glow-yellow': '0 8px 25px -5px rgba(255, 195, 0, 0.4)',
        'glow-purple': '0 8px 25px -5px rgba(91, 43, 224, 0.4)',
        'card-hover': '0 12px 30px -10px rgba(11, 45, 107, 0.15)',
      },
    },
  },
  plugins: [],
};
