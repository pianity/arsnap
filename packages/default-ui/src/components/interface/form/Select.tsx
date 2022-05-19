import { classes } from "@/utils/tailwind";

/** Props for {@link Select} */
type SelectProps = {
    /**
     * Placeholder for select.
     *
     * @remarks Only shows as placeholder if value is undefined,
     * otherwise shows as a disabled first option.
     */
    placeholder?: string;
    /** Selected value */
    value?: string | undefined;
    /** List of [value, label] pairs */
    options: [string, string][];
    /** Called with the new selected value */
    onChange: (value: string) => void;
};

/**
 * ArSnap default select.
 */
export default function Select({ placeholder, value, options, onChange }: SelectProps) {
    return (
        <div
            className={classes(
                "w-full h-12 px-4",
                "text-[14px] leading-none",
                "flex items-center",
                "bg-transparent focus:outline-none",
                "rounded-md border box-border border-purple-text",
            )}
        >
            <select
                value={value ?? "never"}
                className={classes(
                    "w-full h-full",
                    "bg-transparent focus:outline-none",
                    "text-[14px] leading-[140%]",
                )}
                onChange={(e) => onChange(e.target.value)}
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
}
