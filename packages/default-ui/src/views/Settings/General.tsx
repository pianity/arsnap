import { useForm } from "react-hook-form";

import Label from "@/components/interface/form/Label";
import Input from "@/components/interface/form/Input";
import Button from "@/components/interface/Button";
import Select from "@/components/interface/form/Select";
import ViewContainer from "@/components/interface/layout/ViewContainer";
import Container from "@/components/interface/layout/Container";
import Checkbox from "@/components/interface/form/Checkbox";

export default function General() {
    type Form = {
        currency: string;
        gateway: string;
        checked: boolean;
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<Form>({
        defaultValues: {
            gateway: "testnet",
            currency: "USD",
            checked: false,
        },
    });

    function submit(data: Form) {
        console.log(data);
    }

    return (
        <ViewContainer>
            <Container className="px-6 pt-8 grow">
                <form onSubmit={handleSubmit(submit)}>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col">
                            <Label white className="mb-3">
                                Gateway
                            </Label>
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
                        </div>

                        <div className="flex flex-col">
                            <Label white className="mb-3">
                                Currency
                            </Label>
                            <Select
                                options={[
                                    ["USD", "USD"],
                                    ["EUR", "EUR"],
                                ]}
                                name="currency"
                                register={register}
                                registerOptions={{
                                    required: {
                                        value: true,
                                        message: "This field is required",
                                    },
                                }}
                                className={errors.gateway ? " border-red-dark" : ""}
                            ></Select>
                        </div>
                    </div>

                    <Checkbox
                        name="checked"
                        register={register}
                        control={control}
                        label="My checkbox"
                    />

                    <Button type="submit">Save</Button>
                </form>
            </Container>
        </ViewContainer>
    );
}
