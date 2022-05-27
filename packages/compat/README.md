# Compat

*Make ArSnap talk in ArConnect's language.*

---

If you already built a dApp that makes use of ArConnect's API, you might not be willing to add an
extra layer of complexity into your code to also support ArSnap users. Well rest assured, we got
you covered! The goal of this package is to allow you to continue using the same API you were using
to support ArConnect while also supporting ArSnap through a thin compatibility layer. It'll
effectively Expose ArSnap functionnalities through ArConnect's API.

## Try It Out

At the moment using this solution simply revolves around:

1. installing the package into your project by running `yarn add @pianity/arsnap-compat`,
2. importing it into your dApp's page with `import "@pianity/arsnap-compat"`.

What this will do for now is override the `arweaveWallet` object injected into the page by
ArConnect, filling its functions with calls to ArSnap.

## Caution

This Compatibility Layer is very much a PoC as of now. It currently only serves as a demonstration
that ArSnap can be 100% compatible with dApps developped with ArConnect in mind. However, as you
may have guessed, in its current form it will effectively prevent ArConnect users from using your
dApp. This obviously isn't a desirable behavior. We're looking for ways to allow either you or your
user to easily switch between ArSnap and ArConnect depending on what they want to use on your dApp.
