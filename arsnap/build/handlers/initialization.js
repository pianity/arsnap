"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddress = exports.getPubKey = exports.generateWallet = exports.isEnabled = void 0;
const metamask_1 = require("../metamask");
const utils_1 = require("../utils");
function isEnabled() {
    return true;
}
exports.isEnabled = isEnabled;
async function generateWallet() {
    const state = await (0, metamask_1.getState)();
    if (state.key) {
        return false;
    }
    const wallet = await (0, utils_1.generateJWK)();
    const address = await (0, utils_1.ownerToAddress)(wallet.n);
    (0, metamask_1.setState)({
        ...state,
        key: wallet,
        address,
    });
    return true;
}
exports.generateWallet = generateWallet;
async function getPubKey() {
    const { key } = await (0, metamask_1.getState)();
    if (!key) {
        throw new Error("No key found");
    }
    return {
        kty: "RSA",
        e: key.e,
        n: key.n,
    };
}
exports.getPubKey = getPubKey;
async function getAddress() {
    const { address } = await (0, metamask_1.getState)();
    return address;
}
exports.getAddress = getAddress;
