import { Dispatch, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { match } from "ts-pattern";

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
    SetLogs,
    updateLogs,
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
import Logs from "@/views/Settings/Logs";
import { GatewayName, useConfigReducer } from "@/state/config";

type ArsnapState = "locked" | "configured" | "unconfigured" | "error";
export type AppStatus = "locked" | "loading" | "loaded" | "error";

async function getArsnapStatus(): Promise<ArsnapState> {
    try {
        const unlocked = await adapter.isUnlocked(6);

        if (unlocked === "timeout") {
            return "error";
        } else if (!unlocked) {
            return "locked";
        }

        const state = await getMissingPermissions(REQUIRED_PERMISSIONS).then((missingPermissions) =>
            missingPermissions.length > 0 ? "unconfigured" : "configured",
        );

        return state;
    } catch (e) {
        // TODO: The adapter doesn't include a proper way of checking for thrown error kind yet so
        // we have to rely on the message attached to the error object...
        if (e && (e as Error).message === "MetaMask is not installed") {
            return "error";
        }

        return "unconfigured";
    }
}

function updateWalletData(
    gateway: GatewayName,
    activeWallet: string | undefined,
    dispatchState: Dispatch<SetArBalance | SetArPrice | SetTransactions | SetLogs>,
) {
    if (activeWallet) {
        updateBalance(gateway, activeWallet, dispatchState);
        updateTransactions(gateway, activeWallet, dispatchState);
        updateLogs(dispatchState);
    }
}

export default function App() {
    const [arsnapStatus, setArsnapStatus] = useState<undefined | ArsnapState>();
    const [appStatus, setAppStatus] = useState<AppStatus>("loading");
    const [state, dispatchState] = useArsnapReducer();
    const [config, dispatchConfig] = useConfigReducer();

    const [_updateDataInterval, setUpdateDataInterval] = useState<
        undefined | ReturnType<typeof setInterval>
    >();
    const location = useLocation();

    useEffect(() => {
        getArsnapStatus().then(setArsnapStatus);

        const newUpdateDataInterval = setInterval(
            () => updateWalletData(config.gateway, state.activeWallet, dispatchState),
            2 * 60 * 1000,
        );

        setUpdateDataInterval((updateDataInterval) => {
            if (updateDataInterval) {
                clearInterval(updateDataInterval);
            }
            return newUpdateDataInterval;
        });

        return () => {
            clearInterval(newUpdateDataInterval);
        };
    }, [location.pathname, config.gateway, state.activeWallet, dispatchState]);

    useEffect(() => {
        let detectUnlock: undefined | ReturnType<typeof setInterval>;

        if (arsnapStatus === "locked") {
            detectUnlock = setInterval(() => getArsnapStatus().then(setArsnapStatus), 3 * 1000);
        }

        match<typeof arsnapStatus, Promise<AppStatus>>(arsnapStatus)
            .with("configured", () =>
                Promise.all([
                    updateWallets(dispatchState),
                    updatePermissions(dispatchState),
                    updateLogs(dispatchState),
                ]).then(() => "loaded"),
            )
            .with("locked", async () => "locked")
            .with("unconfigured", async () => "loaded")
            .with("error", async () => "error")
            .with(undefined, async () => "loading")
            .exhaustive()
            .then(setAppStatus);

        return () => clearInterval(detectUnlock);
    }, [arsnapStatus, dispatchState]);

    useEffect(() => {
        updateWalletData(config.gateway, state.activeWallet, dispatchState);
    }, [state.activeWallet, config.gateway, dispatchState]);

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

            case "deleteWallet":
                await adapter.deleteWallet(e.address);
                await updateWallets(dispatchState);
                return {};

            case "logout":
                await adapter.revokeAllPermissions();
                dispatchState({ type: "logout" });
                return {};

            default:
                return exhaustive(e);
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header
                appStatus={appStatus}
                smallLogo={!!state.activeWallet}
                gateway={config.gateway}
                activeWallet={state.activeWallet}
                availableWallets={state.wallets}
                onWalletEvent={onWalletMenuEvent}
                onInitialized={() => updateWallets(dispatchState)}
            />

            {match(appStatus)
                .with("locked", () => (
                    <ViewContainer className="justify-center">
                        <Text size="32" color="white" className="mb-3">
                            Metamask is locked.
                        </Text>
                        <Text
                            size="20"
                            color="white"
                            className="whitespace-pre-wrap"
                            align="center"
                            taller
                        >
                            Unlock it by opening the extension and entering your password to start
                            using Arsnap.
                        </Text>
                    </ViewContainer>
                ))
                .with("loading", () => (
                    <ViewContainer className="justify-center">
                        <LoadingIndicator width={40} height={40} className="opacity-40" />
                    </ViewContainer>
                ))
                .with("error", () => (
                    <ViewContainer className="justify-center">
                        <Text size="32" color="white" className="mb-3">
                            Something went wrong :(
                        </Text>
                        <Text
                            size="20"
                            color="white"
                            className="whitespace-pre-wrap"
                            align="center"
                            taller
                        >
                            Make sure you have{" "}
                            <span className="text-purple hover:text-purple-text font-semibold">
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://metamask.io/flask"
                                >
                                    MetaMask Flask
                                </a>
                            </span>{" "}
                            <span className="font-semibold">(and only MetaMask Flask)</span>{" "}
                            installed and refresh the page.
                        </Text>
                    </ViewContainer>
                ))
                .with("loaded", () => (
                    <Routes>
                        <Route path={AppRoute.About} element={<About />} />

                        {!state.activeWallet ? (
                            <Route
                                path={AppRoute.Root}
                                element={
                                    <Welcome onInitialized={() => updateWallets(dispatchState)} />
                                }
                            />
                        ) : (
                            <>
                                <Route
                                    path={AppRoute.Root}
                                    element={
                                        <Wallet
                                            balance={state.arBalance}
                                            price={state.arPrice}
                                            transactions={state.transactions}
                                        />
                                    }
                                />

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

                                <Route
                                    path={AppRoute.Logs}
                                    element={
                                        <Logs logs={state.logs} onClearLogs={adapter.clearLogs} />
                                    }
                                />
                            </>
                        )}

                        <Route path="*" element={<Navigate to={AppRoute.Root} />} />
                    </Routes>
                ))
                .exhaustive()}

            <footer
                className={classes(
                    "h-16 px-6",
                    "fixed inset-x-0 bottom-0",
                    "flex items-center justify-between",
                    "pointer-events-none",
                )}
            >
                <div className="flex flex-col mb-12 pointer-events-auto">
                    <Text className="ml-1 mb-3" size="14" taller weight="semibold">
                        ArSnap {version}
                    </Text>
                    <a target="_blank" rel="noopener noreferrer" href="https://www.arweave.org/">
                        <img src={permawebSeal} />
                    </a>
                </div>

                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/pianity/arsnap"
                    className="flex items-center pointer-events-auto"
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
