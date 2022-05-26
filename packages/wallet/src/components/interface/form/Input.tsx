import { InputHTMLAttributes } from "react";
import { Path, RegisterOptions, UseFormRegister } from "react-hook-form";

type InputProps<T> = InputHTMLAttributes<HTMLInputElement> & { light?: boolean } & (
        | {
              name: Path<T>;
              register: UseFormRegister<T>;
              registerOptions?: RegisterOptions;
          }
        | {
              name?: UseFormRegister<T>;
              register?: never;
              registerOptions?: RegisterOptions;
          }
    );

/**
 * Default ArSnap input.
 */
export default function Input<T>({
    light,
    name,
    register,
    registerOptions,
    className,
    ...props
}: InputProps<T>) {
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
            {...props}
            {...register?.(name, registerOptions)}
        />
    );
}
