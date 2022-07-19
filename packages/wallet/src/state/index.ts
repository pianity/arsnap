import { Reducer, useReducer } from "react";

import { exhaustive } from "@/utils";
import { Transactions } from "@/state/getTransactions";
import { Wallets } from "@/state/getWallets";
import { DappsPermissions } from "@/state/getPermissions";
import { DappsEvents } from "@/state/getEvents";

export * from "@/state/getTransactions";
export * from "@/state/getPermissions";
export * from "@/state/getBalance";
export * from "@/state/getWallets";
export * from "@/state/getEvents";

export type State = {
    activeWallet?: string;
    wallets?: Wallets;
    arBalance?: number;
    arPrice?: number;
    transactions?: Transactions;
    dappsPermissions?: DappsPermissions;
    events?: DappsEvents;
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

export type SetPermissions = {
    type: "setPermissions";
    permissions: DappsPermissions;
};

export type SetEvents = {
    type: "setEvents";
    events: DappsEvents;
};

export type Logout = {
    type: "logout";
};

export type Action =
    | SetActiveWallet
    | SetWallets
    | SetArBalance
    | SetArPrice
    | SetTransactions
    | SetPermissions
    | SetEvents
    | Logout;

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

        case "setPermissions":
            return {
                ...state,
                dappsPermissions: action.permissions,
            };

        case "setEvents":
            return {
                ...state,
                events: action.events,
            };

        case "logout":
            return {};

        default:
            return exhaustive(action);
    }
};

export function useArsnapReducer() {
    return useReducer(reducer, {});
}
