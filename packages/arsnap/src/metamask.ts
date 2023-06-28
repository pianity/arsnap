import { getBIP44AddressKeyDeriver, JsonBIP44CoinTypeNode } from "@metamask/key-tree";
import { divider, heading, panel, text } from "@metamask/snaps-ui";

import { RpcParam, RpcResponse } from "@pianity/arsnap-adapter";

export type RpcMessageHandler = (args: {
    origin: string;
    request: RpcParam;
}) => Promise<RpcResponse>;

export function confirmPopup(title: string, lines: string[]): Promise<boolean> {
    return snap.request({
        method: "snap_dialog",
        params: {
            type: "confirmation",
            content: panel([
                heading(title),
                ...lines.map((line) => (line === "" ? divider() : text(line))),
            ]),
        },
    }) as Promise<boolean>;
}

export async function notify(message: string, type: "native" | "inApp" = "native"): Promise<void> {
    await snap.request({
        method: "snap_notify",
        params: {
            type: type,
            message,
        },
    });
}

export async function getSecret(): Promise<Uint8Array> {
    // m / purpose' / coin_type' / account' / change / address_index
    // m / 44' / 472' / 0' / 0 / 0
    // const [, , coinType, account, change, addressIndex] = derivationPath.split('/');
    const account = 0;
    const change = 0;
    const addressIndex = 0;
    const bip44Code = 472;

    const arweaveNode = (await snap.request({
        method: `snap_getBip44Entropy`,
        params: { coinType: bip44Code },
    }));

    const deriveArweaveAddress = await getBIP44AddressKeyDeriver(arweaveNode);

    const addressKey = await deriveArweaveAddress(addressIndex);
    const secret = addressKey.privateKeyBytes;

    if (!secret) {
        throw new Error("Could not access secret.");
    }

    return secret;
}
