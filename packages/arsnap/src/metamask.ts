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
            type,
            message,
        },
    });
}

function hexToUint8Array(hex: string): Uint8Array {
    const chunks = [];
    for (let i = 0; i < hex.length; i += 2) {
        chunks.push(hex.slice(i, i + 2));
    }

    return new Uint8Array(chunks.map((chunk) => parseInt(chunk, 16)));
}

export async function getSecret(account = 0): Promise<Uint8Array> {
    const bip44Code = 472;

    const arweaveNode = await snap.request({
        method: `snap_getBip32Entropy`,
        params: {
            path: ["m", "44'", `${bip44Code}'`, `${account}'`],
            curve: "ed25519",
        },
    });

    if (!arweaveNode.privateKey) {
        throw new Error("Could not access secret.");
    }

    const secret = hexToUint8Array(arweaveNode.privateKey.slice(2));

    return secret;
}
