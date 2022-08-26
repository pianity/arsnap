import { useState } from "react";

import LoadingIndicator from "@/components/interface/svg/LoadingIndicator";
import metamaskLogoUrlDark from "@/assets/metamask-dark.svg";
import metamaskLogoUrlLight from "@/assets/metamask-light.svg";
import Text from "@/components/interface/typography/Text";
import { classes } from "@/utils/tailwind";

type MetamaskButtonProps = {
    label: string;
    small?: boolean;
    dark?: boolean;
    onClick: () => Promise<void>;
};

export default function MetamaskButton({ label, small, dark, onClick }: MetamaskButtonProps) {
    const [initializing, setInitializing] = useState(false);

    return (
        <button
            onClick={async () => {
                setInitializing(true);
                await onClick();
                setInitializing(false);
            }}
            className={classes(
                "flex items-center justify-center rounded-full bg-white relative",
                dark &&
                    "bg-opacity-20 lg:hover:bg-opacity-40 transition duration-300 ease-quart-out",
                small ? "h-10 px-4" : "h-14 px-6",
            )}
        >
            <Text.span
                color={dark ? "white" : "gray-dark"}
                size={small ? "14" : "16"}
                weight="semibold"
                taller
                className={"mr-2" + (initializing ? " invisible" : "")}
            >
                {label}
            </Text.span>
            <img
                src={dark ? metamaskLogoUrlLight : metamaskLogoUrlDark}
                width={small ? 94 : 105}
                height={small ? 18 : 20}
                alt="Metamask"
                className={initializing ? "invisible" : ""}
            />

            {initializing && (
                <LoadingIndicator
                    height={20}
                    width={20}
                    className={"absolute z-10 " + (dark ? "text-white" : "text-gray-dark")}
                />
            )}
        </button>
    );
}
