import { forwardRef, HTMLProps, ForwardedRef } from "react";

import Text from "@/components/interface/typography/Text";
import { classes } from "@/utils/tailwind";

type SelectExtraProps = {
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
    label?: string;
};
type SelectProps = SelectExtraProps &
    Omit<HTMLProps<HTMLSelectElement>, keyof SelectExtraProps | "type">;

/**
 * ArSnap default select.
 */
const Select = forwardRef(
    (
        // { label, placeholder, value, options, name, onChange, className, ...selectProps}: SelectProps<T>,
        { label, placeholder, options, className, ...selectProps }: SelectProps,
        ref: ForwardedRef<HTMLSelectElement>,
    ) => {
        return (
            <div
                className={classes(
                    "w-full h-10 px-4",
                    "text-[14px] leading-none",
                    "flex items-center gap-2",
                    "bg-transparent focus:outline-none",
                    "rounded-md border box-border border-purple-text",
                    "hover:cursor-pointer",
                    className,
                )}
            >
                {label && (
                    <Text.span size="14" className="font-bold">
                        {label}
                    </Text.span>
                )}

                <select
                    className={classes(
                        "w-full h-full",
                        "bg-transparent focus:outline-none",
                        "text-[14px] leading-[140%]",
                        "hover:cursor-pointer",
                    )}
                    {...selectProps}
                    ref={ref}
                >
                    {placeholder && (
                        <option value="never" disabled>
                            {placeholder}
                        </option>
                    )}

                    {options.map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>
        );
    },
);
export default Select;
