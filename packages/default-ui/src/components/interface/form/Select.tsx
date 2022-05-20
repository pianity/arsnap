import { Path, RegisterOptions, UseFormRegister } from "react-hook-form";

import { classes } from "@/utils/tailwind";

/** Props for {@link Select} */
type SelectProps<T> = {
    /**
     * Placeholder for select.
     *
     * @remarks Only shows as placeholder if value is undefined,
     * otherwise shows as a disabled first option.
     */
    placeholder?: string;
    /** List of [value, label] pairs */
    options: [string, string][];
    /** Extra classes for the component */
    className?: string;
} & (
    | {
          /** RHF: Name of the form property */
          name: Path<T>;
          /** RHF: Form register method */
          register: UseFormRegister<T>;
          /** RHF: Form register method properties */
          registerOptions?: RegisterOptions;
          value?: never;
          onChange?: never;
      }
    | {
          name?: UseFormRegister<T>;
          register?: never;
          registerOptions?: never;
          /** Selected value */
          value?: string | undefined;
          /** Called with the new selected value */
          onChange?: (value: string) => void;
      }
);

/**
 * ArSnap default select.
 */
export default function Select<T>({
    placeholder,
    value,
    options,
    name,
    onChange,
    register,
    registerOptions,
    className,
}: SelectProps<T>) {
    return (
        <div
            className={classes(
                "w-full h-12 px-4",
                "text-[14px] leading-none",
                "flex items-center",
                "bg-transparent focus:outline-none",
                "rounded-md border box-border border-purple-text",
                className ?? "",
            )}
        >
            <select
                value={register ? undefined : value ?? "never"}
                className={classes(
                    "w-full h-full",
                    "bg-transparent focus:outline-none",
                    "text-[14px] leading-[140%]",
                )}
                {...(register?.(name, registerOptions) ?? {})}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            >
                {placeholder && (
                    <option value="never" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map(([value, label]) => (
                    <option key={value} value={value} className="text-purple">
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
}
