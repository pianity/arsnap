import { useState, FocusEvent, useRef } from "react";
import { JWKInterface } from "arweave/node/lib/wallet";

import { NamedAddress } from "@/utils/types";
import Button from "@/components/Button";
import { exhaustive } from "@/utils";

type SelectWallet = {
    event: "selectWallet";
    address: string;
};

type RenameWallet = {
    event: "renameWallet";
    name: string;
    address: string;
};

type ImportWallet = {
    event: "importWallet";
    jwk: JWKInterface;
};

type DownloadWallet = {
    event: "downloadWallet";
};

export type WalletMenuEvent = SelectWallet | RenameWallet | ImportWallet | DownloadWallet;

export type WalletMenuEventResponse = {
    wallet?: NamedAddress;
    jwk?: JWKInterface;
};
export type WalletMenuOnEvent<T = WalletMenuEvent> = (event: T) => Promise<WalletMenuEventResponse>;

type FileBrowserEvent = (state: "opened" | "closed") => void;

type WalletItemProps = {
    active?: boolean;
    name: string;
    address: string;
    onEvent: WalletMenuOnEvent;
};

function WalletItem({ active, name, address, onEvent }: WalletItemProps) {
    const [renaming, setRenaming] = useState<string | undefined>();

    function onBlur(e: FocusEvent<HTMLInputElement>) {
        onEvent({ event: "renameWallet", name: e.target.value, address });

        setRenaming(undefined);
    }

    return (
        <li onClick={() => onEvent({ event: "selectWallet", address })}>
            {active && <p>(logo)</p>}

            <input
                onBlur={renaming === address ? onBlur : undefined}
                onClick={(e) => {
                    setRenaming(address);

                    e.stopPropagation();
                }}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                defaultValue={name}
            />

            <span
                onClick={(e) => {
                    console.log("copied to clipboard!");

                    navigator.clipboard.writeText(address);
                    e.stopPropagation();
                }}
            >
                {address}
            </span>
        </li>
    );
}

function findAddressName(wallets: [string, string][], needle: string): string {
    return wallets[wallets.findIndex(([address]) => address === needle)][1];
}

type NameNewWalletProps = {
    origin: "imported" | "created";
    wallet: NamedAddress;
    onGoBack: () => void;
    onEvent: WalletMenuOnEvent<RenameWallet | DownloadWallet>;
};
function NameNewWallet({ origin, wallet, onGoBack, onEvent }: NameNewWalletProps) {
    return (
        <div onClick={(e) => e.stopPropagation()}>
            <label>Name your wallet</label>
            <input
                onBlur={(e) => {
                    onEvent({
                        event: "renameWallet",
                        name: e.target.value,
                        address: wallet.address,
                    });
                    e.stopPropagation();
                }}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                defaultValue={wallet.name}
            />

            {origin === "created" && (
                <Button onClick={() => console.log("TODO")}>Download Wallet</Button>
            )}

            <Button
                onClick={(e) => {
                    onGoBack();
                    e.stopPropagation();
                }}
            >
                See Wallets
            </Button>
        </div>
    );
}

type NewWalletChoice = "importExisting" | "createNew" | "cancel";

type NewWalletProps = {
    onChoice: (choice: NewWalletChoice, walletFile?: FileList) => Promise<void>;
    onFileBrowserEvent: FileBrowserEvent;
};
function NewWallet({ onChoice, onFileBrowserEvent }: NewWalletProps) {
    const inputFile = useRef<HTMLInputElement>(null);

    return (
        <>
            <input
                type="file"
                ref={inputFile}
                style={{ display: "none" }}
                onChange={(e) => {
                    onFileBrowserEvent("closed");
                    onChoice("importExisting", e.target.files || undefined);
                }}
                onClick={(e) => e.stopPropagation()}
            />
            <Button
                onClick={(e) => {
                    onFileBrowserEvent("opened");
                    e.stopPropagation();
                    inputFile.current?.click();
                }}
            >
                Load existing wallet
            </Button>

            <Button
                onClick={(e) => {
                    e.stopPropagation();
                    onChoice("createNew");
                }}
            >
                Create new wallet
            </Button>

            <Button
                onClick={(e) => {
                    e.stopPropagation();
                    onChoice("cancel");
                }}
            >
                Cancel
            </Button>
        </>
    );
}

