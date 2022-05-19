import Text from "@/components/interface/typography/Text";
import checkmarkIconUrl from "@/assets/icons/checkmark.svg";
import { classes } from "@/utils/tailwind";

type CheckboxProps = {
    label?: string;
    checked: boolean;
    onToggle?: () => void;
};

export default function Checkbox({ label, checked, onToggle }: CheckboxProps) {
    return (
        <label className="flex cursor-pointer w-max">
            {onToggle && (
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle()}
                    className="invisible"
                />
            )}
            <span
                className={classes(
                    "w-5 h-5",
                    "rounded box-border border border-purple",
                    "flex items-center justify-center",
                    "transition duration-300 ease-quart-out",
                    checked ? "bg-purple" : "",
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
