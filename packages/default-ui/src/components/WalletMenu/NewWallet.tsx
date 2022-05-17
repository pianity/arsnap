import Button from "@/components/interface/Button";
import {
    ExportWallet,
    OnFileBrowserEvent,
    OnWalletMenuEvent,
    RenameWallet,
} from "@/components/WalletMenu/WalletMenu";
import { NamedAddress } from "@/utils/types";
import Text from "@/components/interface/typography/Text";
import Label from "@/components/interface/Label";
import Input from "@/components/interface/Input";

type NewWalletProps = {
    origin: "imported" | "created";
    wallet: NamedAddress;
    onGoBack: () => void;
    onEvent: OnWalletMenuEvent<RenameWallet | ExportWallet>;
    onFileBrowserEvent: OnFileBrowserEvent;
};

export default function NewWallet({
    origin,
    wallet,
    onGoBack,
    onEvent,
    onFileBrowserEvent,
}: NewWalletProps) {
    return (
        <div onClick={(e) => e.stopPropagation()} className="flex flex-col px-2">
            {/* MARK: Title */}
            <Text
                color="purple"
                size="24"
                weight="semibold"
                taller
                align="center"
                className="mt-4 mb-2"
            >
                {origin === "imported" ? "Wallet imported!" : "New Wallet created!"}
            </Text>
            {/* MARK: Subtitle */}
            <Text.span
                color="gray-dark"
                size="16"
                align="center"
                className="leading-[120%] mb-10 px-3"
            >
                {origin === "imported"
                    ? "You can now give a name to your wallet."
                    : "You can now give a name to your new wallet and store the seed phrase securely."}
            </Text.span>

            {/* MARK: Name wallet */}
            <Label className="mb-3">Name your wallet</Label>
            <Input
                onBlur={(e) => {
                    onEvent({
                        event: "renameWallet",
                        name: e.target.value,
                        address: wallet.address,
                    });
                    e.stopPropagation();
                }}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                defaultValue={wallet.name}
            />

            {/* MARK: Buttons */}
            <div className="flex mt-6 mb-2">
                {origin === "created" && (
                    <Button
                        onClick={async () => {
                            onFileBrowserEvent("opened");
                            await onEvent({ event: "exportWallet", address: wallet.address });
                            onFileBrowserEvent("closed");
                        }}
                        className="mr-3"
                    >
                        Download Wallet
                    </Button>
                )}
                <Button
                    outlined={origin === "created"}
                    onClick={(e) => {
                        onGoBack();
                        e.stopPropagation();
                    }}
                >
                    Done
                </Button>
            </div>
        </div>
    );
}
