import { Dispatch } from "react";

import * as adapter from "@pianity/arsnap-adapter";

import { SnapAction } from "@/state/snap";

export async function updateWallets(dispatch: Dispatch<SnapAction>) {
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
