# ArSnap Wallet

*ArSnap's official wallet.*

---

## Purpose

As MetaMask doesn't currently include a way of extending/modifying its UI through Snaps, we have to
come up with a separate solution in order to expose ArSnap functionnalities to users. ArSnap Wallet
is here to fill this role but it also serves other purposes:

1. It's aiming at becoming a full-fledged Arweave wallet allowing you to: manage Arweave keys, send
   AR, views all the transactions attached to a wallet, amongst other things

2. But it's also the main way through which you will be able to configure ArSnap, review how dApps
   you're connected to are using your keys, review the permissions you granted them, ...

3. While we want it to be the Wallet of reference for many things you'd need to do with ArSnap, all
   of its abilities are procured by the Adapter, which is what developers will use to integrate any
   dApp with ArSnap. So if you're eager to see how a dApp should integrate with ArSnap, the Wallet
   also serves as a complete example!

## Caution

The ArSnap project having not reached a stable state yet, the Wallet should only be used for
testing purposes. It is currently advised **not** to use it with existing wallets that currently
hold actual ARs. **The default gateway used by the wallet is the testnet at
<https://testnet.redstone.tools>.** However, if you feel adventurous, you can change the gateway to
<https://arweave.net> in the general settings page.

## Testing

The testnet's gateway (which is enabled by default for now) allows users to mint new ARs straight
into their wallet in order to test making transactions and interacting with the testnet. In order
to give yourself some fake ARs, visit this URL:

```
https://testnet.redstone.tools/mint/<your-wallet-address>/<amount-of-winston>
```

So for example:

```
https://testnet.redstone.tools/mint/u50tnPYCJK0Kuh6bL8u_EB3V6kjrytij2jkby83EMMg/1000000000000000
```

Will send 1000 AR to `u50tnPYCJK0Kuh6bL8u_EB3V6kjrytij2jkby83EMMg`.

## Hosted On The Permaweb

Thanks to the power of Arweave, every new versions of ArSnap Wallet will be uploaded to the
Permaweb, allowing you to rest assured that it will forever be available. The domain
<https://arsnap.org> will always redirect to the latest uploaded version.
