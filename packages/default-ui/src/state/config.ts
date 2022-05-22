import { Reducer, useReducer } from "react";

import { exhaustive } from "@/utils";
import { DEFAULT_CURRENCY, DEFAULT_GATEWAY } from "@/consts";

export type Currency = "USD" | "EUR" | "GBP";
export type GatewayName = "arweave" | "testnet";

enum ConfigKeys {
    Currency = "currency",
    Gateway = "gateway",
}

export type Config = {
    [ConfigKeys.Currency]: Currency;
    [ConfigKeys.Gateway]: GatewayName;
};

export type GatewayInfo = { protocol: string; host: string; port: number };

function getLocalStorageItem<T extends ConfigKeys>(key: T): Config[T] | null {
    const storageItem = window.localStorage.getItem(key) as any;

    return storageItem;
}

function setLocalStorageItem<T extends ConfigKeys>(key: T, value: Config[T]) {
    window.localStorage.setItem(key, value);
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
            setLocalStorageItem(ConfigKeys.Currency, action.currency);
            return {
                ...state,
                currency: action.currency,
            };

        case "setGateway":
            setLocalStorageItem(ConfigKeys.Gateway, action.gateway);
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
        currency: getLocalStorageItem(ConfigKeys.Currency) || DEFAULT_CURRENCY,
        gateway: getLocalStorageItem(ConfigKeys.Gateway) || DEFAULT_GATEWAY,
    };

    return useReducer(reducer, config);
}
