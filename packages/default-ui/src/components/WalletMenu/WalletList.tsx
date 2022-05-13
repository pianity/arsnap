import { useState, FocusEvent } from "react";

import { OnWalletMenuEvent, WalletMenuProps } from "@/components/WalletMenu/WalletMenu";
import Button from "@/components/Button";

export type WalletItemProps = {
    active?: boolean;
    name: string;
    address: string;
    onEvent: OnWalletMenuEvent;
};
function WalletItem({ active, name, address, onEvent }: WalletItemProps) {
    const [renaming, setRenaming] = useState<string | undefined>();

    function onBlur(e: FocusEvent<HTMLInputElement>) {
        onEvent({ event: "renameWallet", name: e.target.value, address });

        setRenaming(undefined);
    }

    return (
        <li onClick={() => onEvent({ event: "selectWallet", address })}>
            {active && <p>(logo)</p>}

            <input
                onBlur={renaming === address ? onBlur : undefined}
                onClick={(e) => {
                    setRenaming(address);

                    e.stopPropagation();
                }}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                defaultValue={name}
            />

            <span
                onClick={(e) => {
                    console.log("copied to clipboard!");

                    navigator.clipboard.writeText(address);
                    e.stopPropagation();
                }}
            >
                {address}
            </span>
        </li>
    );
}

export type WalletOpenedMenuProps = WalletMenuProps & {
    onAddWallet: () => void;
};

export default function WalletList({
    activeWallet,
    availableWallets,
    onEvent,
    onAddWallet,
}: WalletOpenedMenuProps) {
    return (
        <div>
            <ul>
                {activeWallet && availableWallets
                    ? availableWallets.map(([address, name]) => (
                          <WalletItem
                              key={address}
                              active={address === activeWallet}
                              name={name}
                              address={address}
                              onEvent={onEvent}
                          />
                      ))
                    : "loading wallets..."}
            </ul>

            <Button
                onClick={(e) => {
                    onAddWallet();
                    e.stopPropagation();
                }}
            >
                Add wallet
            </Button>
            <Button>Settings</Button>
            <Button>Logout</Button>
        </div>
    );
}
