import { Mutex, MutexInterface } from "async-mutex";

import { Permission } from "@pianity/arsnap-adapter";

import { EncryptedData, encryptWallet, JWKInterface } from "@/crypto";
import { generateWallet } from "@/wallets";
import { binToB64 } from "@/utils";

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
    encryptedKey: EncryptedData;
    metadata: WalletMetadata;
};

export type State = {
    /**
     * The base 64 encoded salt parameter used to derive the AES-GCM key used to encrypts wallets.
     */
    keySalt: string;

    /**
     * List of wallets managed by ArSnap indexed by their address.
     */
    wallets: Map<string, EncryptedWallet>;

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
    wallets: [string, EncryptedWallet][];
    permissions: [string, Permission[]][];
};

export async function initializeState(): Promise<State> {
    const keySalt = binToB64(window.crypto.getRandomValues(new Uint8Array(8)));
    const defaultWallet = await generateWallet([], "Default Wallet");

    return {
        keySalt,
        wallets: new Map([
            [defaultWallet.metadata.address, await encryptWallet(keySalt, defaultWallet)],
        ]),
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
            wallets: new Map(serialState.wallets),
            permissions: new Map(serialState.permissions),
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
    };

    await window.wallet.request({ method: "snap_manageState", params: ["update", serialState] });
}
