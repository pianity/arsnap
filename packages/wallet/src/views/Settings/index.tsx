import { Link, To } from "react-router-dom";

import { AppRoute } from "@/consts";
import ViewContainer from "@/components/interface/layout/ViewContainer";
import Container from "@/components/interface/layout/Container";
import Text from "@/components/interface/typography/Text";
import { classes } from "@/utils/tailwind";
import Chevron from "@/components/interface/svg/Chevron";

export default function Settings() {
    return (
        <ViewContainer>
            <Container className="px-6 py-8">
                <Text.h1 size="32" weight="bold" taller>
                    Settings
                </Text.h1>
                <div className="h-[1px] bg-purple mt-6 mb-4" />
                <ul>
                    <SettingsLink
                        to={AppRoute.GeneralSettings}
                        title="General Settings"
                        subtitle="Edit currency, etc..."
                    />
                    <SettingsLink
                        to={AppRoute.Events}
                        title="Events"
                        subtitle="View security events"
                    />
                    <SettingsLink
                        to={AppRoute.Permissions}
                        title="Permissions"
                        subtitle="Manage site permissions"
                    />
                </ul>
            </Container>
        </ViewContainer>
    );
}

type SettingsLinkProps = {
    to: To;
    title: string;
    subtitle?: string;
};

function SettingsLink({ to, title, subtitle }: SettingsLinkProps) {
    return (
        <Link to={to}>
            <li
                className={classes(
                    "group",
                    "h-14 px-4",
                    "rounded-lg",
                    "flex items-center justify-between",
                    "transition duration-300 ease-quart-out",
                    "hover:bg-purple",
                )}
            >
                <Text.h2 size="18" weight="semibold" taller>
                    {title}
                </Text.h2>

                <div className="flex items-center">
                    {subtitle && (
                        <Text.span
                            color="purple-light"
                            opacity="75"
                            size="14"
                            className={classes(
                                "mr-3",
                                "lg:group-hover:text-white lg:group-hover:opacity-100",
                            )}
                        >
                            {subtitle}
                        </Text.span>
                    )}

                    <div
                        className={classes(
                            "w-8 h-8",
                            "rounded-full",
                            "bg-purple-light text-purple-dark",
                            "flex items-center justify-center",
                        )}
                    >
                        <Chevron className="-rotate-90" />
                    </div>
                </div>
            </li>
        </Link>
    );
}
