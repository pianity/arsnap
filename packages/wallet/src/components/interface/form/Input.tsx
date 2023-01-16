import { forwardRef, HTMLProps } from "react";

/** Props for {@link Checkbox} */
type InputExtraProps = {
    light?: boolean;
    className?: string;
};
type InputProps = InputExtraProps & Omit<HTMLProps<HTMLInputElement>, keyof InputExtraProps>;

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ light, className, ...inputProps }: InputProps, ref) => {
        const colorClass = light
            ? "text-purple-light border-purple-text"
            : "text-gray-dark border-gray-dark border-opacity-25";

        return (
            <input
                className={[
                    "w-full h-12 px-4",
                    "text-[14px] leading-none",
                    "flex items-center",
                    "bg-transparent focus:outline-none invalid:border-red-dark",
                    "rounded-md border box-border",
                    colorClass,
                    className,
                ].join(" ")}
                {...inputProps}
                ref={ref}
            />
        );
    },
);
export default Input;
