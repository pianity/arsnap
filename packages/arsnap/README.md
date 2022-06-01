# ArSnap

*The project's core*

---

ArSnap, as the name suggests, is a MetaMask Snap - a completely isolated plugin that runs securely
inside MetaMask. It can be seen as the brain of the whole project: it's what will do the actual
work when you use [the Adapter](/packages/adapter) to sign a transaction, for example. Its only
interactions outside of its isolated environment are made possible by MetaMask's RPC API. It also
implements its own, allowing developers to interact with it, that is made transparently available
through the Adapter.

## Start building

To learn how to start building around ArSnap, head over to [the Adapter](/packages/adapter)
directory!
