[@pianity/arsnap-adapter](README.md) / Exports

# @pianity/arsnap-adapter

## Table of contents

### Type Aliases

-   [LogEntry](modules.md#logentry)
-   [RpcLogInfo](modules.md#rpcloginfo)
-   [RpcMethods](modules.md#rpcmethods)
-   [RpcParam](modules.md#rpcparam)
-   [RpcPermission](modules.md#rpcpermission)
-   [RpcResponse](modules.md#rpcresponse)

### Variables

-   [RPC_PERMISSIONS](modules.md#rpc_permissions)

### Functions

-   [clearLogs](modules.md#clearlogs)
-   [connect](modules.md#connect)
-   [deleteWallet](modules.md#deletewallet)
-   [getActiveAddress](modules.md#getactiveaddress)
-   [getActivePublicKey](modules.md#getactivepublickey)
-   [getAllAddresses](modules.md#getalladdresses)
-   [getDappsPermissions](modules.md#getdappspermissions)
-   [getLogs](modules.md#getlogs)
-   [getPermissions](modules.md#getpermissions)
-   [getWalletNames](modules.md#getwalletnames)
-   [importWallet](modules.md#importwallet)
-   [isEnabled](modules.md#isenabled)
-   [isUnlocked](modules.md#isunlocked)
-   [renameWallet](modules.md#renamewallet)
-   [requestPermissions](modules.md#requestpermissions)
-   [revokeAllPermissions](modules.md#revokeallpermissions)
-   [revokeDappPermission](modules.md#revokedapppermission)
-   [revokePermission](modules.md#revokepermission)
-   [sendWinstonTo](modules.md#sendwinstonto)
-   [setActiveAddress](modules.md#setactiveaddress)
-   [signBytes](modules.md#signbytes)
-   [signTx](modules.md#signtx)

## Type Aliases

### LogEntry

Ƭ **LogEntry**: `Object`

#### Type declaration

| Name        | Type                                  |
| :---------- | :------------------------------------ |
| `info`      | [`RpcLogInfo`](modules.md#rpcloginfo) |
| `origin`    | `string`                              |
| `timestamp` | `number`                              |

#### Defined in

[types.ts:3](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L3)

---

### RpcLogInfo

Ƭ **RpcLogInfo**: { [K in keyof RpcMethods]: Object[K] & { [K in keyof RpcMethods]: Object }[K] }[keyof [`RpcMethods`](modules.md#rpcmethods)]

#### Defined in

[types.ts:40](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L40)

---

### RpcMethods

Ƭ **RpcMethods**: `Object`

#### Type declaration

| Name                      | Type                                                                                                                             |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------- |
| `clear_logs`              | () => `Promise`<`null`\>                                                                                                         |
| `delete_wallet`           | (`address`: `string`) => `Promise`<`null`\>                                                                                      |
| `get_active_address`      | () => `Promise`<`string`\>                                                                                                       |
| `get_active_public_key`   | () => `Promise`<`string`\>                                                                                                       |
| `get_all_addresses`       | () => `Promise`<`string`[]\>                                                                                                     |
| `get_dapps_permissions`   | () => `Promise`<[dappOrigin: string, permissions: RpcPermission[]][]\>                                                           |
| `get_logs`                | () => `Promise`<[dappOrigin: string, logs: LogEntry[]][]\>                                                                       |
| `get_permissions`         | () => `Promise`<[`RpcPermission`](modules.md#rpcpermission)[]\>                                                                  |
| `get_wallet_names`        | () => `Promise`<[address: string, name: string][]\>                                                                              |
| `import_wallet`           | (`wallet`: `JWKInterface`, `name?`: `string`) => `Promise`<{ `address`: `string` ; `name`: `string` }\>                          |
| `is_enabled`              | () => `Promise`<`boolean`\>                                                                                                      |
| `rename_wallet`           | (`address`: `string`, `name`: `string`) => `Promise`<`null`\>                                                                    |
| `request_permissions`     | (`permissions`: [`RpcPermission`](modules.md#rpcpermission)[]) => `Promise`<`"granted"` \| `"already_granted"` \| `"declined"`\> |
| `revoke_all_permissions`  | () => `Promise`<`null`\>                                                                                                         |
| `revoke_dapp_permissions` | (`dappOrigin`: `string`, `permissions`: [`RpcPermission`](modules.md#rpcpermission)[]) => `Promise`<`null`\>                     |
| `revoke_permissions`      | (`permissions`: [`RpcPermission`](modules.md#rpcpermission)[]) => `Promise`<`null`\>                                             |
| `set_active_address`      | (`address`: `string`) => `Promise`<`null`\>                                                                                      |
| `sign_bytes`              | (`bytes`: `Uint8Array`, `saltLength`: `number`) => `Promise`<`Uint8Array`\>                                                      |

#### Defined in

[types.ts:9](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L9)

---

### RpcParam

Ƭ **RpcParam**: { [K in keyof RpcMethods]: Object }[keyof [`RpcMethods`](modules.md#rpcmethods)]

#### Defined in

[types.ts:100](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L100)

---

### RpcPermission

Ƭ **RpcPermission**: `Exclude`<{ [K in keyof RpcMethods]: typeof RPC_PERMISSIONS[K] }[keyof typeof [`RPC_PERMISSIONS`](modules.md#rpc_permissions)], `null`\>

#### Defined in

[types.ts:93](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L93)

---

### RpcResponse

Ƭ **RpcResponse**: { [K in keyof RpcMethods]: ReturnType<RpcMethods[K]\> }[keyof [`RpcMethods`](modules.md#rpcmethods)]

#### Defined in

[types.ts:104](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L104)

## Variables

### RPC_PERMISSIONS

• `Const` **RPC_PERMISSIONS**: `Object`

#### Type declaration

| Name                      | Type                        |
| :------------------------ | :-------------------------- |
| `clear_logs`              | `"CLEAR_LOGS"`              |
| `delete_wallet`           | `"DELETE_WALLET"`           |
| `get_active_address`      | `"GET_ACTIVE_ADDRESS"`      |
| `get_active_public_key`   | `"GET_ACTIVE_PUBLIC_KEY"`   |
| `get_all_addresses`       | `"GET_ALL_ADDRESSES"`       |
| `get_dapps_permissions`   | `"GET_DAPPS_PERMISSIONS"`   |
| `get_logs`                | `"GET_LOGS"`                |
| `get_permissions`         | `null`                      |
| `get_wallet_names`        | `"GET_ALL_ADDRESSES"`       |
| `import_wallet`           | `"IMPORT_WALLET"`           |
| `is_enabled`              | `null`                      |
| `rename_wallet`           | `"RENAME_WALLET"`           |
| `request_permissions`     | `null`                      |
| `revoke_all_permissions`  | `null`                      |
| `revoke_dapp_permissions` | `"REVOKE_DAPP_PERMISSIONS"` |
| `revoke_permissions`      | `null`                      |
| `set_active_address`      | `"SET_ACTIVE_ADDRESS"`      |
| `sign_bytes`              | `"SIGN"`                    |

#### Defined in

[types.ts:68](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L68)

## Functions

### clearLogs

▸ **clearLogs**(): `Promise`<`null`\>

#### Returns

`Promise`<`null`\>

**`Requires`**

"CLEAR_LOGS"

#### Defined in

[types.ts:36](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L36)

---

### connect

▸ **connect**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[metamask.ts:50](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/metamask.ts#L50)

---

### deleteWallet

▸ **deleteWallet**(`address`): `Promise`<`null`\>

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `address` | `string` |

#### Returns

`Promise`<`null`\>

**`Requires`**

"DELETE_WALLET"

#### Defined in

[types.ts:33](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L33)

---

### getActiveAddress

▸ **getActiveAddress**(): `Promise`<`string`\>

Get the address of the currently active wallet.

#### Returns

`Promise`<`string`\>

**`Requires`**

"GET_ACTIVE_ADDRESS"

#### Defined in

[types.ts:21](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L21)

---

### getActivePublicKey

▸ **getActivePublicKey**(): `Promise`<`string`\>

Get the public key of the currently active wallet.

#### Returns

`Promise`<`string`\>

**`Requires`**

"GET_ACTIVE_PUBLIC_KEY"

#### Defined in

[types.ts:22](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L22)

---

### getAllAddresses

▸ **getAllAddresses**(): `Promise`<`string`[]\>

Get addresses for all the stored wallets.

#### Returns

`Promise`<`string`[]\>

**`Requires`**

"GET_ALL_ADDRESSES"

#### Defined in

[types.ts:23](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L23)

---

### getDappsPermissions

▸ **getDappsPermissions**(): `Promise`<[dappOrigin: string, permissions: RpcPermission[]][]\>

Get permisssions granted for all dApps.

#### Returns

`Promise`<[dappOrigin: string, permissions: RpcPermission[]][]\>

**`Requires`**

"GET_DAPPS_PERMISSIONS"

#### Defined in

[types.ts:18](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L18)

---

### getLogs

▸ **getLogs**(): `Promise`<[dappOrigin: string, logs: LogEntry[]][]\>

#### Returns

`Promise`<[dappOrigin: string, logs: LogEntry[]][]\>

**`Requires`**

"GET_LOGS"

#### Defined in

[types.ts:35](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L35)

---

### getPermissions

▸ **getPermissions**(): `Promise`<[`RpcPermission`](modules.md#rpcpermission)[]\>

Get the permissions granted to current dApp.

#### Returns

`Promise`<[`RpcPermission`](modules.md#rpcpermission)[]\>

#### Defined in

[types.ts:12](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L12)

---

### getWalletNames

▸ **getWalletNames**(): `Promise`<[address: string, name: string][]\>

Get all the addresses and their names.

#### Returns

`Promise`<[address: string, name: string][]\>

**`Requires`**

"GET_ALL_ADDRESSES"

#### Defined in

[types.ts:24](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L24)

---

### importWallet

▸ **importWallet**(`wallet`, `name?`): `Promise`<{ `address`: `string` ; `name`: `string` }\>

#### Parameters

| Name     | Type           |
| :------- | :------------- |
| `wallet` | `JWKInterface` |
| `name?`  | `string`       |

#### Returns

`Promise`<{ `address`: `string` ; `name`: `string` }\>

**`Requires`**

"IMPORT_WALLET"

#### Defined in

[types.ts:28](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L28)

---

### isEnabled

▸ **isEnabled**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

[types.ts:10](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L10)

---

### isUnlocked

▸ **isUnlocked**(`timeout?`): `Promise`<`boolean` \| `"timeout"`\>

WARNING: This function relies on an experimental Metamask API.

#### Parameters

| Name      | Type     | Default value |
| :-------- | :------- | :------------ |
| `timeout` | `number` | `5`           |

#### Returns

`Promise`<`boolean` \| `"timeout"`\>

#### Defined in

[metamask.ts:39](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/metamask.ts#L39)

---

### renameWallet

▸ **renameWallet**(`address`, `name`): `Promise`<`null`\>

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `address` | `string` |
| `name`    | `string` |

#### Returns

`Promise`<`null`\>

**`Requires`**

"RENAME_WALLET"

#### Defined in

[types.ts:32](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L32)

---

### requestPermissions

▸ **requestPermissions**(`permissions`): `Promise`<`"granted"` \| `"already_granted"` \| `"declined"`\>

Request permissions for the current dApp.

#### Parameters

| Name          | Type                                          |
| :------------ | :-------------------------------------------- |
| `permissions` | [`RpcPermission`](modules.md#rpcpermission)[] |

#### Returns

`Promise`<`"granted"` \| `"already_granted"` \| `"declined"`\>

#### Defined in

[types.ts:13](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L13)

---

### revokeAllPermissions

▸ **revokeAllPermissions**(): `Promise`<`null`\>

Revoke all the granted permissions for the current dApp.

#### Returns

`Promise`<`null`\>

#### Defined in

[types.ts:17](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L17)

---

### revokeDappPermission

▸ **revokeDappPermission**(`dappOrigin`, `permissions`): `Promise`<`null`\>

Revoke permissions for the specified dApp.

#### Parameters

| Name          | Type                                          |
| :------------ | :-------------------------------------------- |
| `dappOrigin`  | `string`                                      |
| `permissions` | [`RpcPermission`](modules.md#rpcpermission)[] |

#### Returns

`Promise`<`null`\>

**`Requires`**

"REVOKE_DAPP_PERMISSIONS"

#### Defined in

[types.ts:19](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L19)

---

### revokePermission

▸ **revokePermission**(`permissions`): `Promise`<`null`\>

Revoke permissions for the current dApp.

#### Parameters

| Name          | Type                                          |
| :------------ | :-------------------------------------------- |
| `permissions` | [`RpcPermission`](modules.md#rpcpermission)[] |

#### Returns

`Promise`<`null`\>

#### Defined in

[types.ts:16](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L16)

---

### sendWinstonTo

▸ **sendWinstonTo**(`arweave`, `winston`, `recipient`): `Promise`<`void`\>

Send `winston` winstons using the current active wallet.

#### Parameters

| Name        | Type      | Description                                                |
| :---------- | :-------- | :--------------------------------------------------------- |
| `arweave`   | `default` | Arweave client used to send the transaction                |
| `winston`   | `string`  | Amount of winstons to send (1 winston = 0.000000000001 AR) |
| `recipient` | `string`  | Address that should receive the winstons                   |

#### Returns

`Promise`<`void`\>

**`Requires`**

-   ["GET_ACTIVE_PUBLIC_KEY", "SIGN"]

#### Defined in

[helpers.ts:50](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/helpers.ts#L50)

---

### setActiveAddress

▸ **setActiveAddress**(`address`): `Promise`<`null`\>

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `address` | `string` |

#### Returns

`Promise`<`null`\>

**`Requires`**

"SET_ACTIVE_ADDRESS"

#### Defined in

[types.ts:27](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L27)

---

### signBytes

▸ **signBytes**(`bytes`, `saltLength`): `Promise`<`Uint8Array`\>

Sign bytes with the currently active wallet.

#### Parameters

| Name         | Type         |
| :----------- | :----------- |
| `bytes`      | `Uint8Array` |
| `saltLength` | `number`     |

#### Returns

`Promise`<`Uint8Array`\>

**`Requires`**

"SIGN"

#### Defined in

[types.ts:25](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/types.ts#L25)

---

### signTx

▸ **signTx**(`tx`): `Promise`<`void`\>

Sign a transaction with the current active wallet.

#### Parameters

| Name | Type      | Description             |
| :--- | :-------- | :---------------------- |
| `tx` | `default` | The transaction to sign |

#### Returns

`Promise`<`void`\>

**`Requires`**

-   ["GET_ACTIVE_PUBLIC_KEY", "SIGN"]

#### Defined in

[helpers.ts:21](https://github.com/pianity/arsnap/blob/bc25249/packages/adapter/src/helpers.ts#L21)
