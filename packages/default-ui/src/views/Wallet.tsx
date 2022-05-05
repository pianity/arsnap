import Balance from "@/components/Balance";
import Transactions from "@/components/Transactions";
import { Transactions as TransactionsData } from "@/state/fetchers/transactions";
import { Balance as BalanceData } from "@/state/fetchers/balance";

export type WalletProps = {
    balance: BalanceData;
    transactions: TransactionsData;
};

export default function Wallet({ balance, transactions }: WalletProps) {
    return (
        <>
            <Balance balance={balance} />
            <Transactions transactions={transactions} />
        </>
    );
}
