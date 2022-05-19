import { useState } from "react";

import { Permission } from "@pianity/arsnap-adapter";

import { AllPermissions as AllPermissionsData } from "@/state";

function dappsList(dapps: string[], onDappClick: (dapp: string) => void) {
    return (
        <ul>
            {dapps.map((dapp) => (
                <a key={dapp} onClick={() => onDappClick(dapp)}>
                    <li>{dapp}</li>
                </a>
            ))}
        </ul>
    );
}

function permissionsList(
    permissions: Permission[],
    onRevokeClick: (permission: Permission) => void,
) {
    return (
        <ul>
            {permissions.map((permission) => (
                <li key={permission}>
                    <span>{permission}</span>
                    <a onClick={() => onRevokeClick(permission)}>revoke</a>
                </li>
            ))}
        </ul>
    );
}

export type PermissionsProps = {
    allPermissions?: AllPermissionsData;
};

export default function Permissions({ allPermissions }: PermissionsProps) {
    const [dapp, setDapp] = useState<string>();

    function onRevokeClick(permission: Permission) {
        console.log("revoke", permission);
    }

    return (
        <>
            {allPermissions &&
                dappsList(
                    [...allPermissions.entries()].map(([dapp, _]) => dapp),
                    setDapp,
                )}

            {dapp && permissionsList(allPermissions?.get(dapp) || [], onRevokeClick)}
            <p>Current dApp: {dapp}</p>
        </>
    );
}
