import { EncryptedWallet, getSecret, getState, Wallet } from "@/metamask";
import { b64ToBin, binToB64, JWKInterface } from "@/utils";

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

async function getAESKey() {
    const secret = new Uint8Array(await getSecret());

    const salt = b64ToBin((await getState()).keySalt);

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

export async function encrypt(data: Uint8Array): Promise<EncryptedData> {
    const key = await getAESKey();
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

export async function decrypt(data: EncryptedData): Promise<Uint8Array> {
    const key = await getAESKey();

    const decryptedData: ArrayBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: b64ToBin(data.iv) },
        key,
        b64ToBin(data.data),
    );

    return new Uint8Array(decryptedData);
}

export async function encryptWallet(wallet: Wallet): Promise<EncryptedWallet> {
    const encryptedData = await encrypt(new TextEncoder().encode(JSON.stringify(wallet.key)));

    return {
        encryptedData,
        address: wallet.address,
    };
}

export async function decryptWallet(wallet: EncryptedWallet): Promise<Wallet> {
    const decryptedData: JWKInterface = JSON.parse(
        new TextDecoder().decode(await decrypt(wallet.encryptedData)),
    );

    return {
        key: decryptedData,
        address: wallet.address,
    };
}
