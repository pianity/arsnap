import { Transactions as TransactionsData, Balance as BalanceData } from "@/state";
import Balance from "@/components/Balance";
import Transactions from "@/components/Transactions";

export type WalletProps = {
    balance?: BalanceData;
    transactions?: TransactionsData;
};

export default function Wallet({ balance, transactions }: WalletProps) {
    return (
        <>
            <Balance balance={balance} />
            <Transactions transactions={transactions} />
            <a href="/send">Send</a>
        </>
    );
}
