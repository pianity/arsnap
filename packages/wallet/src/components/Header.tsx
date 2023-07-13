import { Link } from "react-router-dom";
import { match } from "ts-pattern";

import arsnapLogoUrl from "@/assets/arsnap.svg";
import WalletMenu, { OnWalletMenuEvent } from "@/components/WalletMenu";
import LoadingIndicator from "@/components/interface/svg/LoadingIndicator";
import MetamaskButton from "@/components/interface/MetamaskButton";
import { initializeArsnap } from "@/utils/arsnap";
import Text from "@/components/interface/typography/Text";
import { Wallets } from "@/state";
import { AppRoute } from "@/consts";
import { classes } from "@/utils/tailwind";
import { GatewayName } from "@/state/config";
import { AppStatus } from "@/App";

type HeaderProps = {
    /**
     * Show/hide the wallet button according to the app status:
     *   - "loading": display a loading indicator
     *   - "error": display an error indicator
     *   - "loaded": display the wallet button
     */
    appStatus: AppStatus;
    /** Makes the ArSnap logo smaller */
    smallLogo?: boolean;
    gateway: GatewayName;
    /** Current active wallet */
    activeWallet: string | undefined;
    /** List of available wallets */
    availableWallets: Wallets | undefined;
    /** Wallet menu callback */
    onWalletEvent: OnWalletMenuEvent;
    /** ArSnap initialisation callback */
    onInitialized: () => void;
};

/**
 * Renders the ArSnap header with nav links on the left,
 * logo in the center and wallet button on the right.
 */
export default function Header({
    appStatus,
    smallLogo,
    gateway,
    activeWallet,
    availableWallets,
    onWalletEvent,
    onInitialized,
}: HeaderProps) {
    async function onMetamaskClick() {
        if ((await initializeArsnap()) === "success") {
            onInitialized();
        }
    }

    return (
        <header
            className={classes(
                "relative",
                "w-screen h-[72px] pl-6 pr-5 mb-[72px]",
                "shrink-0 flex items-center justify-between",
                "border-b border-white border-opacity-25",
            )}
        >
            {/* MARK: Navbar items */}
            <ul className="flex">
                <Link to={AppRoute.About}>
                    <Text.li
                        size="16"
                        color="white"
                        hoverColor="purple-text"
                        taller
                        weight="semibold"
                        className="mr-4"
                    >
                        About
                    </Text.li>
                </Link>
                <Link to="/help">
                    <Text.li
                        size="16"
                        color="white"
                        hoverColor="purple-text"
                        taller
                        weight="semibold"
                        className="mr-4"
                    >
                        Help
                    </Text.li>
                </Link>
                <a
                    href="https://github.com/pianity/arsnap/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Text.li
                        size="16"
                        color="white"
                        hoverColor="purple-text"
                        taller
                        weight="semibold"
                        className="mr-4"
                    >
                        Report a bug
                    </Text.li>
                </a>
            </ul>

            {/* MARK: Metamask connect */}
            {match(appStatus)
                .with("locked", () => (
                    <Text
                        size="16"
                        color="white"
                        weight="semibold"
                        taller
                        className="cursor-default mr"
                    >
                        locked
                    </Text>
                ))
                .with("error", () => (
                    <Text
                        size="16"
                        color="white"
                        weight="semibold"
                        taller
                        className="cursor-default mr"
                    >
                        :(
                    </Text>
                ))
                .with("loading", () => <LoadingIndicator height={16} width={16} />)
                .with("loaded", () =>
                    activeWallet && availableWallets ? (
                        <WalletMenu
                            gateway={gateway}
                            activeWallet={activeWallet}
                            availableWallets={availableWallets}
                            onEvent={onWalletEvent}
                        />
                    ) : (
                        <MetamaskButton label="Connect with" onClick={onMetamaskClick} small dark />
                    ),
                )
                .exhaustive()}

            {/* MARK: ArSnap logo */}
            <Link
                to="/"
                className={classes(
                    "absolute left-1/2 -translate-x-1/2 z-10",
                    "bg-purple-dark",
                    "transition-all duration-300 ease-quart-out",
                    smallLogo ? "px-8 -bottom-6" : "px-10 -bottom-14",
                )}
            >
                <img
                    src={arsnapLogoUrl}
                    width={smallLogo ? 114 : 172}
                    height={smallLogo ? 61 : 84}
                    alt="ArSnap for MetaMask"
                    className="transition-size duration-300 ease-quart-out"
                />
            </Link>
        </header>
    );
}
