[@pianity/arsnap-adapter](README.md) / Exports

# @pianity/arsnap-adapter

## Table of contents

### Type aliases

- [Permission](modules.md#permission)
- [RpcApi](modules.md#rpcapi)
- [RpcRequest](modules.md#rpcrequest)
- [RpcResponse](modules.md#rpcresponse)

### Functions

- [connect](modules.md#connect)
- [deleteWallet](modules.md#deletewallet)
- [exportWallet](modules.md#exportwallet)
- [getActiveAddress](modules.md#getactiveaddress)
- [getActivePublicKey](modules.md#getactivepublickey)
- [getAllAddresses](modules.md#getalladdresses)
- [getDappsPermissions](modules.md#getdappspermissions)
- [getPermissions](modules.md#getpermissions)
- [getWalletNames](modules.md#getwalletnames)
- [importWallet](modules.md#importwallet)
- [isEnabled](modules.md#isenabled)
- [renameWallet](modules.md#renamewallet)
- [requestPermissions](modules.md#requestpermissions)
- [revokeDappPermission](modules.md#revokedapppermission)
- [revokePermission](modules.md#revokepermission)
- [sendWinstonTo](modules.md#sendwinstonto)
- [setActiveAddress](modules.md#setactiveaddress)
- [signBytes](modules.md#signbytes)
- [signTx](modules.md#signtx)

## Type aliases

### Permission

Ƭ **Permission**: ``"GET_ACTIVE_ADDRESS"`` \| ``"SET_ACTIVE_ADDRESS"`` \| ``"GET_ACTIVE_PUBLIC_KEY"`` \| ``"GET_ALL_ADDRESSES"`` \| ``"SIGN"`` \| ``"ENCRYPT"`` \| ``"DECRYPT"`` \| ``"GET_DAPPS_PERMISSIONS"`` \| ``"REVOKE_DAPP_PERMISSIONS"`` \| ``"IMPORT_WALLET"`` \| ``"EXPORT_WALLET"`` \| ``"RENAME_WALLET"`` \| ``"DELETE_WALLET"``

#### Defined in

[types.ts:3](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/types.ts#L3)

___

### RpcApi

Ƭ **RpcApi**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `delete_wallet` | (`address`: `string`) => `Promise`<``null``\> |
| `export_wallet` | (`address`: `string`) => `Promise`<{ `address`: `string` ; `jwk`: `JWKInterface` ; `name`: `string`  }\> |
| `get_active_address` | () => `Promise`<`string`\> |
| `get_active_public_key` | () => `Promise`<`string`\> |
| `get_all_addresses` | () => `Promise`<`string`[]\> |
| `get_dapps_permissions` | () => `Promise`<[dappOrigin: string, permissions: Permission[]][]\> |
| `get_permissions` | () => `Promise`<[`Permission`](modules.md#permission)[]\> |
| `get_wallet_names` | () => `Promise`<[address: string, name: string][]\> |
| `import_wallet` | (`wallet`: `JWKInterface`, `name?`: `string`) => `Promise`<{ `address`: `string` ; `name`: `string`  }\> |
| `is_enabled` | () => `Promise`<`boolean`\> |
| `rename_wallet` | (`address`: `string`, `name`: `string`) => `Promise`<``null``\> |
| `request_permissions` | (`permissions`: [`Permission`](modules.md#permission)[]) => `Promise`<`boolean`\> |
| `revoke_dapp_permissions` | (`dapp`: `string`, `permissions`: [`Permission`](modules.md#permission)[]) => `Promise`<``null``\> |
| `revoke_permissions` | (`permissions`: [`Permission`](modules.md#permission)[]) => `Promise`<``null``\> |
| `set_active_address` | (`address`: `string`) => `Promise`<``null``\> |
| `sign_bytes` | (`bytes`: `Uint8Array`, `saltLength`: `number`) => `Promise`<`Uint8Array`\> |

#### Defined in

[types.ts:21](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/types.ts#L21)

___

### RpcRequest

Ƭ **RpcRequest**: { [K in keyof RpcApi]: Object }[keyof [`RpcApi`](modules.md#rpcapi)]

#### Defined in

[types.ts:48](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/types.ts#L48)

___

### RpcResponse

Ƭ **RpcResponse**: { [K in keyof RpcApi]: ReturnType<RpcApi[K]\> }[keyof [`RpcApi`](modules.md#rpcapi)]

#### Defined in

[types.ts:52](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/types.ts#L52)

## Functions

### connect

▸ **connect**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[metamask.ts:27](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/metamask.ts#L27)

___

### deleteWallet

▸ **deleteWallet**(`address`): `Promise`<``null``\>

**`requires`** "DELETE_WALLET"

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<``null``\>

#### Defined in

[api.ts:122](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/api.ts#L122)

___

### exportWallet

▸ **exportWallet**(`address`): `Promise`<{ `address`: `string` ; `jwk`: `JWKInterface` ; `name`: `string`  }\>

**`requires`** "EXPORT_WALLET"

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<{ `address`: `string` ; `jwk`: `JWKInterface` ; `name`: `string`  }\>

#### Defined in

[api.ts:115](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/api.ts#L115)

___

### getActiveAddress

▸ **getActiveAddress**(): `Promise`<`string`\>

Get the address of the currently active wallet.

**`requires`** "GET_ACTIVE_ADDRESS"

#### Returns

`Promise`<`string`\>

#### Defined in

[api.ts:56](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/api.ts#L56)

___

### getActivePublicKey

▸ **getActivePublicKey**(): `Promise`<`string`\>

Get the public key of the currently active wallet.

**`requires`** "GET_ACTIVE_PUBLIC_KEY"

#### Returns

`Promise`<`string`\>

#### Defined in

[api.ts:65](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/api.ts#L65)

___

### getAllAddresses

▸ **getAllAddresses**(): `Promise`<`string`[]\>

Get addresses for all the stored wallets.

**`requires`** "GET_ALL_ADDRESSES"

#### Returns

`Promise`<`string`[]\>

#### Defined in

[api.ts:74](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/api.ts#L74)

___

### getDappsPermissions

▸ **getDappsPermissions**(): `Promise`<[dappOrigin: string, permissions: Permission[]][]\>

Get permisssions granted for all dApps.

**`requires`** "GET_DAPPS_PERMISSIONS"

#### Returns

`Promise`<[dappOrigin: string, permissions: Permission[]][]\>

#### Defined in

[api.ts:39](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/api.ts#L39)

___

### getPermissions

▸ **getPermissions**(): `Promise`<[`Permission`](modules.md#permission)[]\>

Get the permissions granted to current dApp.

#### Returns

`Promise`<[`Permission`](modules.md#permission)[]\>

#### Defined in

[api.ts:16](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/api.ts#L16)

___

### getWalletNames

▸ **getWalletNames**(): `Promise`<[address: string, name: string][]\>

Get all the addresses and their names.

**`requires`** "GET_ALL_ADDRESSES"

#### Returns

`Promise`<[address: string, name: string][]\>

#### Defined in

[api.ts:83](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/api.ts#L83)

___

### importWallet

▸ **importWallet**(`wallet`, `name?`): `Promise`<{ `address`: `string` ; `name`: `string`  }\>

**`requires`** "IMPORT_WALLET"

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet` | `JWKInterface` |
| `name?` | `string` |

#### Returns

`Promise`<{ `address`: `string` ; `name`: `string`  }\>

#### Defined in

[api.ts:108](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/api.ts#L108)

___

### isEnabled

▸ **isEnabled**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

[api.ts:5](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/api.ts#L5)

___

### renameWallet

▸ **renameWallet**(`address`, `name`): `Promise`<``null``\>

**`requires`** "RENAME_WALLET"

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `name` | `string` |

#### Returns

`Promise`<``null``\>

#### Defined in

[api.ts:129](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/api.ts#L129)

___

### requestPermissions

▸ **requestPermissions**(`permissions`): `Promise`<`boolean`\>

Request permissions for the current dApp.

#### Parameters

| Name | Type |
| :------ | :------ |
| `permissions` | [`Permission`](modules.md#permission)[] |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[api.ts:23](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/api.ts#L23)

___

### revokeDappPermission

▸ **revokeDappPermission**(`dapp`, `permissions`): `Promise`<``null``\>

Revoke permissions for the specified dApp.

**`requires`** "REVOKE_DAPP_PERMISSIONS"

#### Parameters

| Name | Type |
| :------ | :------ |
| `dapp` | `string` |
| `permissions` | [`Permission`](modules.md#permission)[] |

#### Returns

`Promise`<``null``\>

#### Defined in

[api.ts:47](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/api.ts#L47)

___

### revokePermission

▸ **revokePermission**(`permissions`): `Promise`<``null``\>

Revoke permissions for the current dApp.

#### Parameters

| Name | Type |
| :------ | :------ |
| `permissions` | [`Permission`](modules.md#permission)[] |

#### Returns

`Promise`<``null``\>

#### Defined in

[api.ts:30](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/api.ts#L30)

___

### sendWinstonTo

▸ **sendWinstonTo**(`arweave`, `winston`, `recipient`): `Promise`<`void`\>

Send `winston` winstons using the current active wallet.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `arweave` | `default` | Arweave client used to send the transaction |
| `winston` | `string` | Amount of winstons to send (1 winston = 0.000000000001 AR) |
| `recipient` | `string` | Address that should receive the winstons |

#### Returns

`Promise`<`void`\>

#### Defined in

[helpers.ts:46](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/helpers.ts#L46)

___

### setActiveAddress

▸ **setActiveAddress**(`address`): `Promise`<``null``\>

**`requires`** "SET_ACTIVE_ADDRESS"

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<``null``\>

#### Defined in

[api.ts:101](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/api.ts#L101)

___

### signBytes

▸ **signBytes**(`bytes`, `saltLength`): `Promise`<`Uint8Array`\>

**`requires`** "SIGN"

#### Parameters

| Name | Type |
| :------ | :------ |
| `bytes` | `Uint8Array` |
| `saltLength` | `number` |

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[api.ts:90](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/api.ts#L90)

___

### signTx

▸ **signTx**(`tx`): `Promise`<`void`\>

Sign a transaction with the current active wallet.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tx` | `default` | The transaction to sign |

#### Returns

`Promise`<`void`\>

#### Defined in

[helpers.ts:19](https://github.com/pianity/arsnap/blob/5da4bd4/packages/adapter/src/helpers.ts#L19)
