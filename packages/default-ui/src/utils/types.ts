import { Dispatch, SetStateAction } from "react";

export type NamedAddress = { name: string; address: string };

export type SetState<T> = Dispatch<SetStateAction<T>>;

export class CustomError<T> extends Error {
    constructor(public kind: T, message?: string, public originalError?: unknown) {
        super(`${kind}${message ? `: ${message}` : ""}`);
        this.name = "CustomError";
        Error.captureStackTrace(this, CustomError);
    }
}
