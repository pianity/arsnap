import * as Base64 from "base64-js";

export function exhaustive(_: never): never {
    throw new Error("Check wasn't exhaustive");
}

export interface JWKPublicInterface {
    kty: string;
    e: string;
    n: string;
}

export interface JWKInterface extends JWKPublicInterface {
    d?: string;
    p?: string;
    q?: string;
    dp?: string;
    dq?: string;
    qi?: string;
}

export async function generateJWK(): Promise<JWKInterface> {
    const cryptoKey = await crypto.subtle.generateKey(
        {
            name: "RSA-PSS",
            modulusLength: 4096,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
                name: "SHA-256",
            },
        },
        true,
        ["sign"],
    );

    if (!cryptoKey.privateKey) {
        throw new Error("Failed to generate private key");
    }

    const jwk = await crypto.subtle.exportKey("jwk", cryptoKey.privateKey);

    if (!jwk.e || !jwk.n) {
        throw new Error("JWK missing e and n");
    }

    return {
        kty: "RSA",
        e: jwk.e,
        n: jwk.n,
        d: jwk.d,
        p: jwk.p,
        q: jwk.q,
        dp: jwk.dp,
        dq: jwk.dq,
        qi: jwk.qi,
    };
}

function b64UrlToBuffer(b64UrlString: string): Uint8Array {
    return new Uint8Array(Base64.toByteArray(b64UrlDecode(b64UrlString)));
}

function bufferTob64(buffer: Uint8Array): string {
    return Base64.fromByteArray(new Uint8Array(buffer));
}

function bufferTob64Url(buffer: Uint8Array): string {
    return b64UrlEncode(bufferTob64(buffer));
}

function b64UrlEncode(b64UrlString: string): string {
    // eslint-disable-next-line no-useless-escape
    return b64UrlString.replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
}

function b64UrlDecode(b64UrlString: string): string {
    // eslint-disable-next-line no-useless-escape
    b64UrlString = b64UrlString.replace(/\-/g, "+").replace(/\_/g, "/");
    const padding = b64UrlString.length % 4 === 0 ? 0 : 4 - (b64UrlString.length % 4);
    return b64UrlString.concat("=".repeat(padding));
}

async function hash(data: Uint8Array, algorithm = "SHA-256"): Promise<Uint8Array> {
    const digest = await crypto.subtle.digest(algorithm, data);

    return new Uint8Array(digest);
}

export async function ownerToAddress(owner: string): Promise<string> {
    return bufferTob64Url(await hash(b64UrlToBuffer(owner)));
}
