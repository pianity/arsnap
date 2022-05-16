import { Dispatch } from "react";

import * as adapter from "@pianity/arsnap-adapter";

import { SetActiveWallet, SetWallets } from "@/state";

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
