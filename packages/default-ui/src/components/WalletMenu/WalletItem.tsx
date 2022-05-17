import { useState } from "react";

import walletIconUrl from "@/assets/icons/wallet.svg";
import exportButtonUrl from "@/assets/icons/export-button.svg";
import closeIconUrl from "@/assets/icons/close.svg";
import Text from "@/components/interface/typography/Text";
import {
    ExportWallet,
    OnWalletMenuEvent,
    RenameWallet,
    SelectWallet,
} from "@/components/WalletMenu/WalletMenu";
import { NamedAddress } from "@/utils/types";
import truncateStringCenter from "@/utils";

export type WalletItemProps = {
    active?: boolean;
    name: string;
    address: string;
    onEvent: OnWalletMenuEvent<RenameWallet | SelectWallet | ExportWallet>;
    onDeleteWallet: (address: NamedAddress) => void;
};
export default function WalletItem({
    active,
    name,
    address,
    onEvent,
    onDeleteWallet,
}: WalletItemProps) {
    // Used to show the user a copied success message
    const [copied, setCopied] = useState(false);
    // Used to switch between text and input for editing wallet name
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(name);

    /**
     * Copies text to clipboard and sets the copied state
     * to true for a 2000ms timeout on success.
     *
     * @param text text to copy
     */
    function copyToClipboard(text: string) {
        let timeout: NodeJS.Timeout | undefined;
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            timeout = setTimeout(() => {
                setCopied(false);
            }, 2000);
        });

        return () => {
            timeout && clearTimeout(timeout);
        };
    }

    return (
        <div
            onClick={() => {
                !active && onEvent({ event: "selectWallet", address });
            }}
            className={
                "flex items-center px-3 h-16 min-w-0 group border border-purple-light rounded-md shrink-0" +
                (active ? "" : " cursor-pointer lg:hover:bg-purple-light")
            }
        >
            {/* MARK: Wallet icon */}
            {active && (
                <div className="w-9 h-9 shrink-0 mr-3 flex items-center justify-center bg-purple-light rounded-full">
                    <img src={walletIconUrl} width={16} height={12} />
                </div>
            )}

            {/* MARK: Wallet info */}
            <div className="flex flex-col min-w-0 grow">
                {/* MARK: Wallet name */}
                <div className="mb-[6px] w-max flex items-center max-w-full">
                    {editing ? (
                        <input
                            onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                    setNewName(name);
                                    setEditing(false);
                                } else if (e.key === "Enter") {
                                    onEvent({ event: "renameWallet", address, name: newName });
                                    setEditing(false);
                                }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onBlur={() => {
                                setNewName(name);
                                setEditing(false);
                            }}
                            value={newName}
                            onChange={(e) => {
                                setNewName(e.target.value);
                            }}
                            className="text-purple text-[18px] leading-[110%] font-semibold text-left bg-transparent outline-none underline"
                        />
                    ) : (
                        <Text
                            color="purple"
                            size="18"
                            taller
                            weight="semibold"
                            className="truncate text-left"
                        >
                            {name}
                        </Text>
                    )}
                    {/* MARK: Edit button */}
                    {!editing && (
                        <button
                            className="hidden group-hover:block shrink-0 ml-1 leading-none"
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditing(true);
                            }}
                        >
                            edit
                        </button>
                    )}
                </div>

                {/* MARK: Wallet address */}
                <button
                    className="w-max"
                    onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(address);
                    }}
                >
                    <Text
                        color="gray-dark"
                        size="14"
                        opacity="75"
                        className="whitespace-nowrap text-left"
                    >
                        {copied
                            ? "Copied to clipboard! ✓"
                            : truncateStringCenter(address, active ? 22 : 28)}
                    </Text>
                </button>
            </div>

            {/* MARK: Action buttons */}
            <div className="hidden group-hover:flex items-center ml-3 shrink-0">
                {/* MARK: Export button */}
                <button
                    onClick={() => {
                        onEvent({ event: "exportWallet", address });
                    }}
                >
                    <img src={exportButtonUrl} width={28} height={28} alt="Export wallet" />
                </button>

                {/* MARK: Delete button */}
                <button
                    onClick={() => {
                        onDeleteWallet({ name, address });
                    }}
                    className="ml-2 flex items-center justify-center w-7 h-7 rounded-full border border-purple-dark box-border text-purple-dark"
                >
                    <img src={closeIconUrl} width={8} height={8} alt="Delete wallet" />
                </button>
            </div>
        </div>
    );
}
