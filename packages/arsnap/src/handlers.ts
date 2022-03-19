import { ImportWallet, RenameWallet, SetActiveAddress, SignBytes } from "@pianity/arsnap-adapter";

import { JWKPublicInterface, signWithJwk } from "@/crypto";
import * as walletUtils from "@/wallets";
import { ownerToAddress } from "@/utils";
import { getState } from "@/metamask";

export function isEnabled(): boolean {
    return true;
}

export async function getActiveAddress(): Promise<string> {
    const { metadata } = await walletUtils.getActiveWallet();

    return metadata.address;
}

export async function getActivePublicKey(): Promise<JWKPublicInterface> {
    const wallet = await walletUtils.getActiveWallet();

    return {
        kty: "RSA",
        e: wallet.key.e,
        n: wallet.key.n,
    };
}

export async function getAllAddresses(): Promise<string[]> {
    const { wallets } = await getState();

    const addresses = Object.keys(wallets);

    return addresses;
}

export async function getWalletNames(): Promise<Record<string, string>> {
    const { wallets } = await getState();

    const walletNames: Record<string, string> = {};

    for (const { metadata } of Object.values(wallets)) {
        walletNames[metadata.address] = metadata.name;
    }

    return walletNames;
}

export async function signBytes([data, saltLength]: SignBytes["params"]): Promise<Uint8Array> {
    data = new Uint8Array(Object.values(data));

    const wallet = await walletUtils.getActiveWallet();

    return await signWithJwk(wallet.key, data, saltLength);
}

export async function setActiveAddress([address]: SetActiveAddress["params"]): Promise<boolean> {
    await walletUtils.setActiveAddress(address);

    return true;
}

export async function importWallet([jwk, name]: ImportWallet["params"]): Promise<boolean> {
    await walletUtils.importWallet({
        key: jwk,
        metadata: {
            address: await ownerToAddress(jwk.n),
            name,
        },
    });

    return true;
}

export async function renameWallet([address, name]: RenameWallet["params"]): Promise<boolean> {
    await walletUtils.renameWallet(address, name);

    return true;
}
