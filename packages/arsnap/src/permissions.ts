import { RpcPermission } from "@pianity/arsnap-adapter";

import { confirmPopup } from "@/metamask";

/**
 * Throws if `permission` isn't included in `allowedPermission`.
 */
export async function guard(
    origin: string,
    allowedPermissions: RpcPermission[],
    permission: RpcPermission | null,
): Promise<void> {
    if (permission === null) {
        return;
    }

    if (!allowedPermissions.includes(permission)) {
        throw new Error(`Permission denied (${origin}): ${permission}`);
    }
}

type RequestPermissionsResult = {
    status: "granted" | "already_granted" | "declined";
    /**
     * Full new set of permission. If the user declined the request, the old unchanged
     * `currentPermissions` is returned.
     */
    permissions: RpcPermission[];
};

/**
 * Request `requestedPermissions` to the user.
 */
export async function requestPermissions(
    origin: string,
    currentPermissions: RpcPermission[],
    requestedPermissions: RpcPermission[],
): Promise<RequestPermissionsResult> {
    const newPermissions = currentPermissions
        ? [
              ...new Set(
                  requestedPermissions.filter(
                      (permission) => !currentPermissions.includes(permission),
                  ),
              ),
          ]
        : requestedPermissions;

    if (newPermissions.length === 0) {
        return { status: "already_granted", permissions: currentPermissions };
    }

    const newPermissionsStrings = newPermissions.map((permission) => `• **${permission}**`);

    const granted = await confirmPopup("Permissions Request", [
        "Do you want to grant the following permissions?",
        "",
        `The dApp at **${origin}** is requesting the following permissions:`,
        ...newPermissionsStrings,
    ]);

    if (granted) {
        return { status: "granted", permissions: currentPermissions.concat(...newPermissions) };
    } else {
        return { status: "declined", permissions: currentPermissions };
    }
}

export function revokePermissions(
    currentPermissions: RpcPermission[],
    permissionsToRevoke: RpcPermission[],
) {
    return currentPermissions.filter((permission) => !permissionsToRevoke.includes(permission));
}
