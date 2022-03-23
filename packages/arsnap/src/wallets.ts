import { EncryptedWallet, getState, replaceState, Wallet } from "@/metamask";
import { ownerToAddress } from "@/utils";
import { encryptWallet, generateJWK, JWKInterface } from "@/crypto";

export async function getWallet(address: string): Promise<EncryptedWallet> {
    const { wallets } = await getState();

    const encryptedWallet = wallets.get(address);

    if (!encryptedWallet) {
        throw new Error(`No wallet found for address "${address}"`);
    }

    return encryptedWallet;
}

export async function getActiveWallet(): Promise<EncryptedWallet> {
    const { activeWallet } = await getState();

    return getWallet(activeWallet);
}

export async function generateWallet(name?: string): Promise<Wallet> {
    const wallet = await generateJWK();
    const address = await ownerToAddress(wallet.n);

    name = await getProperWalletName(address, name);

    return { key: wallet, metadata: { name, address, keyOwnerField: wallet.n } };
}

export async function setActiveAddress(address: string) {
    const state = await getState();

    if (!state.wallets.get(address)) {
        throw new Error(`No wallet found for address "${address}"`);
    }

    state.activeWallet = address;

    await replaceState(state);
}

export async function importWallet(wallet: Wallet): Promise<void> {
    const encryptedWallet = await encryptWallet(wallet);

    const state = await getState();

    state.wallets.set(wallet.metadata.address, encryptedWallet);

    await replaceState(state);
}

export async function importJwk(jwk: JWKInterface, name?: string): Promise<void> {
    const address = await ownerToAddress(jwk.n);
    name = await getProperWalletName(address, name);

    const wallet = {
        key: jwk,
        metadata: {
            name,
            address,
            keyOwnerField: jwk.n,
        },
    };

    await importWallet(wallet);
}

export async function renameWallet(address: string, name: string) {
    const state = await getState();

    const wallet = state.wallets.get(address);

    if (!wallet) {
        throw new Error(`No wallet found for address "${address}"`);
    }

    wallet.metadata.name = name;

    await replaceState(state);
}

async function getProperWalletName(address: string, name?: string): Promise<string> {
    const { wallets } = await getState();

    name = name ? name?.trim() : undefined;

    if (name) {
        const nameAlreadyTaken =
            [...wallets.entries()].filter(([_, { metadata }]) => metadata.name === name).length > 0;

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
