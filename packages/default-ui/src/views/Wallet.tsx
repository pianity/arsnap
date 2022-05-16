import { Transactions as TransactionsData } from "@/state";
import Balance from "@/components/Balance";
import Transactions from "@/components/Transactions";

export type WalletProps = {
    balance?: number;
    price?: number;
    transactions?: TransactionsData;
};

export default function Wallet({ balance, price, transactions }: WalletProps) {
    return (
        <>
            <Balance balance={balance} price={price} />
            <Transactions transactions={transactions} />
            <a href="/send">Send</a>
        </>
    );
}
