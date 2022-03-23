import { RpcApi } from "@pianity/arsnap-adapter";

import { decryptWallet, signWithJwk } from "@/crypto";
import * as walletsUtils from "@/wallets";
import * as permissions from "@/permissions";
import { ownerToAddress } from "@/utils";
import { getState } from "@/metamask";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WithOrigin<T extends (...params: any[]) => any> = (
    ...params: [origin: string, ...rest: Parameters<T>]
) => ReturnType<T>;

export const isEnabled: RpcApi["is_enabled"] = async () => {
    return true;
};

export const getPermissions: WithOrigin<RpcApi["get_permissions"]> = async (origin) => {
    return permissions.getPermissions(origin);
};

export const getActiveAddress: RpcApi["get_active_address"] = async () => {
    const { metadata } = await walletsUtils.getActiveWallet();

    return metadata.address;
};

export const getActivePublicKey: RpcApi["get_active_public_key"] = async () => {
    const wallet = await walletsUtils.getActiveWallet();

    return wallet.metadata.keyOwnerField;
};

export const getAllAddresses: RpcApi["get_all_addresses"] = async () => {
    const { wallets } = await getState();

    const addresses = Array.from(wallets.keys());

    return addresses;
};

export const getWalletNames: RpcApi["get_wallet_names"] = async () => {
    const { wallets } = await getState();

    const walletNames: Record<string, string> = {};

    for (const { metadata } of wallets.values()) {
        walletNames[metadata.address] = metadata.name;
    }

    return walletNames;
};

export const signBytes: RpcApi["sign_bytes"] = async (data, saltLength) => {
    data = new Uint8Array(Object.values(data));

    const wallet = await decryptWallet(await walletsUtils.getActiveWallet());

    return await signWithJwk(wallet.key, data, saltLength);
};

export const setActiveAddress: RpcApi["set_active_address"] = async (address) => {
    await walletsUtils.setActiveAddress(address);

    return null;
};

export const importWallet: RpcApi["import_wallet"] = async (jwk, name) => {
    await walletsUtils.importJwk(jwk, name);

    return null;
};

export const renameWallet: RpcApi["rename_wallet"] = async (address, name) => {
    await walletsUtils.renameWallet(address, name);

    return null;
};

export const requestPermissions: WithOrigin<RpcApi["request_permissions"]> = async (
    origin,
    requestedPermissions,
) => {
    return permissions.requestPermissions(origin, requestedPermissions);
};
