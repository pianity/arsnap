import { useState } from "react";
import { Link } from "react-router-dom";

import { Permission, revokeDappPermission } from "@pianity/arsnap-adapter";

import { DappsPermissions as AllPermissionsData } from "@/state";
import ViewContainer from "@/components/interface/layout/ViewContainer";
import Container from "@/components/interface/layout/Container";
import { classes } from "@/utils/tailwind";
import Chevron from "@/components/interface/svg/Chevron";
import Text from "@/components/interface/typography/Text";
import { AppRoute } from "@/consts";
import DappsList from "@/components/permissions/DappsList";
import PermissionsList from "@/components/permissions/PermissionsList";

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

    GET_EVENTS: {
        dangerous: true,
        description: "Get all events",
    },
    CLEAR_EVENTS: {
        dangerous: true,
        description: "Clear all events",
    },
};

export type PermissionsProps = {
    dappsPermissions?: AllPermissionsData;
    updatePermissions: () => Promise<void>;
};

export default function Permissions({ dappsPermissions, updatePermissions }: PermissionsProps) {
    const [currentDapp, setCurrentDapp] = useState<string | undefined>();

    async function onRevokeClick(permission: Permission) {
        if (!currentDapp) {
            throw new Error("No dapp selected when trying to revoke permission");
        }

        await revokeDappPermission(currentDapp, [permission]);
        await updatePermissions();
    }

    return (
        <ViewContainer>
            <Container className="px-6 pt-8 grow">
                <div className="flex shrink-0">
                    <Link
                        to={AppRoute.Settings}
                        className={classes(
                            "w-8 h-8 mr-4",
                            "rounded-full",
                            "bg-purple-dark text-purple-light",
                            "flex items-center justify-center",
                        )}
                    >
                        <Chevron className="rotate-90" />
                    </Link>

                    <div className="flex flex-col items-start gap-1">
                        <Text.h1 size="32" weight="bold" taller>
                            Settings
                        </Text.h1>
                        <Text.h2 color="purple-text" size="18" weight="bold" taller>
                            Permissions
                        </Text.h2>
                    </div>
                </div>
                <div className="h-[1px] bg-purple mt-6 shrink-0" />
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
            </Container>
        </ViewContainer>
    );
}
