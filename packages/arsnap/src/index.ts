import * as handlers from "@/handlers";
import { getState, getStateRaw, initializeState, registerRpcMessageHandler } from "@/metamask";
import { exhaustive } from "@/utils";
import { guard } from "@/permissions";

registerRpcMessageHandler(async (origin, request) => {
    const { method, params } = request;

    if (!(await getStateRaw())) {
        await initializeState();
    }

    const state = await getState();

    switch (method) {
        case "is_enabled":
            return handlers.isEnabled();

        case "get_permissions":
            return handlers.getPermissions(origin);

        case "get_active_address":
            await guard(origin, "ACCESS_ADDRESS", state);
            return await handlers.getActiveAddress();

        case "get_active_public_key":
            await guard(origin, "ACCESS_PUBLIC_KEY", state);
            return await handlers.getActivePublicKey();

        case "get_all_addresses":
            await guard(origin, "ACCESS_ALL_ADDRESSES", state);
            return await handlers.getAllAddresses();

        case "get_wallet_names":
            await guard(origin, "ACCESS_ALL_ADDRESSES", state);
            return await handlers.getWalletNames();

        case "sign_bytes":
            await guard(origin, "SIGNATURE", state);
            return await handlers.signBytes(...params);

        case "set_active_address":
            await guard(origin, "ORGANIZE_WALLETS", state);
            return await handlers.setActiveAddress(...params);

        case "import_wallet":
            await guard(origin, "ORGANIZE_WALLETS", state);
            return await handlers.importWallet(...params);

        case "rename_wallet":
            await guard(origin, "ORGANIZE_WALLETS", state);
            return await handlers.renameWallet(...params);

        case "request_permissions":
            return await handlers.requestPermissions(origin, ...params);

        default:
            exhaustive(method);
            throw new Error("Method not found.");
    }
});
