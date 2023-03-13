import * as adapter from "@pianity/arsnap-adapter";

import { getPermissions, RpcPermission } from "@pianity/arsnap-adapter";
import { CustomError } from "@/utils/types";
import { REQUIRED_PERMISSIONS } from "@/consts";

export async function getMissingPermissions(permissions: RpcPermission[]) {
    console.log("getting missing permissions");
    const currentPermissions = await getPermissions();

    const missigPermissions = permissions.filter(
        (permission) => !currentPermissions.includes(permission),
    );

    return missigPermissions;
}

export type InitializationErrorKind =
    | "WrongMetamaskVersion"
    | "InstallationDeclined"
    | "PermissionsDeclined";
export class InitializationError extends CustomError<InitializationErrorKind> {}

export async function initializeArsnap() {
    try {
        await adapter.connect();
    } catch (e) {
        if ((e as any)?.code === -32601) {
            throw new InitializationError("WrongMetamaskVersion");
        }
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
