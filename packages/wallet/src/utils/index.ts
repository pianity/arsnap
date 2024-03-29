export function exhaustive(_: never): never {
    throw new Error("Check wasn't exhaustive");
}

export function sleep(seconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}

export type MediaType = "application/json";

export function downloadFile(content: string, mediaType: MediaType, name: string) {
    const linkElement = document.createElement("a");

    const file = new Blob([content], {
        type: mediaType,
    });

    linkElement.href = URL.createObjectURL(file);
    linkElement.download = name;

    document.body.appendChild(linkElement);

    linkElement.click();

    linkElement.remove();
}

/**
 * Finds the wallet name corresponding to the given address.
 *
 * @param wallets - list of wallets
 * @param needle - address of walle to find
 * @returns name of wallet or undefined if not found
 */
export function findAddressName(wallets: [string, string][], needle: string): string {
    return wallets[wallets.findIndex(([address]) => address === needle)][1];
}

/**
 * Truncates a string in the middle
 *
 * @param str - string to truncate
 * @param strLen  -length of the string including separator (default 30)
 * @param separator - string used to replace the truncated part (default "...")
 * @returns string truncated in the middle
 */
export function truncateStringCenter(str: string, strLen = 30, separator = "...") {
    if (!str || str.length < strLen) return str;

    const sepLen = separator.length;
    const charsToShow = strLen - sepLen;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);

    return str.substring(0, frontChars) + separator + str.substring(str.length - backChars);
}

/**
 * Triggers focus on the given element.
 *
 * @param element - element to focus
 */
export function triggerFocus(element: HTMLElement) {
    const eventType = "onfocusin" in element ? "focusin" : "focus";
    const bubbles = "onfocusin" in element;
    let event;

    if ("createEvent" in document) {
        event = document.createEvent("Event");
        event.initEvent?.(eventType, bubbles, true);
    } else if ("Event" in window) {
        event = new Event(eventType, { bubbles, cancelable: true });
    }

    element.focus();
    if (event) element.dispatchEvent(event);
}

/**
 * Produce an array of numbers starting from `start` (inclusively) and ending at `end`
 * (inclusively).
 */
export function range(start: number, end: number) {
    if (start > end) {
        return [];
    }

    return Array.from(Array(end - start + 1), (_, i) => start + i);
}
