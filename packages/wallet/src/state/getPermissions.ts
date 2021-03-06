import { Dispatch } from "react";

import { getDappsPermissions, RpcPermission } from "@pianity/arsnap-adapter";

import { SetPermissions } from "@/state";

/**
 * Map of permissions where the key is the dApp's origin and the value its list of granted
 * permissions
 */
export type DappsPermissions = Map<string, RpcPermission[]>;

export async function updatePermissions(dispatch: Dispatch<SetPermissions>) {
    const permissions = new Map(await getDappsPermissions());

    dispatch({
        type: "setPermissions",
        permissions,
    });
}
