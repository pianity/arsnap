import { useEffect } from "react";

import { useWalletReducer, updateBalance, updateTransactions } from "@/state/wallet";
import Balance from "@/components/Balance";
import Transactions from "@/components/Transactions";

export type WalletProps = {
    address: string;
};

export default function Wallet({ address }: WalletProps) {
    const [walletState, walletDispatch] = useWalletReducer();

    useEffect(() => {
        if (address) {
            updateBalance(address, walletDispatch);
            updateTransactions(address, walletDispatch);
        }

        const updateInterval = setInterval(async () => {
            if (address) {
                updateBalance(address, walletDispatch);
                updateTransactions(address, walletDispatch);
            }
        }, 2 * 60 * 1000);

        return () => {
            clearInterval(updateInterval);
        };
    }, []);

    return (
        <>
            <Balance balance={walletState.balance} />
            <Transactions transactions={walletState.transactions} />
        </>
    );
}
