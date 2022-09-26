import { Mutex, MutexInterface } from "async-mutex";

import { RpcPermission, LogEntry } from "@pianity/arsnap-adapter";

import { JWKInterface } from "@/crypto";
import { generateDefaultWallet } from "@/wallets";

const stateMutex = new Mutex();

export type WalletMetadata = {
    keyOwnerField: string;
    address: string;
    name: string;
    /**
     * A protected wallet cannot be renamed nor deleted. Right now, only the default wallet
     * derive from the user's Ethereum key is protected.
     */
    isProtected: boolean;
};

export type Wallet = {
    key: JWKInterface;
    metadata: WalletMetadata;
};

export type State = {
    /**
     * List of wallets managed by ArSnap indexed by their address.
     */
    wallets: Map<string, Wallet>;

    /**
     * Address of active wallet.
     */
    activeWallet: string;

    /**
     * List of permissions indexed by `originString`.
     */
    permissions: Map<string, RpcPermission[]>;

    /**
     * List of all the successful requests created by dApps, indexed by dApp origin
     */
    logs: Map<string, LogEntry[]>;

    /**
     * Maximum number of individual request logs per dapp that will be stored.
     *
     * TODO: Make this configurable.
     */
    logsStorageLimit: number;
};

type SerializableState = Omit<State, "wallets" | "permissions" | "logs"> & {
    wallets: [string, Wallet][];
    permissions: [string, RpcPermission[]][];
    logs: [string, LogEntry[]][];
};

export async function initializeState(): Promise<State> {
    const defaultWallet = await generateDefaultWallet();

    return {
        wallets: new Map([[defaultWallet.metadata.address, defaultWallet]]),
        activeWallet: defaultWallet.metadata.address,
        permissions: new Map(),
        logs: new Map(),
        logsStorageLimit: 100,
    };
}

export async function getStateRaw(): Promise<
    [SerializableState | undefined, MutexInterface.Releaser]
> {
    const releaseState = await stateMutex.acquire();

    const state = (await window.wallet.request({
        method: "snap_manageState",
        params: ["get"],
    })) as SerializableState;

    return [state, releaseState];
}

export async function getState(): Promise<[State | undefined, MutexInterface.Releaser]> {
    const [serialState, releaseState] = await getStateRaw();

    if (serialState) {
        const state: State = {
            ...serialState,
            wallets: new Map(serialState.wallets),
            permissions: new Map(serialState.permissions),
            logs: new Map(serialState.logs),
        };

        return [state, releaseState];
    } else {
        return [undefined, releaseState];
    }
}

/**
 * Override ArSnap's state with `state`
 */
export async function replaceState(state: State) {
    const serialState: SerializableState = {
        ...state,
        wallets: Array.from(state.wallets.entries()),
        permissions: Array.from(state.permissions.entries()),
        logs: Array.from(state.logs.entries()),
    };

    await window.wallet.request({ method: "snap_manageState", params: ["update", serialState] });
}
