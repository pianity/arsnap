import { Link } from "react-router-dom";
import arsnapLogoUrl from "@/assets/arsnap.png";
import WalletMenu, { OnWalletMenuEvent } from "@/components/WalletMenu";
import LoadingIndicator from "@/components/interface/svg/LoadingIndicator";
import MetamaskButton from "@/components/interface/MetamaskButton";
import { initializeArsnap } from "@/utils/arsnap";
import Text from "@/components/interface/typography/Text";

type HeaderProps = {
    /** Shows a loading indicator instead of the wallet button */
    loading: boolean;
    /** Current active wallet */
    activeWallet: string | undefined;
    /** List of available wallets */
    availableWallets: [string, string][] | undefined;
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
    loading,
    activeWallet,
    availableWallets,
    onWalletEvent,
    onInitialized,
}: HeaderProps) {
    async function onMetamaskClick() {
        if (await initializeArsnap()) {
            onInitialized();
        }
    }

    return (
        <header className="w-screen h-[72px] shrink-0 pl-6 pr-5 flex items-center justify-between relative border-b border-white border-opacity-25">
            {/* MARK: Navbar items */}
            <ul className="flex">
                <Link to="/about">
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
                <Link to="/report">
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
                </Link>
            </ul>

            {/* MARK: Metamask connect */}
            {loading && <LoadingIndicator height={16} width={16} />}
            {!loading &&
                (activeWallet && availableWallets ? (
                    <WalletMenu
                        activeWallet={activeWallet}
                        availableWallets={availableWallets}
                        onEvent={onWalletEvent}
                    />
                ) : (
                    <MetamaskButton label="Connect with" onClick={onMetamaskClick} small dark />
                ))}

            {/* MARK: ArSnap logo */}
            <div className="absolute px-10 left-1/2 -bottom-14 -translate-x-1/2 z-10 bg-purple-dark">
                <img src={arsnapLogoUrl} width={172} height={84} alt="ArSnap for MetaMask" />
            </div>
        </header>
    );
}
