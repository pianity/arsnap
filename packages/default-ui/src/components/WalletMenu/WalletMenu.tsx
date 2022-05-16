import { useState } from "react";
import { JWKInterface } from "arweave/node/lib/wallet";

import { NamedAddress, Wallets } from "@/utils/types";
import WalletOpenedMenu from "@/components/WalletMenu/WalletOpenedMenu";
import Chevron from "@/components/interface/svg/Chevron";
import { findAddressName } from "@/utils";

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

export type OnFileBrowserEvent = (state: "opened" | "closed") => void;

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
    const [menuOpened, setMenuOpened] = useState(false);

    // This is a dirty hack to prevent `onBlur` of the main div here from firing when the file
    // browser is opened (when user wants to import a wallet).
    const [fileBrowserState, setFileBrowserState] = useState<"notOpened" | "opened" | "closed">(
        "notOpened",
    );

    // Hijacking WalletItem's onEvent to close the menu when a new wallet has been selected
    function onEvent(e: WalletMenuEvent): Promise<WalletMenuEventResponse> {
        if (e.event === "selectWallet") {
            setMenuOpened(false);
        }
        return onEventRaw(e);
    }

    return (
        <div
            className="relative"
            tabIndex={0}
            onBlur={(e) => {
                if (
                    !e.currentTarget.contains(e.relatedTarget) &&
                    fileBrowserState === "notOpened"
                ) {
                    setMenuOpened(false);
                }

                if (fileBrowserState === "closed") {
                    setFileBrowserState("notOpened");
                }
            }}
        >
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
                        onFileBrowserEvent={setFileBrowserState}
                    />
                </div>
            )}
        </div>
    );
}
