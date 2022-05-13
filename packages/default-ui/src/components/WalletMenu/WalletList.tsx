import { useState, FocusEvent } from "react";

import {
    ExportWallet,
    OnWalletMenuEvent,
    RenameWallet,
    SelectWallet,
    WalletMenuProps,
} from "@/components/WalletMenu/WalletMenu";
import Button from "@/components/Button";
import { NamedAddress } from "@/utils/types";

export type WalletItemProps = {
    active?: boolean;
    name: string;
    address: string;
    onEvent: OnWalletMenuEvent<RenameWallet | SelectWallet | ExportWallet>;
    onDeleteWallet: (address: NamedAddress) => void;
};
function WalletItem({ active, name, address, onEvent, onDeleteWallet }: WalletItemProps) {
    const [hovering, setHovering] = useState<boolean>(false);

    function onBlur(e: FocusEvent<HTMLInputElement>) {
        if (e.target.value !== name) {
            onEvent({ event: "renameWallet", name: e.target.value, address });
            e.stopPropagation();
        }
    }

    return (
        <li
            onClick={() => onEvent({ event: "selectWallet", address })}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            {active && <p>(logo)</p>}

            <input
                onBlur={onBlur}
                onClick={(e) => {
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

            {hovering && (
                <>
                    <Button onClick={() => onEvent({ event: "exportWallet", address })}>
                        export
                    </Button>

                    <Button
                        onClick={(e) => {
                            onDeleteWallet({ name, address });
                            e.stopPropagation();
                        }}
                    >
                        delete
                    </Button>
                </>
            )}
        </li>
    );
}

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
                              onDeleteWallet={onDeleteWallet}
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
