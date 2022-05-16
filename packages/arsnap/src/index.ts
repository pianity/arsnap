import { RpcRequest, RpcResponse } from "@pianity/arsnap-adapter";

import * as handlers from "@/handlers";
import { registerRpcMessageHandler } from "@/metamask";
import { getState, initializeState, replaceState, State } from "@/state";
import { exhaustive } from "@/utils";
import { guard } from "@/permissions";

registerRpcMessageHandler(async (origin, request): Promise<RpcResponse> => {
    const [maybeState, releaseState] = await getState();

    const state = maybeState || (await initializeState());

    let response;

    try {
        response = await handleRequest(state, origin, request);
        // eslint-disable-next-line no-useless-catch
    } catch (e) {
        throw e;
    } finally {
        try {
            await replaceState(state);
        } finally {
            releaseState();
        }
    }

    return response;
});

async function handleRequest(state: State, origin: string, request: RpcRequest) {
    const permissions = state.permissions.get(origin) || [];
    const { method, params } = request;

    switch (method) {
        case "is_enabled":
            return await handlers.isEnabled();

        case "get_permissions":
            return await handlers.getPermissions(state, origin);

        case "get_active_address":
            await guard(origin, permissions, "ACCESS_ADDRESS");
            return await handlers.getActiveAddress(state);

        case "get_active_public_key":
            await guard(origin, permissions, "ACCESS_PUBLIC_KEY");
            return await handlers.getActivePublicKey(state);

        case "get_all_addresses":
            await guard(origin, permissions, "ACCESS_ALL_ADDRESSES");
            return await handlers.getAllAddresses(state);

        case "get_wallet_names":
            await guard(origin, permissions, "ACCESS_ALL_ADDRESSES");
            return await handlers.getWalletNames(state);

        case "sign_bytes":
            await guard(origin, permissions, "SIGNATURE");
            return await handlers.signBytes(state, ...params);

        case "set_active_address":
            await guard(origin, permissions, "SET_ACTIVE_WALLET");
            return await handlers.setActiveAddress(state, ...params);

        case "import_wallet":
            await guard(origin, permissions, "IMPORT_WALLET");
            return await handlers.importWallet(state, ...params);

        case "export_wallet":
            await guard(origin, permissions, "EXPORT_WALLET");
            return await handlers.exportWallet(state, origin, ...params);

        case "rename_wallet":
            await guard(origin, permissions, "RENAME_WALLET");
            return await handlers.renameWallet(state, ...params);

        case "delete_wallet":
            await guard(origin, permissions, "DELETE_WALLET");
            return await handlers.deleteWallet(state, origin, ...params);

        case "request_permissions":
            return await handlers.requestPermissions(state, origin, ...params);

        default:
            exhaustive(method);
            throw new Error("Method not found.");
    }
}
