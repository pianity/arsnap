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
                    DEFAULT: "#3CEE99",
                    dark: "#42AF7B",
                },
                red: {
                    DEFAULT: "#FF4794",
                    light: "#CD1F68",
                    dark: "#E9317E",
                },
                orange: {
                    DEFAULT: "#FFA756",
                    dark: "#EB9342",
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
