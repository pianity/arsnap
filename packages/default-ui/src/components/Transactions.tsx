import Container from "@/components/interface/layout/Container";
import Text from "@/components/interface/typography/Text";
import LoadingIndicator from "@/components/interface/svg/LoadingIndicator";
import { Transactions as TransactionsData } from "@/state";

export type TransactionProps = {
    transactions?: TransactionsData;
};

function transactionsList(transactions: TransactionsData) {
    return transactions.map(({ id, direction, amount, timestamp }) => (
        <li key={id}>
            <span>{direction}</span>
            <span>{new Date(timestamp * 1000).toLocaleString()}</span>
            <span>{amount}</span>
        </li>
    ));
}

export default function Transactions({ transactions }: TransactionProps) {
    return (
        <Container className="grow flex flex-col">
            {/* MARK: Tabs */}
            <div className="bg-purple-dark bg-opacity-25 flex justify-center text-center h-12">
                <button className="relative flex items-center">
                    <Text.h1 size="14" taller wider color="purple-text" weight="semibold" uppercase>
                        Transactions
                    </Text.h1>
                    <div className="absolute left-1/2 -bottom-[2px] -translate-x-1/2 h-[4px] w-[14px] bg-purple rounded-full" />
                </button>
            </div>

            {/* MARK: Transaction list */}
            {transactions &&
                (transactions.length > 0 ? (
                    <ul>{transactionsList(transactions)}</ul>
                ) : (
                    <Text.span className="text-center mt-10">No activity</Text.span>
                ))}

            {/* MARK: Loading */}
            {!transactions && (
                <div className="mt-10 flex justify-center">
                    <LoadingIndicator />
                </div>
            )}
        </Container>
    );
}
