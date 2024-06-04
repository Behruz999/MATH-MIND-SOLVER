/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
      },
      animation: {
        showTopText: "showTopText 1s",
        showBottomText: "showBottomText 1s 2s", // Delayed animation
        arrowMove: "arrowMove 3s linear infinite",
      },
      keyframes: {
        showTopText: {
          "0%": {
            transform: "translateY(100%)",
          },
          "40%, 60%": {
            transform: "translateY(50%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        showBottomText: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        arrowMove: {
          "0%": {
            transform: "translateX(-2px)",
          },
          "50%": {
            transform: "translateX(3px)",
          },
          "100%": {
            transform: "translateX(-3px)",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animated")],
};
