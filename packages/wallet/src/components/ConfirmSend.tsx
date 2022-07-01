import { SendFormData } from "@/views/Send";
import Text from "@/components/interface/typography/Text";
import ARIcon from "@/components/interface/svg/ARIcon";
import { truncateStringCenter } from "@/utils";
import Button from "@/components/interface/Button";

type ConfirmSendProps = {
    data: SendFormData;
    fee: number;
    activeAddress: string;
    arPrice?: number;
    onResponse: (response: "confirm" | "cancel") => void;
};

export default function ConfirmSend({
    data,
    fee,
    activeAddress,
    arPrice,
    onResponse,
}: ConfirmSendProps) {
    return (
        <div className="flex flex-col px-6 pb-6 pt-8 items-center">
            <Text.h1
                color="purple"
                size="32"
                taller
                weight="bold"
                align="center"
                className="whitespace-pre-wrap mb-8"
            >
                {"Review\nyour transaction"}
            </Text.h1>

            <div className="bg-purple-light rounded-md grid grid-cols-2 gap-3 items-center p-8 w-full mb-8">
                {/* MARK: Amount */}
                <Text.label color="purple-dark" size="13" wider weight="semibold" uppercase>
                    Amount
                </Text.label>
                <Info
                    value={String(data.amount)}
                    subValue={arPrice ? `${(data.amount * arPrice).toFixed(2)} USD` : undefined}
                    valueIsAR
                />

                {/* MARK: Fee */}
                <Text.label color="purple-dark" size="13" wider weight="semibold" uppercase>
                    Fee
                </Text.label>
                <Info
                    value={String(fee)}
                    subValue={arPrice ? `${(fee * arPrice).toFixed(2)} USD` : undefined}
                    valueIsAR
                />

                {/* MARK: From */}
                <Text.label color="purple-dark" size="13" wider weight="semibold" uppercase>
                    From
                </Text.label>
                <Info value={truncateStringCenter(activeAddress, 20)} />

                {/* MARK: Recipient */}
                <Text.label color="purple-dark" size="13" wider weight="semibold" uppercase>
                    To
                </Text.label>
                <Info value={truncateStringCenter(data.recipient, 20)} />

                {/* Message */}
                <Text.label color="purple-dark" size="13" wider weight="semibold" uppercase>
                    Message
                </Text.label>
                <Info value={data.note} />
            </div>

            <Button large color="purple" onClick={() => onResponse("confirm")}>
                Confirm
            </Button>
            <button className="mt-5" onClick={() => onResponse("cancel")}>
                <Text.span color="gray-dark" size="11" weight="semibold" wider uppercase>
                    Cancel
                </Text.span>
            </button>
        </div>
    );
}

type InfoProps = {
    value: string;
    subValue?: string;
    valueIsAR?: boolean;
};

function Info({ value, subValue, valueIsAR }: InfoProps) {
    return (
        <div className="flex flex-col gap-1 items-start">
            <div className="flex items-center gap-1 text-purple-dark">
                <Text.span size={valueIsAR ? "18" : "14"} weight="semibold" uppercase>
                    {value}
                </Text.span>
                {valueIsAR && <ARIcon width={16} height={16} />}
            </div>
            {subValue && (
                <Text.span color="gray-dark" size="12">
                    {subValue}
                </Text.span>
            )}
        </div>
    );
}
