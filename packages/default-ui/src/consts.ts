import { Permission } from "@pianity/arsnap-adapter";

export const ARWEAVE_HOST = "arweave.net";
export const ARWEAVE_PORT = 443;
export const ARWEAVE_PROTOCOL = "https";

export const REQUIRED_PERMISSIONS: Permission[] = [
    "SET_ACTIVE_WALLET",
    "ACCESS_ADDRESS",
    "ACCESS_PUBLIC_KEY",
    "ACCESS_ALL_ADDRESSES",
    "SIGNATURE",
    "IMPORT_WALLET",
    "RENAME_WALLET",
    "DELETE_WALLET",
    "EXPORT_WALLET",
];
