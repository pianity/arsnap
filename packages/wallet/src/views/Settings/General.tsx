import { Dispatch, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Text from "@/components/interface/typography/Text";
import { Config, ConfigAction, GatewayName, GATEWAYS } from "@/state/config";
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

type FormData = {
    gateway: GatewayName;
    testnet: boolean;
};

function onSave(
    setShowSaved: SetState<boolean>,
    dispatchConfig: Dispatch<ConfigAction>,
    data: FormData,
) {
    dispatchConfig({
        type: "setGateway",
        gateway: data.gateway,
    });

    setShowSaved(true);
}

export default function General({ config, dispatchConfig }: GeneralProps) {
    const [showSaved, setShowSaved] = useState(false);

    const { register, handleSubmit } = useForm<FormData>({
        defaultValues: { gateway: config.gateway },
    });

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout> | undefined;

        if (showSaved) {
            timeout = setTimeout(() => setShowSaved(false), 2000);
        }

        return () => timeout && clearTimeout(timeout);
    }, [showSaved]);

    return (
        <BaseLayout category="General">
            <form onSubmit={handleSubmit((data) => onSave(setShowSaved, dispatchConfig, data))}>
                <div className="flex flex-col gap-3 mt-6 mb-4 px-4">
                    <Label white className="mb-5">
                        Gateway configuration
                    </Label>
                    <div className="flex gap-6 items-center">
                        <div className="flex flex-col">
                            <Select
                                label="Gateway"
                                options={Object.keys(GATEWAYS).map((gateway) => [gateway, gateway])}
                                {...register("gateway")}
                            />
                        </div>
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

                <div className="flex justify-end space-x-3">
                    <Text.h1
                        className={classes(
                            "self-center",
                            "transition-all duration-300 ease-quart-out",
                            showSaved
                                ? "mr-0 opacity-100 visible pointer-events-none"
                                : "-mr-2 opacity-0 invisible",
                        )}
                    >
                        Saved!
                    </Text.h1>
                    <Button
                        type="submit"
                        outlined
                        color="white"
                        className="transition-colors hover:bg-purple"
                    >
                        Save
                    </Button>
                </div>
            </form>
        </BaseLayout>
    );
}
