
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
        colors: {
          'primary': {
            '50': '#fef2f3',
            '100': '#fce7e8',
            '200': '#f9d2d7',
            '300': '#f5acb4',
            '400': '#ee7e8d',
            '500': '#e35169', // main
            '600': '#ce3051',
            '700': '#ae2243',
            '800': '#921f3e',
            '900': '#7d1e3a',
            '950': '#450c1c',
          }
        }
    },
    fontFamily: {
      sans: ['Satoshi', 'sans-serif'],
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  darkMode: 'media',
};