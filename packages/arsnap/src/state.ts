import { Mutex, MutexInterface } from "async-mutex";

import { Permission } from "@pianity/arsnap-adapter";

import { mapToRecord, recordToMap } from "@/utils";
import { EncryptedData, JWKInterface } from "@/crypto";
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

/**
 * @deprecated state will be automatically encrypted by Metamask itself
 */
export type EncryptedWallet = {
    encryptedData: EncryptedData;
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
    permissions: Map<string, Permission[]>;
};

type SerializableState = Omit<State, "wallets" | "permissions"> & {
    wallets: Record<string, Wallet>;
    permissions: Record<string, Permission[]>;
};

export async function initializeState(): Promise<State> {
    const defaultWallet = await generateWallet([], "Default Wallet");

    return {
        wallets: new Map([[defaultWallet.metadata.address, defaultWallet]]),
        activeWallet: defaultWallet.metadata.address,
        permissions: new Map(),
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
            wallets: recordToMap(serialState.wallets),
            permissions: recordToMap(serialState.permissions),
        };

        return [state, releaseState];
    } else {
        return [undefined, releaseState];
    }
}

/**
 * Override ArSnap's state with `state`
 */
export async function replaceState(state: State): Promise<void> {
    const serialState = {
        ...state,
        wallets: mapToRecord(state.wallets),
        permissions: mapToRecord(state.permissions),
    };

    await window.wallet.request({ method: "snap_manageState", params: ["update", serialState] });
}
