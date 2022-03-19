import { deriveBIP44AddressKey, JsonBIP44CoinTypeNode } from "@metamask/key-tree";

import { RpcRequest } from "@pianity/arsnap-adapter";

import { binToB64 } from "@/utils";
import { EncryptedData, JWKInterface } from "@/crypto";
import { generateWallet, importWallet } from "@/wallets";

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

export type WalletMetadata = {
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
     * List of wallets managed by ArSnap.
     */
    wallets: EncryptedWallet[];

    /**
     * Index of active wallet. Defaults to 0.
     */
    activeWallet: number;

    /**
     * The base 64 encoded salt parameter used to derive the AES-GCM key used to encrypts wallets.
     */
    keySalt: string;
};

export async function registerRpcMessageHandler(callback: MethodCallback) {
    window.wallet.registerRpcMessageHandler(callback);
}

export async function initializeState() {
    const keySalt = binToB64(window.crypto.getRandomValues(new Uint8Array(8)));

    await replaceState({
        wallets: [],
        activeWallet: 0,
        keySalt,
    });

    const defaultWallet = await generateWallet();
    await importWallet(defaultWallet);
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

export async function getState(): Promise<State> {
    const snapState = await window.wallet.request({ method: "snap_manageState", params: ["get"] });
    return snapState as State;
}

export async function replaceState(state: State): Promise<void> {
    await window.wallet.request({ method: "snap_manageState", params: ["update", state] });
}

export async function updateState(update: Partial<State>): Promise<void> {
    const state = await getState();
    await window.wallet.request({
        method: "snap_manageState",
        params: ["update", { ...state, ...update }],
    });
}
