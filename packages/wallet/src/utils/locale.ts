export function formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getNumberFormatter(locales?: string | string[], opt?: Intl.NumberFormatOptions) {
    try {
        return new Intl.NumberFormat(locales, opt);
    } catch {
        try {
            return new Intl.NumberFormat("en-US");
        } catch (error) {
            // WARNING: Polyfill for unavailable Intl options...
            return {
                format: (number: number, _?: unknown) => "" + number,
            };
        }
    }
}

/**
 * Creates a number formatter with default options for FIAT currencies.
 *
 * @param locales - locale for the number formatter
 * @param opt - options for the number formatter
 *
 * @returns a number formatter
 */
export function getFiatFormatter(locales?: string | string[], opt?: Intl.NumberFormatOptions) {
    const options: Intl.NumberFormatOptions = {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        currencyDisplay: "narrowSymbol",
        ...(opt ?? {}),
    };

    const formatter = getNumberFormatter(locales, options);
    return formatter;
}
