import { Reducer, useReducer } from "react";

import { exhaustive } from "@/utils";
import { Transactions } from "@/state/getTransactions";
import { Wallets } from "@/utils/types";

export * from "@/state/getTransactions";
export * from "@/state/getBalance";
export * from "@/state/getWallets";

export type State = {
    activeWallet?: string;
    wallets?: Wallets;
    arBalance?: number;
    arPrice?: number;
    transactions?: Transactions;
};

export type SetActiveWallet = {
    type: "setActiveWallet";
    activeWallet: string;
};

export type SetWallets = {
    type: "setWallets";
    wallets: [string, string][];
};

export type SetArBalance = {
    type: "setArBalance";
    balance: number;
};

export type SetArPrice = {
    type: "setArPrice";
    price: number;
};

export type SetTransactions = {
    type: "setTransactions";
    transactions: Transactions;
};

// type RenameWallet = {
//     type: "renameWallet";
//     address: string;
//     newName: string;
// };

export type Action = SetActiveWallet | SetWallets | SetArBalance | SetArPrice | SetTransactions;
// | RenameWallet;

const reducer: Reducer<State, Action> = (state, action): State => {
    switch (action.type) {
        case "setActiveWallet":
            return {
                ...state,
                activeWallet: action.activeWallet,
            };

        case "setWallets":
            return {
                ...state,
                wallets: new Map(action.wallets),
            };

        // case "renameWallet": {
        //     if (!state.wallets) {
        //         throw new Error("Cannot rename a wallet before wallets has been defined");
        //     }
        //
        //     const walletIndex = state.wallets.findIndex(
        //         ([hayAddress]) => hayAddress === action.address,
        //     );
        //
        //     if (walletIndex < 0) {
        //         throw new Error(`Couldn't find wallet to rename (address: ${action.address})`);
        //     }
        //
        //     state.wallets[walletIndex][1] = action.newName;
        //
        //     return state;
        // }

        case "setArBalance":
            return {
                ...state,
                arBalance: action.balance,
            };

        case "setArPrice":
            return {
                ...state,
                arPrice: action.price,
            };

        case "setTransactions":
            return {
                ...state,
                transactions: action.transactions,
            };

        default:
            exhaustive(action);
            throw new Error();
    }
};

export function useArsnapReducer() {
    // TODO: grab initial state from sessionStorage

    return useReducer(reducer, {});
}
