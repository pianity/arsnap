import Transaction from "arweave/node/lib/transaction";
import { JWKInterface, JWKPublicInterface } from "arweave/node/lib/wallet";

import { Base64 } from "js-base64";
import { RpcRequest, SNAP_ID } from "@/api/types";

export function request(method: string, params: unknown[]): Promise<any> {
    return window.ethereum.request({
        method,
        params,
    });
}

export function requestSnap<T>(invoke: RpcRequest): Promise<T> {
    return request("wallet_invokeSnap", [SNAP_ID, invoke]);
}

export async function enable() {
    await request("wallet_enable", [{ wallet_snap: { [SNAP_ID]: {} } }]);
}

export function isEnabled(): Promise<boolean> {
    return requestSnap({ method: "is_enabled" });
}

export function getActiveAddress(): Promise<string> {
    return requestSnap({ method: "get_active_address" });
}

export function getActivePublicKey(): Promise<JWKPublicInterface> {
    return requestSnap({ method: "get_active_public_key" });
}

export function getAllAddresses(): Promise<string[]> {
    return requestSnap({ method: "get_all_addresses" });
}

export function getWalletNames(): Promise<Record<string, string | undefined>> {
    return requestSnap({ method: "get_wallet_names" });
}

export function importWallet(jwk: JWKInterface, name?: string): Promise<void> {
    return request("wallet_import", [jwk, name]);
}

export function signBytes(bytes: Uint8Array, saltLength = 32): Promise<Uint8Array> {
    return requestSnap({
        method: "sign_bytes",
        params: [bytes, saltLength],
    });
}

/**
 * Helper function to sign a transaction. Makes two request to obtain the public key and to sign
 * the transaction.
 * @param tx - The transaction to sign
 */
export async function signTx(tx: Transaction): Promise<void> {
    const { n: owner } = await getActivePublicKey();

    tx.setOwner(owner);

    const dataToSign = await tx.getSignatureData();
    const dataSigned = new Uint8Array(Object.values(await signBytes(dataToSign)));
    const id = await crypto.subtle.digest("SHA-256", dataSigned);

    tx.setSignature({
        id: Base64.fromUint8Array(new Uint8Array(id), true),
        owner,
        signature: Base64.fromUint8Array(dataSigned, true),
    });
}
