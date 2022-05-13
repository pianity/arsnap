import { useState } from "react";

import { OnFileBrowserEvent, WalletMenuProps } from "@/components/WalletMenu/WalletMenu";
import WalletList from "@/components/WalletMenu/WalletList";
import NewWallet, { NewWalletChoice } from "@/components/WalletMenu/NewWallet";
import NameNewWallet from "@/components/WalletMenu/NameNewWallet";
import { NamedAddress } from "@/utils/types";
import { arweave } from "@/utils/blockchain";
import { exhaustive } from "@/utils";

export type WalletOpenedMenuProps = WalletMenuProps & { onFileBrowserEvent: OnFileBrowserEvent };
export default function WalletOpenedMenu({
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
        <>
            {view === "walletsList" && (
                <WalletList
                    activeWallet={activeWallet}
                    availableWallets={availableWallets}
                    onEvent={onEvent}
                    onAddWallet={() => setView("newWallet")}
                />
            )}

            {view === "newWallet" && (
                <NewWallet onChoice={onNewWalletChoice} onFileBrowserEvent={onFileBrowserEvent} />
            )}

            {view === "imported" ||
                (view === "created" && (
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
                ))}
        </>
    );
}
