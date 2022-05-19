import { useEffect, useState } from "react";

import Text from "@/components/interface/typography/Text";
import errorIconUrl from "@/assets/icons/error.svg";
import { classes } from "@/utils/tailwind";

type InputErrorProps = {
    message: string;
};

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
        <div className="relative">
            <div
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                className={classes(
                    "w-4 h-4",
                    "rounded-full",
                    "bg-red-dark text-white",
                    "flex items-center justify-center",
                )}
            >
                <img src={errorIconUrl} alt="Error" />
            </div>

            <div
                className={classes(
                    "pb-3",
                    "overflow-hidden",
                    "absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full",
                    "transition-all duration-300 ease-quart-out",
                    show ? "top-0 opacity-100 visible" : "top-2 opacity-0 invisible",
                )}
            >
                <div className="bg-white rounded-md p-4 w-max max-w-[35ch] text-center">
                    <Text.span color="gray-dark" size="14" taller>
                        {message}
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
