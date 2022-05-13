import { JWKInterface } from "arweave/node/lib/wallet";

export const SNAP_ID = "local:http://localhost:4000/";

export const ArconnectPermissions = [
    "ACCESS_ADDRESS",
    "ACCESS_PUBLIC_KEY",
    "ACCESS_ALL_ADDRESSES",
    "SIGN_TRANSACTION",
    "ENCRYPT",
    "DECRYPT",
    "SIGNATURE",
    "ACCESS_ARWEAVE_CONFIG",
    "DISPATCH",
] as const;

export type ArconnectPermission = typeof ArconnectPermissions[number];
export type ArsnapPermission = "EXPORT_WALLETS" | "ORGANIZE_WALLETS";
export type Permission = ArconnectPermission | ArsnapPermission;

export type RpcApi = {
    is_enabled: () => Promise<boolean>;

    get_permissions: () => Promise<Permission[]>;
    get_active_address: () => Promise<string>;
    get_active_public_key: () => Promise<string>;
    get_all_addresses: () => Promise<string[]>;
    get_wallet_names: () => Promise<[string, string][]>;
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
    request_permissions: (permissions: Permission[]) => Promise<boolean>;
};

export type RpcRequest = {
    [K in keyof RpcApi]: { method: K; params: Parameters<RpcApi[K]> };
}[keyof RpcApi];

export type RpcResponse = {
    [K in keyof RpcApi]: ReturnType<RpcApi[K]>;
}[keyof RpcApi];
