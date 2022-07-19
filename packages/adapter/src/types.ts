import { JWKInterface } from "arweave/node/lib/wallet";

export type Permission =
    | "GET_ACTIVE_ADDRESS"
    | "SET_ACTIVE_ADDRESS"
    | "GET_ACTIVE_PUBLIC_KEY"
    | "GET_ALL_ADDRESSES"
    //
    | "SIGN"
    | "ENCRYPT"
    | "DECRYPT"
    //
    | "GET_DAPPS_PERMISSIONS"
    | "REVOKE_DAPP_PERMISSIONS"
    //
    | "IMPORT_WALLET"
    | "EXPORT_WALLET"
    | "RENAME_WALLET"
    | "DELETE_WALLET"
    //
    | "GET_EVENTS"
    | "CLEAR_EVENTS";

export type RequestEvent = {
    timestamp: number;
    origin: string;
    request: RpcEvent;
};

export type RpcApi = {
    is_enabled: () => Promise<boolean>;

    get_permissions: () => Promise<Permission[]>;
    request_permissions: (permissions: Permission[]) => Promise<boolean>;
    revoke_permissions: (permissions: Permission[]) => Promise<null>;
    revoke_all_permissions: () => Promise<null>;
    get_dapps_permissions: () => Promise<[dappOrigin: string, permissions: Permission[]][]>;
    revoke_dapp_permissions: (dappOrigin: string, permissions: Permission[]) => Promise<null>;

    get_active_address: () => Promise<string>;
    get_active_public_key: () => Promise<string>;
    get_all_addresses: () => Promise<string[]>;
    get_wallet_names: () => Promise<[address: string, name: string][]>;
    sign_bytes: (bytes: Uint8Array, saltLength: number) => Promise<Uint8Array>;

    set_active_address: (address: string) => Promise<null>;
    import_wallet: (
        wallet: JWKInterface,
        name?: string,
    ) => Promise<{ name: string; address: string }>;
    export_wallet: (
        address: string,
    ) => Promise<{ jwk: JWKInterface; name: string; address: string }>;
    rename_wallet: (address: string, name: string) => Promise<null>;
    delete_wallet: (address: string) => Promise<null>;

    get_events: () => Promise<[dappOrigin: string, events: RequestEvent[]][]>;
    clear_events: () => Promise<null>;
};

type Empty = Record<string, unknown>;

export type RpcEvent = {
    [K in keyof RpcApi]: ({
        is_enabled: Empty;

        get_permissions: Empty;
        request_permissions: { permissions: Permission[] };
        revoke_permissions: { permissions: Permission[] };
        revoke_all_permissions: Empty;
        get_dapps_permissions: Empty;
        revoke_dapp_permissions: { dappOrigin: string; permissions: Permission[] };

        get_active_address: Empty;
        get_active_public_key: Empty;
        get_all_addresses: Empty;
        get_wallet_names: Empty;
        sign_bytes: { bytesLength: number };

        set_active_address: { address: string };
        import_wallet: { address: string; name: string };
        export_wallet: { address: string };
        rename_wallet: { address: string; name: string };
        delete_wallet: { address: string };

        get_events: Empty;
        clear_events: Empty;
    } & { [K in keyof RpcApi]: { method: K } })[K];
}[keyof RpcApi];

export type RpcRequest = {
    [K in keyof RpcApi]: { method: K; params: Parameters<RpcApi[K]> };
}[keyof RpcApi];

export type RpcResponse = {
    [K in keyof RpcApi]: ReturnType<RpcApi[K]>;
}[keyof RpcApi];
