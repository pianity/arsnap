import { RpcPermission } from "@pianity/arsnap-adapter";

export const REQUIRED_PERMISSIONS: RpcPermission[] = [
    "GET_ACTIVE_ADDRESS",
    "SET_ACTIVE_ADDRESS",
    "GET_ACTIVE_PUBLIC_KEY",
    "GET_ALL_ADDRESSES",
    "SIGN",
    // "ENCRYPT",
    // "DECRYPT",
    "GET_DAPPS_PERMISSIONS",
    "REVOKE_DAPP_PERMISSIONS",
    "IMPORT_WALLET",
    "RENAME_WALLET",
    "DELETE_WALLET",
    "GET_LOGS",
    "CLEAR_LOGS",
];

export enum AppRoute {
    Root = "/",
    About = "/about",
    Send = "/send",
    Settings = "/settings",
    GeneralSettings = "/settings/general",
    Permissions = "/settings/permissions",
    Logs = "/settings/logs",
}
