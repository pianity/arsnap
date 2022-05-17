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
                    warning: "#CD1F68",
                },
                orange: {
                    warning: "#FFA756",
                },
                gray: {
                    dark: "#333333",
                    light: "#888888",
                },
            },
            transitionProperty: {
                size: "height, width",
                spacing: "margin, padding",
                visibility: "visibility",
            },
            transitionTimingFunction: {
                "quart-out": "cubic-bezier(0.25, 1, 0.5, 1)",
            },
            boxShadow: {
                container:
                    "0px 4px 4px rgba(0, 0, 0, 0.04), 0px 24px 28px rgba(0, 0, 0, 0.04), 0px 20px 24px rgba(0, 0, 0, 0.04)",
            },
        },
    },
    plugins: [],
};
