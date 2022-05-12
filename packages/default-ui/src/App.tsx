import { useEffect, Dispatch, Reducer, useReducer, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

import * as adapter from "@pianity/arsnap-adapter";
// import "@pianity/arsnap-compat";

import Wallet from "@/views/Wallet";
import About from "@/views/About";
import { exhaustive } from "@/utils";
import { getMissingPermissions } from "@/utils/arsnap";
import {
    Balance,
    Transactions,
    updateTransactions,
    updateBalance,
    useWalletReducer,
} from "@/state/wallet";
import Welcome from "@/views/Welcome";
import { REQUIRED_PERMISSIONS } from "@/consts";

async function isArsnapInstalled() {
    try {
        const missingPermissions = await getMissingPermissions(REQUIRED_PERMISSIONS);
        return missingPermissions.length === 0;
    } catch (e) {
        console.log("getMissingPermissions threw:", e);
        return false;
    }
}

export default function App() {
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        isArsnapInstalled().then(setInitialized);
    }, []);

    return (
        <>
            <Link to="/about">Abouuuuut</Link>

            <Routes>
                <Route
                    path="/"
                    element={
                        initialized ? (
                            <Wallet />
                        ) : (
                            <Welcome
                                onInitialized={() => {
                                    setInitialized(true);
                                }}
                            />
                        )
                    }
                />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}
