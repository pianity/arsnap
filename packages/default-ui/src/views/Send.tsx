import { Dispatch, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import * as adapter from "@pianity/arsnap-adapter";

import Arweave from "arweave";
import { SetArBalance, SetArPrice, updateBalance } from "@/state";
import Button from "@/components/interface/Button";
import { arweave as getArweave } from "@/utils/blockchain";
import ViewContainer from "@/components/interface/layout/ViewContainer";
import Container from "@/components/interface/layout/Container";
import Text from "@/components/interface/typography/Text";
import ARIcon from "@/components/interface/svg/ARIcon";
import Label from "@/components/interface/form/Label";
import Input from "@/components/interface/form/Input";
import InputError from "@/components/interface/form/InputError";
import Modal from "@/components/interface/Modal";
import ConfirmSend from "@/components/ConfirmSend";
import LoadingIndicator from "@/components/interface/svg/LoadingIndicator";
import { classes } from "@/utils/tailwind";
import { getFiatFormatter } from "@/utils/currencies";

const ARWEAVE_ADDRESS_PATTERN = /[a-z0-9-_]{43}/i;

export type SendFormData = {
    amount: number;
    recipient: string;
    note: string;
};

type TxStatus =
    | { status: "confirm"; data: SendFormData }
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

    const [arweave, _] = useState<Arweave>(getArweave());

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<SendFormData>({
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

    function onSubmit(data: SendFormData) {
        setTxStatus({ status: "confirm", data });
    }

    async function postTx(data: SendFormData) {
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
            <Modal show={!!txStatus} onClose={() => setTxStatus(undefined)}>
                {txStatus?.status === "confirm" && (
                    <ConfirmSend
                        data={txStatus.data}
                        fee={fee}
                        activeAddress={activeAddress}
                        arPrice={arPrice}
                        onResponse={(response) => {
                            if (response === "confirm") {
                                postTx(txStatus.data);
                            } else {
                                setTxStatus(undefined);
                            }
                        }}
                    />
                )}

                {txStatus?.status === "loading" && (
                    <div className="h-[242px] flex flex-col items-center justify-center">
                        <LoadingIndicator width={25} height={25} className="text-purple" />
                    </div>
                )}

                {txStatus?.status === "success" && (
                    <div className="h-[242px] flex flex-col items-center justify-center">
                        <Text.h1 color="purple" size="32" weight="bold" taller>
                            Success!
                        </Text.h1>
                        <Text.span color="gray-dark" size="16" className="mt-3 mb-8 leading-[120%]">
                            Your transaction is on its way...
                        </Text.span>
                        <Link to="/">
                            <Button color="purple" large>
                                Done
                            </Button>
                        </Link>
                    </div>
                )}

                {txStatus?.status === "error" && (
                    <div className="py-12 px-6 flex flex-col items-center justify-center">
                        <Text.h1 color="red-dark" size="32" weight="bold" taller>
                            Oops.
                        </Text.h1>
                        <Text.span color="gray-dark" size="16" className="mt-3 leading-[120%]">
                            There was an error while trying to send your transaction.
                        </Text.span>
                        <div
                            className={classes(
                                "w-full p-8 my-8",
                                "bg-purple-light",
                                "rounded-md",
                                "flex items-center justify-center",
                            )}
                        >
                            <Text.span
                                color="gray-dark"
                                size="16"
                                className="leading-[120%]"
                                align="center"
                            >
                                {txStatus.reason}
                            </Text.span>
                        </div>

                        <Button color="purple" large onClick={() => setTxStatus(undefined)}>
                            Go back
                        </Button>
                    </div>
                )}
            </Modal>

            <Container>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                                className={classes(
                                    "min-w-[44px] max-w-[12ch]",
                                    "text-[40px] leading-none font-bold",
                                    "text-purple-dark invalid:text-red-dark",
                                    "bg-transparent outline-none",
                                )}
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
                                    className={classes(
                                        "h-8 px-3 ml-3",
                                        "flex items-center self-center",
                                        "rounded-full box-border border border-purple",
                                    )}
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
                            <Text.span align="center">{`~${getFiatFormatter().format(
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
                                <div className="flex items-center justify-between mb-3 h-4">
                                    <Label white>Send to address</Label>
                                    {errors.recipient && (
                                        <InputError
                                            message={errors.recipient.message ?? "Invalid"}
                                        />
                                    )}
                                </div>
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
                                <Label
                                    white
                                    className="flex items-center mb-3 h-4 whitespace-pre-wrap"
                                >
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
                    </div>
                </form>
            </Container>
        </ViewContainer>
    );
}
