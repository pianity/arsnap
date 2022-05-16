import { Transactions as TransactionsData, Balance as BalanceData } from "@/state";
import Balance from "@/components/Balance";
import Transactions from "@/components/Transactions";
import ViewContainer from "@/components/interface/layout/ViewContainer";

export type WalletProps = {
    balance?: BalanceData;
    transactions?: TransactionsData;
};

export default function Wallet({ balance, transactions }: WalletProps) {
    function onSendClick() {}

    return (
        <ViewContainer>
            <div className="grow flex flex-col gap-4 w-full">
                <Balance balance={balance} onSendClick={onSendClick} />
                <Transactions transactions={transactions} />
            </div>
        </ViewContainer>
    );
}
