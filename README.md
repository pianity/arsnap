# ArSnap Project

*Empowering users and developers to integrate Arweave into their favorite wallet and dApps.*

---

This repository is home to multiple packages allowing developers to access Arweave through
MetaMask. It is made possible by MetaMask's Flask experimental *Snaps* feature which is basically a
plugin system implemented into MetaMask. It enables developers to write JS code that will run
inside MetaMask while benefiting from its API in order to expand its capabilities. To learn more
about Snaps, head over to <https://docs.metamask.io/guide/snaps.html>.

## The Project

In the packages directory you'll find the 4 key pieces composing the ArSnap Project, making
possible the use of MetaMask for existing and new Arweave dApps. Below is a quick summary of each
of them, describing their relations and their purpose. If you want to quickly start playing
ArSnap's API you can take a look at [this simple example](packages/adapter/example).

### [ArSnap](packages/arsnap)

ArSnap is the core of the project, it's the code that will ultimately run inside MetaMask.

### [Adapter](packages/adapter)

If you're building a new dApp or want to integrate with ArSnap specifically, this is what you'll be
using. It defines ArSnap's API and exposes its many methods in a simple and clean way.

### [Compat](packages/compat)(ibility Layer)

What if you've already built a dApp that integrates with the existing Arweave wallet ArConnect?
Thanks to this package you'll be able to give your users the possibility to benefit from ArSnap
without any extra work on your part. It basically allows you to use the exact same API that you
were already using with ArConnect, to communicate with ArSnap.

### [Wallet](packages/wallet)

All of this wouldn't be very useful if users weren't able to interact with it. ArSnap's Wallet is
the reference Wallet for ArSnap, exposing all of its functionalities to users. To put it simply:
it's to Arweave what MetaMask is to Ethereum. [Learn more](packages/wallet).
