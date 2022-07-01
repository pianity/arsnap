import { Dispatch } from "react";

import * as adapter from "@pianity/arsnap-adapter";

import { SetEvents } from "@/state";

export type RequestEvents = adapter.RequestEvent[];

export async function updateEvents(dispatch: Dispatch<SetEvents>) {
    const events = await adapter.getEvents();
    dispatch({
        type: "setEvents",
        events,
    });
}
