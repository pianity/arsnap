import { Link, To } from "react-router-dom";

import { AppRoute } from "@/consts";
import Text from "@/components/interface/typography/Text";
import { classes } from "@/utils/tailwind";
import Chevron from "@/components/interface/svg/Chevron";
import { BaseLayout } from "@/components/interface/layout/settingsLayout";

export default function Settings() {
    return (
        <BaseLayout>
            <ul className="mt-4">
                <SettingsLink
                    to={AppRoute.GeneralSettings}
                    title="General Settings"
                    subtitle="Edit currency, etc..."
                />
                <SettingsLink to={AppRoute.Logs} title="Logs" subtitle="View security logs" />
                <SettingsLink
                    to={AppRoute.Permissions}
                    title="Permissions"
                    subtitle="Manage site permissions"
                />
            </ul>
        </BaseLayout>
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
                    "hover:bg-purple/50",
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
