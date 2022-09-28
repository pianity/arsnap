import { Dispatch, useEffect, useState } from "react";

import Text from "@/components/interface/typography/Text";
import { Config, ConfigAction, GatewayName } from "@/state/config";
import Label from "@/components/interface/form/Label";
import Select from "@/components/interface/form/Select";
import { BaseLayout } from "@/components/interface/layout/settingsLayout";
import Button from "@/components/interface/form/Button";
import { classes } from "@/utils/tailwind";
import { SetState } from "@/utils/types";

export type GeneralProps = {
    config: Config;
    dispatchConfig: Dispatch<ConfigAction>;
};

const options: [GatewayName, GatewayName][] = [
    ["testnet", "testnet"],
    ["arweave", "arweave"],
];

function onSave(setShowSaved: SetState<boolean>) {
    setShowSaved(true);
}

export default function General({ config, dispatchConfig }: GeneralProps) {
    const [showSaved, setShowSaved] = useState(false);

    useEffect(() => {
        if (showSaved) {
            const timeout = setTimeout(() => setShowSaved(false), 2000);
            return () => clearTimeout(timeout);
        }
    }, [showSaved]);

    return (
        <BaseLayout category="General">
            <div className="grid grid-cols-2 gap-8 mt-4 mb-4">
                <div className="flex flex-col">
                    <Label white className="mb-3">
                        Gateway
                    </Label>
                    <Select
                        options={options}
                        onChange={(gateway) => dispatchConfig({ type: "setGateway", gateway })}
                        value={config.gateway}
                    />
                </div>

                {/* <div className="flex flex-col"> */}
                {/*     <Label white className="mb-3"> */}
                {/*         Currency */}
                {/*     </Label> */}
                {/*     <Select */}
                {/*         options={[ */}
                {/*             ["USD", "USD"], */}
                {/*             ["EUR", "EUR"], */}
                {/*         ]} */}
                {/*         onChange={(currency) => { */}
                {/*             setCurrency(currency as Currency); */}
                {/*         }} */}
                {/*     ></Select> */}
                {/* </div> */}
            </div>

            <div className="flex ml-auto justify-center items-center space-x-3">
                <Text.h1
                    className={classes(
                        "transition-all duration-300 ease-quart-out",
                        showSaved
                            ? "mr-0 opacity-100 visible pointer-events-none"
                            : "-mr-2 opacity-0 invisible",
                    )}
                >
                    Saved!
                </Text.h1>
                <Button
                    outlined
                    color="white"
                    className="transition-colors hover:bg-purple"
                    onClick={() => onSave(setShowSaved)}
                >
                    Save
                </Button>
            </div>

            {/* <Checkbox */}
            {/*     name="checked" */}
            {/*     register={register} */}
            {/*     control={control} */}
            {/*     label="My checkbox" */}
            {/* /> */}
        </BaseLayout>
    );
}
