import Button from "@/components/interface/form/Button";
import { truncateStringCenter } from "@/utils";
import Text from "@/components/interface/typography/Text";
import { classes } from "@/utils/tailwind";

export type DeleteWalletProps = {
    name: string;
    address: string;
    onChoice: (choice: "confirm" | "cancel") => void;
};

export default function DeleteWallet({ name, address, onChoice }: DeleteWalletProps) {
    return (
        <div
            className={classes(
                "p-6",
                "absolute inset-0",
                "flex flex-col items-center justify-center",
                "bg-red-light bg-opacity-95 text-white",
            )}
        >
            <Text size="24" taller weight="semibold" align="center">
                Do you really want to remove your wallet "{name}"?
            </Text>
            <div
                className={classes(
                    "h-10 px-4 my-5",
                    "rounded-full",
                    "bg-white bg-opacity-25",
                    "flex items-center",
                )}
            >
                {truncateStringCenter(address, 26)}
            </div>

            <Text.span align="center" className="leading-[120%] px-3">
                This operation is irreversible, so make sure you have kept your seed phrase or an
                export of the wallet somewhere safe to access it again.
            </Text.span>

            <div className="flex items-center mt-8 gap-2">
                <Button color="white" onClick={() => onChoice("confirm")}>
                    Confirm
                </Button>
                <Button color="white" outlined onClick={() => onChoice("cancel")}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}
