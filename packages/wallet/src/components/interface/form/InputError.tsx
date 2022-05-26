import { useEffect, useState } from "react";

import errorIconUrl from "@/assets/icons/error.svg";
import { classes } from "@/utils/tailwind";
import Tooltip from "@/components/interface/Tooltip";

/** Props of {@link InputError} */
type InputErrorProps = {
    /** Message in the tooltip */
    message: string;
};

/**
 * Shows an error icon with an open tooltip containing message.
 * This tooltip disappears after 2 secondes, and can be re-opened
 * on hover.
 *
 * @param props - Props of the component
 */
export default function InputError({ message }: InputErrorProps) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShow(false);
        }, 2000);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return (
        <Tooltip text={message} forceShow={show}>
            <div
                className={classes(
                    "w-4 h-4",
                    "rounded-full",
                    "bg-red-dark text-white",
                    "flex items-center justify-center",
                )}
            >
                <img src={errorIconUrl} alt="Error" />
            </div>
        </Tooltip>
    );
}
