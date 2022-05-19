import { Permission } from "@pianity/arsnap-adapter";

// TODO: Make the gateway configurable

export const ARWEAVE_HOST = "testnet.redstone.tools";
// export const ARWEAVE_HOST = "arweave.net";

export const ARWEAVE_PORT = 443;
export const ARWEAVE_PROTOCOL = "https";

export const REQUIRED_PERMISSIONS: Permission[] = [
    "GET_ACTIVE_ADDRESS",
    "SET_ACTIVE_ADDRESS",
    "GET_ACTIVE_PUBLIC_KEY",
    "GET_ALL_ADDRESSES",
    "SIGN",
    // "ENCRYPT",
    // "DECRYPT",
    "GET_DAPPS_PERMISSIONS",
    "REVOKE_DAPP_PERMISSION",
    "IMPORT_WALLET",
    "EXPORT_WALLET",
    "RENAME_WALLET",
    "DELETE_WALLET",
];

export enum AppRoute {
    Root = "/",
    About = "/about",
    Send = "/send",
    Settings = "/settings",
    GeneralSettings = "/settings/general",
    Permissions = "/settings/permissions",
    Events = "/settings/events",
}
