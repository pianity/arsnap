import { Balance as BalanceData } from "@/state/wallet";
import Text from "@/components/interface/typography/Text";
import Container from "@/components/interface/layout/Container";

type BalanceProps = {
    /** Set to true to shrink size of balance component */
    shrink?: boolean;
    /** Balance state */
    balance?: BalanceData;
    /** Called when user clicks the send button */
    onSendClick: () => void;
};

/**
 * Renders the wallet's balance in both AR and fiat
 * along with a send button.
 */
export default function Balance({ shrink, balance, onSendClick }: BalanceProps) {
    return (
        <Container
            opaque
            centerAll
            className={
                "relative transition-size duration-300 ease-quart-out " +
                (shrink ? "h-[104px]" : "h-[200px]")
            }
        >
            {/* MARK: AR Balance */}
            <Text.span
                color="gray-dark"
                size={shrink ? "32" : "56"}
                weight="bold"
                pulse={!balance}
                className="mb-2"
            >{`${balance?.ar || "0"} AR`}</Text.span>

            {/* MARK: FIAT Balance */}
            <Text.span color="gray-light" size={shrink ? "18" : "20"} pulse={!balance}>{`$${
                balance?.fiat || "0"
            } USD`}</Text.span>

            {/* MARK: Send button */}
            <button
                onClick={onSendClick}
                className="absolute right-12 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[color:#E2E2FE] text-purple-dark flex items-center justify-center"
            >
                <svg
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M24.7532 1.82141C25.0646 1.01252 24.2696 0.2176 23.4607 0.52895L1.19844 9.09799C0.421019 9.39723 0.328845 10.4601 1.04315 10.8887L7.31814 14.6539C7.68221 14.8723 8.14455 14.837 8.47127 14.5659L14.3358 9.69888C15.2838 8.91217 16.5385 10.2016 15.7263 11.1277L10.7448 16.8081C10.4582 17.1349 10.4155 17.6093 10.6391 17.9819L14.3936 24.2392C14.8222 24.9535 15.8851 24.8613 16.1844 24.0839L24.7532 1.82141Z"
                        className="fill-current"
                    />
                </svg>
            </button>
        </Container>
    );
}
