import * as adapter from "@pianity/arsnap-adapter";

import Button from "@/components/Button";
import { CustomError } from "@/utils/types";
import { getMissingPermissions } from "@/utils/arsnap";
import { REQUIRED_PERMISSIONS } from "@/consts";

type InitializationErrorKind = "InstallationDeclined" | "PermissionsDeclined";
class InitializationError extends CustomError<InitializationErrorKind> {}

async function initializeArsnap() {
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

export type WelcomeProps = {
    onInitialized: () => void;
};

export default function Welcome({ onInitialized }: WelcomeProps) {
    const onClick = async () => {
        const initSuccess = await initializeArsnap();

        if (initSuccess) {
            onInitialized();
        }
    };

    return (
        <>
            <p>Welcome, click on the button below to initialize ArSnap</p>
            <Button onClick={onClick}>initialize ArSnap</Button>
        </>
    );
}
