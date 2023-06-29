import { useRef } from "react";

import Button from "@/components/interface/form/Button";
import Text from "@/components/interface/typography/Text";

export type NewWalletChoice = "importExisting" | "cancel";

export type NewWalletProps = {
    onChoice: (choice: NewWalletChoice, walletFile?: FileList) => Promise<void>;
};

export default function AddWallet({ onChoice }: NewWalletProps) {
    const inputFile = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-col items-center py-6">
            {/* MARK: Hidden input for import */}
            <input
                type="file"
                ref={inputFile}
                style={{ display: "none" }}
                onChange={(e) => {
                    onChoice("importExisting", e.target.files || undefined);
                }}
            />

            {/* MARK: Title */}
            <Text color="purple-dark" size="24" weight="semibold" taller className="mb-9">
                New Wallet
            </Text>

            {/* MARK: Load wallet */}
            <Button
                color="purple"
                large
                onClick={() => {
                    inputFile.current?.click();
                }}
            >
                Import existing wallet
            </Button>

            {/* MARK: Cancel */}
            <button
                className="text-gray-dark font-semibold text-[11px] leading-none tracking-wider uppercase mt-9"
                onClick={() => {
                    onChoice("cancel");
                }}
            >
                Cancel
            </button>
        </div>
    );
}
