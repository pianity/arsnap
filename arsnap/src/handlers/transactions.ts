import { getState } from "@/metamask";
import { JWKInterface } from "@/utils";

async function jwkToCryptoKey(jwk: JWKInterface) {
    const key = await crypto.subtle.importKey(
        "jwk",
        jwk,
        {
            name: "RSA-PSS",
            hash: "SHA-256",
        },
        false,
        ["sign"],
    );

    return key;
}

export async function signBytes(data: Uint8Array): Promise<Uint8Array> {
    data = new Uint8Array(Object.values(data));

    const { wallet } = await getState();

    if (!wallet) {
        throw new Error("No wallet found");
    }

    const cryptoKey = await jwkToCryptoKey(wallet.key);

    const signature = await crypto.subtle.sign(
        {
            name: "RSA-PSS",
            saltLength: 32,
        },
        cryptoKey,
        data,
    );

    return new Uint8Array(signature);
}
