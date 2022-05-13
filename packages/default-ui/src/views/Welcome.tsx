import * as adapter from "@pianity/arsnap-adapter";

import { CustomError } from "@/utils/types";
import { getMissingPermissions } from "@/utils/arsnap";
import { REQUIRED_PERMISSIONS } from "@/consts";
import metamaskLogoUrl from "@/assets/metamask-dark.svg";
import { useState } from "react";
import LoadingIndicator from "@/components/interface/svg/LoadingIndicator";

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
    loading: boolean;
    onInitialized: () => void;
};

export default function Welcome({ loading, onInitialized }: WelcomeProps) {
    const [initializing, setInitializing] = useState(false);

    const onClick = async () => {
        setInitializing(true);
        if (await initializeArsnap()) {
            onInitialized();
        }
        setInitializing(false);
    };

    return (
        <div className="w-full grow flex flex-col justify-center items-center">
            {loading ? (
                <LoadingIndicator width={40} height={40} className="opacity-40" />
            ) : (
                <div className="bg-white bg-opacity-25 rounded-xl text-center flex flex-col items-center justify-center h-[50vh] min-h-[280px] max-h-[395px] w-[90vw] max-w-[768px]">
                    <h1 className="text-2xl leading-[26px] font-semibold">Welcome!</h1>
                    <span className="text-lg leading-[20px] mt-2">
                        Click on the button below to initialize ArSnap
                    </span>
                    <button
                        onClick={onClick}
                        className="h-14 px-6 flex items-center justify-center rounded-full bg-white mt-10 relative"
                    >
                        <span
                            className={
                                "text-gray-dark text-base leading-[17px] font-semibold mr-2" +
                                (initializing ? " invisible" : "")
                            }
                        >
                            Connect with
                        </span>
                        <img
                            src={metamaskLogoUrl}
                            width={126}
                            height={24}
                            alt="Metamask"
                            className={initializing ? "invisible" : ""}
                        />

                        {initializing && (
                            <LoadingIndicator
                                height={20}
                                width={20}
                                className="absolute text-gray-dark z-10"
                            />
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
