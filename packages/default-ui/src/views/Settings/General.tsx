import { useState } from "react";
import { useForm } from "react-hook-form";

import {
    Currency,
    setGateway,
    setCurrency,
    getGateway as getStoredGateway,
    getCurrency,
    Gateway,
    TESTNET_GATEWAY,
    ARWEAVE_GATEWAY,
} from "@/state/config";
import Label from "@/components/interface/form/Label";
import Input from "@/components/interface/form/Input";
import Button from "@/components/interface/Button";
import Select from "@/components/interface/form/Select";
import ViewContainer from "@/components/interface/layout/ViewContainer";
import Container from "@/components/interface/layout/Container";
import Checkbox from "@/components/interface/form/Checkbox";

type GatewayKey = "arweave" | "testnet";

function getGateway(): GatewayKey {
    if (getStoredGateway().host === "arweave.net") {
        return "arweave";
    }
    return "testnet";
}

export type GeneralProps = {
    onGatewayChange: () => void;
};

export default function General({ onGatewayChange }: GeneralProps) {
    const [selectedGateway, setSelectedGateway] = useState<GatewayKey>(getGateway());

    const gateways: Record<GatewayKey, Gateway> = {
        arweave: ARWEAVE_GATEWAY,
        testnet: TESTNET_GATEWAY,
    };

    return (
        <ViewContainer>
            <Container className="px-6 pt-8 grow">
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col">
                        <Label white className="mb-3">
                            Gateway
                        </Label>
                        <Select
                            options={[
                                ["arweave", "arweave"],
                                ["testnet", "testnet"],
                            ]}
                            onChange={(gateway) => {
                                setGateway(gateways[gateway as GatewayKey]);
                                setSelectedGateway(gateway as GatewayKey);
                                onGatewayChange();
                            }}
                            value={selectedGateway}
                        ></Select>
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

                {/* <Checkbox */}
                {/*     name="checked" */}
                {/*     register={register} */}
                {/*     control={control} */}
                {/*     label="My checkbox" */}
                {/* /> */}
            </Container>
        </ViewContainer>
    );
}
