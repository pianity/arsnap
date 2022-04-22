import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";

import { arweave } from "@/utils/blockchain";
import { SetState } from "@/utils/types";

type BalanceProps = {
    address: string;
};

async function getArBalance(address: string) {
    const winston = await arweave.wallets.getBalance(address);
    const ar = new BigNumber(arweave.ar.winstonToAr(winston)).decimalPlaces(6);

    return ar.toString();
}

async function getFiatBalance(ar: string) {
    // const balance = new BigNumber(ar).decimalPlaces(6);
    // const balanceFiat = await arweave.ar.winstonToFiat(balance.toString());
    const res = await (
        await fetch("https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=usd")
    ).json();
    const price = res.arweave.usd;

    const fiat = new BigNumber(ar).times(price).decimalPlaces(2);

    return fiat.toString();
}

export default function Balance(props: BalanceProps) {
    const { address } = props;

    const [arBalance, setArBalance] = useState<string | null>(null);
    const [fiatBalance, setFiatBalance] = useState<string | null>(null);

    useEffect(() => {
        async function initializeState() {
            const ar = await getArBalance(address);
            setArBalance(ar);

            const fiat = await getFiatBalance(ar);
            setFiatBalance(fiat);
        }

        initializeState();
    }, []);

    return (
        <>
            <p>{`${arBalance || "loading AR balance..."} AR`}</p>
            <p>{`${fiatBalance || "loading FIAT balance..."} $`}</p>
        </>
    );
}
