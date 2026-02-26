/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8F9FA",
        foreground: "#1A1D1F",
        primary: {
          DEFAULT: "#8FB755",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#6366F1",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F4F4F4",
          foreground: "#6F767E",
        },
        accent: {
          DEFAULT: "#FF7D54",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1D1F",
        },
        border: "#EFEFEF",
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.02), 0 10px 10px -5px rgba(0, 0, 0, 0.01)',
      }
    },
  },
  plugins: [],
}
