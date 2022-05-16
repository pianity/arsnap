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
    return (
        <div
            onClick={() => {
                !active && onEvent({ event: "selectWallet", address });
            }}
            className={
                "flex items-center px-3 py-[14px] min-w-0 group" + (active ? "" : " cursor-pointer")
            }
        >
            {/* MARK: Wallet icon */}
            {active && (
                <div className="w-9 h-9 shrink-0 mr-3 flex items-center justify-center">
                    <img src={walletIconUrl} width={16} height={12} />
                </div>
            )}

            {/* MARK: Wallet info */}
            <div className="flex flex-col min-w-0 grow">
                <Text color="purple" size="18" taller weight="semibold" className="mb-[6px]">
                    {name}
                </Text>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(address);
                    }}
                >
                    <Text
                        color="gray-dark"
                        size="14"
                        opacity="75"
                        className="whitespace-nowrap text-left"
                    >
                        {truncateStringCenter(address, active ? 22 : 28)}
                    </Text>
                </button>
            </div>

            {/* MARK: Action buttons */}
            <div className="hidden group-hover:flex items-center ml-3">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEvent({ event: "exportWallet", address });
                    }}
                    className="mr-2"
                >
                    <img src={exportButtonUrl} width={28} height={28} alt="Export wallet" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
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
