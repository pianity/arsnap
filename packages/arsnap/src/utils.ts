import * as Base64 from "base64-js";

export function exhaustive(_: never): never {
    throw new Error("Check wasn't exhaustive");
}

export function mapToRecord<V>(map: Map<string, V>): Record<string, V> {
    const record: Record<string, V> = {};

    for (const [key, value] of map) {
        record[key] = value;
    }

    return record;
}

export function recordToMap<V>(record: Record<string, V>): Map<string, V> {
    return new Map(Object.entries(record));
}

export function binToB64(data: Uint8Array): string {
    return btoa(String.fromCharCode.apply(null, [...data]));
}

export function b64ToBin(data: string): Uint8Array {
    return new Uint8Array(
        atob(data)
            .split("")
            .map((char) => char.charCodeAt(0)),
    );
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

export async function ownerToAddress(ownerB64Url: string): Promise<string> {
    const owner = b64UrlToBuffer(ownerB64Url);
    const ownerHashed = await crypto.subtle.digest("SHA-256", owner);
    const address = bufferTob64Url(new Uint8Array(ownerHashed));

    return address;
}
