/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
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
            },
            borderRadius: {
                '2xl': '20px',
                '3xl': '28px',
                '4xl': '40px',
            },
        },
    },
    plugins: [],
}
