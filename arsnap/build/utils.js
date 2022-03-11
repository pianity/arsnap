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
exports.ownerToAddress = exports.generateJWK = exports.exhaustive = void 0;
const Base64 = __importStar(require("base64-js"));
function exhaustive(_) {
    throw new Error("Check wasn't exhaustive");
}
exports.exhaustive = exhaustive;
async function generateJWK() {
    const cryptoKey = await crypto.subtle.generateKey({
        name: "RSA-PSS",
        modulusLength: 4096,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: {
            name: "SHA-256",
        },
    }, true, ["sign"]);
    const jwk = await crypto.subtle.exportKey("jwk", cryptoKey.privateKey);
    if (!jwk.e || !jwk.n) {
        throw new Error("JWK missing e and n");
    }
    return {
        kty: "RSA",
        e: jwk.e,
        n: jwk.n,
        d: jwk.d,
        p: jwk.p,
        q: jwk.q,
        dp: jwk.dp,
        dq: jwk.dq,
        qi: jwk.qi,
    };
}
exports.generateJWK = generateJWK;
function b64UrlToBuffer(b64UrlString) {
    return new Uint8Array(Base64.toByteArray(b64UrlDecode(b64UrlString)));
}
function bufferTob64(buffer) {
    return Base64.fromByteArray(new Uint8Array(buffer));
}
function bufferTob64Url(buffer) {
    return b64UrlEncode(bufferTob64(buffer));
}
function b64UrlEncode(b64UrlString) {
    // eslint-disable-next-line no-useless-escape
    return b64UrlString.replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
}
function b64UrlDecode(b64UrlString) {
    // eslint-disable-next-line no-useless-escape
    b64UrlString = b64UrlString.replace(/\-/g, "+").replace(/\_/g, "/");
    const padding = b64UrlString.length % 4 === 0 ? 0 : 4 - (b64UrlString.length % 4);
    return b64UrlString.concat("=".repeat(padding));
}
async function hash(data, algorithm = "SHA-256") {
    const digest = await crypto.subtle.digest(algorithm, data);
    return new Uint8Array(digest);
}
async function ownerToAddress(owner) {
    return bufferTob64Url(await hash(b64UrlToBuffer(owner)));
}
exports.ownerToAddress = ownerToAddress;
