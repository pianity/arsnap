import { Dispatch } from "react";

import * as adapter from "@pianity/arsnap-adapter";

import { SetActiveWallet, SetWallets } from "@/state";

/**
 * Map of wallets where the key is the name and the value the address
 */
export type Wallets = Map<string, string>;

export async function updateWallets(dispatch: Dispatch<SetWallets | SetActiveWallet>) {
    const wallets = await adapter.getWalletNames();
    dispatch({
        type: "setWallets",
        wallets,
    });

    const activeWallet = await adapter.getActiveAddress();
    dispatch({
        type: "setActiveWallet",
        activeWallet,
    });
}
