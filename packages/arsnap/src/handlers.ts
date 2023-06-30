import { RpcMethods } from "@pianity/arsnap-adapter";

import { signWithJwk } from "@/crypto";
import * as walletsUtils from "@/wallets";
import * as permissions from "@/permissions";
import { getOrThrow, truncateStringCenter } from "@/utils";
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

export const isEnabled: RpcMethods["is_enabled"] = async () => {
    return true;
};

export const getPermissions: WithState<WithOrigin<RpcMethods["get_permissions"]>> = async (
    state,
    origin,
) => {
    return state.permissions.get(origin) || [];
};

export const requestPermissions: WithState<WithOrigin<RpcMethods["request_permissions"]>> = async (
    state,
    origin,
    requestedPermissions,
) => {
    const currentPermissions = state.permissions.get(origin) || [];

    const { granted, permissions: newPermissions } = await permissions.requestPermissions(
        origin,
        currentPermissions,
        requestedPermissions,
    );

    if (granted) {
        state.permissions.set(origin, newPermissions);
    }

    return granted;
};

export const revokePermissions: WithState<WithOrigin<RpcMethods["revoke_permissions"]>> = async (
    state,
    origin,
    permissionsToRevoke,
) => {
    const currentPermissions = state.permissions.get(origin);

    if (!currentPermissions) {
        return null;
    }

    state.permissions.set(
        origin,
        permissions.revokePermissions(currentPermissions, permissionsToRevoke),
    );

    return null;
};

export const revokeAllPermissions: WithState<
    WithOrigin<RpcMethods["revoke_all_permissions"]>
> = async (state, origin) => {
    const currentPermissions = state.permissions.get(origin);

    if (!currentPermissions) {
        return null;
    }

    state.permissions.set(origin, []);

    return null;
};

export const getDappsPermissions: WithState<RpcMethods["get_dapps_permissions"]> = async (
    state,
) => {
    return [...state.permissions.entries()];
};

export const revokeDappPermissions: WithState<RpcMethods["revoke_dapp_permissions"]> = async (
    state,
    dapp,
    permissionsToRevoke,
) => {
    const currentPermissions = state.permissions.get(dapp);

    if (!currentPermissions) {
        return null;
    }

    state.permissions.set(
        dapp,
        permissions.revokePermissions(currentPermissions, permissionsToRevoke),
    );

    return null;
};

export const getActiveAddress: WithState<RpcMethods["get_active_address"]> = async (state) => {
    const { metadata } = getOrThrow(state.wallets, state.activeWallet);

    return metadata.address;
};

export const getActivePublicKey: WithState<RpcMethods["get_active_public_key"]> = async (state) => {
    const wallet = getOrThrow(state.wallets, state.activeWallet);

    return wallet.metadata.keyOwnerField;
};

export const getAllAddresses: WithState<RpcMethods["get_all_addresses"]> = async (state) => {
    const addresses = Array.from(state.wallets.keys());

    return addresses;
};

export const getWalletNames: WithState<RpcMethods["get_wallet_names"]> = async (state) => {
    const walletNames: [string, string][] = [...state.wallets.values()].map((wallet) => [
        wallet.metadata.address,
        wallet.metadata.name,
    ]);

    return walletNames;
};

export const signBytes: WithState<RpcMethods["sign_bytes"]> = async (
    state,
    rawData,
    saltLength,
) => {
    // NOTE: As everything sent to and from Metamask has to be serialized to JSON and as
    // Uint8Array isn't serializable, we have to pass the bytes as an array of numbers instead and
    // convert it back to Uint8Array.
    const data = new Uint8Array(rawData);

    const wallet = getOrThrow(state.wallets, state.activeWallet);

    return Array.from(await signWithJwk(wallet.key, data, saltLength)) as unknown as Uint8Array;
};

export const setActiveAddress: WithState<RpcMethods["set_active_address"]> = async (
    state,
    address,
) => {
    if (!state.wallets.get(address)) {
        throw new Error(`Couldn't find any wallet with address "${address}"`);
    }

    state.activeWallet = address;

    return null;
};

export const importWallet: WithState<RpcMethods["import_wallet"]> = async (state, jwk, name) => {
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

export const renameWallet: WithState<RpcMethods["rename_wallet"]> = async (
    state,
    address,
    name,
) => {
    const wallet = getOrThrow(state.wallets, address);

    wallet.metadata.name = name;

    return null;
};

// TODO: prevent from deleting last wallet
export const deleteWallet: WithState<WithOrigin<RpcMethods["delete_wallet"]>> = async (
    state,
    origin,
    address,
) => {
    const wallet = getOrThrow(state.wallets, address);

    if (wallet.metadata.isProtected) {
        throw new Error("Cannot delete protected wallet");
    }

    const granted = await confirmPopup("Wallet Deletion Request", [
        "**A DApp is trying to remove one of your wallets.**",
        "",
        `The dApp at **${origin}** is requesting the DELETION of the following wallet:`,
        `-> **${wallet.metadata.name}**`,
        `-> **${truncateStringCenter(wallet.metadata.address)}**`,
        "",
        "If the request doesn't originate from you, please decline.",
    ]);

    if (!granted) {
        throw new Error("Wallet deletion declined by user");
    }

    state.wallets.delete(address);

    return null;
};
