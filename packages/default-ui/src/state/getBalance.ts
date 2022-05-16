import { Dispatch } from "react";

import { arweave } from "@/utils/blockchain";
import { SetArBalance, SetArPrice } from "@/state";

async function getArBalance(address: string) {
    const winston = await arweave.wallets.getBalance(address);
    const ar = arweave.ar.winstonToAr(winston);

    return Number(ar);
}

async function getArPrice() {
    const res = await (
        await fetch("https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=usd")
    ).json();
    const price = res.arweave.usd;

    return Number(price);
}

export async function updateBalance(
    address: string,
    dispatch: Dispatch<SetArBalance | SetArPrice>,
) {
    const balance = await getArBalance(address);

    dispatch({
        type: "setArBalance",
        balance,
    });

    const price = await getArPrice();

    dispatch({
        type: "setArPrice",
        price,
    });
}
