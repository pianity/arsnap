import { useEffect, Dispatch, Reducer, useReducer } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

import * as adapter from "@pianity/arsnap-adapter";
// import "@pianity/arsnap-compat";

import Wallet from "@/views/Wallet";
import About from "@/views/About";
import { exhaustive } from "@/utils";
import {
    Balance,
    Transactions,
    updateTransactions,
    updateBalance,
    useWalletReducer,
} from "@/state/wallet";

export default function App() {
    const address = "kX4Z5hj5znsyxwAIG9yvOf40u3EXTnGv-jL9ALTqPSg";

    const [state, dispatch] = useWalletReducer(address);

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
