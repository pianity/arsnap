import { getPermissions, Permission } from "@pianity/arsnap-adapter";

export async function getMissingPermissions(permissions: Permission[]) {
    const currentPermissions = await getPermissions();

    const missigPermissions = permissions.filter(
        (permission) => !currentPermissions.includes(permission),
    );

    return missigPermissions;
}
