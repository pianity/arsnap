import Button from "@/components/interface/Button";

export type DeleteWalletProps = {
    name: string;
    address: string;
    onChoice: (choice: "confirm" | "cancel") => void;
};

export default function DeleteWallet({ name, address, onChoice }: DeleteWalletProps) {
    return (
        <>
            <p>Do you really want to remove your wallet "{name}"</p>
            <p>{address}</p>
            <p>This operation is unreversible!</p>
            <Button onClick={() => onChoice("confirm")}>Confirm</Button>
            <Button onClick={() => onChoice("cancel")}>Cancel</Button>
        </>
    );
}
