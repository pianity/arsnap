import * as adapter from "@pianity/arsnap-adapter";

import { getPermissions, Permission } from "@pianity/arsnap-adapter";
import { CustomError } from "@/utils/types";
import { REQUIRED_PERMISSIONS } from "@/consts";

export async function getMissingPermissions(permissions: Permission[]) {
    const currentPermissions = await getPermissions();

    const missigPermissions = permissions.filter(
        (permission) => !currentPermissions.includes(permission),
    );

    return missigPermissions;
}

type InitializationErrorKind = "InstallationDeclined" | "PermissionsDeclined";
class InitializationError extends CustomError<InitializationErrorKind> {}

export async function initializeArsnap() {
    try {
        await adapter.installSnap();
    } catch (e) {
        throw new InitializationError("InstallationDeclined");
    }

    const missingPermissions = await getMissingPermissions(REQUIRED_PERMISSIONS);

    if (missingPermissions.length > 0) {
        const granted = await adapter.requestPermissions(missingPermissions);
        if (!granted) {
            throw new InitializationError("PermissionsDeclined");
        }
    }

    return true;
}
