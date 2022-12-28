/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xxs': '260px',
        'xs': '320px',
        'ssm': '360px',
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
}
