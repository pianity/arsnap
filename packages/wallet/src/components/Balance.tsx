import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Text from "@/components/interface/typography/Text";
import Container from "@/components/interface/layout/Container";
import sendIconUrl from "@/assets/icons/send.svg";
import { AppRoute } from "@/consts";
import { classes } from "@/utils/tailwind";
import { getFiatFormatter } from "@/utils/locale";

type BalanceProps = {
    /** Set to true to shrink size of balance component */
    shrink?: boolean;
    /** Balance state */
    balance?: number;
    price?: number;
};

/**
 * Renders the wallet's balance in both AR and fiat
 * along with a send button.
 */
export default function Balance({ shrink, balance, price }: BalanceProps) {
    const [fiatBalance, setFiatBalance] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (balance !== undefined && price !== undefined) {
            setFiatBalance(getFiatFormatter().format(balance * price));
        }
    }, [balance, price]);

    return (
        <Container
            opaque
            centerAll
            className={
                "relative shrink-0 transition-size duration-300 ease-quart-out " +
                (shrink ? "h-[104px]" : "h-[200px]")
            }
        >
            {/* MARK: AR Balance */}
            <Text.span
                color={balance !== undefined ? "gray-dark" : "orange"}
                size={shrink ? "32" : "56"}
                weight="bold"
                pulse={balance === undefined}
                className="mb-2"
            >{`${balance?.toFixed(6) || "0"} AR`}</Text.span>

            {/* MARK: FIAT Balance */}
            <Text.span
                color={fiatBalance !== undefined ? "gray-light" : "orange"}
                size={shrink ? "18" : "20"}
                pulse={fiatBalance === undefined}
            >{`${fiatBalance || "0"} USD`}</Text.span>

            {/* MARK: Send button */}
            <Link
                to={AppRoute.Send}
                className={classes(
                    "absolute right-12 top-1/2 -translate-y-1/2",
                    "w-16 h-16",
                    "rounded-full",
                    "bg-[color:#E2E2FE] text-purple-dark",
                    "flex items-center justify-center",
                )}
            >
                <img src={sendIconUrl} width={25} height={25} alt="Send" />
            </Link>
        </Container>
    );
}
