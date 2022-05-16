import { useEffect, useState } from "react";

type BalanceProps = {
    balance?: number;
    price?: number;
};

export default function Balance({ balance, price }: BalanceProps) {
    const [fiatBalance, setFiatBalance] = useState<string | undefined>(undefined);

    useEffect(() => {
        console.log("beh");
        if (balance && price) {
            console.log("beh");
            setFiatBalance((balance * price).toFixed(2));
        }
    }, [balance, price]);

    return (
        <>
            <p>{`${balance ? balance.toFixed(6) : "loading AR balance..."} AR`}</p>
            <p>{`${fiatBalance || "loading FIAT balance..."} $`}</p>
        </>
    );
}
