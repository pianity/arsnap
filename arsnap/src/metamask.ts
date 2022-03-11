import { deriveBIP44AddressKey, JsonBIP44CoinTypeNode } from "@metamask/key-tree";

import { RpcRequest } from "@pianity/arsnap-adapter";

import { JWKInterface } from "@/utils";

export type MethodCallback = (originString: string, requestObject: RpcRequest) => Promise<unknown>;

export type State = {
    key: JWKInterface;
    address: string;

    // filecoin: {
    //     config: SnapConfig;
    //     messages: MessageStatus[];
    // };
};

interface Wallet {
    registerRpcMessageHandler: (fn: MethodCallback) => unknown;
    request(options: { method: string; params?: unknown[] }): unknown;
}

declare const wallet: Wallet;

export async function registerRpcMessageHandler(callback: MethodCallback) {
    wallet.registerRpcMessageHandler(callback);
}

export async function getSecret() {
    // const [, , coinType, account, change, addressIndex] = derivationPath.split('/');
    const account = 0;
    const change = 0;
    const addressIndex = 0;
    const bip44Code = 472;

    const arweaveNode = (await wallet.request({
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
    const snapState = await wallet.request({ method: "snap_manageState", params: ["get"] });

    return snapState as State;
}

export async function setState(state: State): Promise<void> {
    await wallet.request({ method: "snap_manageState", params: ["update", state] });
}
