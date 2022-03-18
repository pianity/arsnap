import { getState, updateState, Wallet } from "@/metamask";
import { ownerToAddress } from "@/utils";
import { decryptWallet, encryptWallet, generateJWK } from "@/crypto";

export async function getWallet(index: number) {
    const { wallets } = await getState();

    const encryptedWallet = wallets[index];

    if (!encryptedWallet) {
        throw new Error(`No wallet found at index "${index}"`);
    }

    return await decryptWallet(encryptedWallet);
}

export async function getActiveWallet() {
    const { activeWallet } = await getState();

    return getWallet(activeWallet);
}

export async function setActiveWallet(index: number) {
    await updateState({
        activeWallet: index,
    });
}

export async function generateWallet(): Promise<Wallet> {
    const wallet = await generateJWK();
    const address = await ownerToAddress(wallet.n);

    return { key: wallet, address };
}

export async function importWallet(wallet: Wallet): Promise<void> {
    const encryptedWallet = await encryptWallet(wallet);

    const { wallets } = await getState();

    await updateState({
        wallets: [...wallets, encryptedWallet],
    });
}
