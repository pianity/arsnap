export * from "@/api/types";
export * from "@/api";

// import {
//     deriveBIP44AddressKey,
//     JsonBIP44CoinTypeNode,
//     getBIP44AddressKeyDeriver,
// } from "@metamask/key-tree";
// import { Base64 } from "js-base64";
// import { JWKInterface, JWKPublicInterface } from "arweave/node/lib/wallet";
// import forge from "node-forge";
//
// import { Wallet } from "@/snapTypes";
//
// declare const wallet: Wallet;
//
// // function str2ab(str: string): ArrayBuffer {
// //     const buf = new ArrayBuffer(str.length); // 2 bytes for each char
// //     const bufView = new Uint8Array(buf);
// //     for (let i = 0, strLen = str.length; i < strLen; i++) {
// //         bufView[i] = str.charCodeAt(i);
// //     }
// //     return buf;
// // }
//
// // async function hello() {
// //     const keyfile: JWKInterface = testArconnect1;
// //
// //     const cryptoKey = await crypto.subtle.importKey(
// //         "jwk",
// //         keyfile,
// //         {
// //             name: "RSA-PSS",
// //             hash: {
// //                 name: "SHA-256",
// //             },
// //         },
// //         false,
// //         ["sign"],
// //     );
// //
// //     const signature = await crypto.subtle.sign(
// //         {
// //             name: "RSA-PSS",
// //             saltLength: 0,
// //         },
// //         cryptoKey,
// //         str2ab("bonjour"),
// //     );
// //
// //     return base64.encode(String.fromCharCode.apply(null, [...new Uint8Array(signature)]));
// // }
//
// export function b64ToB64Url(b64: string): string {
//     return (
//         b64
//             .replace(/\+/g, "-")
//             .replace(/\//g, "_")
//             // eslint-disable-next-line no-useless-escape
//             .replace(/\=/g, "")
//     );
// }
//
// async function jwkToCryptoKey(jwk: JWKInterface): Promise<CryptoKey> {
//     const key = await crypto.subtle.importKey(
//         "jwk",
//         jwk,
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
//     return key;
// }
//
// type KeyPair = {
//     address: string;
//     privateKey: string;
//     publicKey: string;
// };
//
// function bignumberToB64(bignumber: string): string {
//     const bytes = [];
//
//     for (let i = 0; i < bignumber.length; i += 2) {
//         const slice = bignumber.slice(i, i + 1);
//         bytes.push(parseInt(slice, 16));
//     }
//
//     return Base64.encode(String.fromCharCode.apply(null, bytes), true);
// }
//
// async function deriveArweaveFromSecret(secretBuffer: Uint8Array) {
//     const time = Date.now();
//
//     console.log("****************** STOP 1");
//
//     const secret = secretBuffer.slice(0, 32);
//
//     console.log("SECRET", secret);
//
//     const keyPair = await generateKey();
//
//     console.log("****************** STOP 2");
//
//     const publicKey: JWKPublicInterface = {
//         kty: "RSA",
//         e: bignumberToB64(keyPair.publicKey.e.toString(16)),
//         n: bignumberToB64(keyPair.publicKey.n.toString(16)),
//     };
//     const privateKey: JWKInterface = {
//         ...publicKey,
//         p: bignumberToB64(keyPair.privateKey.p.toString(16)),
//         d: bignumberToB64(keyPair.privateKey.d.toString(16)),
//         q: bignumberToB64(keyPair.privateKey.p.toString(16)),
//         dp: bignumberToB64(keyPair.privateKey.dP.toString(16)),
//         dq: bignumberToB64(keyPair.privateKey.dQ.toString(16)),
//         qi: bignumberToB64(keyPair.privateKey.qInv.toString(16)),
//     };
//
//     console.log("****************** STOP 3");
//
//     console.log("JWK", privateKey);
//
//     const cryptoKey = await crypto.subtle.importKey(
//         "jwk",
//         privateKey,
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
//     console.log("****************** STOP 4");
//
//     console.log("************ derived in", (Date.now() - time) * 1000, "s");
//
//     return { publicJwk: publicKey, privateJwk: privateKey, cryptoKey, keyPair };
// }
//
// function generateKey(): Promise<forge.pki.rsa.KeyPair> {
//     return new Promise((resolve, reject) => {
//         const secret = [
//             115, 127, 48, 211, 56, 142, 127, 153, 200, 239, 247, 193, 145, 61, 198, 74, 71, 109, 71,
//             94, 22, 120, 50, 7, 176, 139, 136, 157, 58, 102, 180, 110,
//         ];
//
//         const rand = forge.random.createInstance();
//         rand.seedFile = (needed, callback) => {
//             new Promise<string>((resolve, _) => {
//                 let seed = "";
//
//                 for (let i = 0; i < needed; i++) {
//                     seed += secret[i % secret.length];
//                 }
//
//                 resolve(seed);
//             }).then((seed) => {
//                 callback(null, seed);
//             });
//         };
//
//         forge.pki.rsa.generateKeyPair(
//             {
//                 bits: 4096,
//                 e: 0x10001,
//                 prng: rand,
//                 workers: 8,
//             },
//             (err, keypair) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(keypair);
//                 }
//             },
//         );
//     });
// }
//
// function generateKeySync(): forge.pki.rsa.KeyPair {
//     const secret = [
//         115, 127, 48, 211, 56, 142, 127, 153, 200, 239, 247, 193, 145, 61, 198, 74, 71, 109, 71, 94,
//         22, 120, 50, 7, 176, 139, 136, 157, 58, 102, 180, 110,
//     ];
//
//     const rand = forge.random.createInstance();
//     rand.seedFile = (needed, callback) => {
//         let seed = "";
//
//         for (let i = 0; i < needed; i++) {
//             seed += secret[i % secret.length];
//         }
//
//         callback(null, seed);
//     };
//
//     return forge.pki.rsa.generateKeyPair({
//         bits: 4096,
//         e: 0x10001,
//         prng: rand,
//     });
// }
//
// async function tryAsyncGen() {
//     const time = Date.now();
//
//     console.log("##################################### GENERATING KEY");
//     const keyPair = await generateKey();
//     console.log("##################################### DONE IN", (Date.now() - time) / 1000, "s");
//     console.log("##################################### KEY", keyPair);
//
//     // convert to PKCS#8 PrivateKeyInfo
//     const rsaPrivateKey = forge.pki.privateKeyToAsn1(keyPair.privateKey);
//     const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKey);
//
//     // get DER-formatted PKCS#8 private key
//     const pkcs8 = forge.asn1.toDer(privateKeyInfo).getBytes();
//
//     // converts a forge 0.6.x string of bytes to an ArrayBuffer
//     function str2ab(str: string) {
//         const b = new ArrayBuffer(str.length);
//         const view = new Uint8Array(b);
//         for (let i = 0; i < str.length; ++i) {
//             view[i] = str.charCodeAt(i);
//         }
//         return b;
//     }
//
//     // import the PKCS#8 DER-formatted key
//     const cryptoKey = await crypto.subtle.importKey(
//         "pkcs8",
//         str2ab(pkcs8),
//         {
//             name: "RSA-PSS",
//             hash: { name: "SHA-256" },
//         },
//         true,
//         ["sign"],
//     );
//
//     const jwkRaw = (await crypto.subtle.exportKey("jwk", cryptoKey)) as unknown as JWKInterface;
//     const jwk: JWKInterface = {
//         kty: "RSA",
//         e: jwkRaw.e,
//         n: jwkRaw.n,
//         d: jwkRaw.d,
//         p: jwkRaw.p,
//         dp: jwkRaw.dp,
//         dq: jwkRaw.dq,
//         qi: jwkRaw.qi,
//     };
//
//     return jwk;
// }
//
// async function getKeyPair() {
//     // const snapState = await wallet.request({ method: 'snap_manageState', params: ['get'] });
//     // const { derivationPath } = snapState.filecoin.config;
//
//     // const [, , coinType, account, change, addressIndex] = derivationPath.split('/');
//     const account = 0;
//     const change = 0;
//     const addressIndex = 0;
//     const bip44Code = 472;
//
//     const arweaveNode = (await wallet.request({
//         method: `snap_getBip44Entropy_${bip44Code}`,
//         params: [],
//     })) as JsonBIP44CoinTypeNode;
//
//     const secret = deriveBIP44AddressKey(arweaveNode, {
//         account,
//         change,
//         address_index: addressIndex,
//     });
//
//     return deriveArweaveFromSecret(secret);
// }
//
// async function getPubKey() {
//     const { publicJwk } = await getKeyPair();
//
//     // const jwk: JWKPublicInterface = {
//     //     kty: "RSA",
//     //     // e: b64ToB64Url(Base64.encode(String.fromCharCode.apply(null, publicKey.e.toByteArray()))),
//     //     // n: b64ToB64Url(Base64.encode(String.fromCharCode.apply(null, publicKey.n.toByteArray()))),
//     //     e: b64ToB64Url(Base64.encode(publicKey.e.toString(64))),
//     //     n: b64ToB64Url(Base64.encode(publicKey.n.toString(64))),
//     // };
//
//     return publicJwk;
// }
//
// // async function signWoJwk(data: string) {
// //     const { keyPair } = await getKeyPair();
// //     const parsedData = new Uint8Array(Object.values(JSON.parse(data)));
// //
// //     const md = forge.md.sha384
// //         .create()
// //         .update(String.fromCharCode.apply(null, [...parsedData]), "raw");
// //
// //     // sign data using RSASSA-PSS where PSS uses a SHA-1 hash, a SHA-1 based
// //     // masking function MGF1, and a 20 byte salt
// //     // var md = forge.md.sha1.create();
// //     // md.update("sign this", "utf8");
// //     const pss = forge.pss.create({
// //         md: forge.md.sha384.create(),
// //         mgf: forge.mgf.mgf1.create(forge.md.sha384.create()),
// //         saltLength: 32,
// //     });
// //     const signature = keyPair.privateKey.sign(md, pss);
// //
// //     // const jwk: JWKInterface = { kty: "RSA", ...publicKey, ...privateKey };
// //
// //     return signature;
// // }
//
// async function signWoJwk(data: string) {
//     console.log("****************** STOP 4");
//
//     const parsedData = new Uint8Array(Object.values(JSON.parse(data)));
//     const { cryptoKey } = await getKeyPair();
//
//     const signature = await crypto.subtle.sign(
//         {
//             name: "RSA-PSS",
//             saltLength: 32,
//         },
//         cryptoKey,
//         parsedData,
//     );
//
//     return JSON.stringify(new Uint8Array(signature));
// }
//
// async function sign(jwk: JWKInterface, data: Uint8Array): Promise<Uint8Array> {
//     const signature = await crypto.subtle.sign(
//         {
//             name: "RSA-PSS",
//             saltLength: 32,
//         },
//         await jwkToCryptoKey(jwk),
//         data,
//     );
//
//     return new Uint8Array(signature);
// }
//
// async function signTx(params: any[]) {
//     const jwk = params[0];
//     const signatureDataRaw = JSON.parse(params[1]);
//     const signatureData = new Uint8Array(Object.values(signatureDataRaw));
//
//     const signedSignatureData = await sign(jwk, signatureData);
//
//     console.log("FROM SNAP", signedSignatureData);
//
//     // const signedSignatureData = crypto.subtle.digest({ name: "SHA-256" }, signedSignatureDataRaw);
//
//     // crypto.subtle.
//
//     // transaction.setSignature({
//     //     id: ArweaveUtils.bufferTob64Url(id),
//     //     owner: jwk.n,
//     //     signature: ArweaveUtils.bufferTob64Url(rawSignature),
//     // });
//
//     return JSON.stringify(signedSignatureData);
// }
//
// function tryRust() {
//     return keygen();
// }
//
// wallet.registerRpcMessageHandler(async (originString, requestObject) => {
//     const { method, params } = requestObject;
//
//     switch (method) {
//         case "pubkey_pls":
//             return JSON.stringify(await getPubKey());
//         case "sign_tx_wojwk":
//             return await signWoJwk(params[0]);
//         case "sign_tx":
//             return await signTx(params);
//         case "try_async_gen":
//             return await tryAsyncGen();
//         case "try_rust":
//             return tryRust();
//         case "hello":
//             return wallet.request({
//                 method: "snap_confirm",
//                 params: [
//                     {
//                         prompt: `Hello, ${originString}!`,
//                         description: "This custom confirmation is just for display purposes.",
//                         textAreaContent: "heydo",
//                     },
//                 ],
//             });
//         default:
//             throw new Error("Method not found.");
//     }
// });
//
// // const Arweave = require("arweave");
// //
// // const arweave = Arweave.init({
// //     host: "arweave.net",
// //     port: 443,
// //     protocol: "https",
// //     timeout: 20000,
// // });
// //
// // async function sign(message) {
// //     const wallet = await arweave.wallets.generate();
// //     // const signature = await arweave.utils.sign({ algorithm: "RSA-RSSmessage, wallet);
// //     const cryptoKey = await crypto.subtle.importKey(
// //         "jwk",
// //         wallet,
// //         {
// //             name: "RSA-PSS",
// //             hash: {
// //                 name: "SHA-256",
// //             },
// //         },
// //         false,
// //         ["sign"],
// //     );
// //
// //     const signature = await crypto.subtle.sign(undefined, cryptoKey, "bonjour");
// //     console.log(signature);
// // }
// //
// // wallet.registerRpcMessageHandler(async (originString, requestObject) => {
// //     const { method, params } = requestObject;
// //
// //     switch (method) {
// //         case "hello":
// //             return wallet.request({
// //                 method: "snap_confirm",
// //                 params: [
// //                     {
// //                         prompt: `Hello, ${originString}!`,
// //                         description:
// //                             "This custom confirmation is just for display purposes.",
// //                         textAreaContent:
// //                             "But you can edit the snap source code to make it do something, if you want to!",
// //                     },
// //                 ],
// //             });
// //         default:
// //             throw new Error("Method not found.");
// //     }
// // });
