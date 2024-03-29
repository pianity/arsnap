import { AppInfo, PermissionType as ArconnectPermission } from "arconnect";
import Transaction from "arweave/node/lib/transaction";

import * as adapter from "@pianity/arsnap-adapter";

const PERMISSIONS_TRANSLATIONS: Record<
    adapter.RpcPermission,
    ArconnectPermission | null | ArconnectPermission[]
> = {
    GET_ACTIVE_ADDRESS: "ACCESS_ADDRESS",
    GET_ACTIVE_PUBLIC_KEY: "ACCESS_PUBLIC_KEY",
    GET_ALL_ADDRESSES: "ACCESS_ALL_ADDRESSES",

    SIGN: ["SIGNATURE", "SIGN_TRANSACTION"],

    SET_ACTIVE_ADDRESS: null,
    GET_DAPPS_PERMISSIONS: null,
    REVOKE_DAPP_PERMISSIONS: null,
    IMPORT_WALLET: null,
    RENAME_WALLET: null,
    DELETE_WALLET: null,

    GET_LOGS: null,
    CLEAR_LOGS: null,
};

function reverseFind(needle: ArconnectPermission): adapter.RpcPermission {
    const translations = Object.entries(PERMISSIONS_TRANSLATIONS);

    for (const [permission, translation] of translations) {
        if (translation === null) continue;

        if (typeof translation === "string") {
            if (translation === needle) {
                return permission as unknown as adapter.RpcPermission;
            }
        }

        if (translation instanceof Array) {
            if (translation.find((value) => value === needle)) {
                return permission as unknown as adapter.RpcPermission;
            }
        }
    }

    throw new Error(`Couldn't translate permission ${needle}`);
}

function convertPermsToArconnect(permissions: adapter.RpcPermission[]): ArconnectPermission[] {
    const translatedPermissions: ArconnectPermission[] = permissions
        .map((permission) => PERMISSIONS_TRANSLATIONS[permission])
        .flat()
        .filter((permission): permission is ArconnectPermission => permission !== null);

    return translatedPermissions;
}

function convertPermsToArsnap(permissions: ArconnectPermission[]): adapter.RpcPermission[] {
    const translatedPermissions: adapter.RpcPermission[] = permissions
        .map((permission) => reverseFind(permission))
        .flat();

    return translatedPermissions;
}

async function connect(permissions: ArconnectPermission[], _appInfo?: AppInfo) {
    await adapter.connect();
    await adapter.requestPermissions(convertPermsToArsnap(permissions));
}

async function disconnect() {
    try {
        await adapter.revokeAllPermissions();
    } catch {
        // ignore errors
    }
}

async function getPermissions(): Promise<ArconnectPermission[]> {
    try {
        const permissions = await adapter.getPermissions();

        return convertPermsToArconnect(permissions);
    } catch {
        return [];
    }
}

async function getActivePublicKey(): Promise<string> {
    return await adapter.getActivePublicKey();
}

async function getAllAddresses(): Promise<string[]> {
    return adapter.getAllAddresses();
}

async function getWalletNames(): Promise<Record<string, string>> {
    return Object.fromEntries(await adapter.getWalletNames());
}

async function sign(transaction: Transaction): Promise<Transaction> {
    await adapter.signTx(transaction);

    return transaction;
}

function signature(
    data: Uint8Array,
    options: AlgorithmIdentifier | RsaPssParams | EcdsaParams,
): Promise<Uint8Array> {
    const { saltLength } = options as RsaPssParams;

    return adapter.signBytes(data, saltLength);
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
            disconnect,
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
