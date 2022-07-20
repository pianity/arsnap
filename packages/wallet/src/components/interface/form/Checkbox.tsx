import { Control, Path, RegisterOptions, UseFormRegister, useWatch } from "react-hook-form";

import Text from "@/components/interface/typography/Text";
import checkmarkIconUrl from "@/assets/icons/checkmark.svg";
import checkmarkWhiteIconUrl from "@/assets/icons/checkmark-white.svg";
import { classes } from "@/utils/tailwind";
import { exhaustive } from "@/utils";

/** Props for {@link Checkbox} */
type CheckboxProps<T> = {
    label?: string;
    style?: "squared" | "rounded-fill";
} & (
    | {
          /** RHF: Name of the form property */
          name: Path<T>;
          /** RHF: Form register method */
          register: UseFormRegister<T>;
          /** RHF: Form control for checked state */
          control?: Control<T>;
          /** RHF: Form register method properties */
          registerOptions?: RegisterOptions;
          checked?: never;
          onToggle?: never;
      }
    | {
          name?: never;
          register?: never;
          control?: never;
          registerOptions?: never;
          /** Checked value of checkbox */
          checked: boolean;
          /** Called when value should change */
          onToggle?: () => void;
      }
);

/**
 * ArSnap default Checkbox
 *
 * @param props - Component props
 */
export default function Checkbox<T>({
    label,
    style = "squared",
    checked,
    name,
    onToggle,
    register,
    control,
    registerOptions,
}: CheckboxProps<T>) {
    checked = checked ?? !!useWatch({ name, control });

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
            <>
                {register && (
                    <input
                        type="checkbox"
                        {...(register?.(name, registerOptions) ?? {})}
                        className="absolute invisible"
                    />
                )}
                {(onToggle || !register) && (
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={onToggle}
                        readOnly={!onToggle}
                        className="absolute invisible"
                    />
                )}
            </>
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
}
