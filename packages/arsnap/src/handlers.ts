import { RpcApi } from "@pianity/arsnap-adapter";

import { signWithJwk } from "@/crypto";
import * as walletUtils from "@/wallets";
import { ownerToAddress } from "@/utils";
import { getState } from "@/metamask";

export const isEnabled: RpcApi["is_enabled"] = async () => {
    return true;
};

export const getPermissions: RpcApi["get_permissions"] = async () => {
    return [];
};

export const getActiveAddress: RpcApi["get_active_address"] = async () => {
    const { metadata } = await walletUtils.getActiveWallet();

    return metadata.address;
};

export const getActivePublicKey: RpcApi["get_active_public_key"] = async () => {
    const wallet = await walletUtils.getActiveWallet();

    return wallet.key.n;
};

export const getAllAddresses: RpcApi["get_all_addresses"] = async () => {
    const { wallets } = await getState();

    const addresses = Object.keys(wallets);

    return addresses;
};

export const getWalletNames: RpcApi["get_wallet_names"] = async () => {
    const { wallets } = await getState();

    const walletNames: Record<string, string> = {};

    for (const { metadata } of Object.values(wallets)) {
        walletNames[metadata.address] = metadata.name;
    }

    return walletNames;
};

export const signBytes: RpcApi["sign_bytes"] = async (data, saltLength) => {
    data = new Uint8Array(Object.values(data));

    const wallet = await walletUtils.getActiveWallet();

    return await signWithJwk(wallet.key, data, saltLength);
};

export const setActiveAddress: RpcApi["set_active_address"] = async (address) => {
    await walletUtils.setActiveAddress(address);
};

export const importWallet: RpcApi["import_wallet"] = async (jwk, name) => {
    await walletUtils.importWallet({
        key: jwk,
        metadata: {
            address: await ownerToAddress(jwk.n),
            name,
        },
    });
};

export const renameWallet: RpcApi["rename_wallet"] = async (address, name) => {
    await walletUtils.renameWallet(address, name);
};
