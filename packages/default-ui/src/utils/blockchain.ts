import Arweave from "arweave";

import { getGateway } from "@/state/config";

export function arweave() {
    const gateway = getGateway();

    return Arweave.init(gateway);
}
