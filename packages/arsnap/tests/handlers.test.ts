import {
    vi,
    expect,
    test,
    beforeAll,
    afterAll,
    afterEach,
    MockedFunction,
    beforeEach,
} from "vitest";
import type * as _ from "@metamask/snaps-types";

import { State, Wallet } from "@/state";
import { generateJWK, JWKInterface, JWKPublicInterface } from "@/crypto";
import { ownerToAddress } from "@/utils";
import * as handlers from "@/handlers";
import * as metamask from "@/metamask";
import { RpcPermission } from "@pianity/arsnap-adapter";

type DummyWallet = { key: JWKInterface; address: string };
let WALLET1: DummyWallet;
let WALLET2: DummyWallet;
const ORIGIN = "https://pianity.com";

let state: State;

const mockedSnap = {
    request: vi.fn() as MockedFunction<typeof snap.request>,
};
vi.stubGlobal("snap", mockedSnap);

beforeAll(async () => {
    const jwk1 = await generateJWK();
    const jwk2 = await generateJWK();
    WALLET1 = { key: jwk1, address: await ownerToAddress(jwk1.n) };
    WALLET2 = { key: jwk2, address: await ownerToAddress(jwk2.n) };
}, 10_000);

beforeEach(async () => {
    const wallet: Wallet = {
        key: WALLET1.key,
        metadata: {
            name: "Default wallet",
            address: WALLET1.address,
            isProtected: true,
            keyOwnerField: WALLET1.key.n,
        },
    };

    state = {
        wallets: new Map([[WALLET1.address, wallet]]),
        logs: new Map(),
        permissions: new Map([[ORIGIN, []]]),
        activeWallet: WALLET1.address,
        logsStorageLimit: 100,
    };
});

afterEach(() => {
    vi.clearAllMocks();
});

test("isEnabled", async () => {
    const isEnabled = await handlers.isEnabled();
    expect(isEnabled).toBe(true);
});

test("accepted requestPermissions", async () => {
    const perms: RpcPermission[] = ["GET_LOGS", "CLEAR_LOGS"];

    vi.spyOn(metamask, "confirmPopup").mockImplementation(async (_title, lines) => {
        perms.forEach((perm) => {
            expect(lines.some((line) => line.includes(`**${perm}**`))).true;
        });
        return true;
    });

    const permissions = await handlers.requestPermissions(state, ORIGIN, perms);

    expect(permissions).true;
    expect(state.permissions.get(ORIGIN)).toEqual(perms);
});

test("rejected requestPermissions", async () => {
    const perms: RpcPermission[] = ["GET_LOGS", "CLEAR_LOGS"];

    vi.spyOn(metamask, "confirmPopup").mockResolvedValue(false);

    const permissions = await handlers.requestPermissions(state, ORIGIN, perms);

    expect(permissions).false;
    expect(state.permissions.get(ORIGIN)).toEqual([]);
});

test("getPermissions", async () => {
    const perms: RpcPermission[] = ["GET_LOGS", "CLEAR_LOGS"];
    state.permissions.set(ORIGIN, perms);
    const permissions = await handlers.getPermissions(state, ORIGIN);
    expect(permissions).toBe(perms);
});

test("revokePermissions", async () => {
    const keep: RpcPermission[] = ["GET_ACTIVE_ADDRESS"];
    const revoke: RpcPermission[] = ["GET_LOGS", "CLEAR_LOGS"];

    state.permissions.set(ORIGIN, keep.concat(revoke));

    await handlers.revokePermissions(state, ORIGIN, revoke);

    expect(state.permissions.get(ORIGIN)).toEqual(keep);
});

test("revokeAllPermissions", async () => {
    const perms: RpcPermission[] = ["GET_LOGS", "CLEAR_LOGS"];
    state.permissions.set(ORIGIN, perms);

    await handlers.revokeAllPermissions(state, ORIGIN);

    expect(state.permissions.get(ORIGIN)).toEqual([]);
});

test("getDappsPermissions", async () => {
    const perms1: RpcPermission[] = ["GET_LOGS", "CLEAR_LOGS"];
    const perms2: RpcPermission[] = ["GET_ACTIVE_ADDRESS", "SIGN"];
    const secondOrigin = "https://example.com";
    state.permissions.set(ORIGIN, perms1);
    state.permissions.set(secondOrigin, perms2);

    const result = await handlers.getDappsPermissions(state);

    expect(result).toEqual([
        [ORIGIN, perms1],
        [secondOrigin, perms2],
    ]);
});

