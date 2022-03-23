import Transaction from "arweave/node/lib/transaction";
import { JWKInterface, JWKPublicInterface } from "arweave/node/lib/wallet";
import { Base64 } from "js-base64";

import { Permission, RpcApi, RpcRequest, SNAP_ID } from "@/api/types";

export function request(method: string, params: unknown[]): Promise<any> {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
        throw new Error("MetaMask is not installed");
    }

    return window.ethereum.request({
        method,
        params,
    });
}

// export function requestSnap<T>(invoke: Omit<RpcApi, "signature">): Promise<T> {
//     return request("wallet_invokeSnap", [SNAP_ID, invoke]);
// }

export function requestSnap<T extends RpcRequest, U>(
    method: T["method"],
    params: T["params"],
): Promise<U> {
    return request("wallet_invokeSnap", [SNAP_ID, { method, params }]);
}

export async function enable() {
    await request("wallet_enable", [{ wallet_snap: { [SNAP_ID]: {} } }]);
}

export const isEnabled: RpcApi["is_enabled"] = (...params) => {
    return requestSnap("is_enabled", params);
};

export const isInitialized: RpcApi["is_initialized"] = (...params) => {
    return requestSnap("is_initialized", params);
};

/**
 * Initializes ArSnap's state. It is mendatory to call this method before using any other ArSnap
 * methods. When Metamask will provide a way to initialize Snaps this will be handled automatically
 * and this method will be removed.
 *
 * Returns true if ArSnap has successfully been initialized. Returns false when ArSnap has already
 * been initialized.
 */
export const initialize: RpcApi["initialize"] = (...params) => {
    return requestSnap("initialize", params);
};

export const getPermissions: RpcApi["get_permissions"] = (...params) => {
    return requestSnap("get_permissions", params);
};

export const getActiveAddress: RpcApi["get_active_address"] = (...params) => {
    return requestSnap("get_active_address", params);
};

export const getActivePublicKey: RpcApi["get_active_public_key"] = (...params) => {
    return requestSnap("get_active_public_key", params);
};

export const getAllAddresses: RpcApi["get_all_addresses"] = (...params) => {
    return requestSnap("get_all_addresses", params);
};

export const getWalletNames: RpcApi["get_wallet_names"] = (...params) => {
    return requestSnap("get_wallet_names", params);
};

export const signBytes: RpcApi["sign_bytes"] = (...params) => {
    return requestSnap("sign_bytes", params);
};

export const setActiveAddress: RpcApi["set_active_address"] = (...params) => {
    return requestSnap("set_active_address", params);
};

export const importWallet: RpcApi["import_wallet"] = (...params) => {
    return requestSnap("import_wallet", params);
};

export const renameWallet: RpcApi["rename_wallet"] = (...params) => {
    return requestSnap("rename_wallet", params);
};

export const requestPermissions: RpcApi["request_permissions"] = (...params) => {
    return requestSnap("request_permissions", params);
};

/**
 * Helper function to sign a transaction. Makes two request to obtain the public key and to sign
 * the transaction.
 * @param tx - The transaction to sign
 */
export async function signTx(tx: Transaction): Promise<void> {
    const owner = await getActivePublicKey();

    // TODO: Add ArSnap tags to the transaction
    // tx.addTag(

    tx.setOwner(owner);

    const dataToSign = await tx.getSignatureData();
    const dataSigned = new Uint8Array(Object.values(await signBytes(dataToSign, 32)));
    const id = await crypto.subtle.digest("SHA-256", dataSigned);

    tx.setSignature({
        id: Base64.fromUint8Array(new Uint8Array(id), true),
        owner,
        signature: Base64.fromUint8Array(dataSigned, true),
    });
}
