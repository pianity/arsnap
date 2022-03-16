import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Base64 } from "js-base64";
import Arweave from "arweave";

import * as adapter from "@pianity/arsnap-adapter";

import "./App.css";
import { JWKPublicInterface } from "arweave/node/lib/wallet";

async function connect(setSnapConnected: Dispatch<SetStateAction<boolean>>) {
    try {
        console.log("connecting...");
        const enabled = await adapter.enable();
        console.log("connected");
        setSnapConnected(true);
    } catch (e) {
        setSnapConnected(false);
    }
}

async function generateWallet(setWalletState: Dispatch<SetStateAction<WalletState>>) {
    setWalletState("generating");
    try {
        await adapter.generateWallet();
        setWalletState("generated");
    } catch (e) {
        setWalletState("no-wallet");
    }
}

async function signTx() {}

type WalletState = "no-wallet" | "generating" | "generated";

async function getPubKey(
    setPubKey: Dispatch<SetStateAction<JWKPublicInterface | undefined>>,
    setAddress: Dispatch<SetStateAction<string | undefined>>,
) {
    try {
        const pubKey = await adapter.getPubKey();
        const address = await adapter.getAddress();

        setPubKey(pubKey);
        setAddress(address);
    } catch (e) {
        setPubKey(undefined);
        setAddress(undefined);
    }
}

async function createSignTx(owner: string) {
    const arweave = Arweave.init({});

    const tx = await arweave.createTransaction({ data: Math.random().toString().slice(-4) });

    await adapter.signTx(tx);

    const verify = await arweave.transactions.verify(tx);
    console.log("VERIFY", verify);
}

export default function App() {
    const [snapConnected, setSnapConnected] = useState<boolean>(false);
    const [walletState, setWalletState] = useState<WalletState>("no-wallet");
    const [address, setAddress] = useState<string | undefined>();
    const [pubKey, setPubKey] = useState<JWKPublicInterface | undefined>();

    useEffect(() => {
        adapter
            .isEnabled()
            .then(setSnapConnected)
            .catch(() => setSnapConnected(false));
    });

    useEffect(() => {
        if (walletState === "generated") {
            adapter.getPubKey().then(setPubKey);
            adapter.getAddress().then(setAddress);
        } else {
            setPubKey(undefined);
            setAddress(undefined);
        }
    }, [walletState]);

    return (
        <div className="App">
            <header className="App-header">
                <p>Are you connected? {snapConnected && "yes"}</p>
                <button onClick={() => connect(setSnapConnected)}>connect</button>

                {snapConnected && (
                    <>
                        <p>Wallet state: {walletState}</p>
                        <p>Wallet address: {address ?? ""}</p>

                        <button onClick={() => generateWallet(setWalletState)}>
                            Generate a new wallet
                        </button>

                        {pubKey && (
                            <button onClick={() => createSignTx(pubKey.n)}>
                                Create and sign a new transaction
                            </button>
                        )}
                    </>
                )}
            </header>
        </div>
    );
}
