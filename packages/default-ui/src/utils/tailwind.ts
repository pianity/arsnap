export type TextColor =
    | "white"
    | "gray-dark"
    | "gray-light"
    | "purple"
    | "purple-light"
    | "purple-dark"
    | "purple-text"
    | "green"
    | "red"
    | "orange";

/**
 * Gets the tailwind class for the given text color.
 *
 * @param color
 * @returns Tailwind class name
 */
export function getColorClass(color: TextColor): string {
    switch (color) {
        case "white":
            return "text-white";

        case "gray-dark":
            return "text-gray-dark";

        case "gray-light":
            return "text-gray-light";

        case "purple":
            return "text-purple";

        case "purple-light":
            return "text-purple-light";

        case "purple-dark":
            return "text-purple-dark";

        case "purple-text":
            return "text-purple-text";

        case "green":
            return "text-green-success";

        case "red":
            return "text-red-error";

        case "orange":
            return "text-orange-warning";
    }
}

/**
 * Gets the tailwind hover class for the given text color.
 *
 * @param color Tailwind text color
 * @returns Tailwind hover class name
 */
export function getHoverColorClass(color: TextColor): string {
    switch (color) {
        case "white":
            return "lg:hover:text-white";

        case "gray-dark":
            return "lg:hover:text-gray-dark";

        case "gray-light":
            return "lg:hover:text-gray-light";

        case "purple":
            return "lg:hover:text-purple";

        case "purple-light":
            return "lg:hover:text-purple-light";

        case "purple-dark":
            return "lg:hover:text-purple-dark";

        case "purple-text":
            return "lg:hover:text-purple-text";

        case "green":
            return "lg:hover:text-green-success";

        case "red":
            return "lg:hover:text-red-error";

        case "orange":
            return "lg:hover:text-orange-warning";
    }
}

export type Opacity = "0" | "25" | "50" | "75" | "100";

/**
 * Gets the tailwind class for the given opacity.
 *
 * @param opacity
 * @returns Tailwind class name
 */
export function getOpacityClass(opacity: Opacity): string {
    switch (opacity) {
        case "0":
            return "opacity-0";

        case "25":
            return "opacity-25";

        case "50":
            return "opacity-50";

        case "75":
            return "opacity-75";

        case "100":
            return "opacity-100";
    }
}

export type TextSize = "11" | "12" | "13" | "14" | "16" | "18" | "20" | "24" | "32" | "40" | "56";

/**
 * Gets the tailwind class for the given text color.
 *
 * @param color
 * @returns Tailwind class name
 */
export function getSizeClass(size: TextSize): string {
    switch (size) {
        case "11":
            return "text-[11px]";

        case "12":
            return "text-[12px]";

        case "13":
            return "text-[13px]";

        case "14":
            return "text-[14px]";

        case "16":
            return "text-[16px]";

        case "18":
            return "text-[18px]";

        case "20":
            return "text-[20px]";

        case "24":
            return "text-[24px]";

        case "32":
            return "text-[32px]";

        case "40":
            return "text-[40px]";

        case "56":
            return "text-[56px]";
    }
}

export type TextWeight = "normal" | "semibold" | "bold";

/**
 * Gets the tailwind class for the given text weight.
 *
 * @param weight
 * @returns Tailwind class name
 */
export function getWeightClass(weight: TextWeight) {
    switch (weight) {
        case "normal":
            return "font-normal";

        case "semibold":
            return "font-semibold";

        case "bold":
            return "font-bold";
    }
}

export type TextAlign = "left" | "center" | "right";

/**
 * Gets the tailwind class for the given text alignment.
 *
 * @param align
 * @returns Tailwind class name
 */
export function getAlignClass(align: TextAlign) {
    switch (align) {
        case "left":
            return "text-left";

        case "center":
            return "text-center";

        case "right":
            return "text-right";
    }
}
