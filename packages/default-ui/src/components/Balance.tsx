import { Balance as BalanceData } from "@/state/fetchers/balance";

type BalanceProps = {
    balance: BalanceData | null;
};

export default function Balance({ balance }: BalanceProps) {
    return (
        <>
            <p>{`${balance?.ar || "loading AR balance..."} AR`}</p>
            <p>{`${balance?.fiat || "loading FIAT balance..."} $`}</p>
        </>
    );
}
