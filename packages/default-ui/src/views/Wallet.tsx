import { useEffect } from "react";

import { useWalletReducer, updateBalance, updateTransactions } from "@/state/wallet";
import Balance from "@/components/Balance";
import Transactions from "@/components/Transactions";
import ViewContainer from "@/components/interface/layout/ViewContainer";

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
        <ViewContainer>
            <div className="grow flex flex-col gap-4 w-full">
                <Balance balance={walletState.balance} onSendClick={onSendClick} />
                <Transactions transactions={walletState.transactions} />
            </div>
        </ViewContainer>
    );
}