type WalletOpenedMenuProps = WalletMenuProps & { onFileBrowserEvent: FileBrowserEvent };
function WalletOpenedMenu({
    activeWallet,
    availableWallets,
    onEvent,
    onFileBrowserEvent,
}: WalletOpenedMenuProps) {
    const [view, setView] = useState<
        "walletsList" | "newWallet" | "createNew" | "imported" | "created"
    >("walletsList");

    const [wallet, setWallet] = useState<NamedAddress | undefined>();

    async function onNewWalletChoice(choice: NewWalletChoice, walletFile?: FileList) {
        switch (choice) {
            case "importExisting": {
                const importedWallet = await walletFile?.item(0)?.text();
                if (importedWallet) {
                    const response = await onEvent({
                        event: "importWallet",
                        jwk: JSON.parse(importedWallet),
                    });
                    if (response) {
                        setWallet(response.wallet);
                    } else {
                        // TODO: do something
                    }

                    setView("imported");
                }

                break;
            }

            case "createNew":
                setView("createNew");
                break;

            case "cancel":
                setView("walletsList");
                break;

            default:
                exhaustive(choice);
        }
    }

    return (
        <>
            {view === "walletsList" && (
                <div>
                    <ul>
                        {activeWallet && availableWallets
                            ? availableWallets.map(([address, name]) => (
                                  <WalletItem
                                      key={address}
                                      active={address === activeWallet}
                                      name={name}
                                      address={address}
                                      onEvent={onEvent}
                                  />
                              ))
                            : "loading wallets..."}
                    </ul>

                    <Button
                        onClick={(e) => {
                            setView("newWallet");
                            e.stopPropagation();
                        }}
                    >
                        Add wallet
                    </Button>
                    <Button>Settings</Button>
                    <Button>Logout</Button>
                </div>
            )}

            {view === "newWallet" && (
                <NewWallet onChoice={onNewWalletChoice} onFileBrowserEvent={onFileBrowserEvent} />
            )}

            {view === "imported" && (
                <NameNewWallet
                    origin="imported"
                    // I am using a godforsaken non-null assertion here as
                    // Typescript doesn't allow to set a return type depending
                    // on the type of the arguments given to a function. This
                    // would allow me to assert that when calling `onEvent({
                    // event: "importWallet", ... })` we'd always get a
                    // `NamedAddress` in return.
                    wallet={wallet!}
                    onGoBack={() => setView("walletsList")}
                    onEvent={onEvent}
                />
            )}
        </>
    );
}

export type WalletMenuProps = {
    activeWallet?: string;
    availableWallets?: [string, string][];
    onEvent: WalletMenuOnEvent;
};

export default function WalletMenu({
    activeWallet,
    availableWallets,
    onEvent: onEventRaw,
}: WalletMenuProps) {
    const [menuOpened, setMenuOpened] = useState(false);

    // This is a dirty hack to prevent `onBlur` of the main div here from firing when the file
    // browser is opened (when user wants to import a wallet).
    const [fileBrowserState, setFileBrowserState] = useState<"notOpened" | "opened" | "closed">(
        "notOpened",
    );

    // Hijacking WalletItem's onEvent to close the menu when a new wallet has been selected
    function onEvent(e: WalletMenuEvent): Promise<WalletMenuEventResponse> {
        if (e.event === "selectWallet") {
            setMenuOpened(false);
        }
        return onEventRaw(e);
    }

    return (
        <>
            <div
                tabIndex={0}
                onClick={() => setMenuOpened(!menuOpened)}
                onBlur={(e) => {
                    if (
                        !e.currentTarget.contains(e.relatedTarget) &&
                        fileBrowserState === "notOpened"
                    ) {
                        setMenuOpened(false);
                    }

                    if (fileBrowserState === "closed") {
                        setFileBrowserState("notOpened");
                    }
                }}
            >
                <label>wallet</label>
                <span>
                    {activeWallet && availableWallets
                        ? findAddressName(availableWallets, activeWallet)
                        : "loading wallets..."}
                </span>

                {menuOpened && (
                    <WalletOpenedMenu
                        activeWallet={activeWallet}
                        availableWallets={availableWallets}
                        onEvent={onEvent}
                        onFileBrowserEvent={setFileBrowserState}
                    />
                )}
            </div>
        </>
    );
}
