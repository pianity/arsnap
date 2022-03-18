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

    const addresses = [];

    for (const wallet of wallets.values()) {
        addresses.push(wallet.metadata.address);
    }

    return addresses;
}

export async function getWalletNames(): Promise<Record<string, string | undefined>> {
    const { wallets } = await getState();

    const walletNames: Record<string, string | undefined> = {};

    for (const { metadata } of wallets.values()) {
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
