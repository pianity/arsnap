import { Dispatch } from "react";

import { getEvents, RequestEvent } from "@pianity/arsnap-adapter";

import { SetEvents } from "@/state";

export type DappsEvents = Map<string, RequestEvent[]>;

export async function updateEvents(dispatch: Dispatch<SetEvents>) {
    const events = new Map(await getEvents());

    dispatch({
        type: "setEvents",
        events,
    });
}
