import Arweave from "arweave";

import { GATEWAYS } from "@/state/config";
import { GatewayName } from "@/state/config";

export function arweave(gateway: GatewayName) {
    return Arweave.init(GATEWAYS[gateway]);
}
