import { Transactions as TransactionsData, Balance as BalanceData } from "@/state/wallet";
import Balance from "@/components/Balance";
import Transactions from "@/components/Transactions";
import WalletMenu from "@/components/WalletMenu";

export type WalletProps = {
    balance: BalanceData | null;
    transactions: TransactionsData | null;
};

export default function Wallet({ balance, transactions }: WalletProps) {
    return (
        <>
            <WalletMenu />
            <Balance balance={balance} />
            <Transactions transactions={transactions} />
        </>
    );
}
