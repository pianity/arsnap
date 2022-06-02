import { PermissionType } from "arconnect";

import "@pianity/arsnap-compat";

const connectButton = document.getElementById("connect") as HTMLButtonElement;
const revokePermsButton = document.getElementById("revoke-permissions") as HTMLButtonElement;
const getActiveAddrButton = document.getElementById("get-active-address") as HTMLButtonElement;
const signMsgButton = document.getElementById("sign-message") as HTMLButtonElement;
const msgToSignInput = document.getElementById("message-to-sign") as HTMLInputElement;
const status = document.getElementById("status") as HTMLParagraphElement;

// Define the permissions required by our dApp (more on this later).
const PERMISSIONS: PermissionType[] = ["ACCESS_ADDRESS", "SIGNATURE"];

connectButton.addEventListener("click", async () => {
    try {
        // The first step to start using ArSnap is to connect to it. This will trigger MetaMask to
        // ask for the user's authorization to allow the dApp to connect to ArSnap. It will also
        // asks the user if they want ArSnap to be installed, if it weren't already.
        await window.arweaveWallet.connect(PERMISSIONS);

        status.innerText = "Connection successful! You can try to buttons below now.";
    } catch (e) {
        // The `connect` function will throw if the user decline the connection or if the proper
        // MetaMask version isn't installed.

        // The user don't have an Arweave wallet extension installed
        if (!window.arweaveWallet) {
            // Prompt the user to install MetaMask Flask.
            const link = document.createElement("a") as HTMLAnchorElement;
            link.target = "_blank";
            link.href = "https://metamask.io/flask";
            link.text = "Please install MetaMask Flask first.";

            status.innerHTML = link.outerHTML;
        } else {
            status.innerText = "The connection to the wallet was declined.";
        }
    }
});

revokePermsButton.addEventListener("click", async () => {
    try {
        // Revoke the permissions that we previously requested.
        await window.arweaveWallet.disconnect();

        status.innerText = "All permissions revoked.";
    } catch (e) {
        status.innerText = "Couldn't revoke permissions. You must connect to ArSnap first.";
    }
});

getActiveAddrButton.addEventListener("click", async () => {
    try {
        // Obtain the current wallet's address.
        const address = await window.arweaveWallet.getActiveAddress();

        status.innerText = `The current active wallet's address is: ${address}`;
    } catch (e) {
        status.innerText =
            "Couldn't obtain the active wallet's address. Did you connect to ArSnap and " +
            "requested the required permissions?";
    }
});

signMsgButton.addEventListener("click", async () => {
    if (msgToSignInput.value.length === 0) {
        status.innerText = "Try writing some text inside the input before clicking this button.";
        return;
    }

    try {
        // The function `signBytes` allow us to sign an arbitrary array of data. This can be used
        // to sign anything, even transaction. Although for transactions, the Adapter includes a
        // specific helper function that accepts a transaction as a parameter sign it itself
        // internally using `signBytes`.
        const signedMessage = await window.arweaveWallet.signature(
            new TextEncoder().encode(msgToSignInput.value),
            { name: "RSA-PSS", saltLength: 0 },
        );

        console.log("Signed bytes:", signedMessage);

        status.innerText = "Message signed! The result has been printed to the console.";
    } catch (e) {
        status.innerText =
            "Couldn't sign the message. Did you connect to ArSnap and requested the " +
            "required permissions?";
    }
});
