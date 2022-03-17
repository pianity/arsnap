import { getState, setState } from "@/metamask";
import { generateJWK, JWKPublicInterface, ownerToAddress } from "@/utils";

export function isEnabled(): boolean {
    return true;
}

export async function generateWallet(): Promise<boolean> {
    const state = await getState();

    if (state.wallet) {
        return false;
    }

    const wallet = await generateJWK();
    const address = await ownerToAddress(wallet.n);

    setState({
        ...state,
        wallet: {
            key: wallet,
            address,
        },
    });

    return true;
}

export async function getPubKey(): Promise<JWKPublicInterface> {
    const { wallet } = await getState();

    if (!wallet) {
        throw new Error("No wallout found");
    }

    return {
        kty: "RSA",
        e: wallet.key.e,
        n: wallet.key.n,
    };
}

export async function getAddress(): Promise<string> {
    const { wallet } = await getState();

    if (!wallet) {
        throw new Error("No wallet found");
    }

    return wallet.address;
}
