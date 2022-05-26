import { Control, Path, RegisterOptions, UseFormRegister, useWatch } from "react-hook-form";

import Text from "@/components/interface/typography/Text";
import checkmarkIconUrl from "@/assets/icons/checkmark.svg";
import { classes } from "@/utils/tailwind";

/** Props for {@link Checkbox} */
type CheckboxProps<T> = {
    label?: string;
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
    checked,
    name,
    onToggle,
    register,
    control,
    registerOptions,
}: CheckboxProps<T>) {
    checked = checked ?? !!useWatch({ name, control });
    return (
        <label className="flex cursor-pointer w-max relative">
            {(onToggle || register) && (
                <input
                    type="checkbox"
                    // checked={checked}
                    {...(register?.(name, registerOptions) ?? {})}
                    // onChange={onToggle ? () => onToggle() : undefined}
                    className="absolute invisible"
                />
            )}
            <span
                className={classes(
                    "w-5 h-5",
                    "rounded box-border border border-purple-text",
                    "flex items-center justify-center",
                    "transition duration-300 ease-quart-out",
                    checked ? "bg-purple-text" : "",
                )}
            >
                {checked && <img src={checkmarkIconUrl} alt="" />}
            </span>
            {label && (
                <Text.span size="14" className="ml-2 leading-[140%] whitespace-pre-wrap">
                    {label}
                </Text.span>
            )}
        </label>
    );
}
