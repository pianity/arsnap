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

/**
 * Request `requestedPermissions` to the user. Returns an updated Permission[] with the new
 * permissions.
 */
export async function requestPermissions(
    origin: string,
    currentPermissions: Permission[],
    requestedPermissions: Permission[],
): Promise<Permission[]> {
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
        return currentPermissions;
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
        return currentPermissions.concat(...newPermissions);
    } else {
        return currentPermissions;
    }
}

export function revokePermissions(
    currentPermissions: Permission[],
    permissionsToRevoke: Permission[],
) {
    return currentPermissions.filter((permission) => !permissionsToRevoke.includes(permission));
}
