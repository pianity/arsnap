import { ReactNode } from "react";
import { Link } from "react-router-dom";

import ViewContainer from "@/components/interface/layout/ViewContainer";
import Container from "@/components/interface/layout/Container";
import Text from "@/components/interface/typography/Text";
import { classes } from "@/utils/tailwind";
import Chevron from "@/components/interface/svg/Chevron";
import { AppRoute } from "@/consts";

export type BaseLayoutProps = {
    category?: string;
    sideHeader?: ReactNode;
    children: ReactNode;
};

export function BaseLayout({ category, sideHeader, children }: BaseLayoutProps) {
    const settingsTitle = (
        <Text.h1 size="32" weight="bold" taller>
            Settings
        </Text.h1>
    );

    return (
        <ViewContainer>
            <Container className="px-6 py-8 grow">
                <div className="flex shrink-0">
                    {category ? (
                        <>
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
                                {settingsTitle}
                                <Text.h2 color="purple-text" size="18" weight="bold" taller>
                                    {category}
                                </Text.h2>
                            </div>
                        </>
                    ) : (
                        <>{settingsTitle}</>
                    )}

                    {sideHeader && (
                        <div className="flex ml-auto self-center space-x-5">{sideHeader}</div>
                    )}
                </div>

                <div className="h-[1px] bg-purple mt-6 mb-0" />

                {children}
            </Container>
        </ViewContainer>
    );
}
