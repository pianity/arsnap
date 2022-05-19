import { PropsWithChildren } from "react";

import { classes } from "@/utils/tailwind";

/** Props for {@link ViewContainer} */
type ViewContainerProps = {
    /**
     * Class name to apply to the container.
     *
     * Defaults to `"mx-auto w-[90vw] max-w-[768px] grow flex flex-col items-center"`
     * */
    className?: string;
};

/**
 * The container for views.
 *
 * @param props - Component props
 */
export default function ViewContainer({
    children,
    className,
}: PropsWithChildren<ViewContainerProps>) {
    return (
        <div
            className={classes(
                "mx-auto w-[90vw] max-w-[768px] mb-10",
                "grow flex flex-col items-center",
                className ?? "",
            )}
        >
            {children}
        </div>
    );
}
