import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

import * as adapter from "@pianity/arsnap-adapter";

import { REQUIRED_PERMISSIONS } from "@/consts";
import { downloadFile, exhaustive } from "@/utils";
import { getMissingPermissions } from "@/utils/arsnap";
import { useSnapReducer } from "@/state/snap";
import { updateWallets } from "@/state/snap/getWallets";
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
    const [initializing, setInitializing] = useState(true);
    const [snapState, snapDispatch] = useSnapReducer();

    useEffect(() => {
        isArsnapInstalled()
            .then(async () => {
                await updateWallets(snapDispatch);
                setInitializing(false);
            })
            .catch(() => setInitializing(false));
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
        <>
            <Header
                initializing={initializing}
                activeWallet={snapState.activeWallet}
                availableWallets={snapState.wallets}
                onWalletEvent={onWalletMenuEvent}
            />

            <Routes>
                <Route
                    path="/"
                    element={
                        snapState.activeWallet ? (
                            <Wallet address={snapState.activeWallet} />
                        ) : (
                            <Welcome onInitialized={() => updateWallets(snapDispatch)} />
                        )
                    }
                />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}
