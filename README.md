# Arweave Wallet for MetaMask (ArSnap)

[![discord](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fdiscord.com%2Fapi%2Finvites%2FhkHgXEKa%3Fwith_counts%3Dtrue&query=%24.approximate_presence_count&logo=discord&logoColor=white&label=discord&color=green)](https://discord.gg/NW5RqQP338)
[![arsnap npm package](https://img.shields.io/npm/v/%40pianity%2Farsnap?logo=npm&label=%40pianity%2Farsnap)](https://www.npmjs.com/package/@pianity/arsnap)
[![adapter npm package](https://img.shields.io/npm/v/%40pianity%2Farsnap-adapter?logo=npm&label=%40pianity%2Farsnap-adapter)](https://www.npmjs.com/package/@pianity/arsnap-adapter)
[![compat npm package](https://img.shields.io/npm/v/%40pianity%2Farsnap-compat?logo=npm&label=%40pianity%2Farsnap-compat)](https://www.npmjs.com/package/@pianity/arsnap-compat)

Arweave Wallet enables everyone to use MetaMask, the ubiquitous Ethereum wallet, to access the
Arweave ecosystem. It is made possible by the [MetaMask Snaps](https://metamask.io/snaps) feature
which is basically a plugin system for MetaMask. It enables developers to write JS code that will
run inside MetaMask while benefiting from its API in order to expand its capabilities.

## The Arweave Wallet Project

This repository is home to four packages:

- [arsnap](/packages/arsnap): Also known as Arweave Wallet, is the Snap that runs inside MetaMask.

- [adapter](/packages/adapter): The Adapter defines the various functions that Arweave Wallet
implements, and exposes them to developers so they can easily interact with it. It also contains
helper functions to make some tasks - like signing transactions - more convenient.

- [wallet](/packages/wallet): The Wallet dApp allows end users to control every aspects of Arweave
Wallet, through a slick and intuitive interface: select what wallet to use when interacting with
other dApps, creating new wallets, sending ARs, and more in the future. Every new versions of the
Wallet dApp is uploaded to Arweave and accessible at <https://arsnap.org>.

- [compat](/packages/compat): An experimental compatibility layer, allowing developpers that
already integrate with ArConnect to be automatically compatible with Arweave Wallet.

## Getting Started

The easiest way to start experimenting with Arweave Wallet as a dApp developper is to build the
project and start fiddling with the example included in the Adapter's.

Start by setting up the project dependencies:

```bash
yarn install
```

Then build the Adapter in development mode and start its example:

```bash
# in packages/adapter
yarn build-dev
yarn example
```

And finally, build the Snap and start its development server:

```bash
# in packages/arsnap
yarn build-dev
yarn dev
```

You should now be able to go to <http://localhost:5173> (or the URL provided when running `yarn
example`) to try out the example. While the Adapter's example dev server is running you can go in
[packages/adapter/example](/packages/adapter/example) and edit
[`index.ts`](/packages/adapter/example/index.ts) to play with the API; the example's page will
automatically reload with your changes.
