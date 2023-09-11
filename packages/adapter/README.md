# Adapter

[![discord](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fdiscord.com%2Fapi%2Finvites%2FhkHgXEKa%3Fwith_counts%3Dtrue&query=%24.approximate_presence_count&logo=discord&logoColor=white&label=discord&color=green)](https://discord.gg/NW5RqQP338)
[![adapter npm package](https://img.shields.io/npm/v/%40pianity%2Farsnap-adapter?logo=npm&label=%40pianity%2Farsnap-adapter)](https://www.npmjs.com/package/@pianity/arsnap-adapter)

The Adapter defines ArSnap's API and also exposes them through simple functions. If you want to
integrate ArSnap into your dApp without thinking about compatibility with the existing ArConnect's
API, you'll only need this package.

## Getting Started

The quickest way to get your hands dirty with the Adapter is by checking the example included here
in [the example folder](/packages/adapter/example). You can also learn about all the different
available functions by looking at [the documentation](/packages/adapter/docs/modules.md).

## Permission System

As you will notice in the example, ArSnap includes a permission system that restricts by default
what dApps can do. When connecting your dApp to ArSnap, in order to access the various API methods
provided by the Adapter, you will need to request the corresponding permissions via the
`requestPermission` function. Each functions listed in [the
documentation](/packages/adapter/docs/modules.md) have a `requires` field listing the permission(s)
that has to be requested in order to use them.
