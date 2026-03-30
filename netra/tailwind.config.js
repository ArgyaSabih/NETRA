const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      screens: {
        xs: "560px",
        xxs: "440px"
      },
      boxShadow: {
        "offset-purple": "5px 5px 0px 0px #7147C4",
        "offset-yellow-blue": "5px 5px 0px 0px #FFE32C, -5px -5px 0px 0px #3578FF",
        "offset-blue": "10px 10px 0px 0px #0C5DFF"
      },
      fontFamily: {
        "inter-bold": ["var(--font-inter-bold)"],
        "inter-semibold": ["var(--font-inter-semibold)"],
        "inter-light": ["var(--font-inter-light)"],
        "inter-regular": ["var(--font-inter-regular)"],
        "inter-medium": ["var(--font-inter-medium)"]
      }
    }
  },
  plugins: []
};
