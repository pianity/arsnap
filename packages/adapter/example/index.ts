import * as adapter from "@pianity/arsnap-adapter";

const connectButton = document.getElementById("connect") as HTMLButtonElement;
const requestPermsButton = document.getElementById("request-permissions") as HTMLButtonElement;
const revokePermsButton = document.getElementById("revoke-permissions") as HTMLButtonElement;
const getActiveAddrButton = document.getElementById("get-active-address") as HTMLButtonElement;
const signMsgButton = document.getElementById("sign-message") as HTMLButtonElement;
const msgToSignInput = document.getElementById("message-to-sign") as HTMLInputElement;
const status = document.getElementById("status") as HTMLParagraphElement;

// Define the permissions required by our dApp (more on this later).
const PERMISSIONS: adapter.RpcPermission[] = ["GET_ACTIVE_ADDRESS", "SIGN"];

window.onload = async () => {
    // Verify whether this dApp is already connected to ArSnap.
    if (await adapter.isEnabled()) {
        status.innerText = "Welcome back :)";
    } else {
        status.innerText = "Click the Connect button below to connect to ArSnap.";
    }
};

connectButton.addEventListener("click", async () => {
    try {
        // The first step to start using ArSnap is to connect to it. This will trigger MetaMask to
        // ask for the user's authorization to allow the dApp to connect to ArSnap. It will also
        // asks the user if they want ArSnap to be installed, if it weren't already.

        await adapter.connect();

        status.innerText = "Connection successful!";
    } catch (e) {
        // The `connect` function will throw if the user decline the connection or if the proper
        // MetaMask version isn't installed.

        if (
            // This will evaluate to true if the user don't have the right MetaMask version
            // installed.
            (e as any).code === -32601 ||
            // The following check wether MetaMask is installed at all.
            !window.ethereum ||
            !window.ethereum.isMetaMask
        ) {
            // Prompt the user to install MetaMask Flask.
            const link = document.createElement("a") as HTMLAnchorElement;
            link.target = "_blank";
            link.href = "https://metamask.io/flask";
            link.text = "Please install MetaMask Flask first.";

            status.innerHTML = link.outerHTML;
        } else {
            status.innerText = "The connection to ArSnap was declined.";
        }
    }
});

requestPermsButton.addEventListener("click", async () => {
    try {
        // Request the permissions that we'll need for our dApp. We should get a boolean in return,
        // letting us know whether the user granted us the permissions or not.
        const granted = await adapter.requestPermissions(PERMISSIONS);

        if (granted) {
            status.innerText = "Permissions granted. You can try to sign a message now!";
        } else {
            status.innerText = "Permissions declined.";
        }
    } catch {
        status.innerText = "Couldn't request permissions. You must connect to ArSnap first.";
    }
});

revokePermsButton.addEventListener("click", async () => {
    try {
        // Revoke the permissions that we previously requested.
        await adapter.revokePermission(PERMISSIONS);

        status.innerText = "All permissions revoked.";
    } catch (e) {
        status.innerText = "Couldn't revoke permissions. You must connect to ArSnap first.";
    }
});

getActiveAddrButton.addEventListener("click", async () => {
    try {
        // Obtain the current wallet's address.
        const address = await adapter.getActiveAddress();

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
        const signedMessage = await adapter.signBytes(
            new TextEncoder().encode(msgToSignInput.value),
            0,
        );

        console.log("Signed bytes:", signedMessage);

        status.innerText = "Message signed! The result has been printed to the console.";
    } catch (e) {
        status.innerText =
            "Couldn't sign the message. Did you connect to ArSnap and requested the " +
            "required permissions?";
    }
});
