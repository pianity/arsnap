import { useEffect, Dispatch, Reducer, useReducer } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

import * as adapter from "@pianity/arsnap-adapter";
// import "@pianity/arsnap-compat";

import Wallet from "@/views/Wallet";
import About from "@/views/About";
import { exhaustive } from "@/utils";
import getBalance, { Balance } from "@/state/fetchers/balance";
import getTransactions, { Transactions } from "@/state/fetchers/transactions";

type State = {
    address: string;
    balance: Balance;
    transactions: Transactions;
};

function initState(address: string): State {
    return {
        address,
        balance: {},
        transactions: [],
    };
}

type SwitchWallet = {
    type: "switchWallet";
    address: string;
};

type UpdateBalance = {
    type: "updateBalance";
    balance: Balance;
};

type UpdateTransactions = {
    type: "updateTransactions";
    transactions: Transactions;
};

type Action = SwitchWallet | UpdateBalance | UpdateTransactions;

const reducer: Reducer<State, Action> = (state, action): State => {
    switch (action.type) {
        case "switchWallet":
            return {
                address: action.address,
                balance: {},
                transactions: [],
            };
        case "updateBalance":
            return {
                ...state,
                balance: action.balance,
            };

        case "updateTransactions":
            return {
                ...state,
                transactions: action.transactions,
            };

        default:
            exhaustive(action);
            throw new Error();
    }
};

async function updateBalance(address: string, dispatch: Dispatch<Action>) {
    const balance = await getBalance(address);

    dispatch({
        type: "updateBalance",
        balance,
    });
}

async function updateTransactions(address: string, dispatch: Dispatch<Action>) {
    const transactions = await getTransactions(address);

    dispatch({
        type: "updateTransactions",
        transactions,
    });
}

export default function App() {
    const address = "kX4Z5hj5znsyxwAIG9yvOf40u3EXTnGv-jL9ALTqPSg";

    const [state, dispatch] = useReducer(reducer, address, initState);

    useEffect(() => {
        updateBalance(address, dispatch);
        updateTransactions(address, dispatch);

        const updateInterval = setInterval(async () => {
            updateBalance(address, dispatch);
            updateTransactions(address, dispatch);
        }, 2 * 60 * 1000);

        return () => {
            clearInterval(updateInterval);
        };
    }, []);

    return (
        <>
            <Link to="/about">Abouuuuut</Link>

            <Routes>
                <Route
                    path="/"
                    element={<Wallet balance={state.balance} transactions={state.transactions} />}
                />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}
