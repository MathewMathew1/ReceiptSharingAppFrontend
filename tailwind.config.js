/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  mode: "jit",
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          text: '#333',
          primaryBg: '#f5f6f7',
          primaryBg2: '#e5e5dc',
          secondaryBg: '#ffffff',
          secondaryText: "",
          inputPrimaryBg: "#d7e3ee",
          infoBg: "#b2d5f3",
          selectorPrimaryBg: "#d1dae3",
          modalBg: "#fefdff",
        },
        dark: {
          text: '#fff',
          primaryBg: '#333',
          primaryBg2: '#070807',
          secondaryBg: '#4b4b4b',
          secondaryText: "#6795d7",
          colorBtnPrimary: "#263440",
          inputPrimaryBg: "#414548",
          infoBg: "#3d3e3f",
          selectorPrimaryBg: "#64748b",
          modalBg: "#323232",
        },
      },
    },
  },
  plugins: [],
};

