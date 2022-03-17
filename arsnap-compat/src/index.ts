import Transaction from "arweave/node/lib/transaction";

import * as adapter from "@pianity/arsnap-adapter";

declare global {
    interface Window {
        arweaveWallet: {
            /**
             * Enable ArSnap. Both parameters are ignored for now as no permission system has been
             * implemented yet.
             *
             * @param permissions - Permissions to request
             * @param appInfo - Name and logo of the dApp
             */
            connect: (permissions: Permission[], appInfo?: AppInfo) => Promise<void>;

            /**
             * Doesn't do anything for now.
             */
            disconnect: () => Promise<void>;

            getActiveAddress: () => Promise<string>;
            getActivePublicKey: () => Promise<string>;
            sign: (transaction: Transaction) => Promise<Transaction>;
            signature: (data: Uint8Array, options?: { saltLength: number }) => Promise<Uint8Array>;
        };
    }
}

type Permission =
    | "ACCESS_ADDRESS"
    | "ACCESS_PUBLIC_KEY"
    | "ACCESS_ALL_ADDRESSES"
    | "SIGN_TRANSACTION"
    | "DISPATCH"
    | "ENCRYPT"
    | "DECRYPT"
    | "SIGNATURE"
    | "ACCESS_ARWEAVE_CONFIG";

type AppInfo = { name?: string; logo?: string };

async function getArweaveConfig() {
    // TODO: implement me
}

async function connect(_permissions?: Permission[], _appInfo?: AppInfo) {
    await adapter.enable();
}

async function disconnect() {
    // TODO: implement me
}

async function getPermissions(): Promise<Permission[]> {
    return [
        "ACCESS_ADDRESS",
        "ACCESS_PUBLIC_KEY",
        "ACCESS_ALL_ADDRESSES",
        "SIGN_TRANSACTION",
        "DISPATCH",
        "ENCRYPT",
        "DECRYPT",
        "SIGNATURE",
        "ACCESS_ARWEAVE_CONFIG",
    ];
}

async function getActiveAddress(): Promise<string> {
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
