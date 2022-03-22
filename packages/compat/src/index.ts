import { AppInfo, PermissionType } from "arconnect";
import Transaction from "arweave/node/lib/transaction";

import * as adapter from "@pianity/arsnap-adapter";

async function connect(permissions: adapter.Permission[], _appInfo?: AppInfo) {
    await adapter.enable();
    await adapter.requestPermissions(permissions);
}

async function getPermissions(): Promise<PermissionType[]> {
    const permissions = await adapter.getPermissions();

    const arconnectPermissions: PermissionType[] = [
        "ACCESS_ADDRESS",
        "ACCESS_PUBLIC_KEY",
        "ACCESS_ALL_ADDRESSES",
        "SIGN_TRANSACTION",
        "ENCRYPT",
        "DECRYPT",
        "SIGNATURE",
        "ACCESS_ARWEAVE_CONFIG",
        "DISPATCH",
    ];

    const filteredPermissions = permissions.filter((permission) =>
        (arconnectPermissions as string[]).includes(permission),
    );

    return filteredPermissions as PermissionType[];
}

async function getActivePublicKey(): Promise<string> {
    return await adapter.getActivePublicKey();
}

async function getAllAddresses(): Promise<string[]> {
    return adapter.getAllAddresses();
}

async function getWalletNames(): Promise<Record<string, string>> {
    return adapter.getWalletNames();
}

async function sign(transaction: Transaction): Promise<Transaction> {
    await adapter.signTx(transaction);

    return transaction;
}

function signature(data: Uint8Array, options = { saltLength: 32 }): Promise<Uint8Array> {
    return adapter.signBytes(data, options.saltLength);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
function unimplemented(..._args: unknown[]): any {
    throw new Error("This function hasn't yet been implemented!");
}

if (typeof window !== "undefined") {
    window.addEventListener("load", async () => {
        if (window.arweaveWallet) {
            console.warn("`window.arweaveWallet` is already defined, it will be overwritten.");
        }

        window.arweaveWallet = {
            walletName: "ArSnap",
            connect,
            disconnect: unimplemented,
            getPermissions,
            getArweaveConfig: unimplemented,
            getActiveAddress: adapter.getActiveAddress,
            getActivePublicKey,
            getAllAddresses,
            getWalletNames,
            sign,
            signature,
            dispatch: unimplemented,
            encrypt: unimplemented,
            decrypt: unimplemented,
            addToken: unimplemented,
        };
    });
}
