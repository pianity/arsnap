# ArSnap Project

*Empowering users and developers to integrate Arweave into their favorite wallet and dApps.*

---

This repository is home to multiple packages allowing developers to access Arweave through
MetaMask. It is made possible by MetaMask's Flask experimental *Snaps* feature which is basically a
plugin system implemented into MetaMask. It enables developers to write JS code that will run
inside MetaMask while benefiting from its API in order to expand its capabilities. To learn more
about Snaps, head over to <https://docs.metamask.io/guide/snaps.html>.

## The Project

The ArSnap Project is composed of 4 key pieces making possible the use of MetaMask for existing and
new Arweave dApps. Below is a quick summary of each of them, describing their relations and their
purpose. If you want to take a peak at the API and learn how to integrate ArSnap to your dApp,
[follow this link](packages/adapter/README.md).

### ArSnap

**TODO:** mention permission system

ArSnap is the core of the project, it's the code that will ultimately run inside MetaMask.

### Adapter

If you're building a new dApp or want to integrate with ArSnap specifically, this is what you'll be
using. It defines ArSnap's API and exposes its many methods in a simple and clean way.

### Compat(ibility Layer)

What if you've already built a dApp that integrates with the existing Arweave wallet ArConnect?
Thanks to this package you'll be able to give your users the possibility to benefit from ArSnap
without any extra work on your part. It basically allows you to use the exact same API that you
were already using with ArConnect, to communicate with ArSnap.

### Wallet

**TODO:** mention how the Wallet is requiring the user to give it total control over their ArSnap
wallet and how security concerns are mitigated by uploading it to the permaweb and making its code
public.

All of this wouldn't be very useful if users weren't able to interact with it. ArSnap's Wallet is
the reference Wallet for ArSnap, exposing all of its functionalities to users. To put it simply:
it's to Arweave what MetaMask is to Ethereum. It actually serves different purposes:

1. It's aiming at becoming a full-fledged Arweave wallet, allowing you to manage Arweave keys, send
   AR, views their transactions...

2. But it's also the main way through which you will be able to configure ArSnap, review how dApps
   you're connected to are using your keys, etc.

3. While we want it to be the Wallet of reference for many things you'd need to do with ArSnap, all
   of its abilities are procured by the Adapter, which is what developers will use to integrate any
   dApp with ArSnap. So if you're eager to see how a dApp should integrate with ArSnap, the Wallet
   also serves as a perfect example!
