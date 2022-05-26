import { RpcRequest } from "@/types";

import { SNAP_ID } from "@/consts";

declare global {
    interface Window {
        ethereum: {
            isMetaMask: boolean;
            isUnlocked: Promise<boolean>;
            request: (request: unknown | { method: string; params?: any[] }) => Promise<any>;
            on: (eventName: unknown, callback: unknown) => unknown;
        };
    }
}

function request(method: string, params: unknown[]): Promise<any> {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
        throw new Error("MetaMask is not installed");
    }

    return window.ethereum.request({
        method,
        params,
    });
}

export async function connect() {
    await request("wallet_enable", [{ wallet_snap: { [SNAP_ID]: {} } }]);
}

export function requestSnap<T extends RpcRequest, U>(
    method: T["method"],
    params: T["params"],
): Promise<U> {
    return request("wallet_invokeSnap", [SNAP_ID, { method, params }]);
}
