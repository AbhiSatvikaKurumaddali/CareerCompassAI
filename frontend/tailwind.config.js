/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c2d3ff",
          300: "#9bb3ff",
          400: "#7186ff",
          500: "#5b5cf5",
          600: "#4a3ee0",
          700: "#3d31bd",
          800: "#332a97",
          900: "#2c2679",
        },
        accent: {
          400: "#b993ff",
          500: "#a267fb",
          600: "#8a4de8",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #4a3ee0 0%, #5b5cf5 40%, #a267fb 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(74,62,224,0.15) 0%, rgba(162,103,251,0.15) 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        "glass-lg": "0 16px 48px 0 rgba(31, 38, 135, 0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
