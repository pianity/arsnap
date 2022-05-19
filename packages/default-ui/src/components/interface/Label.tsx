import { HTMLAttributes, PropsWithChildren } from "react";

import { classes } from "@/utils/tailwind";

type LabelProps = HTMLAttributes<HTMLLabelElement> & {
    white?: boolean;
};

/**
 * Default ArSnap label.
 */
export default function Label({
    white,
    children,
    className,
    ...props
}: PropsWithChildren<LabelProps>) {
    const colorClass = white ? "text-white" : "text-purple-dark";

    return (
        <label
            className={classes(
                "text-[12px] leading-none font-semibold tracking-wider uppercase",
                colorClass,
                className ?? "",
            )}
            {...props}
        >
            {children}
        </label>
    );
}
