import { requestSnap } from "@/metamask";

import { RpcApi } from "@/types";

export const isEnabled: RpcApi["is_enabled"] = async (...params) => {
    try {
        return await requestSnap("is_enabled", params);
    } catch {
        return false;
    }
};

/**
 * Get the permissions granted to current dApp.
 */
export const getPermissions: RpcApi["get_permissions"] = (...params) => {
    return requestSnap("get_permissions", params);
};

/**
 * Request permissions for the current dApp.
 */
export const requestPermissions: RpcApi["request_permissions"] = (...params) => {
    return requestSnap("request_permissions", params);
};

/**
 * Revoke permissions for the current dApp.
 */
export const revokePermission: RpcApi["revoke_permissions"] = (...params) => {
    return requestSnap("revoke_permissions", params);
};

/**
 * Revoke all the granted permissions for the current dApp.
 */
export const revokeAllPermissions: RpcApi["revoke_all_permissions"] = (...params) => {
    return requestSnap("revoke_all_permissions", params);
};

/**
 * Get permisssions granted for all dApps.
 *
 * @requires "GET_DAPPS_PERMISSIONS"
 */
export const getDappsPermissions: RpcApi["get_dapps_permissions"] = (...params) => {
    return requestSnap("get_dapps_permissions", params);
};

/**
 * Revoke permissions for the specified dApp.
 * @requires "REVOKE_DAPP_PERMISSIONS"
 */
export const revokeDappPermission: RpcApi["revoke_dapp_permissions"] = (...params) => {
    return requestSnap("revoke_dapp_permissions", params);
};

/**
 * Get the address of the currently active wallet.
 *
 * @requires "GET_ACTIVE_ADDRESS"
 */
export const getActiveAddress: RpcApi["get_active_address"] = (...params) => {
    return requestSnap("get_active_address", params);
};

/**
 * Get the public key of the currently active wallet.
 *
 * @requires "GET_ACTIVE_PUBLIC_KEY"
 */
export const getActivePublicKey: RpcApi["get_active_public_key"] = (...params) => {
    return requestSnap("get_active_public_key", params);
};

/**
 * Get addresses for all the stored wallets.
 *
 * @requires "GET_ALL_ADDRESSES"
 */
export const getAllAddresses: RpcApi["get_all_addresses"] = (...params) => {
    return requestSnap("get_all_addresses", params);
};

/**
 * Get all the addresses and their names.
 *
 * @requires "GET_ALL_ADDRESSES"
 */
export const getWalletNames: RpcApi["get_wallet_names"] = (...params) => {
    return requestSnap("get_wallet_names", params);
};

/**
 * @requires "SIGN"
 */
export const signBytes: RpcApi["sign_bytes"] = async (...params) => {
    // NOTE: As everything that is sent back from MetaMask is serialized, the object coming from
    // ArSnap is not an actual Uint8Array but a serialized version of it so we need to convert it
    // back.
    const bytes = (await requestSnap("sign_bytes", params)) as { [k: number]: number };
    return new Uint8Array(Object.values(bytes));
};

/**
 * @requires "SET_ACTIVE_ADDRESS"
 */
export const setActiveAddress: RpcApi["set_active_address"] = (...params) => {
    return requestSnap("set_active_address", params);
};

/**
 * @requires "IMPORT_WALLET"
 */
export const importWallet: RpcApi["import_wallet"] = (...params) => {
    return requestSnap("import_wallet", params);
};

/**
 * @requires "EXPORT_WALLET"
 */
export const exportWallet: RpcApi["export_wallet"] = (...params) => {
    return requestSnap("export_wallet", params);
};

/**
 * @requires "RENAME_WALLET"
 */
export const renameWallet: RpcApi["rename_wallet"] = (...params) => {
    return requestSnap("rename_wallet", params);
};

/**
 * @requires "DELETE_WALLET"
 */
export const deleteWallet: RpcApi["delete_wallet"] = (...params) => {
    return requestSnap("delete_wallet", params);
};

/**
 * @requires "GET_EVENTS"
 */
export const getEvents: RpcApi["get_events"] = (...params) => {
    return requestSnap("get_events", params);
};

/**
 * @requires "CLEAR_EVENTS"
 */
export const clearEvents: RpcApi["clear_events"] = (...params) => {
    return requestSnap("clear_events", params);
};
