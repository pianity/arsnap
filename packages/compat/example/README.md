# Simple Example Using Compat

This is a clone of [the Adapter's example](/packages/adapter/example) but using ArConnect's API
with Compat. Its purpose is to demonstrate that no extra work will be necessary for existing
dApps already supporting ArConnect to add support to ArSnap. If you want to learn about ArSnap's
API, check out the Adapter's example.

## Test It Yourself

Run the following commands in your terminal:

1. `git clone https://github.com/pianity/arsnap`
2. `cd arsnap`
3. `yarn install`
4. `cd packages/compat`
5. `yarn example`

You should now be able to head over to <http://localhost:3000/> and start playing with the example!
Try to comment [line 3](/packages/compat/example/index.ts#L3) to use ArConnect and uncomment to use
ArSnap, the page should refresh automatically.
