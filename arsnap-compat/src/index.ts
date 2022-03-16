import Transaction from "arweave/node/lib/transaction";

import * as adapter from "@pianity/arsnap-adapter";

declare global {
    interface Window {
        arweaveWallet: {
            connect: (...args: unknown[]) => void;
            disconnect: () => void;
            getActiveAddress: () => Promise<string>;
            getActivePublicKey: () => Promise<string>;
            sign: (transaction: Transaction) => Promise<Transaction>;
            signature: (data: Uint8Array, options?: { saltLength: number }) => Promise<Uint8Array>;
        };
    }
}

async function connect() {
    await adapter.enable();
}

function disconnect() {
    // TODO: implement me
}

function getActiveAddress(): Promise<string> {
    return adapter.getAddress();
}

async function getActivePublicKey(): Promise<string> {
    return (await adapter.getPubKey()).n;
}

async function sign(transaction: Transaction): Promise<Transaction> {
    await adapter.signTx(transaction);

    return transaction;
}

function signature(data: Uint8Array, options?: { saltLength: number }): Promise<Uint8Array> {
    return adapter.signBytes(data, options?.saltLength);
}

if (typeof window !== "undefined") {
    window.addEventListener("load", async () => {
        if (window.arweaveWallet) {
            console.warn("`window.arweaveWallet` is already defined, it will be overwritten.");
        }

        window.arweaveWallet = {
            connect,
            disconnect,
            getActiveAddress,
            getActivePublicKey,
            sign,
            signature,
        };
    });
}

export {};
