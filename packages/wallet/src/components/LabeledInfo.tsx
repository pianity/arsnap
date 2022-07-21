import { truncateStringCenter } from "@/utils";
import Text from "@/components/interface/typography/Text";
import CopiableText from "@/components/interface/typography/CopiableText";
import Tooltip from "@/components/interface/Tooltip";

type LabeledInfo = {
    label: string;
    info: string | string[] | Record<string, unknown>;
};

export default function LabeledInfo({ label, info }: LabeledInfo) {
    let displayInfo: string;

    if (typeof info === "string") {
        displayInfo = truncateStringCenter(info, 30);
    } else if (Array.isArray(info)) {
        displayInfo = `[${info.length} items]`;
    } else {
        displayInfo = "[object]";
    }

    let copiableInfo: string;

    if (typeof info === "string") {
        copiableInfo = info;
    } else {
        copiableInfo = JSON.stringify(info, undefined, 2);
    }

    const InfoText = () => (
        <Text.span color="white" size="13">
            <CopiableText textToCopy={copiableInfo}>{displayInfo}</CopiableText>
        </Text.span>
    );

    return (
        <div className="flex flex-col gap-2 items-start">
            <>
                <Text.span color="white" size="13" weight="semibold" wider uppercase>
                    {label}
                </Text.span>

                {displayInfo !== info ? (
                    <Tooltip text={copiableInfo}>
                        <InfoText />
                    </Tooltip>
                ) : (
                    <InfoText />
                )}
            </>
        </div>
    );
}
