import Transaction from "arweave/node/lib/transaction";
import { Base64 } from "js-base64";

import * as api from "@/api";

/**
 * Sign a transaction with the current active wallet.
 * @param tx - The transaction to sign
 */
export async function signTx(tx: Transaction): Promise<void> {
    const owner = await api.getActivePublicKey();

    // TODO: Add ArSnap tags to the transaction
    // tx.addTag(

    tx.setOwner(owner);

    const dataToSign = await tx.getSignatureData();
    const dataSigned = new Uint8Array(Object.values(await api.signBytes(dataToSign, 32)));
    const id = await crypto.subtle.digest("SHA-256", dataSigned);

    tx.setSignature({
        id: Base64.fromUint8Array(new Uint8Array(id), true),
        owner,
        signature: Base64.fromUint8Array(dataSigned, true),
    });
}
