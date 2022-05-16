import Arweave from "arweave";

// TODO: Make the gateway configurable

export const arweave = Arweave.init({
    host: "testnet.redstone.tools",
    port: 443,
    protocol: "https",
});

// export const arweave = Arweave.init({
//     host: "arweave.net",
//     port: 443,
//     protocol: "https",
// });
