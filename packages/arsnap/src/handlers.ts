import { RpcApi } from "@pianity/arsnap-adapter";

import { signWithJwk } from "@/crypto";
import * as walletsUtils from "@/wallets";
import * as permissions from "@/permissions";
import { getOrThrow } from "@/utils";
import { State } from "@/state";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WithOrigin<T extends (...params: any[]) => any> = (
    ...params: [origin: string, ...rest: Parameters<T>]
) => ReturnType<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WithState<T extends (...params: any[]) => any> = (
    ...params: [state: State, ...rest: Parameters<T>]
) => ReturnType<T>;

export const isEnabled: RpcApi["is_enabled"] = async () => {
    return true;
};

export const getPermissions: WithState<WithOrigin<RpcApi["get_permissions"]>> = async (
    state,
    origin,
) => {
    return state.permissions.get(origin) || [];
};

export const getActiveAddress: WithState<RpcApi["get_active_address"]> = async (state) => {
    const { metadata } = getOrThrow(state.wallets, state.activeWallet);

    return metadata.address;
};

export const getActivePublicKey: WithState<RpcApi["get_active_public_key"]> = async (state) => {
    const wallet = getOrThrow(state.wallets, state.activeWallet);

    return wallet.metadata.keyOwnerField;
};

export const getAllAddresses: WithState<RpcApi["get_all_addresses"]> = async (state) => {
    const addresses = Array.from(state.wallets.keys());

    return addresses;
};

export const getWalletNames: WithState<RpcApi["get_wallet_names"]> = async (state) => {
    const walletNames: Record<string, string> = {};

    for (const { metadata } of state.wallets.values()) {
        walletNames[metadata.address] = metadata.name;
    }

    return walletNames;
};

export const signBytes: WithState<RpcApi["sign_bytes"]> = async (state, data, saltLength) => {
    data = new Uint8Array(Object.values(data));

    const wallet = getOrThrow(state.wallets, state.activeWallet);

    return await signWithJwk(wallet.key, data, saltLength);
};

export const setActiveAddress: WithState<RpcApi["set_active_address"]> = async (state, address) => {
    if (!state.wallets.get(address)) {
        throw new Error(`Couldn't find any wallet with address "${address}"`);
    }

    state.activeWallet = address;

    return null;
};

export const importWallet: WithState<RpcApi["import_wallet"]> = async (state, jwk, name) => {
    const wallet = await walletsUtils.jwkToWallet(
        walletsUtils.walletsToNames(state.wallets),
        jwk,
        name,
    );

    state.wallets.set(wallet.metadata.address, wallet);

    return null;
};

export const renameWallet: WithState<RpcApi["rename_wallet"]> = async (state, address, name) => {
    const wallet = getOrThrow(state.wallets, address);

    wallet.metadata.name = name;

    return null;
};

export const requestPermissions: WithState<WithOrigin<RpcApi["request_permissions"]>> = async (
    state,
    origin,
    requestedPermissions,
) => {
    const currentPermissions = state.permissions.get(origin) || [];

    const newPermissions = await permissions.requestPermissions(
        currentPermissions,
        requestedPermissions,
    );

    if (newPermissions.length !== currentPermissions.length) {
        state.permissions.set(origin, newPermissions);

        return true;
    } else {
        return false;
    }
};
