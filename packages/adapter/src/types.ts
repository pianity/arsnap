import { JWKInterface } from "arweave/node/lib/wallet";

export type LogEntry = {
    timestamp: number;
    origin: string;
    info: RpcLogInfo;
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
    rename_wallet: (address: string, name: string) => Promise<null>;
    delete_wallet: (address: string) => Promise<null>;

    get_logs: () => Promise<[dappOrigin: string, logs: LogEntry[]][]>;
    clear_logs: () => Promise<null>;
};

type Empty = { method: string };
export type RpcLogInfo = {
    [K in keyof RpcMethods]: {
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
        rename_wallet: { address: string; name: string };
        delete_wallet: { address: string };

        get_logs: Empty;
        clear_logs: Empty;
    }[K] &
        { [K in keyof RpcMethods]: { method: K } }[K];
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
    rename_wallet: "RENAME_WALLET",
    delete_wallet: "DELETE_WALLET",

    get_logs: "GET_LOGS",
    clear_logs: "CLEAR_LOGS",
} as const;

export type RpcPermission = Exclude<
    {
        [K in keyof RpcMethods]: (typeof RPC_PERMISSIONS)[K];
    }[keyof typeof RPC_PERMISSIONS],
    null
>;

export type RpcParam = {
    [K in keyof RpcMethods]: { method: K; params: Parameters<RpcMethods[K]> };
}[keyof RpcMethods];

export type RpcResponse = {
    [K in keyof RpcMethods]: ReturnType<RpcMethods[K]>;
}[keyof RpcMethods];
