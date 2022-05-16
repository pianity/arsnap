import { Dispatch } from "react";
import BigNumber from "bignumber.js";

import { arweave } from "@/utils/blockchain";
import { SetBalance } from "@/state";

export type Balance = {
    ar: string;
    fiat: string;
};

async function getArBalance(address: string) {
    const winston = await arweave.wallets.getBalance(address);
    const ar = new BigNumber(arweave.ar.winstonToAr(winston)).decimalPlaces(6);

    return ar.toString();
}

async function getFiatBalance(ar: string) {
    const res = await (
        await fetch("https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=usd")
    ).json();
    const price = res.arweave.usd;

    const fiat = new BigNumber(ar).times(price).decimalPlaces(2);

    return fiat.toString();
}

async function getBalance(address: string): Promise<Balance> {
    const ar = await getArBalance(address);
    const fiat = await getFiatBalance(ar);

    return { ar, fiat };
}

export async function updateBalance(address: string, dispatch: Dispatch<SetBalance>) {
    const balance = await getBalance(address);

    dispatch({
        type: "setBalance",
        balance,
    });
}
