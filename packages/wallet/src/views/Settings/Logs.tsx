import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { LogEntry, RpcLogInfo } from "@pianity/arsnap-adapter";

import { DappsLogs, Transaction, Transactions } from "@/state";
import ViewContainer from "@/components/interface/layout/ViewContainer";
import Container from "@/components/interface/layout/Container";
import { classes, TextColor } from "@/utils/tailwind";
import Chevron from "@/components/interface/svg/Chevron";
import Text from "@/components/interface/typography/Text";
import { AppRoute } from "@/consts";
import { exhaustive, truncateStringCenter } from "@/utils";
import Tooltip from "@/components/interface/Tooltip";
import { formatTimestamp, getFiatFormatter } from "@/utils/locale";
import Button from "@/components/interface/Button";
import CopiableText from "@/components/interface/typography/CopiableText";
import LoadingIndicator from "@/components/interface/svg/LoadingIndicator";
import DappsList, { DappItem } from "@/components/permissions/DappsList";
import Checkbox from "@/components/interface/form/Checkbox";
import Pagination from "@/components/Pagination";

const LOGS_PER_PAGE = 9;

type LogsListProps = {
    logs?: LogEntry[];
};

function LogsList({ logs }: LogsListProps) {
    const [showDetails, setShowDetails] = useState<number | undefined>();

    return (
        <>
            {/* MARK: Logs list */}
            {logs &&
                (logs.length > 0 ? (
                    <ul>
                        {logs.map((log, i) => (
                            <li key={i}>
                                <LogItem
                                    log={log}
                                    showDetails={showDetails === i}
                                    onShowDetails={() =>
                                        setShowDetails(showDetails === i ? undefined : i)
                                    }
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <Text.span className="mt-10 flex justify-center">No activity</Text.span>
                ))}

            {/* MARK: Loading */}
            {!logs && (
                <div className="mt-10 flex justify-center">
                    <LoadingIndicator />
                </div>
            )}
        </>
    );
}

type DetailsInfoProps = {
    label: string;
    info: string;
};
function DetailsInfo({ label, info }: DetailsInfoProps) {
    const truncatedInfo = truncateStringCenter(info, 30);

    const InfoText = () => (
        <Text.span color="white" size="13">
            <CopiableText textToCopy={info}>{truncatedInfo}</CopiableText>
        </Text.span>
    );

    return (
        <div className="flex flex-col gap-2 items-start">
            <>
                <Text.span color="white" size="13" weight="semibold" wider uppercase>
                    {label}
                </Text.span>

                {truncatedInfo.length !== info.length ? (
                    <Tooltip text={info}>
                        <InfoText />
                    </Tooltip>
                ) : (
                    <InfoText />
                )}
            </>
        </div>
    );
}

function LogDetails({ params }: { params: [string, unknown][] }) {
    return (
        <div className="grid grid-cols-[minmax(auto,50%)_1fr] gap-6">
            {params.map(([key, value]) => (
                <DetailsInfo label={key} info={typeof value === "string" ? value : "-"} />
            ))}
        </div>
    );
}

type LogItemProps = {
    log: LogEntry;
    showDetails: boolean;
    onShowDetails: () => void;
};
function LogItem({ log, showDetails, onShowDetails }: LogItemProps) {
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
                    "lg:hover:bg-purple/50 rounded",
                )}
            >
                {/* MARK: Open details button */}
                <button
                    onClick={onShowDetails}
                    className={classes(
                        "mr-2 w-6 h-6 flex items-center justify-center rounded-full bg-white",
                        "text-purple-dark transition-transform",
                        !hasDetails && "opacity-25",
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
                    "bg-purple-dark bg-opacity-30 rounded-lg transition-size duration-300",
                    "ease-quart-out relative",
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

export type LogsProps = {
    logs?: DappsLogs;
    onClearLogs: () => void;
};

export default function Logs({ logs: allLogs }: LogsProps) {
    const [showWalletLogs, setShowWalletLogs] = useState(false);
    const [dapps, setDapps] = useState<string[]>([]);
    const [currentDapp, setCurrentDapp] = useState<"all" | string>("all");
    const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
    const [page, setPage] = useState(1);
    const [pageView, setPageView] = useState<LogEntry[]>([]);

    // Update dapps list
    useEffect(() => {
        const rawDapps = Array.from(allLogs?.keys() || []);
        const dapps = showWalletLogs
            ? rawDapps
            : rawDapps.filter((origin) => origin !== window.origin);

        if (!dapps.includes(currentDapp)) {
            setCurrentDapp("all");
            setPage(1);
        }

        setDapps(["all", ...dapps]);
    }, [allLogs, showWalletLogs]);

    useEffect(() => {
        setPage(1);

        const newFilteredLogs = (() => {
            if (!allLogs) {
                return [];
            } else if (currentDapp === "all") {
                const rawLogs = Array.from(allLogs.entries());
                const logs = showWalletLogs
                    ? rawLogs
                    : rawLogs.filter(([origin, _]) => origin !== window.origin);

                return logs.flatMap(([_, logs]) => logs).sort((a, b) => b.timestamp - a.timestamp);
            } else {
                return allLogs.get(currentDapp) || [];
            }
        })();

        setFilteredLogs(newFilteredLogs);
    }, [allLogs, currentDapp, showWalletLogs]);

    useEffect(() => {
        const newPageView = filteredLogs.slice(
            (page - 1) * LOGS_PER_PAGE,
            (page - 1) * LOGS_PER_PAGE + LOGS_PER_PAGE,
        );

        setPageView(newPageView);
    }, [page, filteredLogs]);

    return (
        <ViewContainer>
            <Container className="px-6 pt-8 grow">
                <div className="flex shrink-0">
                    <Link
                        to={AppRoute.Settings}
                        className={classes(
                            "w-8 h-8 mr-4",
                            "rounded-full",
                            "bg-purple-dark text-purple-light",
                            "flex items-center justify-center",
                        )}
                    >
                        <Chevron className="rotate-90" />
                    </Link>

                    <div className="flex flex-col items-start gap-1">
                        <Text.h1 size="32" weight="bold" taller>
                            Settings
                        </Text.h1>
                        <Text.h2 color="purple-text" size="18" weight="bold" taller>
                            Logs
                        </Text.h2>
                    </div>

                    <div className="flex ml-auto self-center space-x-5">
                        <Button
                            outlined={!showWalletLogs}
                            color="white"
                            className="flex transition-colors"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowWalletLogs(!showWalletLogs);
                            }}
                        >
                            <Checkbox
                                style="rounded-fill"
                                checked={showWalletLogs}
                                label={"Show Wallet logs"}
                            />
                        </Button>

                        <Button outlined color="white" className="transition-colors">
                            Clear Logs
                        </Button>
                    </div>
                </div>
                <div className="h-[1px] bg-purple mt-6 shrink-0" />
                <div className="grow grid grid-cols-[auto,1fr]">
                    <DappsList
                        currentDapp={currentDapp}
                        dapps={dapps}
                        onDappClick={setCurrentDapp}
                    />

                    <div className="flex flex-col pl-6 py-4">
                        <div className="grow">
                            <LogsList logs={pageView} />
                        </div>

                        <div className="self-center">
                            <Pagination
                                pages={Math.max(Math.ceil(filteredLogs.length / LOGS_PER_PAGE), 1)}
                                currentPage={page}
                                onPageChange={setPage}
                            />
                        </div>
                    </div>
                </div>
            </Container>
        </ViewContainer>
    );
}
