import { useState } from "react";

import { OnFileBrowserEvent, OnWalletMenuEvent } from "@/components/WalletMenu/WalletMenu";
import WalletList from "@/components/WalletMenu/WalletList";
import NewWallet, { NewWalletChoice } from "@/components/WalletMenu/NewWallet";
import NameNewWallet from "@/components/WalletMenu/NameNewWallet";
import DeleteWallet from "@/components/WalletMenu/DeleteWallet";
import { NamedAddress } from "@/utils/types";
import { arweave } from "@/utils/blockchain";
import { exhaustive } from "@/utils";
import Container from "@/components/interface/layout/Container";

export type WalletOpenedMenuProps = {
    activeWallet: string;
    availableWallets: [string, string][];
    onEvent: OnWalletMenuEvent;
    onFileBrowserEvent: OnFileBrowserEvent;
};

export default function WalletOpenedMenu({
    activeWallet,
    availableWallets,
    onEvent,
    onFileBrowserEvent,
}: WalletOpenedMenuProps) {
    const [view, setView] = useState<
        "walletsList" | "deleteWallet" | "newWallet" | "createNew" | "imported" | "created"
    >("walletsList");

    // // When `view` is set to `deleteWallet`, `deletingAddress` should be set to the address of the
    // // wallet the user wants to delete.
    // const [deletingAddress, setDeletingAddress] = useState<NamedAddress | undefined>();

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

            case "createNew": {
                const jwk = await arweave.wallets.generate();

                const response = await onEvent({
                    event: "importWallet",
                    jwk,
                });
                if (response) {
                    setWallet(response.wallet);
                } else {
                    // TODO: do something
                }

                setView("created");
                break;
            }

            case "cancel":
                setView("walletsList");
                break;

            default:
                exhaustive(choice);
        }
    }

    return (
        <Container opaque shadow className="p-4 text-gray-dark">
            {view === "walletsList" && (
                <WalletList
                    activeWallet={activeWallet}
                    availableWallets={availableWallets}
                    onEvent={onEvent}
                    onAddWallet={() => setView("newWallet")}
                    onDeleteWallet={(wallet) => {
                        setView("deleteWallet");
                        setWallet(wallet);
                    }}
                />
            )}

            {view === "deleteWallet" && wallet && (
                <DeleteWallet
                    name={wallet.name}
                    address={wallet.address}
                    onChoice={(choice) => {
                        if (choice === "confirm") {
                            onEvent({ event: "deleteWallet", address: wallet.address });
                        }
                        setWallet(undefined);
                        setView("walletsList");
                    }}
                />
            )}

            {view === "newWallet" && (
                <NewWallet onChoice={onNewWalletChoice} onFileBrowserEvent={onFileBrowserEvent} />
            )}

            {(view === "imported" || view === "created") && (
                <NameNewWallet
                    origin={view}
                    // I am using a godforsaken non-null assertion here as
                    // Typescript doesn't allow to set a return type depending
                    // on the type of the arguments given to a function. This
                    // would allow me to assert that when calling `onEvent({
                    // event: "importWallet", ... })` we'd always get a
                    // `NamedAddress` in return.
                    wallet={wallet!}
                    onGoBack={() => setView("walletsList")}
                    onEvent={onEvent}
                    onFileBrowserEvent={onFileBrowserEvent}
                />
            )}
        </Container>
    );
}
