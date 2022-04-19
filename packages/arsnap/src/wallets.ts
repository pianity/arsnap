import { State, Wallet } from "@/state";
import { ownerToAddress } from "@/utils";
import { generateJWK, JWKInterface } from "@/crypto";

export async function generateWallet(
    existingWalletsNames: string[],
    name?: string,
): Promise<Wallet> {
    const wallet = await generateJWK();
    const address = await ownerToAddress(wallet.n);

    return {
        key: wallet,
        metadata: {
            name: getProperWalletName(existingWalletsNames, address, name),
            address,
            keyOwnerField: wallet.n,
        },
    };
}

export async function jwkToWallet(
    existingWalletsNames: string[],
    jwk: JWKInterface,
    name?: string,
): Promise<Wallet> {
    const address = await ownerToAddress(jwk.n);
    name = getProperWalletName(existingWalletsNames, address, name);

    const wallet = {
        key: jwk,
        metadata: {
            name,
            address,
            keyOwnerField: jwk.n,
        },
    };

    return wallet;
}

/**
 * Returns an array of `wallets` names.
 */
export function walletsToNames(wallets: State["wallets"]): string[] {
    return Array.from(wallets.values()).map((wallet) => wallet.metadata.name);
}

function getProperWalletName(wallets: string[], address: string, name?: string): string {
    name = name ? name?.trim() : undefined;

    if (name) {
        const nameAlreadyTaken = wallets.filter((takenName) => takenName === name).length > 0;

        if (nameAlreadyTaken) {
            const splitted = name.split(" ");
            const lastWord = parseInt(splitted.at(-1) ?? "");

            if (splitted.length > 1 && !Number.isNaN(lastWord)) {
                splitted.pop();
                name = `${name} ${lastWord + 1}`;
            } else {
                name = `${name} 2`;
            }
        }
    }

    name = name ?? `Unnamed ${address.slice(0, 3)}...${address.slice(-3)}`;

    return name;
}
