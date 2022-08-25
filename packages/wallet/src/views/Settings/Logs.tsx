import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { LogEntry } from "@pianity/arsnap-adapter";

import { DappsLogs } from "@/state";
import ViewContainer from "@/components/interface/layout/ViewContainer";
import Container from "@/components/interface/layout/Container";
import { classes } from "@/utils/tailwind";
import Chevron from "@/components/interface/svg/Chevron";
import Text from "@/components/interface/typography/Text";
import { AppRoute } from "@/consts";
import Button from "@/components/interface/form/Button";
import DappsList from "@/components/permissions/DappsList";
import Checkbox from "@/components/interface/form/Checkbox";
import LogsList from "@/components/logs/LogsList";

const LOGS_PER_PAGE = 9;

export type LogsProps = {
    logs?: DappsLogs;
    onClearLogs: () => void;
};

export default function Logs({ logs: allLogs, onClearLogs }: LogsProps) {
    const [showWalletLogs, setShowWalletLogs] = useState(false);
    const [dapps, setDapps] = useState<string[]>([]);
    const [currentDapp, setCurrentDapp] = useState<"all" | string>("all");
    const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);

    // Update dapps list
    useEffect(() => {
        const rawDapps = Array.from(allLogs?.keys() || []);
        const dapps = showWalletLogs
            ? rawDapps
            : rawDapps.filter((origin) => origin !== window.origin);

        if (!dapps.includes(currentDapp)) {
            setCurrentDapp("all");
        }

        setDapps(["all", ...dapps]);
    }, [allLogs, showWalletLogs]);

    useEffect(() => {
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

                        <Button
                            outlined
                            color="white"
                            className="transition-colors"
                            onClick={() => onClearLogs()}
                        >
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

                    <LogsList logs={filteredLogs} logsPerPage={LOGS_PER_PAGE} />
                </div>
            </Container>
        </ViewContainer>
    );
}
