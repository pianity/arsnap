import * as handlers from "@/handlers";
import { getStateRaw, initializeState, registerRpcMessageHandler } from "@/metamask";
import { exhaustive } from "@/utils";

registerRpcMessageHandler(async (origin, request) => {
    const { method, params } = request;

    if (!(await getStateRaw())) {
        await initializeState();
    }

    switch (method) {
        case "is_enabled":
            return handlers.isEnabled();

        case "get_permissions":
            return handlers.getPermissions(origin);

        case "get_active_address":
            return await handlers.getActiveAddress();

        case "get_active_public_key":
            return await handlers.getActivePublicKey();

        case "get_all_addresses":
            return await handlers.getAllAddresses();

        case "get_wallet_names":
            return await handlers.getWalletNames();

        case "sign_bytes":
            return await handlers.signBytes(...params);

        case "set_active_address":
            return await handlers.setActiveAddress(...params);

        case "import_wallet":
            return await handlers.importWallet(...params);

        case "rename_wallet":
            return await handlers.renameWallet(...params);

        case "request_permissions":
            return await handlers.requestPermissions(origin, ...params);

        default:
            exhaustive(method);
            throw new Error("Method not found.");
    }
});
