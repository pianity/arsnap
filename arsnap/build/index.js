"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const handlers = __importStar(require("./handlers"));
const metamask_1 = require("./metamask");
const utils_1 = require("./utils");
(0, metamask_1.registerRpcMessageHandler)(async (originString, request) => {
    const { method } = request;
    switch (method) {
        case "is_enabled":
            return handlers.isEnabled();
        case "generate_wallet":
            return await handlers.generateWallet();
        case "sign_bytes":
            return false;
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
            (0, utils_1.exhaustive)(method);
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
