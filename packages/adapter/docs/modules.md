[@pianity/arsnap-adapter](README.md) / Exports

# @pianity/arsnap-adapter

## Table of contents

### Type Aliases

- [LogEntry](modules.md#logentry)
- [RpcLogInfo](modules.md#rpcloginfo)
- [RpcMethods](modules.md#rpcmethods)
- [RpcParam](modules.md#rpcparam)
- [RpcPermission](modules.md#rpcpermission)
- [RpcResponse](modules.md#rpcresponse)

### Variables

- [RPC\_PERMISSIONS](modules.md#rpc_permissions)

### Functions

- [clearLogs](modules.md#clearlogs)
- [connect](modules.md#connect)
- [deleteWallet](modules.md#deletewallet)
- [getActiveAddress](modules.md#getactiveaddress)
- [getActivePublicKey](modules.md#getactivepublickey)
- [getAllAddresses](modules.md#getalladdresses)
- [getDappsPermissions](modules.md#getdappspermissions)
- [getLogs](modules.md#getlogs)
- [getPermissions](modules.md#getpermissions)
- [getWalletNames](modules.md#getwalletnames)
- [importWallet](modules.md#importwallet)
- [isEnabled](modules.md#isenabled)
- [isUnlocked](modules.md#isunlocked)
- [renameWallet](modules.md#renamewallet)
- [requestPermissions](modules.md#requestpermissions)
- [revokeAllPermissions](modules.md#revokeallpermissions)
- [revokeDappPermission](modules.md#revokedapppermission)
- [revokePermission](modules.md#revokepermission)
- [sendWinstonTo](modules.md#sendwinstonto)
- [setActiveAddress](modules.md#setactiveaddress)
- [signBytes](modules.md#signbytes)
- [signTx](modules.md#signtx)

## Type Aliases

### LogEntry

Ƭ **LogEntry**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `info` | [`RpcLogInfo`](modules.md#rpcloginfo) |
| `origin` | `string` |
| `timestamp` | `number` |

#### Defined in

[types.ts:3](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L3)

___

### RpcLogInfo

Ƭ **RpcLogInfo**: { [K in keyof RpcMethods]: Object[K] & { [K in keyof RpcMethods]: Object }[K] }[keyof [`RpcMethods`](modules.md#rpcmethods)]

#### Defined in

[types.ts:38](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L38)

___

### RpcMethods

Ƭ **RpcMethods**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `clear_logs` | () => `Promise`<``null``\> |
| `delete_wallet` | (`address`: `string`) => `Promise`<``null``\> |
| `get_active_address` | () => `Promise`<`string`\> |
| `get_active_public_key` | () => `Promise`<`string`\> |
| `get_all_addresses` | () => `Promise`<`string`[]\> |
| `get_dapps_permissions` | () => `Promise`<[dappOrigin: string, permissions: RpcPermission[]][]\> |
| `get_logs` | () => `Promise`<[dappOrigin: string, logs: LogEntry[]][]\> |
| `get_permissions` | () => `Promise`<[`RpcPermission`](modules.md#rpcpermission)[]\> |
| `get_wallet_names` | () => `Promise`<[address: string, name: string][]\> |
| `import_wallet` | (`wallet`: `JWKInterface`, `name?`: `string`) => `Promise`<{ `address`: `string` ; `name`: `string`  }\> |
| `is_enabled` | () => `Promise`<`boolean`\> |
| `rename_wallet` | (`address`: `string`, `name`: `string`) => `Promise`<``null``\> |
| `request_permissions` | (`permissions`: [`RpcPermission`](modules.md#rpcpermission)[]) => `Promise`<`boolean`\> |
| `revoke_all_permissions` | () => `Promise`<``null``\> |
| `revoke_dapp_permissions` | (`dappOrigin`: `string`, `permissions`: [`RpcPermission`](modules.md#rpcpermission)[]) => `Promise`<``null``\> |
| `revoke_permissions` | (`permissions`: [`RpcPermission`](modules.md#rpcpermission)[]) => `Promise`<``null``\> |
| `set_active_address` | (`address`: `string`) => `Promise`<``null``\> |
| `sign_bytes` | (`bytes`: `Uint8Array`, `saltLength`: `number`) => `Promise`<`Uint8Array`\> |

#### Defined in

[types.ts:9](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L9)

___

### RpcParam

Ƭ **RpcParam**: { [K in keyof RpcMethods]: Object }[keyof [`RpcMethods`](modules.md#rpcmethods)]

#### Defined in

[types.ts:98](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L98)

___

### RpcPermission

Ƭ **RpcPermission**: `Exclude`<{ [K in keyof RpcMethods]: typeof RPC\_PERMISSIONS[K] }[keyof typeof [`RPC_PERMISSIONS`](modules.md#rpc_permissions)], ``null``\>

#### Defined in

[types.ts:91](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L91)

___

### RpcResponse

Ƭ **RpcResponse**: { [K in keyof RpcMethods]: ReturnType<RpcMethods[K]\> }[keyof [`RpcMethods`](modules.md#rpcmethods)]

#### Defined in

[types.ts:102](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L102)

## Variables

### RPC\_PERMISSIONS

• `Const` **RPC\_PERMISSIONS**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `clear_logs` | ``"CLEAR_LOGS"`` |
| `delete_wallet` | ``"DELETE_WALLET"`` |
| `get_active_address` | ``"GET_ACTIVE_ADDRESS"`` |
| `get_active_public_key` | ``"GET_ACTIVE_PUBLIC_KEY"`` |
| `get_all_addresses` | ``"GET_ALL_ADDRESSES"`` |
| `get_dapps_permissions` | ``"GET_DAPPS_PERMISSIONS"`` |
| `get_logs` | ``"GET_LOGS"`` |
| `get_permissions` | ``null`` |
| `get_wallet_names` | ``"GET_ALL_ADDRESSES"`` |
| `import_wallet` | ``"IMPORT_WALLET"`` |
| `is_enabled` | ``null`` |
| `rename_wallet` | ``"RENAME_WALLET"`` |
| `request_permissions` | ``null`` |
| `revoke_all_permissions` | ``null`` |
| `revoke_dapp_permissions` | ``"REVOKE_DAPP_PERMISSIONS"`` |
| `revoke_permissions` | ``null`` |
| `set_active_address` | ``"SET_ACTIVE_ADDRESS"`` |
| `sign_bytes` | ``"SIGN"`` |

#### Defined in

[types.ts:66](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L66)

## Functions

### clearLogs

▸ **clearLogs**(): `Promise`<``null``\>

**`Requires`**

"CLEAR_LOGS"

#### Returns

`Promise`<``null``\>

#### Defined in

[types.ts:34](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L34)

___

### connect

▸ **connect**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[metamask.ts:50](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/metamask.ts#L50)

___

### deleteWallet

▸ **deleteWallet**(`address`): `Promise`<``null``\>

**`Requires`**

"DELETE_WALLET"

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<``null``\>

#### Defined in

[types.ts:31](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L31)

___

### getActiveAddress

▸ **getActiveAddress**(): `Promise`<`string`\>

Get the address of the currently active wallet.

**`Requires`**

"GET_ACTIVE_ADDRESS"

#### Returns

`Promise`<`string`\>

#### Defined in

[types.ts:19](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L19)

___

### getActivePublicKey

▸ **getActivePublicKey**(): `Promise`<`string`\>

Get the public key of the currently active wallet.

**`Requires`**

"GET_ACTIVE_PUBLIC_KEY"

#### Returns

`Promise`<`string`\>

#### Defined in

[types.ts:20](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L20)

___

### getAllAddresses

▸ **getAllAddresses**(): `Promise`<`string`[]\>

Get addresses for all the stored wallets.

**`Requires`**

"GET_ALL_ADDRESSES"

#### Returns

`Promise`<`string`[]\>

#### Defined in

[types.ts:21](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L21)

___

### getDappsPermissions

▸ **getDappsPermissions**(): `Promise`<[dappOrigin: string, permissions: RpcPermission[]][]\>

Get permisssions granted for all dApps.

**`Requires`**

"GET_DAPPS_PERMISSIONS"

#### Returns

`Promise`<[dappOrigin: string, permissions: RpcPermission[]][]\>

#### Defined in

[types.ts:16](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L16)

___

### getLogs

▸ **getLogs**(): `Promise`<[dappOrigin: string, logs: LogEntry[]][]\>

**`Requires`**

"GET_LOGS"

#### Returns

`Promise`<[dappOrigin: string, logs: LogEntry[]][]\>

#### Defined in

[types.ts:33](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L33)

___

### getPermissions

▸ **getPermissions**(): `Promise`<[`RpcPermission`](modules.md#rpcpermission)[]\>

Get the permissions granted to current dApp.

#### Returns

`Promise`<[`RpcPermission`](modules.md#rpcpermission)[]\>

#### Defined in

[types.ts:12](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L12)

___

### getWalletNames

▸ **getWalletNames**(): `Promise`<[address: string, name: string][]\>

Get all the addresses and their names.

**`Requires`**

"GET_ALL_ADDRESSES"

#### Returns

`Promise`<[address: string, name: string][]\>

#### Defined in

[types.ts:22](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L22)

___

### importWallet

▸ **importWallet**(`wallet`, `name?`): `Promise`<{ `address`: `string` ; `name`: `string`  }\>

**`Requires`**

"IMPORT_WALLET"

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet` | `JWKInterface` |
| `name?` | `string` |

#### Returns

`Promise`<{ `address`: `string` ; `name`: `string`  }\>

#### Defined in

[types.ts:26](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L26)

___

### isEnabled

▸ **isEnabled**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

[types.ts:10](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L10)

___

### isUnlocked

▸ **isUnlocked**(`timeout?`): `Promise`<`boolean` \| ``"timeout"``\>

WARNING: This function relies on an experimental Metamask API.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `timeout` | `number` | `5` |

#### Returns

`Promise`<`boolean` \| ``"timeout"``\>

#### Defined in

[metamask.ts:39](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/metamask.ts#L39)

___

### renameWallet

▸ **renameWallet**(`address`, `name`): `Promise`<``null``\>

**`Requires`**

"RENAME_WALLET"

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `name` | `string` |

#### Returns

`Promise`<``null``\>

#### Defined in

[types.ts:30](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L30)

___

### requestPermissions

▸ **requestPermissions**(`permissions`): `Promise`<`boolean`\>

Request permissions for the current dApp.

#### Parameters

| Name | Type |
| :------ | :------ |
| `permissions` | [`RpcPermission`](modules.md#rpcpermission)[] |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[types.ts:13](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L13)

___

### revokeAllPermissions

▸ **revokeAllPermissions**(): `Promise`<``null``\>

Revoke all the granted permissions for the current dApp.

#### Returns

`Promise`<``null``\>

#### Defined in

[types.ts:15](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L15)

___

### revokeDappPermission

▸ **revokeDappPermission**(`dappOrigin`, `permissions`): `Promise`<``null``\>

Revoke permissions for the specified dApp.

**`Requires`**

"REVOKE_DAPP_PERMISSIONS"

#### Parameters

| Name | Type |
| :------ | :------ |
| `dappOrigin` | `string` |
| `permissions` | [`RpcPermission`](modules.md#rpcpermission)[] |

#### Returns

`Promise`<``null``\>

#### Defined in

[types.ts:17](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L17)

___

### revokePermission

▸ **revokePermission**(`permissions`): `Promise`<``null``\>

Revoke permissions for the current dApp.

#### Parameters

| Name | Type |
| :------ | :------ |
| `permissions` | [`RpcPermission`](modules.md#rpcpermission)[] |

#### Returns

`Promise`<``null``\>

#### Defined in

[types.ts:14](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L14)

___

### sendWinstonTo

▸ **sendWinstonTo**(`arweave`, `winston`, `recipient`): `Promise`<`void`\>

Send `winston` winstons using the current active wallet.

**`Requires`**

- ["GET_ACTIVE_PUBLIC_KEY", "SIGN"]

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `arweave` | `default` | Arweave client used to send the transaction |
| `winston` | `string` | Amount of winstons to send (1 winston = 0.000000000001 AR) |
| `recipient` | `string` | Address that should receive the winstons |

#### Returns

`Promise`<`void`\>

#### Defined in

[helpers.ts:50](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/helpers.ts#L50)

___

### setActiveAddress

▸ **setActiveAddress**(`address`): `Promise`<``null``\>

**`Requires`**

"SET_ACTIVE_ADDRESS"

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<``null``\>

#### Defined in

[types.ts:25](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L25)

___

### signBytes

▸ **signBytes**(`bytes`, `saltLength`): `Promise`<`Uint8Array`\>

Sign bytes with the currently active wallet.

**`Requires`**

"SIGN"

#### Parameters

| Name | Type |
| :------ | :------ |
| `bytes` | `Uint8Array` |
| `saltLength` | `number` |

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[types.ts:23](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/types.ts#L23)

___

### signTx

▸ **signTx**(`tx`): `Promise`<`void`\>

Sign a transaction with the current active wallet.

**`Requires`**

- ["GET_ACTIVE_PUBLIC_KEY", "SIGN"]

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tx` | `default` | The transaction to sign |

#### Returns

`Promise`<`void`\>

#### Defined in

[helpers.ts:21](https://github.com/pianity/arsnap/blob/a1d55dc/packages/adapter/src/helpers.ts#L21)
