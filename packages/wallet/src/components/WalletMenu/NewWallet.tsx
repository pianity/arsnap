import Button from "@/components/interface/form/Button";
import { OnWalletMenuEvent, RenameWallet } from "@/components/WalletMenu/WalletMenu";
import { NamedAddress } from "@/utils/types";
import Text from "@/components/interface/typography/Text";
import Label from "@/components/interface/form/Label";
import Input from "@/components/interface/form/Input";

type NewWalletProps = {
    origin: "imported" | "created";
    wallet: NamedAddress;
    onGoBack: () => void;
    onEvent: OnWalletMenuEvent<RenameWallet>;
};

export default function NewWallet({ origin, wallet, onGoBack, onEvent }: NewWalletProps) {
    return (
        <div className="flex flex-col">
            <div className="flex flex-col bg-purple-light rounded-t-xl p-8 mb-8">
                {/* MARK: Title */}
                <Text
                    color="purple"
                    size="24"
                    weight="semibold"
                    taller
                    align="center"
                    className="mb-2"
                >
                    {origin === "imported" ? "Wallet imported!" : "New Wallet created!"}
                </Text>
                {/* MARK: Subtitle */}
                <Text.span
                    color="gray-dark"
                    size="16"
                    align="center"
                    className="leading-[120%]px-3"
                >
                    {origin === "imported"
                        ? "You can now give a name to your wallet."
                        : "You can now give a name to your new wallet and store the seed phrase securely."}
                </Text.span>
            </div>

            <div className="flex flex-col px-6 pb-6">
                {/* MARK: Name wallet */}
                <Label className="mb-3">Name your wallet</Label>
                <Input
                    onBlur={(e) => {
                        onEvent({
                            event: "renameWallet",
                            name: e.target.value,
                            address: wallet.address,
                        });
                    }}
                    onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                    defaultValue={wallet.name}
                />

                {/* MARK: Buttons */}
                <div className="flex mt-6 mb-2">
                    <Button
                        outlined={origin === "created"}
                        onClick={() => {
                            onGoBack();
                        }}
                    >
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
}
