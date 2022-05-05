import { Transaction } from "@/state/fetchers/transactions";

export type TransactionProps = {
    transactions: Transaction[];
};

function transactionsList(transactions: Transaction[]) {
    return transactions.map(({ id, direction, amount, timestamp }) => (
        <li key={id}>
            <span>{direction}</span>
            <span>{new Date(timestamp * 1000).toLocaleString()}</span>
            <span>{amount}</span>
        </li>
    ));
}

export default function Transactions({ transactions }: TransactionProps) {
    return <ul>{transactions ? transactionsList(transactions) : "loading transactions..."}</ul>;
}
