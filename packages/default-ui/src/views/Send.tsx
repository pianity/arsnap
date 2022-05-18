import { Dispatch, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import * as adapter from "@pianity/arsnap-adapter";

import { SetArBalance, SetArPrice, updateBalance } from "@/state";
import Button from "@/components/interface/Button";
import { arweave } from "@/utils/blockchain";
import ViewContainer from "@/components/interface/layout/ViewContainer";
import Container from "@/components/interface/layout/Container";
import Text from "@/components/interface/typography/Text";
import ARIcon from "@/components/interface/svg/ARIcon";
import Label from "@/components/interface/Label";
import Input from "@/components/interface/Input";

const ARWEAVE_ADDRESS_PATTERN = /[a-z0-9-_]{43}/i;
const fiatFormatter = Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currencyDisplay: "narrowSymbol",
});

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
        setValue,
        formState: { errors },
    } = useForm<Form>({
        defaultValues: { amount: 0, recipient: "", note: "" },
        mode: "onBlur",
    });
    const watchAmount = watch("amount");
    const watchRecipient = watch("recipient");

    useEffect(() => {
        if (watchRecipient?.match(ARWEAVE_ADDRESS_PATTERN)) {
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
        <ViewContainer>
            <Container>
                <form onSubmit={handleSubmit(postTx)}>
                    <div className="flex flex-col items-center pt-10">
                        <Text.h1 size="32" taller weight="bold" className="mb-[8px]">
                            Send AR
                        </Text.h1>
                        <div className="flex items-center mb-10">
                            <Text.span size="16" taller weight="semibold" color="purple-text">
                                Available: {balance?.toFixed(6)}
                            </Text.span>
                            <ARIcon width={20} height={20} className="text-purple-text ml-1" />
                        </div>

                        {/* MARK: Amount input */}
                        <div className="bg-white flex rounded-full h-20 px-6 mb-6">
                            <ARIcon
                                width={24}
                                height={24}
                                className="text-purple-dark self-center mr-3"
                            />
                            <input
                                type="number"
                                min={0}
                                max={balance}
                                className="min-w-[44px] max-w-[12ch] text-[40px] text-purple-dark leading-none font-bold bg-transparent outline-none invalid:text-red-dark"
                                style={{ width: (String(watchAmount)?.length ?? 0) + "ch" }}
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
                            {balance && (
                                <button
                                    onClick={() => setValue("amount", balance)}
                                    className="ml-3 h-8 px-3 rounded-full box-border border border-purple flex items-center self-center"
                                >
                                    <Text.span
                                        size="12"
                                        weight="semibold"
                                        color="purple"
                                        uppercase
                                        className="leading-[75%]"
                                    >
                                        Max
                                    </Text.span>
                                </button>
                            )}
                        </div>

                        {/* MARK: Fees + Total */}
                        <div className="flex flex-col gap-1 mb-10">
                            <Text.span align="center">{`~${fiatFormatter.format(
                                amountFiat,
                            )} USD`}</Text.span>
                            <Text
                                color="purple-text"
                                size="14"
                                className="flex justify-between gap-2"
                            >
                                <Text.span underlined>Fee:</Text.span>
                                <Text.span>{`${fee} AR`}</Text.span>
                            </Text>
                            <Text
                                color="purple-text"
                                size="14"
                                className="flex justify-between gap-2"
                            >
                                <Text.span underlined>Total:</Text.span>
                                <Text.span>{`${total} AR`}</Text.span>
                            </Text>
                        </div>
                    </div>

                    <div className="bg-purple-dark bg-opacity-30 rounded-b-xl pt-10 pb-5 px-12">
                        <div className="grid grid-cols-2 gap-5 mb-10">
                            {/* MARK: Recipient */}
                            <div className="flex flex-col">
                                <Label white className="mb-3">
                                    Send to address
                                </Label>
                                <Input
                                    light
                                    name="recipient"
                                    register={register}
                                    registerOptions={{
                                        required: {
                                            value: true,
                                            message: "This field is required",
                                        },
                                        pattern: {
                                            value: ARWEAVE_ADDRESS_PATTERN,
                                            message: "This field must be a valid AR address",
                                        },
                                    }}
                                    className={errors.recipient ? " border-red-dark" : ""}
                                />
                            </div>

                            {/* MARK: Message */}
                            <div className="flex flex-col">
                                <Label white className="mb-3">
                                    Message <Text.span color="purple-text">(optional)</Text.span>
                                </Label>
                                <Input light name="note" register={register} />
                            </div>
                        </div>

                        {/* MARK: Buttons */}
                        <div className="flex flex-col items-center">
                            <Button large color="purple" type="submit" className="mb-5">
                                Send AR
                            </Button>

                            <Link to="/">
                                <Text.span
                                    color="purple-light"
                                    size="11"
                                    wider
                                    uppercase
                                    weight="semibold"
                                >
                                    Cancel
                                </Text.span>
                            </Link>
                        </div>

                        {txStatus?.status === "loading" && <p>Sending transaction...</p>}
                        {txStatus?.status === "success" && <p>Transaction sent!</p>}
                        {txStatus?.status === "error" && (
                            <p>Couldn't send the transaction: {txStatus.reason}</p>
                        )}
                    </div>
                </form>
            </Container>
        </ViewContainer>
    );
}
