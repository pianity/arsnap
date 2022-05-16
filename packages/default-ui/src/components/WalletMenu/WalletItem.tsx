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
import { useState } from "react";

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
        <div className="flex items-center px-3 py-[14px] min-w-0 group">
            {/* MARK: Wallet icon */}
            {active && (
                <div className="w-9 h-9 shrink-0 mr-3 flex items-center justify-center">
                    <img src={walletIconUrl} width={16} height={12} />
                </div>
            )}

            {/* MARK: Wallet info */}
            <div className="flex flex-col min-w-0 grow">
                {/* MARK: Wallet name */}
                <button
                    className={"mb-[6px] w-max" + (active ? " pointer-events-none" : "")}
                    onClick={() => {
                        !active && onEvent({ event: "selectWallet", address });
                    }}
                >
                    <Text
                        color="purple"
                        size="18"
                        taller
                        weight="semibold"
                        className="truncate text-left hover:underline"
                    >
                        {name}
                    </Text>
                </button>

                {/* MARK: Wallet address */}
                <button
                    className="w-max"
                    onClick={() => {
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
            <div className="hidden group-hover:flex items-center ml-3">
                {/* MARK: Export button */}
                <button
                    onClick={() => {
                        onEvent({ event: "exportWallet", address });
                    }}
                    className="mr-2"
                >
                    <img src={exportButtonUrl} width={28} height={28} alt="Export wallet" />
                </button>

                {/* MARK: Delete button */}
                <button
                    onClick={() => {
                        onDeleteWallet({ name, address });
                    }}
                    className="mr-2 flex items-center justify-center w-7 h-7 rounded-full border border-purple-dark box-border text-purple-dark"
                >
                    <img src={closeIconUrl} width={8} height={8} alt="Delete wallet" />
                </button>
            </div>
        </div>
    );
}
