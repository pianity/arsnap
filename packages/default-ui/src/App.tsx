import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import * as adapter from "@pianity/arsnap-adapter";

import { REQUIRED_PERMISSIONS } from "@/consts";
import { downloadFile, exhaustive } from "@/utils";
import { getMissingPermissions } from "@/utils/arsnap";
import { useSnapReducer } from "@/state/snap";
import { updateWallets } from "@/state/snap/getWallets";
import githubIconUrl from "@/assets/github.png";
import Wallet from "@/views/Wallet";
import Welcome from "@/views/Welcome";
import Header from "@/components/Header";
import About from "@/views/About";
import { WalletMenuEvent, WalletMenuEventResponse } from "@/components/WalletMenu";

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
    // Indicates whether Arsnap is being loaded and wallets updated.
    const [loading, setLoading] = useState(true);
    const [snapState, snapDispatch] = useSnapReducer();

    useEffect(() => {
        isArsnapInstalled()
            .then(async () => {
                await updateWallets(snapDispatch);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    async function onWalletMenuEvent(e: WalletMenuEvent): Promise<WalletMenuEventResponse> {
        switch (e.event) {
            case "renameWallet":
                await adapter.renameWallet(e.address, e.name);
                await updateWallets(snapDispatch);
                return {};

            case "selectWallet":
                await adapter.setActiveAddress(e.address);
                return {};

            case "importWallet": {
                const wallet = await adapter.importWallet(e.jwk);
                await updateWallets(snapDispatch);
                return { wallet };
            }

            case "downloadWallet": {
                console.log("downloading wallet");

                const wallet = await adapter.exportWallet(e.address);

                // TODO: Make sure that `wallet.metadata.name` contains only safe characters (this
                // should also be enforced in ArSnap).
                downloadFile(JSON.stringify(wallet.jwk), "application/json", `${wallet.name}.json`);

                return {};
            }

            default:
                exhaustive(e);
                throw new Error();
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header
                loading={loading}
                activeWallet={snapState.activeWallet}
                availableWallets={snapState.wallets}
                onWalletEvent={onWalletMenuEvent}
                onInitialized={() => updateWallets(snapDispatch)}
            />

            <Routes>
                <Route
                    path="/"
                    element={
                        snapState.activeWallet ? (
                            <Wallet address={snapState.activeWallet} />
                        ) : (
                            <Welcome
                                loading={loading}
                                onInitialized={() => updateWallets(snapDispatch)}
                            />
                        )
                    }
                />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>

            <footer className="fixed inset-x-0 bottom-0 h-16 flex items-center justify-between px-6">
                <div className="text-sm leading-[15px] font-semibold">ArSnap v0.1</div>
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com"
                    className="flex items-center"
                >
                    <img src={githubIconUrl} alt="GitHub" />
                    <span className="text-base leading-[17px] font-semibold ml-2">GitHub</span>
                </a>
            </footer>
        </div>
    );
}
