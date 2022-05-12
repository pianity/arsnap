import { Reducer, useReducer } from "react";

import { exhaustive } from "@/utils";

export type SnapState = {
    activeWallet?: string;
    wallets?: [string, string][];
};

type SetActiveWallet = {
    type: "setActiveWallet";
    activeWallet: string;
};

type SetWallets = {
    type: "setWallets";
    wallets: [string, string][];
};

type RenameWallet = {
    type: "renameWallet";
    address: string;
    newName: string;
};

export type SnapAction = SetActiveWallet | SetWallets | RenameWallet;

const reducer: Reducer<SnapState, SnapAction> = (state, action): SnapState => {
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

        case "renameWallet": {
            if (!state.wallets) {
                throw new Error("Cannot rename a wallet before wallets has been defined");
            }

            const walletIndex = state.wallets.findIndex(
                ([hayAddress]) => hayAddress === action.address,
            );

            if (walletIndex < 0) {
                throw new Error(`Couldn't find wallet to rename (address: ${action.address})`);
            }

            state.wallets[walletIndex][1] = action.newName;

            return state;
        }

        default:
            exhaustive(action);
            throw new Error();
    }
};

export function useSnapReducer(activeWallet?: string, wallets?: [string, string][]) {
    // TODO: grab initial state from sessionStorage

    return useReducer(reducer, { activeWallet, wallets });
}
