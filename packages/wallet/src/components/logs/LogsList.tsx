import { useEffect, useState } from "react";

import { LogEntry } from "@pianity/arsnap-adapter";

import LogItem from "@/components/logs/LogItem";
import Pagination from "@/components/interface/Pagination";
import Text from "@/components/interface/typography/Text";
import LoadingIndicator from "@/components/interface/svg/LoadingIndicator";

export type LogsListProps = {
    logs?: LogEntry[];
    logsPerPage: number;
};

export default function LogsList({ logs, logsPerPage }: LogsListProps) {
    const [page, setPage] = useState(1);
    const [pageView, setPageView] = useState<LogEntry[]>([]);
    const [showDetails, setShowDetails] = useState<number | undefined>();
    const [changingPage, setChangingPage] = useState<number | undefined>();

    useEffect(() => {
        setPage(1);
    }, [logs]);

    useEffect(() => {
        if (changingPage !== undefined) {
            setPage(changingPage);
            setChangingPage(undefined);
        }
    }, [changingPage]);

    useEffect(() => {
        if (!logs) {
            setPageView([]);
            return;
        }

        const newPageView = logs.slice(
            (page - 1) * logsPerPage,
            (page - 1) * logsPerPage + logsPerPage,
        );

        setPageView(newPageView);
    }, [page, logs]);

    return (
        <div className="flex flex-col pl-6 py-4">
            {/* MARK: Logs list */}
            {logs &&
                (logs.length > 0 ? (
                    <>
                        <ul className="grow">
                            {pageView.map((log, i) => (
                                <li key={i}>
                                    <LogItem
                                        log={log}
                                        showDetails={showDetails === i}
                                        onShowDetails={() =>
                                            setShowDetails(showDetails === i ? undefined : i)
                                        }
                                        disableTransition={changingPage !== undefined}
                                    />
                                </li>
                            ))}
                        </ul>

                        <div className="self-center">
                            <Pagination
                                pages={Math.max(Math.ceil(logs.length / logsPerPage), 1)}
                                currentPage={page}
                                onPageChange={(newPage) => {
                                    setShowDetails(undefined);
                                    setChangingPage(newPage);
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <Text.span className="mt-10 flex justify-center">No activity</Text.span>
                ))}

            {/* MARK: Loading */}
            {!logs && (
                <div className="mt-10 flex justify-center">
                    <LoadingIndicator />
                </div>
            )}
        </div>
    );
}
