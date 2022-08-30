import { PropsWithChildren, useState } from "react";

import { classes } from "@/utils/tailwind";
import Text from "@/components/interface/typography/Text";

/** Props of {@link Tooltip} */
type TooltipProps = {
    /** Text in the tooltip */
    text: string;
    /** Set to true to keep tooltip open */
    forceShow?: boolean;
    /** ClassName of the container div */
    className?: string;
    /** ClassName of the children container div */
    childrenClassName?: string;
};

/**
 * Simple animated text tooltip on hover.
 */
export default function Tooltip({
    text,
    forceShow,
    className,
    childrenClassName,
    children,
}: PropsWithChildren<TooltipProps>) {
    const [show, setShow] = useState(false);

    const showTooltip = show || forceShow;
    return (
        <div className={classes("relative min-w-0", className)}>
            <div
                className={childrenClassName}
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                {children}
            </div>

            <div
                className={classes(
                    "pb-3",
                    "overflow-hidden",
                    "absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full",
                    "transition-all duration-300 ease-quart-out",
                    showTooltip
                        ? "top-0 opacity-100 visible pointer-events-none"
                        : "top-2 opacity-0 invisible",
                )}
            >
                <div className="bg-white rounded-md p-4 w-max max-w-[35ch] text-center break-words">
                    <Text.span color="gray-dark" size="14" taller>
                        {text}
                    </Text.span>
                </div>

                <div
                    className={classes(
                        "bg-white",
                        "rounded-[2px]",
                        "w-4 h-4",
                        "rotate-45",
                        "absolute left-1/2 -translate-x-1/2 bottom-2",
                    )}
                />
            </div>
        </div>
    );
}
