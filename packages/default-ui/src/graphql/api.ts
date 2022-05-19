import { GraphQLClient } from "graphql-request";

import { ARWEAVE_HOST, ARWEAVE_PORT, ARWEAVE_PROTOCOL } from "@/consts";
import * as Arweave from "@/graphql/arweave";
import { sleep } from "@/utils";

const retryWrapper = (maxProtectedTries: number, waitSeconds = 5): Arweave.SdkFunctionWrapper => {
    return async <T>(action: () => Promise<T>): Promise<T> => {
        for (let tryNumber = 0; tryNumber < maxProtectedTries; tryNumber++) {
            try {
                return await action();
            } catch (rawErr) {
                const err = rawErr as Error;
                console.log(
                    `warning: GraphQL error, trying again ${tryNumber}/${maxProtectedTries}: ` +
                        `${err.name} ${err.message}`,
                );
                await sleep(waitSeconds);
            }
        }

        if (maxProtectedTries > 0) {
            console.log(
                "warning: GraphQL errored too many times, trying one more time without wrapper",
            );
        }
        return await action();
    };
};

const arweaveClient = new GraphQLClient(
    `${ARWEAVE_PROTOCOL}://${ARWEAVE_HOST}:${ARWEAVE_PORT}/graphql`,
);

const ArweaveApi = Arweave.getSdk(arweaveClient);

export default ArweaveApi;
