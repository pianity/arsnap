import { useForm, ValidateResult } from "react-hook-form";

export type SendProps = {
    balance?: string;
    onChoice: (choice: "send" | "cancel") => void;
};

const ARWEAVE_ADDRESS_PATTERN = /[a-z0-9-_]{43}/i;

export default function Send({ balance = "0" }: SendProps) {
    type Form = {
        amount: number;
        recipientAddress: string;
        note: string;
    };

    const {
        register,
        handleSubmit,
        // watch,
        formState: { errors },
    } = useForm<Form>();

    return (
        <>
            <h1>Send AR</h1>
            <p>Available: {balance}</p>

            <form
                onSubmit={handleSubmit((data) => {
                    console.log(data);
                })}
            >
                <input {...register("amount", { required: true })} />
                <input
                    {...register("recipientAddress", {
                        required: true,
                        pattern: ARWEAVE_ADDRESS_PATTERN,
                    })}
                />
                <input {...register("note")} />

                <input type="submit" />
            </form>
        </>
    );
}
