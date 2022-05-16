import { Dispatch, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import * as adapter from "@pianity/arsnap-adapter";

import { SetArBalance, SetArPrice, updateBalance } from "@/state";
import Button from "@/components/Button";
import { arweave } from "@/utils/blockchain";

const ARWEAVE_ADDRESS_PATTERN = /[a-z0-9-_]{43}/i;

type Form = {
    amount: number;
    recipient: string;
    note: string;
};

type TxStatus =
    | {
          status: "success" | "loading";
      }
    | { status: "error"; reason: string };

export type SendProps = {
    activeAddress: string;
    balance?: number;
    arPrice?: number;
    dispatchBalance: Dispatch<SetArBalance | SetArPrice>;
};

export default function Send({ activeAddress, balance, arPrice, dispatchBalance }: SendProps) {
    const [txStatus, setTxStatus] = useState<TxStatus | undefined>(undefined);
    const [amountFiat, setAmountFiat] = useState<number>(0);
    const [fee, setFee] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Form>({ defaultValues: { amount: 0, recipient: "", note: "" } });
    const watchAmount = watch("amount");
    const watchRecipient = watch("recipient");

    useEffect(() => {
        console.log("watchRecipient:", watchRecipient);
        if (watchRecipient.match(ARWEAVE_ADDRESS_PATTERN)) {
            arweave.transactions
                .getPrice(0, watchRecipient)
                .then((fee) => setFee(Number(arweave.ar.winstonToAr(fee))));
        }
    }, [watchRecipient]);

    useEffect(() => {
        const amountNumber = Number(watchAmount);

        if (amountNumber && amountNumber > 0) {
            if (arPrice) {
                setAmountFiat(amountNumber * arPrice);
            } else {
                setAmountFiat(0);
            }

            setTotal(amountNumber + fee);
        } else {
            setAmountFiat(0);
            setTotal(0);
        }
    }, [watchAmount, fee]);

    async function postTx(data: Form) {
        setTxStatus({ status: "loading" });

        try {
            const winston = arweave.ar.arToWinston(data.amount.toString());

            await adapter.sendWinstonTo(arweave, winston, data.recipient);
            setTxStatus({ status: "success" });
            await updateBalance(activeAddress, dispatchBalance);
        } catch (e) {
            setTxStatus({
                status: "error",
                // TODO: Reason shouldn't directly include `e`.
                reason: `${e}`,
            });
        }
    }

    return (
        <>
            <h1>Send AR</h1>
            <p>Available: {balance?.toFixed(4)}</p>

            <form onSubmit={handleSubmit(postTx)}>
                <label>amount:</label>
                <input
                    type="number"
                    {...register("amount", {
                        required: true,
                        validate: (amount) => {
                            if (!(!balance || amount <= Number(balance))) {
                                return false;
                            }

                            return true;
                        },
                    })}
                />

                <label>recipient:</label>
                <input
                    {...register("recipient", {
                        required: true,
                        pattern: ARWEAVE_ADDRESS_PATTERN,
                    })}
                />

                <label>note:</label>
                <input {...register("note")} />

                <Button type="submit">Send</Button>

                <Button>
                    <a href="/">Cancel</a>
                </Button>

                <p>~{amountFiat.toFixed(2)} $</p>
                <p>fee {fee} AR</p>
                <p>total {total} AR</p>

                {txStatus?.status === "loading" && <p>Sending transaction...</p>}
                {txStatus?.status === "success" && <p>Transaction sent!</p>}
                {txStatus?.status === "error" && (
                    <p>Couldn't send the transaction: {txStatus.reason}</p>
                )}
            </form>
        </>
    );
}