test("revokeDappPermissions", async () => {
    const revoke: RpcPermission[] = ["RENAME_WALLET", "GET_ACTIVE_PUBLIC_KEY", "SIGN"];
    const keep: RpcPermission[] = ["DELETE_WALLET", "GET_LOGS"];
    state.permissions.set(ORIGIN, [...keep, ...revoke]);

    await handlers.revokeDappPermissions(state, ORIGIN, revoke);

    expect(state.permissions.get(ORIGIN)).toEqual(keep);
});

test("getActiveAddress", async () => {
    state.activeWallet = WALLET1.address;
    const result = await handlers.getActiveAddress(state);
    expect(result).toBe(WALLET1.address);
});

test("getActivePublicKey", async () => {
    state.activeWallet = WALLET1.address;
    const result = await handlers.getActivePublicKey(state);
    expect(result).toBe(WALLET1.key.n);
});

test("getAllAddresses", async () => {
    const result = await handlers.getAllAddresses(state);
    expect(result).toEqual([WALLET1.address]);
});

test("getWalletNames", async () => {
    const result = await handlers.getWalletNames(state);
    expect(result).toEqual([[WALLET1.address, "Default wallet"]]);
});

test("setActiveAddress", async () => {
    await handlers.setActiveAddress(state, WALLET1.address);
    expect(state.activeWallet).toBe(WALLET1.address);
});

test("signBytes", async () => {
    const saltLength = 32;
    const bytes = new TextEncoder().encode("Hello world");
    const signature = new Uint8Array(await handlers.signBytes(state, bytes, saltLength));

    const publicKey: JWKPublicInterface = {
        kty: "RSA",
        e: "AQAB",
        n: WALLET1.key.n,
    };
    const verifyKey = await crypto.subtle.importKey(
        "jwk",
        publicKey,
        {
            name: "RSA-PSS",
            hash: { name: "SHA-256" },
        },
        false,
        ["verify"],
    );

    await expect(
        crypto.subtle.verify(
            {
                name: "RSA-PSS",
                hash: "SHA-256",
                saltLength,
            },
            verifyKey,
            signature,
            bytes,
        ),
    ).resolves.toBe(true);
});

test("importWallet", async () => {
    const name = "Imported wallet";
    const key = await generateJWK();
    const address = await ownerToAddress(key.n);

    vi.spyOn(metamask, "confirmPopup").mockResolvedValue(true);

    await handlers.importWallet(state, key, name);

    expect(state.wallets.get(address)).toEqual({
        key,
        metadata: {
            name,
            address,
            isProtected: false,
            keyOwnerField: key.n,
        },
    });
});

test("deleteWallet throws when deleting protected wallet", async () => {
    await expect(handlers.deleteWallet(state, ORIGIN, WALLET1.address)).rejects.toThrow();
    expect(state.wallets.size).toBe(1);
});

test("accepted deleteWallet deletes unprotected wallet", async () => {
    const address = "fakeAddress";

    state.wallets.set(address, {
        key: WALLET1.key,
        metadata: {
            name: "Unprotected wallet",
            address,
            isProtected: false,
            keyOwnerField: WALLET1.key.n,
        },
    });

    vi.spyOn(metamask, "confirmPopup").mockResolvedValue(true);

    await handlers.deleteWallet(state, ORIGIN, address);

    expect(state.wallets.get(address)).toBeUndefined();
});

test("rejected deleteWallet doesn't delete unprotected wallet", async () => {
    const address = "fakeAddress";
    const wallet: Wallet = {
        key: WALLET1.key,
        metadata: {
            name: "Unprotected wallet",
            address,
            isProtected: false,
            keyOwnerField: WALLET1.key.n,
        },
    };

    state.wallets.set(address, wallet);

    vi.spyOn(metamask, "confirmPopup").mockResolvedValue(false);

    await expect(handlers.deleteWallet(state, ORIGIN, address)).rejects.toThrow();
    expect(state.wallets.get(address)).toEqual(wallet);
});

test("renameWallet", async () => {
    const newName = "New name";
    await handlers.renameWallet(state, WALLET1.address, newName);
    expect(state.wallets.get(WALLET1.address)?.metadata.name).toEqual(newName);
});
