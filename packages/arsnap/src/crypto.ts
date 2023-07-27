import init, { keygen } from "@pianity/arsnap-keygen";

import { getSecret } from "@/metamask";
import { Wallet, WalletMetadata } from "@/state";
import { b64ToBin, binToB64 } from "@/utils";

/**
 * @deprecated state will be automatically encrypted by Metamask itself
 */
export type EncryptedData = {
    /**
     * The base 64 encoded IV parameter used to encrypt the data
     */
    iv: string;

    /**
     * The base 64 encoded encrypted data
     */
    data: string;
};

/**
 * @deprecated state will be automatically encrypted by Metamask itself
 */
export type EncryptedWallet = {
    encryptedKey: EncryptedData;
    metadata: WalletMetadata;
};

export type JWKPublicInterface = {
    kty: string;
    e: string;
    n: string;
};

export type JWKInterface = JWKPublicInterface & {
    d?: string;
    p?: string;
    q?: string;
    dp?: string;
    dq?: string;
    qi?: string;
};

function base64ToUint8Array(base64String: string) {
    const binaryString = window.atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
}

/**
 * Convert the pem string to a binary representation
 */
function pemToBin(pem: string) {
    const encoded = pem
        .split("\n")
        .reduce((lines, line) => (line.indexOf("-----") < 0 ? lines + line : lines), "");
    return base64ToUint8Array(encoded);
}

/**
 * Convert the pem key to the official arweave key format
 */
async function pemToJwk(pem: string): Promise<JWKInterface> {
    const cryptoKey = await crypto.subtle.importKey(
        "pkcs8",
        pemToBin(pem),
        {
            name: "RSA-PSS",
            hash: { name: "SHA-256" },
        },
        true,
        ["sign"],
    );

    const jwk = (await crypto.subtle.exportKey("jwk", cryptoKey)) as JWKInterface;

    return {
        kty: jwk.kty,
        n: jwk.n,
        e: jwk.e,
        d: jwk.d,
        p: jwk.p,
        q: jwk.q,
        dp: jwk.dp,
        dq: jwk.dq,
        qi: jwk.qi,
    };
}

export async function generateDeterministicJWK(): Promise<JWKInterface> {
    await init();

    const secret = await getSecret();
    const pem = keygen(secret);
    const jwk = pemToJwk(pem);

    return jwk;
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

export async function signWithCryptoKey(
    key: CryptoKey,
    data: Uint8Array,
    saltLength?: number,
): Promise<Uint8Array> {
    const signature = await crypto.subtle.sign(
        {
            name: "RSA-PSS",
            saltLength,
        },
        key,
        data,
    );

    return new Uint8Array(signature);
}

export async function signWithJwk(
    jwk: JWKInterface,
    data: Uint8Array,
    saltLength?: number,
): Promise<Uint8Array> {
    const cryptoKey = await jwkToCryptoKey(jwk);
    return await signWithCryptoKey(cryptoKey, data, saltLength);
}

/**
 * @deprecated state will be automatically encrypted by Metamask itself
 */
async function getAESKey(rawSalt: string) {
    const secret = await getSecret();

    const salt = b64ToBin(rawSalt);

    const keyBase = await window.crypto.subtle.importKey("raw", secret, "PBKDF2", false, [
        "deriveBits",
        "deriveKey",
    ]);

    const key = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: 200000,
            hash: "SHA-512",
        },
        keyBase,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"],
    );

    return key;
}

/**
 * @deprecated state will be automatically encrypted by Metamask itself
 */
export async function encrypt(salt: string, data: Uint8Array): Promise<EncryptedData> {
    const key = await getAESKey(salt);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedData: ArrayBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        data,
    );

    return {
        iv: binToB64(iv),
        data: binToB64(new Uint8Array(encryptedData)),
    };
}

/**
 * @deprecated state will be automatically encrypted by Metamask itself
 */
export async function decrypt(salt: string, data: EncryptedData): Promise<Uint8Array> {
    const key = await getAESKey(salt);

    const decryptedData: ArrayBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: b64ToBin(data.iv) },
        key,
        b64ToBin(data.data),
    );

    return new Uint8Array(decryptedData);
}

/**
 * @deprecated state will be automatically encrypted by Metamask itself
 */
export async function encryptWallet(salt: string, wallet: Wallet): Promise<EncryptedWallet> {
    const encryptedData = await encrypt(salt, new TextEncoder().encode(JSON.stringify(wallet.key)));

    return {
        encryptedKey: encryptedData,
        metadata: wallet.metadata,
    };
}

/**
 * @deprecated state will be automatically encrypted by Metamask itself
 */
export async function decryptWallet(salt: string, wallet: EncryptedWallet): Promise<Wallet> {
    const decryptedData: JWKInterface = JSON.parse(
        new TextDecoder().decode(await decrypt(salt, wallet.encryptedKey)),
    );

    return {
        key: decryptedData,
        metadata: wallet.metadata,
    };
}
