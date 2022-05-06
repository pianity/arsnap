import { Reducer, useReducer } from "react";

import { exhaustive } from "@/utils";

export type SnapState = {
    activeWallet: string;
    wallets: [string, string][];
};

type SetActiveWallet = {
    type: "setActiveWallet";
    activeWallet: string;
};

type SetWallets = {
    type: "setWallets";
    wallets: [string, string][];
};

type Action = SetActiveWallet | SetWallets;

const reducer: Reducer<SnapState, Action> = (state, action): SnapState => {
    switch (action.type) {
        case "setActiveWallet":
            return {
                ...state,
                activeWallet: action.activeWallet,
            };

        case "setWallets":
            return {
                ...state,
                wallets: action.wallets,
            };

        default:
            exhaustive(action);
            throw new Error();
    }
};

export function useSnapReducer(activeWallet: string, wallets: [string, string][]) {
    // TODO: grab initial state from sessionStorage

    return useReducer(reducer, { activeWallet, wallets });
}
