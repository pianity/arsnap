import Arweave from "arweave";

export const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
});
