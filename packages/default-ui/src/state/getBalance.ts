import { Dispatch } from "react";
import redstone from "redstone-api";

import { arweave as getArweave } from "@/utils/blockchain";
import { SetArBalance, SetArPrice } from "@/state";
import { GatewayName } from "@/state/config";

async function getArBalance(gateway: GatewayName, address: string) {
    const arweave = getArweave(gateway);

    const winston = await arweave.wallets.getBalance(address);
    const ar = arweave.ar.winstonToAr(winston);

    return Number(ar);
}

async function getArPrice() {
    return (await redstone.getPrice("AR")).value;
}

export async function updateBalance(
    gateway: GatewayName,
    address: string,
    dispatch: Dispatch<SetArBalance | SetArPrice>,
) {
    const balance = await getArBalance(gateway, address);

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
