import { useEffect } from "react";

import * as adapter from "@pianity/arsnap-adapter";

import {
    Transactions as TransactionsData,
    Balance as BalanceData,
    useWalletReducer,
    updateBalance,
    updateTransactions,
} from "@/state/wallet";
import Balance from "@/components/Balance";
import Transactions from "@/components/Transactions";
import WalletMenu, { WalletMenuEvent, WalletMenuEventResponse } from "@/components/WalletMenu";
import { useSnapReducer } from "@/state/snap";
import { updateWallets } from "@/state/snap/getWallets";
import { NamedAddress } from "@/utils/types";
import { exhaustive } from "@/utils";

export default function Wallet() {
    const [snapState, snapDispatch] = useSnapReducer();
    const [walletState, walletDispatch] = useWalletReducer();

    useEffect(() => {
        updateWallets(snapDispatch);
    }, []);

    useEffect(() => {
        if (snapState.activeWallet) {
            updateBalance(snapState.activeWallet, walletDispatch);
            updateTransactions(snapState.activeWallet, walletDispatch);
        }

        const updateInterval = setInterval(async () => {
            if (snapState.activeWallet) {
                updateBalance(snapState.activeWallet, walletDispatch);
                updateTransactions(snapState.activeWallet, walletDispatch);
            }
        }, 2 * 60 * 1000);

        return () => {
            clearInterval(updateInterval);
        };
    }, [snapState.activeWallet]);

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

            case "downloadWallet":
                return {};

            default:
                exhaustive(e);
                throw new Error();
        }
    }

    return (
        <>
            <WalletMenu
                activeWallet={snapState.activeWallet}
                availableWallets={snapState.wallets}
                onEvent={onWalletMenuEvent}
            />
            <Balance balance={walletState.balance} />
            <Transactions transactions={walletState.transactions} />
        </>
    );
}
