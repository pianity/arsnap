import { Reducer, useReducer } from "react";

import { exhaustive } from "@/utils";

export const DEFAULT_CURRENCY: Currency = "USD";
export const DEFAULT_GATEWAY: GatewayName = "arweave.net";
export const DEFAULT_TESTNET = false;

export type GatewayInfo = { protocol: string; host: string; port: number };
export const GATEWAYS = {
    "arweave.net": { protocol: "https", host: "arweave.net", port: 443 },
    localhost: { protocol: "http", host: "localhost", port: 1984 },
} as const satisfies Record<string, GatewayInfo>;
export type GatewayName = keyof typeof GATEWAYS;

export type Currency = "USD" | "EUR" | "GBP";

export type Config = {
    currency: Currency;
    gateway: GatewayName;
};
export type ConfigKey = keyof Config;

function getLocalStorageItem<T extends ConfigKey>(key: T): Config[T] | null {
    const storageItem = window.localStorage.getItem(key);
    try {
        return storageItem ? JSON.parse(storageItem) : null;
    } catch {
        return null;
    }
}

function setLocalStorageItem<T extends ConfigKey>(key: T, value: Config[T]) {
    window.localStorage.setItem(key, JSON.stringify(value));
}

export type SetCurreny = {
    type: "setCurrency";
    currency: Currency;
};

export type SetGateway = {
    type: "setGateway";
    gateway: GatewayName;
};

export type ConfigAction = SetCurreny | SetGateway;

const reducer: Reducer<Config, ConfigAction> = (state, action): Config => {
    switch (action.type) {
        case "setCurrency":
            setLocalStorageItem("currency", action.currency);
            return {
                ...state,
                currency: action.currency,
            };

        case "setGateway":
            setLocalStorageItem("gateway", action.gateway);
            return {
                ...state,
                gateway: action.gateway,
            };

        default:
            return exhaustive(action);
    }
};

export function useConfigReducer() {
    const config: Config = {
        currency: getLocalStorageItem("currency") || DEFAULT_CURRENCY,
        gateway: getLocalStorageItem("gateway") || DEFAULT_GATEWAY,
    };

    return useReducer(reducer, config);
}
