import { useState } from "react";

/** Props for {@link CopiableText} */
type CopiableTextProps = {
    /** Full text to copy on click */
    textToCopy: string;
    /** Text to render */
    children: string;
};

/**
 * Renders children in a span which copies textToCopy on click.
 *
 * @remarks
 * A `Copied to clipboard! ✓` string briefly replaces children on success.
 *
 * @param props - Component props
 */
export default function CopiableText({ textToCopy, children }: CopiableTextProps) {
    const [copied, setCopied] = useState(false);

    /**
     * Copies text to clipboard and sets the copied state
     * to true for a 2000ms timeout on success.
     *
     * @param text - text to copy
     */
    function copyToClipboard(text: string) {
        let timeout: ReturnType<typeof setTimeout>;
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            timeout = setTimeout(() => {
                setCopied(false);
            }, 2000);
        });

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }

    return (
        <span className="cursor-pointer" onClick={() => copyToClipboard(textToCopy)}>
            {copied ? "Copied to clipboard! ✓" : children}
        </span>
    );
}
