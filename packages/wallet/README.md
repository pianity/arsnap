# Arweave Wallet dApp

[![discord](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fdiscord.com%2Fapi%2Finvites%2FhkHgXEKa%3Fwith_counts%3Dtrue&query=%24.approximate_presence_count&logo=discord&logoColor=white&label=discord&color=green)](https://discord.gg/NW5RqQP338)

The dApp of reference to control every aspects of Arweave Wallet. Select your active wallet,
generate new ones, transfer ARs, manage your dApps permissions, and more!

## Purpose

As MetaMask doesn't currently include a way of extending/modifying its UI through Snaps, we have to
come up with a separate solution in order to expose Arweave Wallet functionnalities to users. The
Arweave Wallet dApp is here to fill this role but it also serves other purposes:

1. It's aiming at becoming a full-fledged Arweave wallet allowing you to: manage Arweave keys, send
   AR, views all the transactions attached to a wallet, amongst other things

2. But it's also the main way through which you will be able to configure Arweave Wallet, review how dApps
   you're connected to are using your keys, review the permissions you granted them, ...

3. While we want it to be the Wallet of reference for many things you'd need to do with Arweave
   Wallet, all
   of its abilities are procured by the Adapter, which is what developers will use to integrate any
   dApp with Arweave Wallet. So if you're eager to see how a dApp should integrate with Arweave Wallet, the Wallet
   also serves as a complete example!

## Hosted On The Permaweb

Thanks to the power of Arweave, every new versions of the Arweave Wallet dApp will be uploaded to
the Permaweb, allowing you to rest assured that it will forever be available. The domain
<https://arsnap.org> will always redirect to the latest uploaded version.

[![permanent on
Arweave](https://miro.medium.com/v2/resize:fit:316/0*OoKujZzU0ZmdVvt5)](https://arsnap.org)

## Testing with ArLocal

You can try sending ARs with Arweave Wallet without actually needing to have some by setting up a
local testnet. This is fortunately easy to do thanks to ArLocal, keep reading this section if you
want to know how.

To start a local Arweave testnet make sure NodeJS is installed on your machine then run the
command in a terminal:

```sh
npx arlocal
```

If it is the first time you run this command you'll be prompted whether you approve the
installation of the package, press enter to continue. You will know the testnet is correctly
running when the message "arlocal started on port 1984" is printed. Now, in order to use your local
testnet, head over to the general settings page and select the `localhost` gateway.

ArLocal allows users to mint new ARs straight into their wallet in order to test making
transactions and interacting with the testnet. In order to give yourself some fake ARs, visit this
URL:

```
https://localhost:1984/mint/<your-wallet-address>/<amount-of-winston>
```

So for example:

```
https://localhost:1984/mint/u50tnPYCJK0Kuh6bL8u_EB3V6kjrytij2jkby83EMMg/1000000000000000
```

Will send 1000 AR to `u50tnPYCJK0Kuh6bL8u_EB3V6kjrytij2jkby83EMMg`.
