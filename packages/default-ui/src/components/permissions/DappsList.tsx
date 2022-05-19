import { classes } from "@/utils/tailwind";
import Text from "@/components/interface/typography/Text";

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
                "min-w-[170px] pl-4 pr-6 pt-6 mb-[14px]",
                "border-r border-purple",
            )}
        >
            <Text.h3 color="white" size="12" weight="semibold" wider uppercase className="mb-6">
                Connected sites
            </Text.h3>
            <ul>
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
                                    : "text-white lg:hover:bg-purple cursor-pointer",
                                "transition duration-300 ease-quart-out",
                            )}
                        >
                            <img
                                src={`${dapp}/favicon.ico`}
                                alt=""
                                width={24}
                                height={24}
                                className="rounded-full bg-purple-dark mr-2 shrink-0 object-cover"
                            />
                            <Text.span size="16" weight="semibold">
                                {dapp}
                            </Text.span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
