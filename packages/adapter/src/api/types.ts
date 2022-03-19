import { JWKInterface } from "arweave/node/lib/wallet";

declare global {
    interface Window {
        ethereum: {
            isMetaMask: boolean;
            isUnlocked: Promise<boolean>;
            request: (request: unknown | { method: string; params?: any[] }) => Promise<any>;
            on: (eventName: unknown, callback: unknown) => unknown;
        };
    }
}

export const SNAP_ID = `local:http://localhost:4000/`;

export type SnapId = typeof SNAP_ID;

// walletName: "ArSnap",
// connect,
// disconnect: unimplemented,
// getPermissions,
// getArweaveConfig: unimplemented,
// getActiveAddress,
// getActivePublicKey,
// getWalletNames: unimplemented,
// getAllAddresses: unimplemented,
// sign,
// signature,
// dispatch: unimplemented,
// encrypt: unimplemented,
// decrypt: unimplemented,
// addToken: unimplemented,

export type IsEnabled = {
    method: "is_enabled";
};

export type GetActiveAddress = {
    method: "get_active_address";
};

export type GetActivePublicKey = {
    method: "get_active_public_key";
};

export type GetAllAddresses = {
    method: "get_all_addresses";
};

export type GetWalletNames = {
    method: "get_wallet_names";
};

/**
 * params[0] - wallet to import
 * params[1] - (optional) name of wallet
 */
export type ImportWallet = {
    method: "import_wallet";
    params: [JWKInterface, string];
};

/**
 * params[0] - bytes to sign
 * params[1] - saltLength
 */
export type SignBytes = {
    method: "sign_bytes";
    params: [Uint8Array, number];
};

export type RpcRequest =
    | IsEnabled
    | GetActiveAddress
    | GetActivePublicKey
    | GetAllAddresses
    | GetWalletNames
    | ImportWallet
    | SignBytes;
