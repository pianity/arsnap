import { PropsWithChildren, MouseEventHandler } from "react";

import LoadingIndicator from "@/components/interface/svg/LoadingIndicator";

export type ButtonProps = {
    /** Display with a border instead of filled in */
    outlined?: boolean;
    /** Color of the button */
    color?: "dark" | "white" | "purple";
    /** Makes the button bigger */
    large?: boolean;
    /** HTML button type */
    type?: "submit" | "button" | "reset";
    /** Displays a loading indicator instead of children */
    loading?: boolean;
    /** Extra classes for the html button */
    className?: string;
    /** onClick callback for the html button */
    onClick?: MouseEventHandler<HTMLButtonElement>;
};

/**
 * Renders the default ArSnap button.
 */
export default function Button(props: PropsWithChildren<ButtonProps>) {
    let colorClass = props.outlined ? "box-border border" : "";
    const sizeClass = props.large
        ? "h-12 px-5 text-[16px] leading-[17px]"
        : "h-8 px-3 text-[14px] leading-[15px]";

    switch (props.color) {
        case "white":
            colorClass += props.outlined ? " border-white text-white" : "bg-white text-purple-dark";
            break;

        case "purple":
            colorClass += props.outlined
                ? " border-purple-text text-purple-text"
                : "bg-purple-text text-purple-dark";
            break;

        case "dark":
        default:
            colorClass += props.outlined
                ? " border-purple-dark text-purple-dark"
                : "bg-purple-dark text-white";
            break;
    }

    return (
        <button
            className={[
                "font-semibold flex items-center justify-center relative rounded-full w-max",
                colorClass,
                sizeClass,
                props.className ?? "",
            ].join(" ")}
            type={props.type}
            onClick={props.onClick}
        >
            <span className={props.loading ? "invisible" : undefined}>{props.children}</span>
            {props.loading && <LoadingIndicator width={16} height={16} className="absolute" />}
        </button>
    );
}
