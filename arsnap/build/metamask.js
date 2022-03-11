"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setState = exports.getState = exports.getSecret = exports.registerRpcMessageHandler = void 0;
const key_tree_1 = require("@metamask/key-tree");
async function registerRpcMessageHandler(callback) {
    wallet.registerRpcMessageHandler(callback);
}
exports.registerRpcMessageHandler = registerRpcMessageHandler;
async function getSecret() {
    // const [, , coinType, account, change, addressIndex] = derivationPath.split('/');
    const account = 0;
    const change = 0;
    const addressIndex = 0;
    const bip44Code = 472;
    const arweaveNode = (await wallet.request({
        method: `snap_getBip44Entropy_${bip44Code}`,
        params: [],
    }));
    const secret = (0, key_tree_1.deriveBIP44AddressKey)(arweaveNode, {
        account,
        change,
        address_index: addressIndex,
    });
    return secret;
}
exports.getSecret = getSecret;
async function getState() {
    const snapState = await wallet.request({ method: "snap_manageState", params: ["get"] });
    return snapState;
}
exports.getState = getState;
async function setState(state) {
    await wallet.request({ method: "snap_manageState", params: ["update", state] });
}
exports.setState = setState;
