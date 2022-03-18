import { SignBytes } from "@pianity/arsnap-adapter";

import { JWKPublicInterface, signWithJwk } from "@/crypto";
import { getActiveWallet } from "@/wallets";

export function isEnabled(): boolean {
    return true;
}

export async function getActiveAddress(): Promise<string> {
    const wallet = await getActiveWallet();

    return wallet.address;
}

export async function getActivePublicKey(): Promise<JWKPublicInterface> {
    const wallet = await getActiveWallet();

    return {
        kty: "RSA",
        e: wallet.key.e,
        n: wallet.key.n,
    };
}

export async function signBytes([data, saltLength]: SignBytes["params"]): Promise<Uint8Array> {
    data = new Uint8Array(Object.values(data));

    const wallet = await getActiveWallet();

    return await signWithJwk(wallet.key, data, saltLength);
}
