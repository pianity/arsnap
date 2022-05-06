import { Reducer, useReducer } from "react";

import { Balance } from "@/state/wallet/getBalance";
import { exhaustive } from "@/utils";

export * from "@/state/wallet/getBalance";
export * from "@/state/wallet/getTransactions";

export type TransactionDirection = "in" | "out";

export type Transaction = {
    id: string;
    direction: TransactionDirection;
    amount: string;
    timestamp: number;
};

export type Transactions = Transaction[];

export type WalletState = {
    address: string;
    balance: Balance | null;
    transactions: Transactions | null;
};

type SwitchWallet = {
    type: "switchWallet";
    address: string;
};

type SetBalance = {
    type: "setBalance";
    balance: Balance;
};

type SetTransactions = {
    type: "setTransactions";
    transactions: Transactions;
};

export type WalletAction = SwitchWallet | SetBalance | SetTransactions;

const reducer: Reducer<WalletState, WalletAction> = (state, action): WalletState => {
    switch (action.type) {
        case "switchWallet":
            return {
                address: action.address,
                balance: null,
                transactions: null,
            };

        case "setBalance":
            return {
                ...state,
                balance: action.balance,
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

export function useWalletReducer(address: string) {
    // TODO: grab initial state from sessionStorage

    return useReducer(reducer, { address, balance: null, transactions: null });
}
