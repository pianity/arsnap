import { LogEntry, RpcLogInfo } from "@pianity/arsnap-adapter";

import LabeledInfo from "@/components/LabeledInfo";
import { classes } from "@/utils/tailwind";
import Chevron from "@/components/interface/svg/Chevron";
import Text from "@/components/interface/typography/Text";
import { formatTimestamp } from "@/utils/locale";
import { DappItem } from "@/components/permissions/DappsList";

function LogDetails({
    params,
}: {
    params: [string, string | string[] | Record<string, unknown>][];
}) {
    return (
        <div className="grid grid-cols-[minmax(auto,50%)_1fr] gap-6">
            {params.map(([key, value]) => (
                <LabeledInfo key={key} label={key} info={value} />
            ))}
        </div>
    );
}

export type LogItemProps = {
    log: LogEntry;
    showDetails: boolean;
    onShowDetails: () => void;
    disableTransition?: boolean;
};

export default function LogItem({
    log,
    showDetails,
    onShowDetails,
    disableTransition = false,
}: LogItemProps) {
    const params = Object.entries(log.info).filter(
        ([key]) => (key as keyof RpcLogInfo) !== "method",
    );
    const hasDetails = params.length > 0;

    return (
        <div>
            <div
                onClick={hasDetails ? onShowDetails : undefined}
                className={classes(
                    "flex items-center h-[62px] px-3 group cursor-pointer",
                    "transition duration-300 ease-quart-out",
                    "hover:bg-purple/50 rounded",
                )}
            >
                {/* MARK: Open details button */}
                <button
                    onClick={onShowDetails}
                    className={classes(
                        "mr-2 w-6 h-6 flex items-center justify-center rounded-full bg-white",
                        "text-purple-dark",
                        !hasDetails && "opacity-25",
                        !disableTransition && "transition-transform ease-quart-out duration-300",
                        showDetails && "rotate-180",
                    )}
                >
                    <Chevron />
                </button>

                {/* MARK: Log name + timestamp */}
                <div className="flex flex-col grow">
                    <Text size="18" color="white" weight="semibold" taller className="mb-1">
                        {log.info.method}
                    </Text>
                    <Text.span size="14" color="purple-light" opacity="50">
                        {formatTimestamp(log.timestamp)}
                    </Text.span>
                </div>

                {/* MARK: Origin */}
                <div className="flex w-40 items-end shrink-0">
                    <DappItem origin={log.origin} iconPosition="right" />
                </div>
            </div>

            {/* MARK: Details view */}
            <div
                className={classes(
                    "bg-purple-dark bg-opacity-30 rounded-lg relative",
                    !disableTransition && "ease-quart-out transition-size duration-300",
                    showDetails ? "h-[200px] mb-4" : "h-0 mb-0 pointer-events-none overflow-hidden",
                )}
            >
                {/* MARK: Info Container */}
                {hasDetails && showDetails && (
                    <div className="flex flex-col h-full w-full py-10 pl-10 pr-12">
                        <LogDetails params={params} />
                    </div>
                )}
            </div>
        </div>
    );
}
