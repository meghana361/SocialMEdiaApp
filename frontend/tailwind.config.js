/** @type {import('tailwindcss').Config} */
export default {
  important: true, // Add this line
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
// module.exports = {
//   content: ['./src/**/*.{js,jsx,ts,tsx}'],
//   theme: {
//     extend: {
//       animation: {
//         pop: 'pop 0.5s ease backwards',
//       },
//       keyframes: {
//         pop: {
//           '0%': { transform: 'scale(1)' },
//           '50%': { transform: 'scale(1.3)' },
//           '100%': { transform: 'scale(1)' },
//         },
//       },
//     },
//   },
// };
