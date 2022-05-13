module.exports = {
    content: ["./src/**/*.ts{x,}"],
    theme: {
        extend: {
            colors: {
                purple: {
                    DEFAULT: "#8383D4",
                    text: "#B5B5F5",
                    dark: "#05053C",
                    light: "#EFEFF9",
                },
                green: {
                    success: "#3CEE99",
                },
                red: {
                    error: "#FF4794",
                },
                orange: {
                    warning: "#FFA756",
                },
                gray: {
                    dark: "#333333",
                    light: "#888888",
                },
            },
        },
    },
    plugins: [],
};
