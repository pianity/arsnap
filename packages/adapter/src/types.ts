import { JWKInterface } from "arweave/node/lib/wallet";

import { Empty } from "@/utils";

export type EventEntry = {
    timestamp: number;
    origin: string;
    request: RpcEvent;
};

export type RpcMethods = {
    is_enabled: () => Promise<boolean>;

    get_permissions: () => Promise<RpcPermission[]>;
    request_permissions: (permissions: RpcPermission[]) => Promise<boolean>;
    revoke_permissions: (permissions: RpcPermission[]) => Promise<null>;
    revoke_all_permissions: () => Promise<null>;
    get_dapps_permissions: () => Promise<[dappOrigin: string, permissions: RpcPermission[]][]>;
    revoke_dapp_permissions: (dappOrigin: string, permissions: RpcPermission[]) => Promise<null>;

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

    get_events: () => Promise<[dappOrigin: string, events: EventEntry[]][]>;
    clear_events: () => Promise<null>;
};

export type RpcEvent = {
    [K in keyof RpcMethods]: ({
        is_enabled: Empty;

        get_permissions: Empty;
        request_permissions: { permissions: RpcPermission[] };
        revoke_permissions: { permissions: RpcPermission[] };
        revoke_all_permissions: Empty;
        get_dapps_permissions: Empty;
        revoke_dapp_permissions: { dappOrigin: string; permissions: RpcPermission[] };

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
    } & { [K in keyof RpcMethods]: { method: K } })[K];
}[keyof RpcMethods];

export const RPC_PERMISSIONS = {
    is_enabled: null,

    get_permissions: null,
    request_permissions: null,
    revoke_permissions: null,
    revoke_all_permissions: null,
    get_dapps_permissions: "GET_DAPPS_PERMISSIONS",
    revoke_dapp_permissions: "REVOKE_DAPP_PERMISSIONS",

    get_active_address: "GET_ACTIVE_ADDRESS",
    get_active_public_key: "GET_ACTIVE_PUBLIC_KEY",
    get_all_addresses: "GET_ALL_ADDRESSES",
    get_wallet_names: "GET_ALL_ADDRESSES",
    sign_bytes: "SIGN",

    set_active_address: "SET_ACTIVE_ADDRESS",
    import_wallet: "IMPORT_WALLET",
    export_wallet: "EXPORT_WALLET",
    rename_wallet: "RENAME_WALLET",
    delete_wallet: "DELETE_WALLET",

    get_events: "GET_EVENTS",
    clear_events: "CLEAR_EVENTS",
} as const;

export type RpcPermission = Exclude<
    {
        [K in keyof RpcMethods]: typeof RPC_PERMISSIONS[K];
    }[keyof typeof RPC_PERMISSIONS],
    null
>;

export type RpcParam = {
    [K in keyof RpcMethods]: { method: K; params: Parameters<RpcMethods[K]> };
}[keyof RpcMethods];

export type RpcResponse = {
    [K in keyof RpcMethods]: ReturnType<RpcMethods[K]>;
}[keyof RpcMethods];
