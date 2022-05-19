import { MouseEventHandler, PropsWithChildren } from "react";

import {
    getAlignClass,
    getColorClass,
    getHoverColorClass,
    getOpacityClass,
    getSizeClass,
    getWeightClass,
    Opacity,
    TextAlign,
    TextColor,
    TextSize,
    TextWeight,
} from "@/utils/tailwind";

type TextProps = {
    /** Font weight of the text */
    weight?: TextWeight;
    /** Increases letter-spacing to 0.05em */
    wider?: boolean;
    /** Increases line height to 110% */
    taller?: boolean;
    /** Color of the text */
    color?: TextColor;
    /** Color of the text on hover */
    hoverColor?: TextColor;
    /** Opacity of the text */
    opacity?: Opacity;
    /** Font size of the text (in px) */
    size?: TextSize;
    /** Alignment of the text */
    align?: TextAlign;
    /** Makes text all uppercase */
    uppercase?: boolean;
    /** Makes text underlined */
    underlined?: boolean;
    /** Makes the text pulse */
    pulse?: boolean;
    /** Extra classes added to the element */
    className?: string;
    /** On click callback for the element */
    onClick?: MouseEventHandler;
};

/**
 * Default text component. Renders as a div.
 *
 * @remarks
 * Use Text.span, Text.label, Text.h1, Text.h2, Text.h3, Text.p
 * to render as a specific HTML tag.
 */
function Text(props: PropsWithChildren<TextProps>) {
    const className = getTextClassName(props);
    return (
        <div className={className} onClick={props.onClick}>
            {props.children}
        </div>
    );
}

/**
 * Renders text component as a span.
 */
function span(props: PropsWithChildren<TextProps>) {
    const className = getTextClassName(props);
    return (
        <span className={className} onClick={props.onClick}>
            {props.children}
        </span>
    );
}

/**
 * Renders text component as a label.
 */
function label(props: PropsWithChildren<TextProps>) {
    const className = getTextClassName(props);
    return (
        <label className={className} onClick={props.onClick}>
            {props.children}
        </label>
    );
}

/**
 * Renders text component as a p.
 */
function p(props: PropsWithChildren<TextProps>) {
    const className = getTextClassName(props);
    return (
        <p className={className} onClick={props.onClick}>
            {props.children}
        </p>
    );
}

/**
 * Renders text component as a h1.
 */
function h1(props: PropsWithChildren<TextProps>) {
    const className = getTextClassName(props);
    return (
        <h1 className={className} onClick={props.onClick}>
            {props.children}
        </h1>
    );
}

/**
 * Renders text component as a h2.
 */
function h2(props: PropsWithChildren<TextProps>) {
    const className = getTextClassName(props);
    return (
        <h2 className={className} onClick={props.onClick}>
            {props.children}
        </h2>
    );
}

/**
 * Renders text component as a h3.
 */
function h3(props: PropsWithChildren<TextProps>) {
    const className = getTextClassName(props);
    return (
        <h3 className={className} onClick={props.onClick}>
            {props.children}
        </h3>
    );
}

/**
 * Renders text component as a li.
 */
function li(props: PropsWithChildren<TextProps>) {
    const className = getTextClassName(props);
    return (
        <li className={className} onClick={props.onClick}>
            {props.children}
        </li>
    );
}

Text.span = span;
Text.label = label;
Text.h1 = h1;
Text.h2 = h2;
Text.h3 = h3;
Text.p = p;
Text.li = li;

export default Text;

function getTextClassName({
    weight,
    color,
    hoverColor,
    size,
    opacity,
    taller,
    wider,
    uppercase,
    pulse,
    align,
    underlined,
    className,
}: TextProps) {
    const classNames: string[] = [];
    if (weight) {
        classNames.push(getWeightClass(weight));
    }
    if (color) {
        classNames.push(getColorClass(color));
    }
    if (hoverColor) {
        classNames.push(getHoverColorClass(hoverColor));
    }
    if (size) {
        classNames.push(getSizeClass(size));
    }
    if (opacity) {
        classNames.push(getOpacityClass(opacity));
    }
    if (taller) {
        classNames.push("leading-[110%]");
    } else {
        classNames.push("leading-none");
    }
    if (wider) {
        classNames.push("tracking-[0.05em]");
    }
    if (className) {
        classNames.push(className);
    }
    if (pulse) {
        classNames.push("animate-pulse");
    }
    if (uppercase) {
        classNames.push("uppercase");
    }
    if (align) {
        classNames.push(getAlignClass(align));
    }
    if (underlined) {
        classNames.push("underline");
    }

    return classNames.join(" ");
}
