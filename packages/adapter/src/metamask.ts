import { RpcMethods, RpcParam } from "@/types";

import { SNAP_ID } from "@/consts";
import { sleep } from "@/utils";

declare global {
    interface Window {
        ethereum: {
            isMetaMask: boolean;
            request: (
                request: unknown | { method: string; params?: Record<string, unknown>[] },
            ) => Promise<any>;
            on: (eventName: unknown, callback: unknown) => unknown;
            isConnected: () => Promise<boolean>;
            /**
             * Experimental API
             */
            _metamask: {
                isUnlocked: () => Promise<boolean>;
            };
        };
    }
}

function request(method: string, params: Record<string, unknown>): Promise<any> {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
        throw new Error("MetaMask is not installed");
    }

    return window.ethereum.request({
        method,
        params,
    });
}

/**
 * WARNING: This function relies on an experimental Metamask API.
 */
export function isUnlocked(timeout = 5): Promise<boolean | "timeout"> {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
        throw new Error("MetaMask is not installed");
    }

    return Promise.race<boolean | "timeout">([
        window.ethereum._metamask.isUnlocked(),
        sleep(timeout).then(() => "timeout"),
    ]);
}

export async function connect() {
    await request("wallet_requestSnaps", { [SNAP_ID]: {} });
}

export function requestSnap<T extends keyof RpcMethods>(
    method: T,
    params: Parameters<RpcMethods[T]>,
): ReturnType<RpcMethods[T]> {
    if (params) {
        return request("wallet_invokeSnap", {
            snapId: SNAP_ID,
            request: { method, params },
        }) as ReturnType<RpcMethods[T]>;
    } else {
        return request("wallet_invokeSnap", { snapId: SNAP_ID, request: { method } }) as ReturnType<
            RpcMethods[T]
        >;
    }
}
