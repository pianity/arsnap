import { PropsWithChildren } from "react";

type ContainerProps = {
    opaque?: boolean;
    shadow?: boolean;
    centerAll?: boolean;
    className?: string;
};

/**
 * The default container
 */
export default function Container({
    opaque,
    shadow,
    centerAll,
    className,
    children,
}: PropsWithChildren<ContainerProps>) {
    return (
        <div
            className={
                "w-full flex flex-col bg-white rounded-xl" +
                (opaque ? "" : " bg-opacity-25") +
                (shadow ? " shadow-container" : "") +
                (centerAll ? " items-center justify-center text-center" : "") +
                (className ? " " + className : "")
            }
        >
            {children}
        </div>
    );
}
