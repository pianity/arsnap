import Arweave from "arweave";

import Transaction from "arweave/node/lib/transaction";
import { Base64 } from "js-base64";

import * as api from "@/api";
import { SIGNING_CLIENT_VERSION } from "@/consts";

const arsnapTags = [
    { name: "Signing-Client", value: "ArSnap" },
    { name: "Signing-Client-Version", value: SIGNING_CLIENT_VERSION },
];

/**
 * Sign a transaction with the current active wallet.
 *
 * @param tx - The transaction to sign
 *
 * @requires - ["GET_ACTIVE_PUBLIC_KEY", "SIGN"]
 */
export async function signTx(tx: Transaction): Promise<void> {
    const owner = await api.getActivePublicKey();

    tx.setOwner(owner);

    arsnapTags.forEach((tag) => {
        tx.addTag(tag.name, tag.value);
    });

    const dataToSign = await tx.getSignatureData();
    const dataSigned = await api.signBytes(dataToSign, 32);
    console.log("SIGN_BYTES", dataToSign, dataSigned);
    const id = await crypto.subtle.digest("SHA-256", dataSigned);

    tx.setSignature({
        id: Base64.fromUint8Array(new Uint8Array(id), true),
        owner,
        signature: Base64.fromUint8Array(dataSigned, true),
    });
}

/**
 * Send `winston` winstons using the current active wallet.
 *
 * @param arweave - Arweave client used to send the transaction
 * @param winston - Amount of winstons to send (1 winston = 0.000000000001 AR)
 * @param recipient - Address that should receive the winstons
 *
 * @requires - ["GET_ACTIVE_PUBLIC_KEY", "SIGN"]
 */
export async function sendWinstonTo(arweave: Arweave, winston: string, recipient: string) {
    const tx = await arweave.createTransaction({
        quantity: winston,
        target: recipient,
    });

    arsnapTags.forEach((tag) => {
        tx.addTag(tag.name, tag.value);
    });

    await signTx(tx);

    await arweave.transactions.post(tx);
}
