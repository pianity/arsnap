import { PropsWithChildren } from "react";

type ViewContainerProps = {
    className?: string;
};

/**
 * The container for views.
 *
 * @param className extra classes
 * @default "mx-auto w-[90vw] max-w-[768px] grow flex flex-col items-center"
 */
export default function ViewContainer({
    children,
    className,
}: PropsWithChildren<ViewContainerProps>) {
    return (
        <div
            className={
                "mx-auto w-[90vw] max-w-[768px] grow flex flex-col items-center" +
                (className ? " " + className : "")
            }
        >
            {children}
        </div>
    );
}
