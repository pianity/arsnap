import { useState } from "react";

import { OnWalletMenuEvent } from "@/components/WalletMenu/WalletMenu";
import WalletList from "@/components/WalletMenu/WalletList";
import AddWallet, { NewWalletChoice } from "@/components/WalletMenu/AddWallet";
import NewWallet from "@/components/WalletMenu/NewWallet";
import DeleteWallet from "@/components/WalletMenu/DeleteWallet";
import { Wallets } from "@/state";
import { NamedAddress } from "@/utils/types";
import { arweave } from "@/utils/blockchain";
import { exhaustive } from "@/utils";
import Container from "@/components/interface/layout/Container";
import { GatewayName } from "@/state/config";

export type WalletOpenedMenuProps = {
    gateway: GatewayName;
    activeWallet: string;
    availableWallets: Wallets;
    onEvent: OnWalletMenuEvent;
    onSettingsOpen: () => void;
};

export default function WalletOpenedMenu({
    gateway,
    activeWallet,
    availableWallets,
    onEvent,
    onSettingsOpen,
}: WalletOpenedMenuProps) {
    const [view, setView] = useState<
        "walletsList" | "deleteWallet" | "addWallet" | "createNew" | "imported" | "created"
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

            case "cancel":
                setView("walletsList");
                break;

            default:
                exhaustive(choice);
        }
    }

    return (
        <Container opaque shadow className="text-gray-dark relative overflow-hidden">
            {(view === "walletsList" || view === "deleteWallet") && (
                <WalletList
                    activeWallet={activeWallet}
                    availableWallets={availableWallets}
                    onEvent={onEvent}
                    onAddWallet={() => setView("addWallet")}
                    onDeleteWallet={(wallet) => {
                        setView("deleteWallet");
                        setWallet(wallet);
                    }}
                    onSettingsOpen={onSettingsOpen}
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

            {view === "addWallet" && <AddWallet onChoice={onNewWalletChoice} />}

            {(view === "imported" || view === "created") && (
                <NewWallet
                    origin={view}
                    // TODO: Avoid using null assertion
                    wallet={wallet!}
                    onGoBack={() => setView("walletsList")}
                    onEvent={onEvent}
                />
            )}
        </Container>
    );
}
