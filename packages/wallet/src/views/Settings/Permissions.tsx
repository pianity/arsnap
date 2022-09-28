import { useState } from "react";
import { Link } from "react-router-dom";

import { RpcPermission, revokeDappPermission } from "@pianity/arsnap-adapter";

import { DappsPermissions as AllPermissionsData } from "@/state";
import ViewContainer from "@/components/interface/layout/ViewContainer";
import Container from "@/components/interface/layout/Container";
import { classes } from "@/utils/tailwind";
import Chevron from "@/components/interface/svg/Chevron";
import Text from "@/components/interface/typography/Text";
import { AppRoute } from "@/consts";
import DappsList from "@/components/permissions/DappsList";
import PermissionsList from "@/components/permissions/PermissionsList";
import { BaseLayout } from "@/components/interface/layout/settingsLayout";

export type PermissionDescription = {
    dangerous: boolean;
    description: string;
};

export const PERMISSIONS_DESCRIPTIONS: Record<RpcPermission, PermissionDescription> = {
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

    GET_DAPPS_PERMISSIONS: {
        dangerous: false,
        description: "Get the permissions of a DApp",
    },
    REVOKE_DAPP_PERMISSIONS: {
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

    GET_LOGS: {
        dangerous: true,
        description: "Get all logs",
    },
    CLEAR_LOGS: {
        dangerous: true,
        description: "Clear all logs",
    },
};

export type PermissionsProps = {
    dappsPermissions?: AllPermissionsData;
    updatePermissions: () => Promise<void>;
};

export default function Permissions({ dappsPermissions, updatePermissions }: PermissionsProps) {
    const [currentDapp, setCurrentDapp] = useState<string | undefined>();

    async function onRevokeClick(permission: RpcPermission) {
        if (!currentDapp) {
            throw new Error("No dapp selected when trying to revoke permission");
        }

        await revokeDappPermission(currentDapp, [permission]);
        await updatePermissions();
    }

    return (
        <BaseLayout category="Permissions">
            <div className="grow grid grid-cols-[auto,1fr]">
                {dappsPermissions && (
                    <DappsList
                        currentDapp={currentDapp}
                        dapps={[...dappsPermissions.entries()].map(([dapp, _]) => dapp)}
                        onDappClick={setCurrentDapp}
                    />
                )}

                {currentDapp && (
                    <PermissionsList
                        permissions={dappsPermissions?.get(currentDapp) || []}
                        onRevokeClick={onRevokeClick}
                    />
                )}
            </div>
        </BaseLayout>
    );
}
