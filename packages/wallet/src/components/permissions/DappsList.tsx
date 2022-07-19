import { ImgHTMLAttributes, useState } from "react";

import { classes } from "@/utils/tailwind";
import Text from "@/components/interface/typography/Text";
import Tooltip from "@/components/interface/Tooltip";
import AllSitesIconUrl from "@/assets/icons/all-sites.svg";

function DappFavicon({ origin }: { origin: string }) {
    const [imgError, setImgError] = useState(false);

    return (
        <div
            className={classes(
                "rounded-full w-6 h-6 shrink-0 object-cover",
                "place-items-center text-center",
                origin !== "all" && "bg-purple-dark",
            )}
        >
            {imgError ? (
                <Text color="white" className="inline align-middle">
                    ?
                </Text>
            ) : (
                <img
                    src={origin === "all" ? AllSitesIconUrl : `${origin}/favicon.ico`}
                    alt=""
                    onError={() => setImgError(true)}
                />
            )}
        </div>
    );
}

function DappText({ origin, iconPosition }: DappItemProps) {
    return (
        <Text.span
            className={iconPosition === "left" ? "ml-2" : "mr-2"}
            size="16"
            weight="semibold"
        >
            {origin === "all" ? "All sites" : origin}
        </Text.span>
    );
}

export type DappItemProps = {
    origin: string;
    iconPosition?: "left" | "right";
};
export function DappItem({ origin, iconPosition = "left" }: DappItemProps) {
    return (
        <>
            {iconPosition === "left" && <DappFavicon origin={origin} />}

            {origin !== "all" ? (
                <Tooltip childrenClassName="truncate" text={origin}>
                    <DappText origin={origin} iconPosition={iconPosition} />
                </Tooltip>
            ) : (
                <DappText origin={origin} iconPosition={iconPosition} />
            )}

            {iconPosition === "right" && <DappFavicon origin={origin} />}
        </>
    );
}

type DappsListProps = {
    currentDapp: string | undefined;
    dapps: string[];
    onDappClick: (dapp: string) => void;
};

export default function DappsList({ currentDapp, dapps, onDappClick }: DappsListProps) {
    return (
        <div
            className={classes(
                "flex flex-col",
                "w-[233px] pl-4 pr-6 pt-6 mb-[14px]",
                "border-r border-purple",
            )}
        >
            <Text.h3 color="white" size="12" weight="semibold" wider uppercase className="mb-6">
                Connected sites
            </Text.h3>
            <ul className="grow">
                {dapps.map((dapp) => {
                    const selected = dapp === currentDapp;
                    return (
                        <li
                            key={dapp}
                            onClick={() => onDappClick(dapp)}
                            className={classes(
                                "h-10 px-2 mb-1 last:mb-0",
                                "rounded",
                                "flex items-center",
                                selected
                                    ? "bg-white text-purple-dark cursor-default"
                                    : "text-white lg:hover:bg-purple/50 cursor-pointer",
                                "transition duration-300 ease-quart-out",
                            )}
                        >
                            <DappItem origin={dapp} />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
