import { useState } from "react";

import { Permission } from "@pianity/arsnap-adapter";

import { DappsPermissions as AllPermissionsData } from "@/state";

export type PermissionDescription = {
    dangerous: boolean;
    description: string;
};

export const PERMISSIONS_DESCRIPTIONS: Record<Permission, PermissionDescription> = {
    GET_ACTIVE_ADDRESS: {
        dangerous: false,
        description: "Get the currently active address",
    },
    SET_ACTIVE_ADDRESS: {
        dangerous: true,
        description: "Set the currently active address",
    },
    GET_ACTIVE_PUBLIC_KEY: {
        dangerous: false,
        description: "Get the currently active public key",
    },
    GET_ALL_ADDRESSES: {
        dangerous: false,
        description: "Get all addresses",
    },

    SIGN: {
        dangerous: true,
        description: "Sign a message",
    },
    ENCRYPT: {
        dangerous: true,
        description: "Encrypt a message",
    },
    DECRYPT: {
        dangerous: true,
        description: "Decrypt a message",
    },

    GET_DAPPS_PERMISSIONS: {
        dangerous: false,
        description: "Get the permissions of a DApp",
    },
    REVOKE_DAPP_PERMISSION: {
        dangerous: true,
        description: "Revoke a permission of a DApp",
    },

    IMPORT_WALLET: {
        dangerous: false,
        description: "Import a wallet",
    },
    EXPORT_WALLET: {
        dangerous: true,
        description: "Export a wallet",
    },
    RENAME_WALLET: {
        dangerous: false,
        description: "Rename a wallet",
    },
    DELETE_WALLET: {
        dangerous: true,
        description: "Delete a wallet",
    },
};

type DappsListProps = {
    currentDapp: string | undefined;
    dapps: string[];
    onDappClick: (dapp: string) => void;
};

function DappsList({ currentDapp, dapps, onDappClick }: DappsListProps) {
    return (
        <ul>
            {dapps.map((dapp) => (
                <a key={dapp} onClick={() => onDappClick(dapp)}>
                    <li>{currentDapp === dapp ? `**${dapp}**` : dapp}</li>
                </a>
            ))}
        </ul>
    );
}

type PermissionsListProps = {
    permissions: Permission[];
    onRevokeClick: (permission: Permission) => void;
};

function PermissionsList({ permissions, onRevokeClick }: PermissionsListProps) {
    const [showTooltip, setShowTooltip] = useState<string | undefined>();

    type PermissionsItems = Array<{ granted: boolean; permission: Permission }>;

    const grantedPermissionsItems: PermissionsItems = permissions.map((permission) => ({
        granted: true,
        permission,
    }));

    const nonGrantedPermissionsItems: PermissionsItems = Object.keys(PERMISSIONS_DESCRIPTIONS)
        .filter((permission) => !permissions.includes(permission as Permission))
        .map((permission) => ({ granted: false, permission: permission as Permission }));

    const allPermissionsItems = [...grantedPermissionsItems, ...nonGrantedPermissionsItems];

    return (
        <ul>
            {allPermissionsItems.map(({ granted, permission }) => (
                <li key={permission}>
                    <span>{permission}</span>

                    {PERMISSIONS_DESCRIPTIONS[permission].dangerous && <span>/!\</span>}

                    <span
                        onMouseEnter={() => setShowTooltip(permission)}
                        onMouseLeave={() => setShowTooltip(undefined)}
                    >
                        ???
                    </span>

                    {showTooltip === permission && (
                        <span>{PERMISSIONS_DESCRIPTIONS[permission].description}</span>
                    )}

                    {granted && <a onClick={() => onRevokeClick(permission)}>revoke</a>}
                </li>
            ))}
        </ul>
    );
}

export type PermissionsProps = {
    allPermissions?: AllPermissionsData;
};

export default function Permissions({ allPermissions }: PermissionsProps) {
    const [currentDapp, setCurrentDapp] = useState<string | undefined>();

    function onRevokeClick(permission: Permission) {
        console.log("revoke", permission);
    }

    return (
        <>
            {allPermissions && (
                <DappsList
                    currentDapp={currentDapp}
                    dapps={[...allPermissions.entries()].map(([dapp, _]) => dapp)}
                    onDappClick={setCurrentDapp}
                />
            )}

            {currentDapp && (
                <PermissionsList
                    permissions={allPermissions?.get(currentDapp) || []}
                    onRevokeClick={onRevokeClick}
                />
            )}
        </>
    );
}
