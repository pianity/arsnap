import { getState, replaceState, updateState, Wallet } from "@/metamask";
import { ownerToAddress } from "@/utils";
import { decryptWallet, encryptWallet, generateJWK } from "@/crypto";

export async function getWallet(address: string) {
    const { wallets } = await getState();

    const encryptedWallet = wallets.get(address);

    if (!encryptedWallet) {
        throw new Error(`No wallet found for address "${address}"`);
    }

    return await decryptWallet(encryptedWallet);
}

export async function getActiveWallet() {
    const { activeWallet } = await getState();

    return getWallet(activeWallet);
}

export async function generateWallet(): Promise<Wallet> {
    const wallet = await generateJWK();
    const address = await ownerToAddress(wallet.n);

    return { key: wallet, metadata: { address, name: "" } };
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

export async function renameWallet(address: string, name: string) {
    const state = await getState();

    const wallet = state.wallets.get(address);

    if (!wallet) {
        throw new Error(`No wallet found for address "${address}"`);
    }

    wallet.metadata.name = name;

    await replaceState(state);
}
