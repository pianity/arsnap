import { Permission } from "@pianity/arsnap-adapter";

import { confirmPopup } from "@/metamask";

/**
 * Throws if `permission` isn't included in `allowedPermission`.
 */
export async function guard(
    origin: string,
    allowedPermissions: Permission[],
    permission: Permission,
): Promise<void> {
    if (!allowedPermissions.includes(permission)) {
        throw new Error(`Permission denied (${origin}): ${permission}`);
    }
}

type RequestPermissionsResult = {
    granted: boolean;
    /**
     * Full new set of permission. If the user declined the request, the old unchanged
     * `currentPermissions` is returned.
     */
    permissions: Permission[];
};

/**
 * Request `requestedPermissions` to the user.
 */
export async function requestPermissions(
    origin: string,
    currentPermissions: Permission[],
    requestedPermissions: Permission[],
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
        return { granted: true, permissions: currentPermissions };
    }

    const newPermissionsString = newPermissions
        .map((permission) => `    • ${permission}`)
        .join("\n");

    const granted = await confirmPopup(
        "Permissions Request",
        "Do you want to grant the following permissions?",
        `The dApp at ${origin} is requesting the following permissions:\n${newPermissionsString}`,
    );

    if (granted) {
        return { granted: true, permissions: currentPermissions.concat(...newPermissions) };
    } else {
        return { granted: false, permissions: currentPermissions };
    }
}

export function revokePermissions(
    currentPermissions: Permission[],
    permissionsToRevoke: Permission[],
) {
    return currentPermissions.filter((permission) => !permissionsToRevoke.includes(permission));
}
