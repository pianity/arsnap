import { Balance as BalanceData } from "@/state/wallet";

type BalanceProps = {
    balance?: BalanceData;
};

export default function Balance({ balance }: BalanceProps) {
    return (
        <>
            <p>{`${balance?.ar || "loading AR balance..."} AR`}</p>
            <p>{`${balance?.fiat || "loading FIAT balance..."} $`}</p>
        </>
    );
}
