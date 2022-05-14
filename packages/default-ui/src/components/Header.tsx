import { Link } from "react-router-dom";
import arsnapLogoUrl from "@/assets/arsnap.png";
import WalletMenu, { OnWalletMenuEvent } from "@/components/WalletMenu";
import LoadingIndicator from "@/components/interface/svg/LoadingIndicator";
import MetamaskButton from "@/components/interface/MetamaskButton";
import { initializeArsnap } from "@/utils/arsnap";

type HeaderProps = {
    initializing: boolean;
    activeWallet: string | undefined;
    availableWallets: [string, string][] | undefined;
    onWalletEvent: OnWalletMenuEvent;
    onInitialized: () => void;
};

export default function Header({
    initializing,
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
                <li className="text-white text-base leading-[17px] font-semibold mr-4 lg:hover:text-purple-text">
                    <Link to="/about">About</Link>
                </li>
                <li className="text-white text-base leading-[17px] font-semibold mr-4 lg:hover:text-purple-text">
                    <Link to="/help">Help</Link>
                </li>
                <li className="text-white text-base leading-[17px] font-semibold mr-4 lg:hover:text-purple-text">
                    <Link to="/report">Report a bug</Link>
                </li>
            </ul>

            {/* MARK: Metamask connect */}
            {initializing && <LoadingIndicator height={16} width={16} />}
            {!initializing &&
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
