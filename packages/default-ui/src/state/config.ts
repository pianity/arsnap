export type Currency = "USD" | "EUR" | "GBP";
export type Gateway = { protocol: string; host: string; port: number };

enum ConfigKeys {
    Currency = "currency",
    Gateway = "gateway",
}

export type Config = {
    currency: Currency;
    gateway: Gateway;
};

export const ARWEAVE_GATEWAY: Gateway = { protocol: "https", host: "arweave.net", port: 443 };
export const TESTNET_GATEWAY: Gateway = {
    protocol: "https",
    host: "testnet.redstone.tools",
    port: 443,
};

const DEFAULT_CURRENCY: Currency = "USD";
const DEFAULT_GATEWAY: Gateway = TESTNET_GATEWAY;

function getLocalStorageItem<T>(key: string): T | null {
    const storageItem = window.localStorage.getItem(key);

    return storageItem ? JSON.parse(storageItem) : null;
}

function setLocalStorageItem(key: string, value: unknown) {
    window.localStorage.setItem(key, JSON.stringify(value));
}

export function getCurrency(): Currency {
    return getLocalStorageItem<Currency>(ConfigKeys.Currency) || DEFAULT_CURRENCY;
}

export function getGateway(): Gateway {
    return getLocalStorageItem<Gateway>(ConfigKeys.Gateway) || DEFAULT_GATEWAY;
}

export function setCurrency(currency: Currency) {
    setLocalStorageItem(ConfigKeys.Currency, currency);
}

export function setGateway(gateway: Gateway) {
    setLocalStorageItem(ConfigKeys.Gateway, gateway);
}
