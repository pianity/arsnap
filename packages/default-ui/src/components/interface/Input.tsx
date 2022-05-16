import { HTMLAttributes } from "react";

type InputProps = HTMLAttributes<HTMLInputElement> & {
    light?: boolean;
};

/**
 * Default ArSnap input.
 */
export default function Input({ light: white, ...props }: InputProps) {
    const colorClass = white
        ? "text-purple-light border-purple"
        : "text-gray-dark border-gray-dark border-opacity-25";

    return (
        <input
            className={[
                "w-full h-12 px-4 text-[14px] leading-none flex items-center bg-transparent rounded-md border box-border focus:outline-none",
                colorClass,
            ].join(" ")}
            {...props}
        />
    );
}
