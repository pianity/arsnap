import Arweave from "arweave";

import { ARWEAVE_HOST, ARWEAVE_PORT, ARWEAVE_PROTOCOL } from "@/consts";

export const arweave = Arweave.init({
    host: ARWEAVE_HOST,
    port: ARWEAVE_PORT,
    protocol: ARWEAVE_PROTOCOL,
});
