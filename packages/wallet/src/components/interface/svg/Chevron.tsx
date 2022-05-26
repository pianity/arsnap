import { SVGProps } from "react";

export default function Chevron(props: SVGProps<SVGSVGElement>) {
    const { width = "9", height = "6", ...rest } = props;
    return (
        <svg
            {...rest}
            {...{ width, height }}
            viewBox="0 0 9 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M1 1.5L3.74742 4.63991C4.14584 5.09524 4.85417 5.09524 5.25258 4.63991L8 1.5"
                className="stroke-current"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}
