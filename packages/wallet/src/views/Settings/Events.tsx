import { useState } from "react";
import { Link } from "react-router-dom";

import { RequestEvents } from "@/state";
import ViewContainer from "@/components/interface/layout/ViewContainer";
import Container from "@/components/interface/layout/Container";
import { classes } from "@/utils/tailwind";
import Chevron from "@/components/interface/svg/Chevron";
import Text from "@/components/interface/typography/Text";
import { AppRoute } from "@/consts";
import { truncateStringCenter } from "@/utils";
import Tooltip from "@/components/interface/Tooltip";
import { formatTimestamp } from "@/utils/locale";

type EventsListProps = {
    events: RequestEvents;
};

function EventsList({ events }: EventsListProps) {
    return (
        <div className={classes("flex flex-col", "w-full pr-4 pl-6 py-6 mb-[14px]")}>
            <Text.h3 color="white" size="12" weight="semibold" wider uppercase className="mb-6">
                Events
            </Text.h3>
            <ul>
                {events.map(({ timestamp, origin, request }) => {
                    const formattedOrigin = truncateStringCenter(origin, 22);

                    return (
                        <li key={timestamp} className="flex items-center mb-5 last:mb-0 space-x-3">
                            <Text.span size="16" color="purple-light" opacity="50">
                                {formatTimestamp(timestamp)}
                            </Text.span>

                            <Tooltip text={origin}>
                                <Text.span size="16" color="purple-text">
                                    {formattedOrigin}
                                </Text.span>
                            </Tooltip>

                            <Text.span size="16" weight="semibold" color="white">
                                {request.method}
                            </Text.span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export type EventsProps = {
    events?: RequestEvents;
};

export default function Events({ events }: EventsProps) {
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
                            Events
                        </Text.h2>
                    </div>
                </div>
                <div className="h-[1px] bg-purple mt-6 shrink-0" />
                <div className="grow grid grid-cols-[auto,1fr]">
                    {events && <EventsList events={events} />}
                </div>
            </Container>
        </ViewContainer>
    );
}
