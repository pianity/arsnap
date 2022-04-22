import React, { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
};

export default function Button(props: ButtonProps) {
    return <button {...props}>{props.children}</button>;
}
