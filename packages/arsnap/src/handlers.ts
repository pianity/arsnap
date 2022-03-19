import { ImportWallet, SignBytes } from "@pianity/arsnap-adapter";

import { JWKPublicInterface, signWithJwk } from "@/crypto";
import { getActiveWallet, importWallet as actuallyImportWallet } from "@/wallets";
import { ownerToAddress } from "@/utils";
import { getState } from "@/metamask";

export function isEnabled(): boolean {
    return true;
}

export async function getActiveAddress(): Promise<string> {
    const { metadata } = await getActiveWallet();

    return metadata.address;
}

export async function getActivePublicKey(): Promise<JWKPublicInterface> {
    const wallet = await getActiveWallet();

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

    for (const [address, { metadata }] of Object.entries(wallets)) {
        walletNames[metadata.address] = metadata.name;
    }

    return walletNames;
}

export async function importWallet([jwk, name]: ImportWallet["params"]): Promise<boolean> {
    actuallyImportWallet({
        key: jwk,
        metadata: {
            address: await ownerToAddress(jwk.n),
            name,
        },
    });

    return true;
}

export async function signBytes([data, saltLength]: SignBytes["params"]): Promise<Uint8Array> {
    data = new Uint8Array(Object.values(data));

    const wallet = await getActiveWallet();

    return await signWithJwk(wallet.key, data, saltLength);
}
