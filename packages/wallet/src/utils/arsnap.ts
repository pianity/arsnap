import * as adapter from "@pianity/arsnap-adapter";

import { getPermissions, RpcPermission } from "@pianity/arsnap-adapter";
import { REQUIRED_PERMISSIONS } from "@/consts";

export async function getMissingPermissions(permissions: RpcPermission[]) {
    const currentPermissions = await getPermissions();

    const missigPermissions = permissions.filter(
        (permission) => !currentPermissions.includes(permission),
    );

    return missigPermissions;
}

export async function initializeArsnap() {
    try {
        await adapter.connect();
    } catch (e) {
        if ((e as any)?.code === -32601) {
            return "wrongMetamaskVersion";
        }
        return "installationDeclined";
    }

    const missingPermissions = await getMissingPermissions(REQUIRED_PERMISSIONS);

    if (missingPermissions.length > 0) {
        const status = await adapter.requestPermissions(missingPermissions);
        if (status === "declined") {
            return "permissionsDeclined";
        }
    }

    return "success";
}
