import { Dispatch } from "react";

import { getAllPermissions, Permission } from "@pianity/arsnap-adapter";

import { SetPermissions } from "@/state";

/**
 * Map of permissions where the key is the dApp's origin and the value its list of granted
 * permissions
 */
export type DappsPermissions = Map<string, Permission[]>;

export async function updatePermissions(dispatch: Dispatch<SetPermissions>) {
    const permissions = new Map(await getAllPermissions());

    dispatch({
        type: "setPermissions",
        permissions,
    });
}
