import { JWKInterface } from "arweave/node/lib/wallet";

export const SNAP_ID = `local:http://localhost:4000/`;

export type SnapId = typeof SNAP_ID;

declare global {
    interface Window {
        ethereum: {
            isMetaMask: boolean;
            isUnlocked: Promise<boolean>;
            request: (request: unknown | { method: string; params?: any[] }) => Promise<any>;
            on: (eventName: unknown, callback: unknown) => unknown;
        };
    }
}

export type ArconnectPermission =
    | "ACCESS_ADDRESS"
    | "ACCESS_PUBLIC_KEY"
    | "ACCESS_ALL_ADDRESSES"
    | "SIGN_TRANSACTION"
    | "ENCRYPT"
    | "DECRYPT"
    | "SIGNATURE"
    | "ACCESS_ARWEAVE_CONFIG"
    | "DISPATCH";

export type ArsnapPermission = "ORGANIZE_WALLETS";

export type Permission = ArconnectPermission | ArsnapPermission;

type ObjectToUnion<T extends Record<string, (...args: any[]) => any>> = {
    [K in keyof T]: { method: K; params: Parameters<T[K]> };
}[keyof T];

export type RpcApi = {
    is_enabled: () => Promise<boolean>;
    get_permissions: () => Promise<Permission[]>;
    get_active_address: () => Promise<string>;
    get_active_public_key: () => Promise<string>;
    get_all_addresses: () => Promise<string[]>;
    get_wallet_names: () => Promise<Record<string, string>>;
    sign_bytes: (bytes: Uint8Array, saltLength: number) => Promise<Uint8Array>;

    set_active_address: (address: string) => Promise<null>;
    import_wallet: (wallet: JWKInterface, name: string) => Promise<null>;
    rename_wallet: (address: string, name: string) => Promise<null>;
    request_permissions: (permissions: Permission[]) => Promise<boolean>;
};

export type RpcRequest = ObjectToUnion<RpcApi>;
