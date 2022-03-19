import { getState, updateState, Wallet } from "@/metamask";
import { ownerToAddress } from "@/utils";
import { decryptWallet, encryptWallet, generateJWK } from "@/crypto";

export async function getWallet(address: string) {
    const { wallets } = await getState();

    const encryptedWallet = wallets[address];

    if (!encryptedWallet) {
        throw new Error(`No wallet found for address "${address}"`);
    }

    return await decryptWallet(encryptedWallet);
}

export async function getActiveWallet() {
    const { activeWallet } = await getState();

    return getWallet(activeWallet);
}

export async function setActiveWallet(address: string) {
    await updateState({
        activeWallet: address,
    });
}

export async function generateWallet(): Promise<Wallet> {
    const wallet = await generateJWK();
    const address = await ownerToAddress(wallet.n);

    return { key: wallet, metadata: { address, name: "" } };
}

export async function importWallet(wallet: Wallet): Promise<void> {
    const encryptedWallet = await encryptWallet(wallet);

    const { wallets } = await getState();

    await updateState({
        wallets: {
            ...wallets,
            [wallet.metadata.address]: encryptedWallet,
        },
    });
}
