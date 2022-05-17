import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import * as adapter from "@pianity/arsnap-adapter";

import { REQUIRED_PERMISSIONS } from "@/consts";
import { downloadFile, exhaustive } from "@/utils";
import { getMissingPermissions } from "@/utils/arsnap";
import githubIconUrl from "@/assets/icons/github.svg";
import { useArsnapReducer, updateWallets, updateTransactions, updateBalance } from "@/state";
import Wallet from "@/views/Wallet";
import Welcome from "@/views/Welcome";
import Header from "@/components/Header";
import About from "@/views/About";
import { WalletMenuEvent, WalletMenuEventResponse } from "@/components/WalletMenu";
import Text from "@/components/interface/typography/Text";
import Send from "@/views/Send";

async function isArsnapConfigured() {
    try {
        const missingPermissions = await getMissingPermissions(REQUIRED_PERMISSIONS);
        return missingPermissions.length === 0;
    } catch (e) {
        return false;
    }
}

export default function App() {
    const [loading, setLoading] = useState(true);
    const [state, dispatch] = useArsnapReducer();

    const updateWalletData = () => {
        if (state.activeWallet) {
            updateBalance(state.activeWallet, dispatch);
            updateTransactions(state.activeWallet, dispatch);
        }
    };

    useEffect(() => {
        isArsnapConfigured()
            .then((configured) => {
                if (configured) {
                    updateWallets(dispatch);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));

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
        <div className="min-h-screen flex flex-col">
            <Header
                loading={loading}
                smallLogo={!!state}
                activeWallet={state.activeWallet}
                availableWallets={state.wallets}
                onWalletEvent={onWalletMenuEvent}
                onInitialized={() => updateWallets(dispatch)}
            />

            <Routes>
                <Route
                    path="/"
                    element={
                        state.activeWallet ? (
                            <Wallet
                                balance={state.arBalance}
                                price={state.arPrice}
                                transactions={state.transactions}
                            />
                        ) : (
                            <Welcome
                                loading={loading}
                                onInitialized={() => updateWallets(dispatch)}
                            />
                        )
                    }
                />
                <Route path="/about" element={<About />} />
                <Route
                    path="/send"
                    element={
                        <Send
                            activeAddress={state.activeWallet!}
                            balance={state.arBalance}
                            arPrice={state.arPrice}
                            dispatchBalance={dispatch}
                        />
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>

            <footer className="fixed inset-x-0 bottom-0 h-16 flex items-center justify-between px-6">
                <Text size="14" taller weight="semibold">
                    ArSnap v0.1
                </Text>
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com"
                    className="flex items-center"
                >
                    <img src={githubIconUrl} alt="GitHub" />
                    <Text.span size="16" taller weight="semibold" className="ml-2">
                        GitHub
                    </Text.span>
                </a>
            </footer>
        </div>
    );
}
