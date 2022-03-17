import {
    deriveBIP44AddressKey,
    JsonBIP44CoinTypeNode,
    getBIP44AddressKeyDeriver,
} from "@metamask/key-tree";

import * as handlers from "@/handlers";
import { registerRpcMessageHandler } from "@/metamask";
import { exhaustive } from "@/utils";

registerRpcMessageHandler(async (originString, request) => {
    const { method } = request;

    switch (method) {
        case "is_enabled":
            return handlers.isEnabled();

        case "generate_wallet":
            return await handlers.generateWallet();

        case "sign_bytes":
            return await handlers.signBytes(request.params);

        case "get_pub_key":
            return await handlers.getPubKey();

        case "get_address":
            return await handlers.getAddress();

        // case "pubkey_pls":
        //     handlers.
        // case "sign_tx_wojwk":
        //     return await signWoJwk(params[0]);
        // case "sign_tx":
        //     return await signTx(params);
        // case "try_async_gen":
        //     return await tryAsyncGen();
        // case "try_rust":
        //     return tryRust();
        // case "hello":
        //     return wallet.request({
        //         method: "snap_confirm",
        //         params: [
        //             {
        //                 prompt: `Hello, ${originString}!`,
        //                 description: "This custom confirmation is just for display purposes.",
        //                 textAreaContent: "heydo",
        //             },
        //         ],
        //     });
        default:
            exhaustive(method);
            throw new Error("Method not found.");
    }
});

// const Arweave = require("arweave");
//
// const arweave = Arweave.init({
//     host: "arweave.net",
//     port: 443,
//     protocol: "https",
//     timeout: 20000,
// });
//
// async function sign(message) {
//     const wallet = await arweave.wallets.generate();
//     // const signature = await arweave.utils.sign({ algorithm: "RSA-RSSmessage, wallet);
//     const cryptoKey = await crypto.subtle.importKey(
//         "jwk",
//         wallet,
//         {
//             name: "RSA-PSS",
//             hash: {
//                 name: "SHA-256",
//             },
//         },
//         false,
//         ["sign"],
//     );
//
//     const signature = await crypto.subtle.sign(undefined, cryptoKey, "bonjour");
//     console.log(signature);
// }
//
// wallet.registerRpcMessageHandler(async (originString, requestObject) => {
//     const { method, params } = requestObject;
//
//     switch (method) {
//         case "hello":
//             return wallet.request({
//                 method: "snap_confirm",
//                 params: [
//                     {
//                         prompt: `Hello, ${originString}!`,
//                         description:
//                             "This custom confirmation is just for display purposes.",
//                         textAreaContent:
//                             "But you can edit the snap source code to make it do something, if you want to!",
//                     },
//                 ],
//             });
//         default:
//             throw new Error("Method not found.");
//     }
// });
