# Adapter

*The door to ArSnap awesomeness.*

---

The Adapter defines ArSnap's API and also exposes them. If you want to integrate ArSnap into your
dApp without thinking about compatibility with the existing ArConnect's API, you'll only need this
package.

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
