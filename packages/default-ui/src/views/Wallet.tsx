import { Transactions as TransactionsData } from "@/state";
import Balance from "@/components/Balance";
import Transactions from "@/components/Transactions";
import ViewContainer from "@/components/interface/layout/ViewContainer";

export type WalletProps = {
    balance?: number;
    price?: number;
    transactions?: TransactionsData;
};

export default function Wallet({ balance, price, transactions }: WalletProps) {
    return (
        <ViewContainer>
            <div className="grow flex flex-col gap-4 w-full">
                <Balance balance={balance} price={price} />
                <Transactions transactions={transactions} />
            </div>
        </ViewContainer>
    );
}
