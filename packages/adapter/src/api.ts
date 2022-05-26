import { requestSnap } from "@/metamask";

import { RpcApi } from "@/types";

export const isEnabled: RpcApi["is_enabled"] = async (...params) => {
    try {
        return await requestSnap("is_enabled", params);
    } catch {
        return false;
    }
};

export const getPermissions: RpcApi["get_permissions"] = (...params) => {
    return requestSnap("get_permissions", params);
};

/**
 * Request permissions to the user.
 *
 * @returns true when requested permissions were granted or if they've already been granted.
 * Returns false otherwise.
 */
export const requestPermissions: RpcApi["request_permissions"] = (...params) => {
    return requestSnap("request_permissions", params);
};

export const revokePermission: RpcApi["revoke_permissions"] = (...params) => {
    return requestSnap("revoke_permissions", params);
};

/**
 * Get permisssions granted to all dApps.
 */
export const getAllPermissions: RpcApi["get_dapps_permissions"] = (...params) => {
    return requestSnap("get_dapps_permissions", params);
};

export const revokeDappPermission: RpcApi["revoke_dapp_permissions"] = (...params) => {
    return requestSnap("revoke_dapp_permissions", params);
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

/**
 * Returns an array of all wallets addresses and their attached name in the following form:
 * `[address: string, name: string][]`
 */
export const getWalletNames: RpcApi["get_wallet_names"] = (...params) => {
    return requestSnap("get_wallet_names", params);
};

export const signBytes: RpcApi["sign_bytes"] = async (...params) => {
    // NOTE: As everything that is sent back from MetaMask is serialized, the object coming from
    // ArSnap is not an actual Uint8Array but a serialized version of it so we need to convert it
    // back.
    const bytes = (await requestSnap("sign_bytes", params)) as { [k: number]: number };
    return new Uint8Array(Object.values(bytes));
};

export const setActiveAddress: RpcApi["set_active_address"] = (...params) => {
    return requestSnap("set_active_address", params);
};

export const importWallet: RpcApi["import_wallet"] = (...params) => {
    return requestSnap("import_wallet", params);
};

export const exportWallet: RpcApi["export_wallet"] = (...params) => {
    return requestSnap("export_wallet", params);
};

export const deleteWallet: RpcApi["delete_wallet"] = (...params) => {
    return requestSnap("delete_wallet", params);
};

export const renameWallet: RpcApi["rename_wallet"] = (...params) => {
    return requestSnap("rename_wallet", params);
};
