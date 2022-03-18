import {
    deriveBIP44AddressKey,
    JsonBIP44CoinTypeNode,
    getBIP44AddressKeyDeriver,
} from "@metamask/key-tree";

import * as handlers from "@/handlers";
import { registerRpcMessageHandler } from "@/metamask";
import { exhaustive } from "@/utils";

registerRpcMessageHandler(async (originString, request) => {
    console.log("THIS IS A TEST*********************", (window as any).wallet);

    const { method } = request;

    switch (method) {
        case "is_enabled":
            return handlers.isEnabled();

        case "generate_wallet":
            return await handlers.generateWallet();

        case "generate_encr_wallet":
            return await handlers.generateEncryptedWallet();

        case "sign_bytes":
            return await handlers.signBytes(request.params);

        case "get_pub_key":
            return await handlers.getPubKey();

        case "get_address":
            return await handlers.getAddress();

        default:
            exhaustive(method);
            throw new Error("Method not found.");
    }
});
