import { deriveBIP44AddressKey, JsonBIP44CoinTypeNode } from "@metamask/key-tree";

import { RpcRequest, Permission } from "@pianity/arsnap-adapter";

import { binToB64, mapToRecord, recordToMap } from "@/utils";
import { EncryptedData, JWKInterface } from "@/crypto";
import { generateWallet, importWallet, setActiveAddress } from "@/wallets";

export type MethodCallback = (originString: string, requestObject: RpcRequest) => Promise<unknown>;

interface MetamaskWallet {
    registerRpcMessageHandler: (fn: MethodCallback) => unknown;
    request(options: { method: string; params?: unknown[] }): unknown;
}

declare global {
    interface Window {
        wallet: MetamaskWallet;
    }
}

export async function registerRpcMessageHandler(callback: MethodCallback) {
    window.wallet.registerRpcMessageHandler(callback);
}

export function confirmPopup(
    prompt: string,
    description: string,
    textAreaContent: string,
): Promise<boolean> {
    return window.wallet.request({
        method: "snap_confirm",
        params: [
            {
                prompt,
                description,
                textAreaContent,
            },
        ],
    }) as Promise<boolean>;
}

export function notify(message: string, type = "native"): Promise<void> {
    return window.wallet.request({
        method: "snap_notify",
        params: [
            {
                type,
                message,
            },
        ],
    }) as Promise<void>;
}

export type WalletMetadata = {
    keyOwnerField: string;
    address: string;
    name: string;
};

export type Wallet = {
    key: JWKInterface;
    metadata: WalletMetadata;
};

export type EncryptedWallet = {
    encryptedData: EncryptedData;
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
    wallets: Record<string, EncryptedWallet>;
    permissions: Record<string, Permission[]>;
};

export async function initializeState() {
    const keySalt = binToB64(window.crypto.getRandomValues(new Uint8Array(8)));

    await replaceState({
        wallets: new Map(),
        activeWallet: "",
        keySalt,
        permissions: new Map(),
    });

    const defaultWallet = await generateWallet("Default Wallet");
    await importWallet(defaultWallet);
    await setActiveAddress(defaultWallet.metadata.address);
}

export async function getStateRaw(): Promise<SerializableState> {
    const state = (await window.wallet.request({
        method: "snap_manageState",
        params: ["get"],
    })) as SerializableState;

    return state;
}

export async function getState(): Promise<State> {
    const serialState = await getStateRaw();

    const state: State = {
        ...serialState,
        wallets: recordToMap(serialState.wallets),
        permissions: recordToMap(serialState.permissions),
    };

    return state;
}

export async function replaceState(state: State): Promise<void> {
    const serialState = {
        ...state,
        wallets: mapToRecord(state.wallets),
        permissions: mapToRecord(state.permissions),
    };

    await window.wallet.request({ method: "snap_manageState", params: ["update", serialState] });
}

export async function updateState(update: Partial<State>): Promise<void> {
    const state = await getState();

    await replaceState({
        ...state,
        ...update,
    });
}

export async function getSecret(): Promise<Buffer> {
    // m / purpose' / coin_type' / account' / change / address_index
    // m / 44' / 472' / 0' / 0 / 0
    // const [, , coinType, account, change, addressIndex] = derivationPath.split('/');
    const account = 0;
    const change = 0;
    const addressIndex = 0;
    const bip44Code = 472;

    const arweaveNode = (await window.wallet.request({
        method: `snap_getBip44Entropy_${bip44Code}`,
        params: [],
    })) as JsonBIP44CoinTypeNode;

    const secret = deriveBIP44AddressKey(arweaveNode, {
        account,
        change,
        address_index: addressIndex,
    });

    return secret;
}
