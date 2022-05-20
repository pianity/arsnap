import { Controller, useForm } from "react-hook-form";

import Label from "@/components/interface/form/Label";
import Input from "@/components/interface/form/Input";
import Button from "@/components/interface/Button";
import Select from "@/components/interface/form/Select";

export default function General() {
    type Form = {
        currency: string;
        gateway: string;
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Form>();

    function submit(data: Form) {
        console.log(data);
    }

    return (
        <>
            <form onSubmit={handleSubmit(submit)}>
                <Label white>Gateway</Label>

                <Input
                    light
                    name="gateway"
                    register={register}
                    defaultValue="testnet"
                    registerOptions={{
                        required: {
                            value: true,
                            message: "This field is required",
                        },
                    }}
                    className={errors.gateway ? " border-red-dark" : ""}
                />

                <Input
                    light
                    name="currency"
                    register={register}
                    defaultValue="USD"
                    registerOptions={{
                        required: {
                            value: true,
                            message: "This field is required",
                        },
                    }}
                    className={errors.gateway ? " border-red-dark" : ""}
                />

                <Button type="submit">Save</Button>
            </form>
        </>
    );
}
