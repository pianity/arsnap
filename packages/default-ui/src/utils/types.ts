import { Dispatch, SetStateAction } from "react";

/**
 * Map of wallets where the key is the name and the value the address
 */
export type Wallets = Map<string, string>;

export type NamedAddress = { name: string; address: string };

export type SetState<T> = Dispatch<SetStateAction<T>>;

export class CustomError<T> extends Error {
    constructor(public kind: T, message?: string, public originalError?: unknown) {
        super(`${kind}${message ? `: ${message}` : ""}`);
        this.name = "CustomError";
        Error.captureStackTrace(this, CustomError);
    }
}
