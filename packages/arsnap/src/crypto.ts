import { getSecret, getState, updateState } from "@/metamask";
import { b64ToBin, binToB64 } from "@/utils";

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

export async function initializeSalt(): Promise<string> {
    const state = await getState();

    const keySalt = binToB64(window.crypto.getRandomValues(new Uint8Array(8)));

    await updateState({ keySalt });

    return keySalt;
}

export async function getAESKey() {
    const secret = new Uint8Array(await getSecret());

    const saltState = (await getState()).keySalt;

    const salt = b64ToBin(saltState ?? (await initializeSalt()));

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
