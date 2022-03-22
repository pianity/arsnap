import { Permission } from "@pianity/arsnap-adapter";

import { confirmPopup, getState, State, updateState } from "@/metamask";

export async function getPermissions(origin: string): Promise<Permission[]> {
    const { permissions: allPermissions } = await getState();

    const currentPermissions = allPermissions.get(origin);

    return currentPermissions || [];
}

export async function guard(origin: string, permission: Permission, state?: State): Promise<void> {
    const { permissions: allPermissions } = state ?? (await getState());

    const grantedPerms = allPermissions.get(origin) ?? [];

    let allowed = false;

    if (permission === "SIGNATURE" || permission === "SIGN_TRANSACTION") {
        allowed = grantedPerms.includes("SIGNATURE") || grantedPerms.includes("SIGN_TRANSACTION");
    } else if (permission === "ACCESS_ADDRESS") {
        allowed =
            grantedPerms.includes("ACCESS_ADDRESS") || grantedPerms.includes("ACCESS_PUBLIC_KEY");
    } else {
        allowed = grantedPerms.includes(permission);
    }

    if (!allowed) {
        throw new Error(`Permission denied (${origin}): ${permission}`);
    }
}

export async function requestPermissions(
    origin: string,
    requestedPermissions: Permission[],
): Promise<boolean> {
    const { permissions: allPermissions } = await getState();

    const currentPermissions = allPermissions.get(origin) ?? [];

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
        return true;
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
        allPermissions.set(origin, [...currentPermissions, ...newPermissions]);

        await updateState({ permissions: allPermissions });
    }

    return granted;
}
