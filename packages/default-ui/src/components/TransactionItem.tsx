import { useState } from "react";

import { Transaction } from "@/state";
import outgoingIconUrl from "@/assets/icons/outgoing.svg";
import incomingIconUrl from "@/assets/icons/incoming.svg";
import Text from "@/components/interface/typography/Text";
import truncateStringCenter from "@/utils";
import { TextColor } from "@/utils/tailwind";
import Chevron from "@/components/interface/svg/Chevron";
import Button from "@/components/interface/Button";
import CopiableText from "@/components/interface/typography/CopiableText";
import { getFiatFormatter } from "@/utils/currencies";

type TransactionItemProps = {
    arPrice?: number;
    transaction: Transaction;
};

export default function TransactionItem({ arPrice, transaction }: TransactionItemProps) {
    const [showDetails, setShowDetails] = useState(false);

    const incoming = transaction.direction === "in";
    const state = transaction.timestamp === 0 ? "Pending" : "Success";
    const color: TextColor = state === "Pending" ? "orange" : "green";

    return (
        <div>
            <div
                onClick={() => setShowDetails((s) => !s)}
                className="flex items-center h-[84px] group cursor-pointer"
            >
                {/* MARK: Direction arrow */}
                <div
                    className={
                        "w-11 h-11 rounded-full flex items-center justify-center box-border" +
                        " text-white mr-4 shrink-0 transition duration-300 ease-quart-out " +
                        (showDetails
                            ? "bg-purple"
                            : "border border-purple lg:group-hover:bg-purple")
                    }
                >
                    <img
                        src={incoming ? incomingIconUrl : outgoingIconUrl}
                        width={22.5}
                        height={22.5}
                    />
                </div>

                {/* MARK: Direction name + address */}
                <div className="flex flex-col grow">
                    <Text size="18" color="white" weight="semibold" taller className="mb-1">
                        {`${incoming ? "Incoming" : "Outgoing"} Transaction`}
                    </Text>
                    <Text.span size="14" color="purple-light" opacity="50">
                        {truncateStringCenter(transaction.to, 40)}
                    </Text.span>
                </div>

                {/* MARK: State */}
                <div className="flex flex-col items-end shrink-0 mx-6">
                    <Text size="16" weight="semibold" color={color} className="mb-1">
                        {state}
                    </Text>
                    <Text.span size="13" color="purple-light" opacity="50">
                        {new Date(transaction.timestamp * 1000).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text.span>
                </div>

                {/* MARK: Amount */}
                <div
                    className={
                        "h-[52px] px-3 rounded-lg box-border text-white flex flex-col" +
                        " items-center justify-center transition duration-300 ease-quart-out " +
                        (showDetails
                            ? "bg-purple"
                            : "border border-purple lg:group-hover:bg-purple" +
                              "lg:group-hover:border-transparent")
                    }
                >
                    <div className="flex items-center">
                        <Text.span size="16" weight="semibold" color="white" className="mb-1">
                            {(+transaction.amount).toFixed(6)}
                        </Text.span>
                    </div>
                    {arPrice && (
                        <Text.span
                            color={showDetails ? "white" : "purple-light"}
                            size="12"
                            taller
                            opacity={showDetails ? "60" : "50"}
                            className="lg:group-hover:text-white lg:group-hover:opacity-60"
                        >
                            {getFiatFormatter().format(+transaction.amount * arPrice)}
                        </Text.span>
                    )}
                </div>
            </div>

            {/* MARK: Details view */}
            <div
                className={
                    "bg-purple-dark bg-opacity-30 rounded-lg transition-size duration-300" +
                    " ease-quart-out relative overflow-hidden " +
                    (showDetails ? "h-[345px] mb-4" : "h-0 mb-0 pointer-events-none")
                }
            >
                {/* MARK: Info Container */}
                <div className="flex flex-col h-full w-full py-10 pl-10 pr-12">
                    <div className="grid grid-cols-[minmax(auto,50%)_1fr] gap-6">
                        {/* MARK: Amount */}
                        <div className="bg-purple rounded-lg flex h-[69px] w-max">
                            <div
                                className={
                                    "bg-white rounded-lg flex flex-col gap-2 justify-center" +
                                    " min-w-[114px] px-4"
                                }
                            >
                                <Text.span
                                    color="purple-dark"
                                    size="13"
                                    weight="semibold"
                                    wider
                                    uppercase
                                >
                                    Amount
                                </Text.span>
                                <Text.span
                                    color="purple-dark"
                                    size="13"
                                >{`${(+transaction.amount).toFixed(6)} AR`}</Text.span>
                            </div>
                            <div className="px-5 flex flex-col justify-center gap-2">
                                <Text.span
                                    color="white"
                                    size="13"
                                    weight="semibold"
                                    wider
                                    uppercase
                                >
                                    Fee
                                </Text.span>
                                <Text.span
                                    color="white"
                                    size="13"
                                >{`${transaction.fee} AR`}</Text.span>
                            </div>
                        </div>

                        {/* MARK: Status */}
                        <div className="flex flex-col gap-2 justify-center items-start">
                            <Text.span size="13" weight="semibold" wider uppercase>
                                Status
                            </Text.span>
                            <div className="bg-white h-[30px] rounded flex items-center px-2">
                                <Text.span size="14" weight="semibold" color={color}>
                                    {state}
                                </Text.span>
                            </div>
                        </div>

                        <DetailsInfo
                            label="ID"
                            info={truncateStringCenter(transaction.id)}
                            textToCopy={transaction.id}
                        />
                        <DetailsInfo label="TIME" info="2022-04-20 17:30:51 +02:00" />

                        <DetailsInfo
                            label="FROM"
                            info={truncateStringCenter(transaction.from)}
                            textToCopy={transaction.from}
                        />
                        <DetailsInfo
                            label="TO"
                            info={truncateStringCenter(transaction.to)}
                            textToCopy={transaction.to}
                        />
                    </div>

                    <div className="h-[1px] bg-purple-text my-6 shrink-0" />

                    <div className="flex gap-3">
                        <Button outlined color="purple">
                            View RAW transaction
                        </Button>
                        <Button outlined color="purple">
                            View on ViewBlock
                        </Button>
                    </div>
                </div>

                {/* MARK: Close button */}
                <button
                    onClick={() => setShowDetails(false)}
                    className={
                        "w-8 h-8 flex items-center justify-center rounded-full bg-white" +
                        " text-purple-dark absolute top-8 right-8" +
                        (showDetails ? "" : " hidden")
                    }
                >
                    <Chevron className="rotate-180" />
                </button>
            </div>
        </div>
    );
}

type DetailsInfoProps = {
    label: string;
    info: string;
    textToCopy?: string;
};

function DetailsInfo({ label, info, textToCopy }: DetailsInfoProps) {
    return (
        <div className="flex flex-col gap-2 items-start">
            <Text.span color="white" size="13" weight="semibold" wider uppercase>
                {label}
            </Text.span>
            <Text.span color="white" size="13">
                {textToCopy ? <CopiableText textToCopy={textToCopy}>{info}</CopiableText> : info}
            </Text.span>
        </div>
    );
}
