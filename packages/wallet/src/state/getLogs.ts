import { Dispatch } from "react";

import { getLogs, LogEntry } from "@pianity/arsnap-adapter";

import { SetLogs } from "@/state";

export type DappsLogs = Map<string, LogEntry[]>;

export async function updateLogs(dispatch: Dispatch<SetLogs>) {
    const logs = new Map(await getLogs());

    dispatch({
        type: "setLogs",
        logs,
    });
}
