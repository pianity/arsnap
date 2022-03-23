import * as handlers from "@/handlers";
import { getState, getStateRaw, initializeState, registerRpcMessageHandler } from "@/metamask";
import { exhaustive } from "@/utils";
import { guard } from "@/permissions";

registerRpcMessageHandler(async (origin, request) => {
    const { method, params } = request;

    if (method === "is_enabled") {
        return true;
    }

    const isInitialized = !!(await getStateRaw());

    if (method === "is_initialized") {
        return isInitialized;
    } else if (method === "initialize") {
        if (isInitialized) {
            return false;
        }

        await initializeState();

        return true;
    }

    if (!isInitialized) {
        throw new Error("ArSnap hasn't been initialized yet. Run `adapter.initialize()` first.");
    }

    const state = await getState();

    let response;

    switch (method) {
        case "get_permissions":
            response = await handlers.getPermissions(origin);
            break;

        case "get_active_address":
            await guard(origin, "ACCESS_ADDRESS", state);
            response = await handlers.getActiveAddress();
            break;

        case "get_active_public_key":
            await guard(origin, "ACCESS_PUBLIC_KEY", state);
            response = await handlers.getActivePublicKey();
            break;

        case "get_all_addresses":
            await guard(origin, "ACCESS_ALL_ADDRESSES", state);
            response = await handlers.getAllAddresses();
            break;

        case "get_wallet_names":
            await guard(origin, "ACCESS_ALL_ADDRESSES", state);
            response = await handlers.getWalletNames();
            break;

        case "sign_bytes":
            await guard(origin, "SIGNATURE", state);
            response = await handlers.signBytes(...params);
            break;

        case "set_active_address":
            await guard(origin, "ORGANIZE_WALLETS", state);
            response = await handlers.setActiveAddress(...params);
            break;

        case "import_wallet":
            await guard(origin, "ORGANIZE_WALLETS", state);
            response = await handlers.importWallet(...params);
            break;

        case "rename_wallet":
            await guard(origin, "ORGANIZE_WALLETS", state);
            response = await handlers.renameWallet(...params);
            break;

        case "request_permissions":
            response = await handlers.requestPermissions(origin, ...params);
            break;

        default:
            exhaustive(method);
            throw new Error("Method not found.");
    }

    return response;
});
