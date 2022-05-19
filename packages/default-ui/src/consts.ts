import { Permission } from "@pianity/arsnap-adapter";

// TODO: Make the gateway configurable

export const ARWEAVE_HOST = "testnet.redstone.tools";
// export const ARWEAVE_HOST = "arweave.net";

export const ARWEAVE_PORT = 443;
export const ARWEAVE_PROTOCOL = "https";

export const REQUIRED_PERMISSIONS: Permission[] = [
    "GET_DAPPS_PERMISSIONS",
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

export enum AppRoute {
    Root = "/",
    About = "/about",
    Send = "/send",
    Settings = "/settings",
    GeneralSettings = "/settings/general",
    Permissions = "/settings/permissions",
    Events = "/settings/events",
}
