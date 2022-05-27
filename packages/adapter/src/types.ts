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
    | "DELETE_WALLET";

export type RpcApi = {
    is_enabled: () => Promise<boolean>;

    get_permissions: () => Promise<Permission[]>;
    request_permissions: (permissions: Permission[]) => Promise<boolean>;
    revoke_permissions: (permissions: Permission[]) => Promise<null>;
    get_dapps_permissions: () => Promise<[dappOrigin: string, permissions: Permission[]][]>;
    revoke_dapp_permissions: (dapp: string, permissions: Permission[]) => Promise<null>;

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
    delete_wallet: (address: string) => Promise<null>;
    rename_wallet: (address: string, name: string) => Promise<null>;
};

export type RpcRequest = {
    [K in keyof RpcApi]: { method: K; params: Parameters<RpcApi[K]> };
}[keyof RpcApi];

export type RpcResponse = {
    [K in keyof RpcApi]: ReturnType<RpcApi[K]>;
}[keyof RpcApi];
