import * as handlers from "@/handlers";
import { getState, initializeState, registerRpcMessageHandler } from "@/metamask";
import { exhaustive } from "@/utils";

registerRpcMessageHandler(async (originString, request) => {
    const { method } = request;

    if (!(await getState())) {
        await initializeState();
    }

    switch (method) {
        case "is_enabled":
            return handlers.isEnabled();

        case "get_active_address":
            return await handlers.getActiveAddress();

        case "get_active_public_key":
            return await handlers.getActivePublicKey();

        case "sign_bytes":
            return await handlers.signBytes(request.params);

        default:
            exhaustive(method);
            throw new Error("Method not found.");
    }
});
