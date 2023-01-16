import { requestSnap } from "@/metamask";

import { RpcMethods } from "@/types";

export const isEnabled: RpcMethods["is_enabled"] = async (...params) => {
    try {
        return await requestSnap("is_enabled", params);
    } catch {
        return false;
    }
};

/**
 * Get the permissions granted to current dApp.
 */
export const getPermissions: RpcMethods["get_permissions"] = (...params) => {
    return requestSnap("get_permissions", params);
};

/**
 * Request permissions for the current dApp.
 */
export const requestPermissions: RpcMethods["request_permissions"] = (...params) => {
    return requestSnap("request_permissions", params);
};

/**
 * Revoke permissions for the current dApp.
 */
export const revokePermission: RpcMethods["revoke_permissions"] = (...params) => {
    return requestSnap("revoke_permissions", params);
};

/**
 * Revoke all the granted permissions for the current dApp.
 */
export const revokeAllPermissions: RpcMethods["revoke_all_permissions"] = (...params) => {
    return requestSnap("revoke_all_permissions", params);
};

/**
 * Get permisssions granted for all dApps.
 *
 * @requires "GET_DAPPS_PERMISSIONS"
 */
export const getDappsPermissions: RpcMethods["get_dapps_permissions"] = (...params) => {
    return requestSnap("get_dapps_permissions", params);
};

/**
 * Revoke permissions for the specified dApp.
 * @requires "REVOKE_DAPP_PERMISSIONS"
 */
export const revokeDappPermission: RpcMethods["revoke_dapp_permissions"] = (...params) => {
    return requestSnap("revoke_dapp_permissions", params);
};

/**
 * Get the address of the currently active wallet.
 *
 * @requires "GET_ACTIVE_ADDRESS"
 */
export const getActiveAddress: RpcMethods["get_active_address"] = (...params) => {
    return requestSnap("get_active_address", params);
};

/**
 * Get the public key of the currently active wallet.
 *
 * @requires "GET_ACTIVE_PUBLIC_KEY"
 */
export const getActivePublicKey: RpcMethods["get_active_public_key"] = (...params) => {
    return requestSnap("get_active_public_key", params);
};

/**
 * Get addresses for all the stored wallets.
 *
 * @requires "GET_ALL_ADDRESSES"
 */
export const getAllAddresses: RpcMethods["get_all_addresses"] = (...params) => {
    return requestSnap("get_all_addresses", params);
};

/**
 * Get all the addresses and their names.
 *
 * @requires "GET_ALL_ADDRESSES"
 */
export const getWalletNames: RpcMethods["get_wallet_names"] = (...params) => {
    return requestSnap("get_wallet_names", params);
};

/**
 * Sign bytes with the currently active wallet.
 *
 * @requires "SIGN"
 */
export const signBytes: RpcMethods["sign_bytes"] = async (...params) => {
    // NOTE: As everything sent to and from Metamask has to be serialized to JSON and as
    // Uint8Array isn't serializable, we have to pass the bytes as an array of numbers instead and
    // convert it back to Uint8Array.
    return requestSnap("sign_bytes", [
        Array.from(params[0]) as unknown as Uint8Array,
        params[1],
    ]).then((bytes) => new Uint8Array(bytes));
};

/**
 * @requires "SET_ACTIVE_ADDRESS"
 */
export const setActiveAddress: RpcMethods["set_active_address"] = (...params) => {
    return requestSnap("set_active_address", params);
};

/**
 * @requires "IMPORT_WALLET"
 */
export const importWallet: RpcMethods["import_wallet"] = (...params) => {
    return requestSnap("import_wallet", params);
};

/**
 * @requires "EXPORT_WALLET"
 */
export const exportWallet: RpcMethods["export_wallet"] = (...params) => {
    return requestSnap("export_wallet", params);
};

/**
 * @requires "RENAME_WALLET"
 */
export const renameWallet: RpcMethods["rename_wallet"] = (...params) => {
    return requestSnap("rename_wallet", params);
};

/**
 * @requires "DELETE_WALLET"
 */
export const deleteWallet: RpcMethods["delete_wallet"] = (...params) => {
    return requestSnap("delete_wallet", params);
};

/**
 * @requires "GET_LOGS"
 */
export const getLogs: RpcMethods["get_logs"] = (...params) => {
    return requestSnap("get_logs", params);
};

/**
 * @requires "CLEAR_LOGS"
 */
export const clearLogs: RpcMethods["clear_logs"] = (...params) => {
    return requestSnap("clear_logs", params);
};
