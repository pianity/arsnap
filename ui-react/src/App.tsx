import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Base64 } from "js-base64";
import Arweave from "arweave";

import * as adapter from "@pianity/arsnap-adapter";

import "./App.css";

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
    await adapter.generateWallet();
    setWalletState("generated");
}

type WalletState = "no-wallet" | "generating" | "generated";

function App() {
    const [snapConnected, setSnapConnected] = useState<boolean>(false);
    const [walletState, setWalletState] = useState<WalletState>("no-wallet");
    const [walletAddress, setWalletAddress] = useState<string>();

    useEffect(() => {
        // adapter
        //     .isEnabled()
        //     .then(setSnapConnected)
        //     .catch(() => setSnapConnected(false));
    });

    useEffect(() => {
        if (walletState === "generated") {
            adapter.getPubKey().then(adapter.getAddress).then(setWalletAddress);
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
                        <p>Wallet address: {walletAddress}</p>
                        <button onClick={() => generateWallet(setWalletState)}>say hi</button>
                    </>
                )}
            </header>
        </div>
    );
}

export default App;
