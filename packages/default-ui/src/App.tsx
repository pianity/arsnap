import { useEffect } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

import * as adapter from "@pianity/arsnap-adapter";

import { REQUIRED_PERMISSIONS } from "@/consts";
import { downloadFile, exhaustive } from "@/utils";
import { getMissingPermissions } from "@/utils/arsnap";
import { useArsnapReducer, updateWallets, updateTransactions, updateBalance } from "@/state";
import Wallet from "@/views/Wallet";
import Welcome from "@/views/Welcome";
import About from "@/views/About";
import Send from "@/views/Send";
import WalletMenu, { WalletMenuEvent, WalletMenuEventResponse } from "@/components/WalletMenu";

async function isArsnapConfigured() {
    try {
        const missingPermissions = await getMissingPermissions(REQUIRED_PERMISSIONS);
        console.log(missingPermissions);
        return missingPermissions.length === 0;
    } catch (e) {
        console.log("getMissingPermissions threw:", e);
        return false;
    }
}

export default function App() {
    const [state, dispatch] = useArsnapReducer();

    const updateWalletData = () => {
        if (state.activeWallet) {
            updateBalance(state.activeWallet, dispatch);
            updateTransactions(state.activeWallet, dispatch);
        }
    };

    useEffect(() => {
        isArsnapConfigured().then((configured) => {
            if (configured) {
                updateWallets(dispatch);
            }
        });

        const updateInterval = setInterval(updateWalletData, 2 * 60 * 1000);

        return () => {
            clearInterval(updateInterval);
        };
    }, []);

    useEffect(() => {
        updateWalletData();
    }, [state.activeWallet]);

    async function onWalletMenuEvent(e: WalletMenuEvent): Promise<WalletMenuEventResponse> {
        switch (e.event) {
            case "renameWallet":
                await adapter.renameWallet(e.address, e.name);
                await updateWallets(dispatch);
                return {};

            case "selectWallet":
                await adapter.setActiveAddress(e.address);
                await updateWallets(dispatch);
                return {};

            case "importWallet": {
                const wallet = await adapter.importWallet(e.jwk);
                await updateWallets(dispatch);
                return { wallet };
            }

            case "exportWallet": {
                const wallet = await adapter.exportWallet(e.address);

                // TODO: Make sure that `wallet.metadata.name` contains only safe characters (this
                // should also be enforced in ArSnap).
                downloadFile(JSON.stringify(wallet.jwk), "application/json", `${wallet.name}.json`);

                return {};
            }

            case "deleteWallet":
                await adapter.deleteWallet(e.address);
                await updateWallets(dispatch);
                return {};

            default:
                exhaustive(e);
                throw new Error();
        }
    }

    return (
        <>
            <Link to="/about">Abouuuuut</Link>

            {state.activeWallet && state.wallets ? (
                <WalletMenu
                    activeWallet={state.activeWallet}
                    availableWallets={state.wallets}
                    onEvent={onWalletMenuEvent}
                />
            ) : (
                <p>Connect with Metamask</p>
            )}

            <Routes>
                <Route
                    path="/"
                    element={
                        state.activeWallet ? (
                            <Wallet balance={state.balance} transactions={state.transactions} />
                        ) : (
                            <Welcome onInitialized={() => updateWallets(dispatch)} />
                        )
                    }
                />
                <Route path="/about" element={<About />} />
                <Route path="/send" element={<Send />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}
