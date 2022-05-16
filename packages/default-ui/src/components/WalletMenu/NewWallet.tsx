import { useRef } from "react";

import { OnFileBrowserEvent } from "@/components/WalletMenu/WalletMenu";
import Button from "@/components/interface/Button";

export type NewWalletChoice = "importExisting" | "createNew" | "cancel";

export type NewWalletProps = {
    onChoice: (choice: NewWalletChoice, walletFile?: FileList) => Promise<void>;
    onFileBrowserEvent: OnFileBrowserEvent;
};

export default function NewWallet({ onChoice, onFileBrowserEvent }: NewWalletProps) {
    const inputFile = useRef<HTMLInputElement>(null);

    return (
        <>
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
            <Button
                onClick={(e) => {
                    onFileBrowserEvent("opened");
                    e.stopPropagation();
                    inputFile.current?.click();
                }}
            >
                Load existing wallet
            </Button>

            <Button
                onClick={(e) => {
                    e.stopPropagation();
                    onChoice("createNew");
                }}
            >
                Create new wallet
            </Button>

            <Button
                onClick={(e) => {
                    e.stopPropagation();
                    onChoice("cancel");
                }}
            >
                Cancel
            </Button>
        </>
    );
}
