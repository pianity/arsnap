import { RpcApi } from "@pianity/arsnap-adapter";

import { signWithJwk } from "@/crypto";
import * as walletsUtils from "@/wallets";
import * as permissions from "@/permissions";
import { getOrThrow } from "@/utils";
import { State } from "@/state";
import { confirmPopup } from "@/metamask";

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
    const walletNames: [string, string][] = [...state.wallets.values()].map((wallet) => [
        wallet.metadata.address,
        wallet.metadata.name,
    ]);

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

    const alreadyImportedWallet = state.wallets.get(wallet.metadata.address);

    if (alreadyImportedWallet) {
        throw new Error(
            `Wallet already imported under name ${alreadyImportedWallet.metadata.name}`,
        );
    }

    state.wallets.set(wallet.metadata.address, wallet);

    return { name: wallet.metadata.name, address: wallet.metadata.address };
};

export const exportWallet: WithState<WithOrigin<RpcApi["export_wallet"]>> = async (
    state,
    origin,
    address,
) => {
    const wallet = state.wallets.get(address);

    if (!wallet) {
        throw new Error(`Wallet not found for address: ${address}`);
    }

    const granted = await confirmPopup(
        "Wallet Export Request",
        "Attention! A dApp is trying to export one of your wallets, proceed carefully.",
        `The dApp at ${origin} is requesting the exportation of your wallet: ${wallet.metadata.name} (${wallet.metadata.address}).` +
            "If the request doesn't originate for you, please decline.",
    );

    if (!granted) {
        throw new Error("Wallet exportation not granted");
    }

    return { jwk: wallet.key, address: wallet.metadata.address, name: wallet.metadata.name };
};

export const renameWallet: WithState<RpcApi["rename_wallet"]> = async (state, address, name) => {
    const wallet = getOrThrow(state.wallets, address);

    wallet.metadata.name = name;

    return null;
};

export const deleteWallet: WithState<WithOrigin<RpcApi["delete_wallet"]>> = async (
    state,
    origin,
    address,
) => {
    const wallet = state.wallets.get(address);

    if (!wallet) {
        throw new Error(`Wallet not found for address: ${address}`);
    }

    const granted = await confirmPopup(
        "Wallet Export Request",
        "Attention! A dApp is trying to remove one of your wallets, proceed carefully.",
        `The dApp at ${origin} is requesting the DELETION of your wallet: ${wallet.metadata.name} (${wallet.metadata.address}).` +
            "If the request doesn't originate for you, please decline.",
    );

    if (!granted) {
        throw new Error("Wallet deletion not granted");
    }

    state.wallets.delete(address);

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
