import { Dispatch } from "react";

import Api from "@/graphql/api";
import { IncomingTransactionsQuery, OutgoingTransactionsQuery } from "@/graphql/arweave";
import { SetTransactions } from "@/state";
import { GatewayName } from "@/state/config";

export type TransactionDirection = "in" | "out";

export type Transaction = {
    id: string;
    from: string;
    to: string;
    direction: TransactionDirection;
    amount: string; // in AR
    fee: string; // in AR
    timestamp: number;
};

export type Transactions = Transaction[];

function gqlToTransaction(
    gqlTxs: IncomingTransactionsQuery | OutgoingTransactionsQuery,
    direction: TransactionDirection,
) {
    const transactions: Transactions = gqlTxs.transactions.edges.map(
        ({ cursor: _cursor, node: { id, owner, recipient, quantity, fee, block } }) => ({
            id,
            from: owner.address,
            to: recipient,
            direction,
            amount: quantity.ar,
            fee: fee.ar,
            timestamp: block?.timestamp ?? 0,
        }),
    );

    return transactions;
}

async function getTransactions(gateway: GatewayName, address: string): Promise<Transactions> {
    const api = Api(gateway);

    const outgoings = gqlToTransaction(
        await api.outgoingTransactions({ address, limit: 10 }),
        "out",
    );
    const incomings = gqlToTransaction(
        await api.incomingTransactions({ address, limit: 10 }),
        "in",
    );

    return outgoings.concat([...incomings]).sort((a, b) => b.timestamp - a.timestamp);
}

export async function updateTransactions(
    gateway: GatewayName,
    address: string,
    dispatch: Dispatch<SetTransactions>,
) {
    const transactions = await getTransactions(gateway, address);

    dispatch({
        type: "setTransactions",
        transactions,
    });
}
