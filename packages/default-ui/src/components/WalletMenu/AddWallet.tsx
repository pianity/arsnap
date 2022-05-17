import { useRef } from "react";

import { OnFileBrowserEvent } from "@/components/WalletMenu/WalletMenu";
import Button from "@/components/interface/Button";
import Text from "../interface/typography/Text";

export type NewWalletChoice = "importExisting" | "createNew" | "cancel";

export type NewWalletProps = {
    onChoice: (choice: NewWalletChoice, walletFile?: FileList) => Promise<void>;
    onFileBrowserEvent: OnFileBrowserEvent;
};

export default function AddWallet({ onChoice, onFileBrowserEvent }: NewWalletProps) {
    const inputFile = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-col items-center py-6">
            {/* MARK: Hidden input for import */}
            <input
                type="file"
                ref={inputFile}
                style={{ display: "none" }}
                onChange={(e) => {
                    onFileBrowserEvent("closed");
                    onChoice("importExisting", e.target.files || undefined);
                }}
                onClick={(e) => e.stopPropagation()}
            />

            {/* MARK: Title */}
            <Text color="purple-dark" size="24" weight="semibold" taller className="mb-9">
                New Wallet
            </Text>

            {/* MARK: Load wallet */}
            <Button
                color="purple"
                large
                onClick={(e) => {
                    onFileBrowserEvent("opened");
                    e.stopPropagation();
                    inputFile.current?.click();
                }}
                className="mb-4"
            >
                Load existing wallet
            </Button>

            {/* MARK: New wallet */}
            <Button
                color="purple"
                large
                onClick={(e) => {
                    e.stopPropagation();
                    onChoice("createNew");
                }}
            >
                Create new wallet
            </Button>

            {/* MARK: Cancel */}
            <button
                className="text-gray-dark font-semibold text-[11px] leading-none tracking-wider uppercase mt-9"
                onClick={(e) => {
                    e.stopPropagation();
                    onChoice("cancel");
                }}
            >
                Cancel
            </button>
        </div>
    );
}
