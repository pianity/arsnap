import { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
    Button,
    Select,
    Input,
    Container,
    Typography,
    Box,
    Stack,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
} from "@mui/material";
import { Base64 } from "js-base64";
import { JWKPublicInterface } from "arweave/node/lib/wallet";
import Arweave from "arweave";

import * as adapter from "@pianity/arsnap-adapter";
import "@pianity/arsnap-compat";

import "@/App.css";

const REQUIRED_PERMS: adapter.Permission[] = [
    "ACCESS_ADDRESS",
    "ACCESS_ALL_ADDRESSES",
    "ACCESS_PUBLIC_KEY",
    "SIGNATURE",
    "ORGANIZE_WALLETS",
];

async function connect(
    setSnapConnected: Dispatch<SetStateAction<boolean>>,
    setPermissionsGranted: Dispatch<SetStateAction<boolean>>,
) {
    try {
        console.log("connecting...");

        await adapter.enable();

        await adapter.initialize();

        setSnapConnected(true);

        console.log("connected");
        console.log("requesting permissions...");

        if (await adapter.requestPermissions(REQUIRED_PERMS)) {
            setPermissionsGranted(true);
        } else {
            setPermissionsGranted(false);
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
    if (verify) {
        console.log("transaction has been signed successfully");
    } else {
        console.error("transaction signature is invalid");
    }
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

function ActiveWallet({
    allWallets,
    selectedAddress,
}: {
    allWallets: Array<[string, string]>;
    selectedAddress: string | undefined;
}) {
    const allWalletsItems = allWallets.map(([address, name]) => (
        <MenuItem key={name} value={address}>
            {name}
        </MenuItem>
    ));

    return (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="active-wallet-label">Active Wallet</InputLabel>
            <Select
                labelId="active-wallet-label"
                id="active-wallet-select"
                value={selectedAddress ?? ""}
                onChange={(...params: any[]) => {
                    // TODO: implement me
                }}
                label="Active Wallet"
            >
                {allWalletsItems.length > 0 ? (
                    allWalletsItems
                ) : (
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                )}
            </Select>
        </FormControl>
    );
}

export default function App() {
    const [snapConnected, setSnapConnected] = useState<boolean>(false);
    const [permissionsGranted, setPermissionsGranted] = useState<boolean>(false);
    const [address, setAddress] = useState<string | undefined>();
    const [pubKey, setPubKey] = useState<string | undefined>();

    const [selectedAddress, setSelectedAddress] = useState<string | undefined>();
    const [allWallets, setAllWallets] = useState<Array<[string, string]>>([]);

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
        if (snapConnected && permissionsGranted) {
            getActiveWalletInfo(setAddress, setPubKey);
            adapter.getWalletNames().then((walletNames) => {
                setAllWallets(Object.entries(walletNames));
            });
            adapter.getActiveAddress().then((address) => {
                setSelectedAddress(address);
            });
        } else {
            setAddress(undefined);
            setPubKey(undefined);
            setAllWallets([]);
            setSelectedAddress(undefined);
        }

        if (snapConnected && !permissionsGranted) {
            adapter.requestPermissions(REQUIRED_PERMS);
        }
    }, [snapConnected, permissionsGranted]);

    return (
        <Container maxWidth="md">
            <Stack spacing={2}>
                <Typography variant="h2">Welcome to ArSnap's default UI!</Typography>
                <p>
                    This is a very minimal UI that allows you to manage your Arweave wallets in
                    ArSnap for use in other dApps.
                </p>

                <Stack direction="row">
                    <Typography variant="body1">ArSnap's status:</Typography>
                    {snapConnected ? (
                        <Chip label="Connected" color="success" />
                    ) : (
                        <Button onClick={() => connect(setSnapConnected, setPermissionsGranted)}>
                            connect
                        </Button>
                    )}
                </Stack>

                <ActiveWallet allWallets={allWallets} selectedAddress={selectedAddress} />

                {snapConnected && (
                    <Container>
                        <Typography>Active wallet address: {address ?? "loading..."}</Typography>

                        <Button onClick={() => adapter.requestPermissions(["ACCESS_ADDRESS"])}>
                            Request some permissions
                        </Button>

                        <Button onClick={() => createSignTx()}>
                            Create and sign a random new transaction
                        </Button>
                    </Container>
                )}
            </Stack>
        </Container>
    );
}
