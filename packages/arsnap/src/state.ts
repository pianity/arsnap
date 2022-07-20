import { Mutex, MutexInterface } from "async-mutex";

import { RpcPermission, LogEntry, RpcParam } from "@pianity/arsnap-adapter";

import { JWKInterface } from "@/crypto";
import { generateWallet } from "@/wallets";

const stateMutex = new Mutex();

export type WalletMetadata = {
    keyOwnerField: string;
    address: string;
    name: string;
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
    events: Map<string, LogEntry[]>;

    /**
     * Maximum number of individual request events per dapp that will be stored.
     *
     * TODO: Make this configurable.
     */
    eventsStorageLimit: number;
};

type SerializableState = Omit<State, "wallets" | "permissions" | "events"> & {
    wallets: [string, Wallet][];
    permissions: [string, RpcPermission[]][];
    events: [string, LogEntry[]][];
};

export async function initializeState(): Promise<State> {
    const defaultWallet = await generateWallet([], "Default Wallet");

    return {
        wallets: new Map([[defaultWallet.metadata.address, defaultWallet]]),
        activeWallet: defaultWallet.metadata.address,
        permissions: new Map(),
        events: new Map(),
        eventsStorageLimit: 100,
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
            events: new Map(serialState.events),
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
        events: Array.from(state.events.entries()),
    };

    await window.wallet.request({ method: "snap_manageState", params: ["update", serialState] });
}
