// wallet.registerRpcMessageHandler(async (originString, requestObject) => {
//     console.log("I AM SNAP", originString, requestObject);
//
//     switch (requestObject.method) {
//         case "ar_hello":
//             return wallet.request({
//                 method: "snap_confirm",
//                 params: [{ prompt: `Hello, ${originString}!` }],
//             });
//         default:
//             throw new Error("Method not found.");
//     }
// });

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
    switch (requestObject.method) {
        case "hello":
            return wallet.request({
                method: "snap_confirm",
                params: [{ prompt: `Hello, ${originString}!` }],
            });
        default:
            throw new Error("Method not found.");
    }
});
