import { OnWalletMenuEvent } from "@/components/WalletMenu/WalletMenu";
import Button from "@/components/interface/Button";
import { NamedAddress, Wallets } from "@/utils/types";
import WalletItem from "@/components/WalletMenu/WalletItem";
import Label from "@/components/interface/Label";

export type WalletOpenedMenuProps = {
    activeWallet: string;
    availableWallets: Wallets;
    onEvent: OnWalletMenuEvent;
    onAddWallet: () => void;
    onDeleteWallet: (wallet: NamedAddress) => void;
};

export default function WalletList({
    activeWallet,
    availableWallets,
    onEvent,
    onAddWallet,
    onDeleteWallet,
}: WalletOpenedMenuProps) {
    const activeWalletName = availableWallets.get(activeWallet);
    return (
        <div className="flex flex-col">
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

            <Label className="mb-3 mt-6">Available wallets</Label>
            <ul className="flex flex-col max-h-[212px] overflow-y-auto">
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

            <div className="flex items-center gap-2 mt-6 h-16">
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddWallet();
                    }}
                >
                    Add wallet
                </Button>
                <Button>Settings</Button>
                <Button className="ml-auto">Logout</Button>
            </div>
        </div>
    );
}
