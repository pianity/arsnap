# Compat

[![discord](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fdiscord.com%2Fapi%2Finvites%2FhkHgXEKa%3Fwith_counts%3Dtrue&query=%24.approximate_presence_count&logo=discord&logoColor=white&label=discord&color=green)](https://discord.gg/NW5RqQP338)
[![compat npm package](https://img.shields.io/npm/v/%40pianity%2Farsnap-compat?logo=npm&label=%40pianity%2Farsnap-compat)](https://www.npmjs.com/package/@pianity/arsnap-compat)

If you already built a dApp that makes use of ArConnect's API, you might not be willing to add an
extra layer of complexity into your code to also support Arweave Wallet users. Well rest assured,
we got you covered! The goal of this package is to allow you to continue using the same API you
were using to support ArConnect while also supporting Arweave Wallet through a thin compatibility
layer. It'll effectively Expose Arweave Wallet functionnalities through ArConnect's API.

## Try it

At the moment using this solution simply revolves around:

1. installing the package into your project by running `yarn add @pianity/arsnap-compat`,
2. importing it into your dApp's page with `import "@pianity/arsnap-compat"`.

What this will do for now is override the `arweaveWallet` object injected into the page by
ArConnect, filling its functions with calls to Arweave Wallet.

## Caution

This compatibility layer is very much a PoC as of now. It currently only serves as a demonstration
that Arweave Wallet can be 100% compatible with dApps developped with ArConnect in mind. However,
as you may have guessed, in its current form it will effectively prevent ArConnect users from using
your dApp. This obviously isn't a desirable behavior. We're looking for ways to allow either you or
your user to easily switch between Arweave Wallet and ArConnect depending on what they want to use
on your dApp.
