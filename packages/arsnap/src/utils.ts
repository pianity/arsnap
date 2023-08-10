import { Base64 } from "js-base64";

export function exhaustive(_: never, errorMessage: string): never {
    throw new Error(errorMessage);
}

export function getOrThrow<T>(map: Map<string, T>, key: string): T {
    const value = map.get(key);

    if (value === undefined) {
        throw new Error(`Couldn't find key "${key}"`);
    }

    return value;
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
    return new Uint8Array(Base64.toUint8Array(b64UrlDecode(b64UrlString)));
}

function bufferTob64(buffer: Uint8Array): string {
    return Base64.fromUint8Array(buffer);
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

/**
 * Truncates a string in the middle
 *
 * @param str - string to truncate
 * @param strLen  -length of the string including separator (default 30)
 * @param separator - string used to replace the truncated part (default "...")
 * @returns string truncated in the middle
 */
export function truncateStringCenter(str: string, strLen = 30, separator = "...") {
    if (!str || str.length < strLen) return str;

    const sepLen = separator.length;
    const charsToShow = strLen - sepLen;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);

    return str.substring(0, frontChars) + separator + str.substring(str.length - backChars);
}
