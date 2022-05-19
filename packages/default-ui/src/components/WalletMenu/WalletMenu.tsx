import { useEffect, useRef, useState } from "react";
import { JWKInterface } from "arweave/node/lib/wallet";

import { Wallets } from "@/state";
import { NamedAddress } from "@/utils/types";
import WalletOpenedMenu from "@/components/WalletMenu/WalletOpenedMenu";
import Chevron from "@/components/interface/svg/Chevron";

export type SelectWallet = {
    event: "selectWallet";
    address: string;
};

export type RenameWallet = {
    event: "renameWallet";
    name: string;
    address: string;
};

export type ImportWallet = {
    event: "importWallet";
    jwk: JWKInterface;
};

export type ExportWallet = {
    event: "exportWallet";
    address: string;
};

export type DeleteWallet = {
    event: "deleteWallet";
    address: string;
};

export type WalletMenuEvent =
    | SelectWallet
    | RenameWallet
    | ImportWallet
    | ExportWallet
    | DeleteWallet;

export type WalletMenuEventResponse = {
    wallet?: NamedAddress;
    jwk?: JWKInterface;
};

export type OnWalletMenuEvent<T = WalletMenuEvent> = (event: T) => Promise<WalletMenuEventResponse>;

export type WalletMenuProps = {
    activeWallet: string;
    availableWallets: Wallets;
    onEvent: OnWalletMenuEvent;
};
export default function WalletMenu({
    activeWallet,
    availableWallets,
    onEvent: onEventRaw,
}: WalletMenuProps) {
    // Used to detect click outside of the menu to close it
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuOpened, setMenuOpened] = useState(false);

    // Hijacking WalletItem's onEvent to close the menu when a new wallet has been selected
    function onEvent(e: WalletMenuEvent): Promise<WalletMenuEventResponse> {
        if (e.event === "selectWallet") {
            setMenuOpened(false);
        }
        return onEventRaw(e);
    }

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: Event) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpened(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" tabIndex={0} ref={menuRef}>
            <button
                className="h-10 px-3 flex items-center rounded-full bg-white bg-opacity-20 lg:hover:bg-opacity-40 transition duration-300 ease-quart-out"
                onClick={() => setMenuOpened(!menuOpened)}
            >
                <label className="text-[11px] leading-[100%] font-semibold text-purple-light opacity-50 mr-2 uppercase">
                    Wallet
                </label>
                <span className="text-white text-sm leading-[100%] font-semibold mr-2 min-w-[80px] transition-size duration-300 ease-quart-out">
                    {availableWallets.get(activeWallet)}
                </span>
                <Chevron width={10} height={6.6} />
            </button>

            {menuOpened && (
                <div className="absolute right-0 top-12 z-50 w-[90vw] max-w-[376px]">
                    <WalletOpenedMenu
                        activeWallet={activeWallet}
                        availableWallets={availableWallets}
                        onEvent={onEvent}
                        onSettingsOpen={() => setMenuOpened(false)}
                    />
                </div>
            )}
        </div>
    );
}
