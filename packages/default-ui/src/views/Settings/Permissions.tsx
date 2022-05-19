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
import Tooltip from "@/components/interface/Tooltip";
import helpIconUrl from "@/assets/icons/help.svg";

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
        <div
            className={classes(
                "flex flex-col",
                "min-w-[170px] pl-4 pr-6 pt-6 mb-[14px]",
                "border-r border-purple",
            )}
        >
            <Text.h3 color="white" size="12" weight="semibold" wider uppercase className="mb-6">
                Connected sites
            </Text.h3>
            <ul>
                {dapps.map((dapp) => {
                    const selected = dapp === currentDapp;
                    return (
                        <li
                            key={dapp}
                            onClick={() => onDappClick(dapp)}
                            className={classes(
                                "h-10 px-2 mb-1 last:mb-0",
                                "rounded",
                                "flex items-center",
                                selected
                                    ? "bg-white text-purple-dark cursor-default"
                                    : "text-white lg:hover:bg-purple cursor-pointer",
                                "transition duration-300 ease-quart-out",
                            )}
                        >
                            <Text.span size="16" weight="semibold">
                                {dapp}
                            </Text.span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

type PermissionsListProps = {
    permissions: Permission[];
    onRevokeClick: (permission: Permission) => void;
};

function PermissionsList({ permissions, onRevokeClick }: PermissionsListProps) {
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
        <div className={classes("flex flex-col", "w-full pr-4 pl-6 py-6 mb-[14px]")}>
            <Text.h3 color="white" size="12" weight="semibold" wider uppercase className="mb-6">
                Permissions
            </Text.h3>
            <ul>
                {allPermissionsItems.map(({ granted, permission }) => (
                    <li key={permission} className="flex items-center mb-5 last:mb-0">
                        <Text.span size="16" weight="semibold">
                            {permission}
                        </Text.span>
                        <Tooltip text={PERMISSIONS_DESCRIPTIONS[permission].description}>
                            <img src={helpIconUrl} alt="Permission info" className="mx-2" />
                        </Tooltip>
                        {PERMISSIONS_DESCRIPTIONS[permission].dangerous && (
                            <span className="w-2 h-2 bg-orange-dark rounded-full" />
                        )}

                        {granted && (
                            <button className="ml-auto" onClick={() => onRevokeClick(permission)}>
                                <Text.span
                                    color="red-dark"
                                    size="12"
                                    weight="semibold"
                                    wider
                                    uppercase
                                >
                                    Revoke
                                </Text.span>
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

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
