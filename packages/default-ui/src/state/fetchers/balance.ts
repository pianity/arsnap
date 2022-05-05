import BigNumber from "bignumber.js";
import { arweave } from "@/utils/blockchain";

export type Balance = {
    ar?: string;
    fiat?: string;
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

export default async function getBalance(address: string): Promise<Balance> {
    const ar = await getArBalance(address);
    const fiat = await getFiatBalance(ar);

    return { ar, fiat };
}
