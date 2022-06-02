import { Dispatch, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import * as adapter from "@pianity/arsnap-adapter";

import { version } from "package.json";
import { AppRoute, REQUIRED_PERMISSIONS } from "@/consts";
import { downloadFile, exhaustive } from "@/utils";
import { getMissingPermissions } from "@/utils/arsnap";
import githubIconUrl from "@/assets/icons/github.svg";
import permawebSeal from "@/assets/permaweb-seal.svg";
import {
    useArsnapReducer,
    updateWallets,
    updateTransactions,
    updateBalance,
    updatePermissions,
    SetTransactions,
    SetArBalance,
    SetArPrice,
} from "@/state";
import Wallet from "@/views/Wallet";
import Welcome from "@/views/Welcome";
import Header from "@/components/Header";
import About from "@/views/About";
import { WalletMenuEvent, WalletMenuEventResponse } from "@/components/WalletMenu";
import Text from "@/components/interface/typography/Text";
import Send from "@/views/Send";
import Settings from "@/views/Settings";
import Permissions from "@/views/Settings/Permissions";
import LoadingIndicator from "@/components/interface/svg/LoadingIndicator";
import ViewContainer from "@/components/interface/layout/ViewContainer";
import { classes } from "@/utils/tailwind";
import General from "@/views/Settings/General";
import { GatewayName, useConfigReducer } from "@/state/config";

async function isArsnapConfigured() {
    try {
        const missingPermissions = await getMissingPermissions(REQUIRED_PERMISSIONS);
        return missingPermissions.length === 0;
    } catch (e) {
        return false;
    }
}

function updateWalletData(
    gateway: GatewayName,
    activeWallet: string | undefined,
    dispatchState: Dispatch<SetArBalance | SetArPrice | SetTransactions>,
) {
    if (activeWallet) {
        updateBalance(gateway, activeWallet, dispatchState);
        updateTransactions(gateway, activeWallet, dispatchState);
    }
}

export default function App() {
    const [loading, setLoading] = useState(true);
    const [state, dispatchState] = useArsnapReducer();
    const [config, dispatchConfig] = useConfigReducer();

    useEffect(() => {
        async function init() {
            await updateWallets(dispatchState);
            await updatePermissions(dispatchState);
        }

        isArsnapConfigured()
            .then((configured) => {
                if (configured) {
                    init().then(() => setLoading(false));
                } else {
                    setLoading(false);
                }
            })
            .catch(() => setLoading(false));

        const updateInterval = setInterval(
            () => updateWalletData(config.gateway, state.activeWallet, dispatchState),
            2 * 60 * 1000,
        );

        return () => {
            clearInterval(updateInterval);
        };
    }, []);

    useEffect(() => {
        updateWalletData(config.gateway, state.activeWallet, dispatchState);
    }, [state.activeWallet, config.gateway]);

    async function onWalletMenuEvent(e: WalletMenuEvent): Promise<WalletMenuEventResponse> {
        switch (e.event) {
            case "renameWallet":
                await adapter.renameWallet(e.address, e.name);
                await updateWallets(dispatchState);
                return {};

            case "selectWallet":
                await adapter.setActiveAddress(e.address);
                await updateWallets(dispatchState);
                return {};

            case "importWallet": {
                const wallet = await adapter.importWallet(e.jwk);
                await updateWallets(dispatchState);
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
                await updateWallets(dispatchState);
                return {};

            default:
                return exhaustive(e);
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header
                loading={loading}
                smallLogo={!!state.activeWallet}
                gateway={config.gateway}
                activeWallet={state.activeWallet}
                availableWallets={state.wallets}
                onWalletEvent={onWalletMenuEvent}
                onInitialized={() => updateWallets(dispatchState)}
            />

            {loading ? (
                <ViewContainer className="justify-center">
                    <LoadingIndicator width={40} height={40} className="opacity-40 " />
                </ViewContainer>
            ) : (
                <Routes>
                    <Route path={AppRoute.About} element={<About />} />

                    <Route
                        path={AppRoute.Root}
                        element={
                            state.activeWallet ? (
                                <Wallet
                                    balance={state.arBalance}
                                    price={state.arPrice}
                                    transactions={state.transactions}
                                />
                            ) : (
                                <Welcome onInitialized={() => updateWallets(dispatchState)} />
                            )
                        }
                    />

                    {state.activeWallet && (
                        <>
                            <Route
                                path={AppRoute.Send}
                                element={
                                    <Send
                                        gateway={config.gateway}
                                        activeAddress={state.activeWallet}
                                        balance={state.arBalance}
                                        arPrice={state.arPrice}
                                        dispatchBalance={dispatchState}
                                    />
                                }
                            />

                            <Route path={AppRoute.Settings} element={<Settings />} />

                            <Route
                                path={AppRoute.GeneralSettings}
                                element={
                                    <General config={config} dispatchConfig={dispatchConfig} />
                                }
                            />

                            <Route
                                path={AppRoute.Permissions}
                                element={
                                    <Permissions
                                        dappsPermissions={state.dappsPermissions}
                                        updatePermissions={async () =>
                                            updatePermissions(dispatchState)
                                        }
                                    />
                                }
                            />
                        </>
                    )}

                    <Route path="*" element={<Navigate to={AppRoute.Root} />} />
                </Routes>
            )}

            <footer
                className={classes(
                    "h-16 px-6",
                    "fixed inset-x-0 bottom-0",
                    "flex items-center justify-between",
                )}
            >
                <div className="flex flex-col mb-12">
                    <Text className="ml-1 mb-3" size="14" taller weight="semibold">
                        ArSnap {version}
                    </Text>
                    <img src={permawebSeal} />
                </div>

                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/pianity/arsnap"
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
