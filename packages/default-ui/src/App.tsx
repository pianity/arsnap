import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Base64 } from "js-base64";
import { JWKPublicInterface } from "arweave/node/lib/wallet";
import Arweave from "arweave";

import * as adapter from "@pianity/arsnap-adapter";
import "@pianity/arsnap-compat";

import "@/App.css";

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
//
// async function generateWallet(setWalletState: Dispatch<SetStateAction<WalletState>>) {
//     setWalletState("generating");
//     try {
//         await adapter.generateWallet();
//         setWalletState("generated");
//     } catch (e) {
//         setWalletState("no-wallet");
//     }
// }

type WalletState = "no-wallet" | "generating" | "generated";

// async function getPubKey(
//     setPubKey: Dispatch<SetStateAction<JWKPublicInterface | undefined>>,
//     setAddress: Dispatch<SetStateAction<string | undefined>>,
// ) {
//     try {
//         const pubKey = await adapter.getPubKey();
//         const address = await adapter.getAddress();
//
//         setPubKey(pubKey);
//         setAddress(address);
//     } catch (e) {
//         setPubKey(undefined);
//         setAddress(undefined);
//     }
// }

async function createSignTx() {
    const arweave = Arweave.init({});

    const tx = await arweave.createTransaction({ data: Math.random().toString().slice(-4) });

    await adapter.signTx(tx);

    const verify = await arweave.transactions.verify(tx);
    console.log("VERIFY", verify);
}

export async function getAESKey() {
    console.log("TEST STARTED");

    const secret = new Uint8Array(32);

    const keyBase = await window.crypto.subtle.importKey("raw", secret, "PBKDF2", false, [
        "deriveBits",
        "deriveKey",
    ]);

    const salt = window.crypto.getRandomValues(new Uint8Array(8));

    const key = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            // NOTE: for `iterations` and `hash` see
            // <https://security.stackexchange.com/questions/3959/recommended-of-iterations-when-using-pbkdf2-sha256>
            iterations: 200000,
            hash: "SHA-512",
        },
        keyBase,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"],
    );

    const iv1 = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedData = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv1 },
        key,
        new TextEncoder().encode("hello world"),
    );

    const decryptedData = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv1 },
        key,
        encryptedData,
    );

    console.log(new TextDecoder().decode(decryptedData));
}

async function getActiveWalletInfo(
    setAddress: Dispatch<SetStateAction<string | undefined>>,
    setPubKey: Dispatch<SetStateAction<JWKPublicInterface | undefined>>,
) {
    try {
        setAddress(await adapter.getActiveAddress());
        setPubKey(await adapter.getActivePublicKey());
    } catch (e) {
        setAddress(undefined);
        setPubKey(undefined);
    }
}

export default function App() {
    const [snapConnected, setSnapConnected] = useState<boolean>(false);
    const [address, setAddress] = useState<string | undefined>();
    const [pubKey, setPubKey] = useState<JWKPublicInterface | undefined>();

    useEffect(() => {
        adapter
            .isEnabled()
            .then(setSnapConnected)
            .then(() => getActiveWalletInfo(setAddress, setPubKey))
            .catch(() => setSnapConnected(false));
    });

    return (
        <div className="App">
            <header className="App-header">
                <p>{snapConnected ? "Connected to ArSnap" : "Click below to connect to ArSnap!"}</p>
                <button onClick={() => connect(setSnapConnected)}>connect</button>

                {snapConnected && (
                    <>
                        <p>Active wallet address: {address ?? "loading..."}</p>

                        {/*
                        <button onClick={() => generateWallet(setWalletState)}>
                            Generate a new wallet
                        </button>
                            */}

                        <button onClick={() => createSignTx()}>
                            Create and sign a random new transaction
                        </button>
                    </>
                )}
            </header>
        </div>
    );
}
