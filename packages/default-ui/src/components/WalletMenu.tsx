import { FocusEventHandler, useState, FocusEvent } from "react";

export type WalletMenuEvent = "selectWallet" | "renameWallet";

export type WalletMenuOnEvent = (
    event: WalletMenuEvent,
    wallet: { name: string; address: string },
) => Promise<void> | void;

export type WalletMenuProps = {
    activeWallet?: string;
    availableWallets?: [string, string][];
    onEvent: WalletMenuOnEvent;
};

type WalletItemProps = {
    active?: boolean;
    name: string;
    address: string;
    onEvent: WalletMenuOnEvent;
};

function WalletItem({ active, name, address, onEvent }: WalletItemProps) {
    const [renaming, setRenaming] = useState<string | undefined>();

    function onBlur(e: FocusEvent<HTMLInputElement>) {
        onEvent("renameWallet", { name: e.target.value, address });

        setRenaming(undefined);
    }

    return (
        <li
            onClick={() => {
                onEvent("selectWallet", { name, address });
            }}
        >
            {active && <p>(logo)</p>}

            <input
                onBlur={renaming === address ? onBlur : undefined}
                onClick={() => {
                    setRenaming(address);
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

export default function WalletMenu({ activeWallet, availableWallets, onEvent }: WalletMenuProps) {
    return (
        <ul>
            {activeWallet && availableWallets
                ? availableWallets.map(([name, address]) => (
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
    );
}
