import { Permission } from "@pianity/arsnap-adapter";

import { Currency, GatewayInfo, GatewayName } from "@/state/config";

export const REQUIRED_PERMISSIONS: Permission[] = [
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

export const DEFAULT_CURRENCY: Currency = "USD";
export const DEFAULT_GATEWAY: GatewayName = "testnet";

export const GATEWAYS: Record<GatewayName, GatewayInfo> = {
    arweave: { protocol: "https", host: "arweave.net", port: 443 },
    testnet: { protocol: "https", host: "testnet.redstone.tools", port: 443 },
};
