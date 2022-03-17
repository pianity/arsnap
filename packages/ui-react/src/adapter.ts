export {};
// import Arweave from "arweave";
// import { JWKInterface, JWKPublicInterface } from "arweave/node/lib/wallet";
// import BigNumber from "bignumber.js";
// import { Base64 } from "js-base64";
//
// declare global {
//     interface Window {
//         ethereum: {
//             isMetaMask: boolean;
//             isUnlocked: Promise<boolean>;
//             request: <T>(request: unknown | { method: string; params?: any[] }) => Promise<T>;
//             on: (eventName: unknown, callback: unknown) => unknown;
//         };
//     }
// }
//
// const snapId = `local:http://localhost:4000/`;
//
// async function request(method: string, params?: any[]): Promise<any> {
//     const response = await window.ethereum.request({
//         method: "wallet_invokeSnap",
//         params: [
//             snapId,
//             {
//                 method,
//                 params,
//             },
//         ],
//     });
//
//     return response;
// }
//
// // here we get permissions to interact with and install the snap
// export async function connect() {
//     await window.ethereum.request({
//         method: "wallet_enable",
//         params: [
//             {
//                 wallet_snap: { [snapId]: {} },
//             },
//         ],
//     });
// }
//
// // here we call the snap's "hello" method
// export async function hello() {
//     return await request("hello");
// }
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
// export async function signMessage() {
//     const arweave = Arweave.init({});
//
//     const jwk = await arweave.wallets.generate();
//
//     const tx = await arweave.createTransaction({
//         data: "bonjour",
//     });
//
//     // await arweave.transactions.sign(tx, jwk);
//     // console.log(tx.id);
//
//     tx.setOwner(jwk.n);
//
//     const signatureData = await tx.getSignatureData();
//
//     const response: string = await request("sign_tx", [jwk, JSON.stringify(signatureData)]);
//     console.log("RESPONSE", response);
//
//     const signedSignatureData = new TextEncoder().encode(response);
//     // const signedSignatureData: string = response;
//
//     console.log("FROM FRONT", signedSignatureData);
//
//     const id = b64ToB64Url(
//         window.btoa(
//             String.fromCharCode.apply(null, [
//                 ...new Uint8Array(await crypto.subtle.digest("SHA-256", signedSignatureData)),
//             ]),
//         ),
//     );
//     // const id = b64ToB64Url(window.btoa(new TextDecoder().decode(idBuffer)));
//
//     tx.setSignature({
//         id,
//         owner: jwk.n,
//         signature: b64ToB64Url(
//             window.btoa(String.fromCharCode.apply(null, [...signedSignatureData])),
//         ),
//     });
//
//     console.log(id);
//     console.log("VERIFY", await arweave.transactions.verify(tx));
// }
//
// export function hexStrToBytes(hexStr: string): Uint8Array {
//     const bytes = new Uint8Array(hexStr.length / 2);
//
//     for (let i = 0; i < hexStr.length; i += 2) {
//         bytes[i / 2] = parseInt(hexStr.slice(i, i + 1), 16);
//     }
//
//     return bytes;
// }
//
// export function hexStrToBytesStr(hexStr: string): string {
//     const bytes = [];
//
//     for (let i = 0; i < hexStr.length; i += 2) {
//         const slice = hexStr.slice(i, i + 1);
//         bytes.push(parseInt(slice, 16));
//     }
//
//     return String.fromCharCode.apply(null, [...bytes]);
// }
//
// export function bignumberToB64(bignumber: string): string {
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
// export async function signWOJWK() {
//     const arweave = Arweave.init({});
//
//     const tx = await arweave.createTransaction({
//         data: "bonjour",
//     });
//
//     // await arweave.transactions.sign(tx, jwk);
//     // console.log(tx.id);
//
//     console.log("getting pubkey...");
//     const jwkRaw = JSON.parse(await request("pubkey_pls"));
//     const jwk: JWKPublicInterface = {
//         kty: "RSA",
//         e: jwkRaw.e,
//         n: jwkRaw.n,
//     };
//
//     tx.setOwner(jwk.n);
//
//     const signatureData = await tx.getSignatureData();
//
//     console.log("signing...");
//     const response: string = await request("sign_tx_wojwk", [JSON.stringify(signatureData)]);
//     console.log("RESPONSE", response);
//
//     const signedSignatureData = new Uint8Array(Object.values(JSON.parse(response)));
//     // const signedSignatureData: string = response;
//
//     console.log("FROM FRONT", signedSignatureData);
//
//     const id = b64ToB64Url(
//         window.btoa(
//             String.fromCharCode.apply(null, [
//                 ...new Uint8Array(await crypto.subtle.digest("SHA-256", signedSignatureData)),
//             ]),
//         ),
//     );
//     // const id = b64ToB64Url(window.btoa(new TextDecoder().decode(idBuffer)));
//
//     tx.setSignature({
//         id,
//         owner: jwk.n,
//         signature: b64ToB64Url(
//             window.btoa(String.fromCharCode.apply(null, [...signedSignatureData])),
//         ),
//     });
//
//     console.log(id);
//     console.log("VERIFY", await arweave.transactions.verify(tx));
// }
//
// export async function tryAsyncGen() {
//     console.log("RUNNING ASYNC GEN");
//
//     const time = Date.now();
//     const jwk = await request("try_async_gen");
//
//     console.log("DONE ASYNC GEN IN", (Date.now() - time) / 1000, "seconds");
//
//     console.log(jwk);
// }
