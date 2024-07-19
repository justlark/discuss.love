/** @type {import('tailwindcss').Config} */
import tailwind from "tailwindcss-primeui";
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [tailwind],
};
