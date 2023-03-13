import Arweave from "arweave";

import { GATEWAYS, GatewayName } from "@/state/config";

export function arweave(gateway: GatewayName) {
    return Arweave.init(GATEWAYS[gateway]);
}
