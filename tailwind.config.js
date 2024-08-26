/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        strokeWidth: {
          '3': '3px',
          '4': '4px',
          '5': '5px',
          '6': '6px',
          '7': '7px',
          '8': '8px',
        },
      },
    },
    plugins: [],
  }