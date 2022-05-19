import { Link } from "react-router-dom";

import { OnWalletMenuEvent } from "@/components/WalletMenu/WalletMenu";
import Button from "@/components/interface/Button";
import { Wallets } from "@/state";
import { NamedAddress } from "@/utils/types";
import WalletItem from "@/components/WalletMenu/WalletItem";
import Label from "@/components/interface/Label";
import { AppRoute } from "@/consts";

export type WalletOpenedMenuProps = {
    activeWallet: string;
    availableWallets: Wallets;
    onEvent: OnWalletMenuEvent;
    onAddWallet: () => void;
    onDeleteWallet: (wallet: NamedAddress) => void;
    onSettingsOpen: () => void;
};

export default function WalletList({
    activeWallet,
    availableWallets,
    onEvent,
    onAddWallet,
    onDeleteWallet,
    onSettingsOpen,
}: WalletOpenedMenuProps) {
    const activeWalletName = availableWallets.get(activeWallet);
    return (
        <div className="flex flex-col">
            <div className="flex flex-col px-4 pt-4">
                {activeWalletName && <Label className="mb-3">Active wallet</Label>}
                {activeWalletName && (
                    <WalletItem
                        active
                        name={activeWalletName}
                        address={activeWallet}
                        onEvent={onEvent}
                        onDeleteWallet={onDeleteWallet}
                    />
                )}

                <Label className="mb-1 mt-6">Available wallets</Label>
                <ul className="flex flex-col gap-[10px] max-h-[226px] overflow-y-auto pt-2 pb-6">
                    {[...availableWallets.entries()].map(([address, name]) =>
                        address === activeWallet ? null : (
                            <WalletItem
                                key={address}
                                name={name}
                                address={address}
                                onEvent={onEvent}
                                onDeleteWallet={onDeleteWallet}
                            />
                        ),
                    )}
                </ul>
            </div>

            <div className="flex items-center gap-2 pl-4 pr-6 h-16 bg-purple-light rounded-b-xl">
                <Button onClick={onAddWallet}>Add wallet</Button>
                <Link to={AppRoute.Settings}>
                    <Button outlined onClick={onSettingsOpen}>
                        Settings
                    </Button>
                </Link>
                <button className="text-[color:#666666] text-[14px] leading-[15px] font-semibold ml-auto mr-1 lg:hover:text-gray-dark">
                    Logout
                </button>
            </div>
        </div>
    );
}
