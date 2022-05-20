import { Dispatch } from "react";
import redstone from "redstone-api";

import { arweave as getArweave } from "@/utils/blockchain";
import { SetArBalance, SetArPrice } from "@/state";

async function getArBalance(address: string) {
    const arweave = getArweave();

    const winston = await arweave.wallets.getBalance(address);
    const ar = arweave.ar.winstonToAr(winston);

    return Number(ar);
}

async function getArPrice() {
    return (await redstone.getPrice("AR")).value;
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
