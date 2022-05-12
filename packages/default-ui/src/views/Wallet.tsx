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
import WalletMenu, { WalletMenuEvent } from "@/components/WalletMenu";
import { useSnapReducer } from "@/state/snap";
import { updateWallets } from "@/state/snap/getWallets";
import { NamedAddress } from "@/utils/types";
import { exhaustive } from "@/utils";

async function onWalletMenuEvent(e: WalletMenuEvent, { name, address }: NamedAddress) {
    switch (e) {
        case "renameWallet":
            adapter.renameWallet(address, name);
            break;

        case "selectWallet":
            adapter.setActiveAddress(address);
            break;

        default:
            exhaustive(e);
    }
}

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
