import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Base64 } from "js-base64";
import { JWKPublicInterface } from "arweave/node/lib/wallet";
import Arweave from "arweave";

import * as adapter from "@pianity/arsnap-adapter";
import "@pianity/arsnap-compat";

import "@/App.css";

const REQUIRED_PERMS = ["ACCESS_ADDRESS", "ACCESS_PUBLIC_KEY", "SIGNATURE", "ORGANIZE_WALLETS"];

async function connect(setSnapConnected: Dispatch<SetStateAction<boolean>>) {
    try {
        console.log("connecting...");

        await adapter.enable();

        setSnapConnected(true);

        console.log("connected");
        console.log("requesting permissions...");

        if (
            await adapter.requestPermissions(["ACCESS_PUBLIC_KEY", "SIGNATURE", "ORGANIZE_WALLETS"])
        ) {
            console.log("permissions granted");
        } else {
            console.log("permissions denied");
        }
    } catch (e) {
        setSnapConnected(false);
    }
}

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
    setPubKey: Dispatch<SetStateAction<string | undefined>>,
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
    const [permissionsGranted, setPermissionsGranted] = useState<boolean>(false);
    const [address, setAddress] = useState<string | undefined>();
    const [pubKey, setPubKey] = useState<string | undefined>();

    useEffect(() => {
        adapter
            .getPermissions()
            .then((perms) => {
                setSnapConnected(true);

                for (const perm of REQUIRED_PERMS) {
                    if (!perms.includes(perm)) {
                        setPermissionsGranted(false);
                        return;
                    }
                }

                setPermissionsGranted(true);
            })
            .catch(() => setSnapConnected(false));
    });

    useEffect(() => {
        getActiveWalletInfo(setAddress, setPubKey);
    }, [permissionsGranted]);

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

                        <button onClick={() => adapter.requestPermissions(["ACCESS_ADDRESS"])}>
                            Request some permissions
                        </button>

                        <button onClick={() => createSignTx()}>
                            Create and sign a random new transaction
                        </button>
                    </>
                )}
            </header>
        </div>
    );
}
