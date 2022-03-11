import { getState, setState } from "@/metamask";
import { generateJWK, JWKPublicInterface, ownerToAddress } from "@/utils";

export function isEnabled(): boolean {
    return true;
}

export async function generateWallet(): Promise<boolean> {
    const state = await getState();

    if (state.key) {
        return false;
    }

    const wallet = await generateJWK();
    const address = await ownerToAddress(wallet.n);

    setState({
        ...state,
        key: wallet,
        address,
    });

    return true;
}

export async function getPubKey(): Promise<JWKPublicInterface> {
    const { key } = await getState();

    if (!key) {
        throw new Error("No key found");
    }

    return {
        kty: "RSA",
        e: key.e,
        n: key.n,
    };
}

export async function getAddress(): Promise<string> {
    const { address } = await getState();

    return address;
}
