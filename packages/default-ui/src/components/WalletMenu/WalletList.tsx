import { OnWalletMenuEvent } from "@/components/WalletMenu/WalletMenu";
import Button from "@/components/Button";
import { NamedAddress } from "@/utils/types";
import Text from "@/components/interface/typography/Text";
import { findAddressName } from "@/utils";
import WalletItem from "@/components/WalletMenu/WalletItem";

export type WalletOpenedMenuProps = {
    activeWallet: string;
    availableWallets: [string, string][];
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
    return (
        <div className="flex flex-col">
            <Text color="gray-dark" size="11" weight="semibold" uppercase className="mb-3">
                Active wallet
            </Text>
            <WalletItem
                active
                name={findAddressName(availableWallets, activeWallet)}
                address={activeWallet}
                onEvent={onEvent}
                onDeleteWallet={onDeleteWallet}
            />

            <Text color="gray-dark" size="11" weight="semibold" uppercase className="mb-3">
                Available wallets
            </Text>
            <ul>
                {availableWallets.map(([address, name]) =>
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
