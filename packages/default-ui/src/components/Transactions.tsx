import { useEffect, useState } from "react";

import { arweave } from "@/utils/blockchain";
import Api from "@/graphql/api";
import { IncomingTransactionsQuery, OutgoingTransactionsQuery } from "@/graphql/arweave";

export type TransactionProps = {
    address: string;
};

type TransactionDirection = "in" | "out";

type Transaction = {
    id: string;
    direction: TransactionDirection;
    amount: string;
    date: string;
};

function dbg<T>(val: T) {
    console.log(val);
    return val;
}

function gqlToTransaction(
    gqlTxs: IncomingTransactionsQuery | OutgoingTransactionsQuery,
    direction: TransactionDirection,
) {
    const transactions: Transaction[] = gqlTxs.transactions.edges.map(({ cursor, node }) => {
        const date = node.block
            ? new Date(node.block.timestamp * 1000).toLocaleString()
            : "unknown date";

        return { id: node.id, direction, amount: node.quantity.ar, date };
    });

    return transactions;
}

async function getTransactions(address: string): Promise<Transaction[]> {
    const outgoings = gqlToTransaction(
        await Api.outgoingTransactions({ address: address, limit: 10 }),
        "out",
    );
    const incomings = gqlToTransaction(
        await Api.incomingTransactions({ address: address, limit: 10 }),
        "in",
    );

    return outgoings.concat([...incomings]);
}

function transactionsList(transactions: Transaction[]) {
    return transactions.map(({ id, direction, amount, date }) => (
        <li key={id}>
            <span>{date}</span>
            <span>{amount}</span>
            <span>{direction}</span>
        </li>
    ));
}

export default function Transactions(props: TransactionProps) {
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);

    useEffect(() => {
        getTransactions(props.address).then(setTransactions);
    }, []);

    return <ul>{transactions ? transactionsList(transactions) : "loading transactions..."}</ul>;
}
