import { forwardRef, HTMLProps } from "react";

import Text from "@/components/interface/typography/Text";
import checkmarkIconUrl from "@/assets/icons/checkmark.svg";
import checkmarkWhiteIconUrl from "@/assets/icons/checkmark-white.svg";
import { classes } from "@/utils/tailwind";
import { exhaustive } from "@/utils";

/** Props for {@link Checkbox} */
type CheckboxExtraProps = {
    label?: string;
    style?: "squared" | "rounded-fill";
};
type CheckboxProps = CheckboxExtraProps &
    Omit<HTMLProps<HTMLInputElement>, keyof CheckboxExtraProps | "type" | "className">;

/**
 * ArSnap default Checkbox
 *
 * @param props - Component props
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, style = "squared", ...inputProps }: CheckboxProps, ref) => {
        const { checked } = inputProps;

        let boxStyle: string;
        let checkmarkStyle: string;
        let checkmarkUrl: string;

        switch (style) {
            case "squared":
                boxStyle = classes(
                    "rounded box-border border border-purple-text",
                    checked && "bg-purple-text",
                );
                checkmarkStyle = "";
                checkmarkUrl = checkmarkIconUrl;
                break;

            case "rounded-fill":
                boxStyle = classes("rounded-full", checked ? "bg-green-dark" : "bg-gray-light");
                checkmarkStyle = checked ? "opacity-100" : "opacity-50";
                checkmarkUrl = checkmarkWhiteIconUrl;
                break;

            default:
                return exhaustive(style);
        }

        return (
            <label className="flex cursor-pointer w-max relative">
                <input type="checkbox" className="absolute invisible" {...inputProps} ref={ref} />
                <span
                    className={classes(
                        "w-5 h-5",
                        boxStyle,
                        "flex items-center justify-center",
                        "transition duration-300 ease-quart-out",
                    )}
                >
                    {(checked || style === "rounded-fill") && (
                        <img className={checkmarkStyle} src={checkmarkUrl} alt="" />
                    )}
                </span>
                {label && (
                    <Text.span size="14" className="ml-2 leading-[140%] whitespace-pre-wrap">
                        {label}
                    </Text.span>
                )}
            </label>
        );
    },
);
export default Checkbox;
