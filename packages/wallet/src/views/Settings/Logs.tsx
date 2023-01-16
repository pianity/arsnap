import { useEffect, useState } from "react";

import { LogEntry } from "@pianity/arsnap-adapter";

import { DappsLogs } from "@/state";
import Button from "@/components/interface/form/Button";
import DappsList from "@/components/permissions/DappsList";
import Checkbox from "@/components/interface/form/Checkbox";
import LogsList from "@/components/logs/LogsList";
import { BaseLayout } from "@/components/interface/layout/settingsLayout";

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
        <BaseLayout
            category="Logs"
            sideHeader={
                <>
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
                            readOnly
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
                </>
            }
        >
            <div className="grow grid grid-cols-[auto,1fr]">
                <DappsList currentDapp={currentDapp} dapps={dapps} onDappClick={setCurrentDapp} />

                <LogsList logs={filteredLogs} logsPerPage={LOGS_PER_PAGE} />
            </div>
        </BaseLayout>
    );
}
