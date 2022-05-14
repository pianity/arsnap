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

    function onSendClick() {}

    return (
        <div className="w-full grow flex flex-col items-center mt-20">
            <div className="flex flex-col items-center justify-center w-[90vw] max-w-[768px]">
                <Balance balance={walletState.balance} onSendClick={onSendClick} />
                <Transactions transactions={walletState.transactions} />
            </div>
        </div>
    );
}
