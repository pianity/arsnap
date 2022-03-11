import Transaction from "arweave/node/lib/transaction";
import { JWKPublicInterface } from "arweave/node/lib/wallet";

import { RpcRequest, SNAP_ID } from "@/api/types";

export async function request(method: string, params: unknown[]): Promise<any> {
    const response = await window.ethereum.request({
        method,
        params,
    });

    return response;
}

export async function requestSnap<T>(invoke: RpcRequest): Promise<T> {
    return await request("wallet_invokeSnap", [SNAP_ID, invoke]);
}

export async function enable() {
    await request("wallet_enable", [{ wallet_snap: { [SNAP_ID]: {} } }]);
}

export async function isEnabled(): Promise<boolean> {
    return await requestSnap({ method: "is_enabled" });
}

export async function generateWallet(): Promise<void> {
    return await requestSnap({ method: "generate_wallet" });
}

export async function signBytes(bytes: Uint8Array): Promise<string> {
    return await requestSnap({
        method: "sign_bytes",
        params: {
            bytes,
        },
    });
}

export async function getPubKey(): Promise<JWKPublicInterface> {
    return await requestSnap({ method: "get_pub_key" });
}

export async function getAddress(): Promise<string> {
    return await requestSnap({ method: "get_address" });
}
