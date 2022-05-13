import { requestSnap } from "@/metamask";

import { RpcApi } from "@/types";

export const isEnabled: RpcApi["is_enabled"] = (...params) => {
    return requestSnap("is_enabled", params);
};

export const getPermissions: RpcApi["get_permissions"] = (...params) => {
    return requestSnap("get_permissions", params);
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

export const signBytes: RpcApi["sign_bytes"] = (...params) => {
    return requestSnap("sign_bytes", params);
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

export const renameWallet: RpcApi["rename_wallet"] = (...params) => {
    return requestSnap("rename_wallet", params);
};

export const requestPermissions: RpcApi["request_permissions"] = (...params) => {
    return requestSnap("request_permissions", params);
};
