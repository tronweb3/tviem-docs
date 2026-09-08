---
description: Sign TIP-712 typed structured data.
title: signTypedData
---

# signTypedData

Signs TIP-712 typed structured data — TRON's counterpart to EIP-712.

Unlike [`signMessage`](/docs/actions/wallet/signMessage), the payload has a
declared structure, so a wallet can show the user what they are actually
approving instead of an opaque blob.

## Usage

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
const signature = await walletClient.signTypedData({
  domain: {
    name: 'Example dApp',
    version: '1',
    chainId: 728126428,
  },
  types: {
    Order: [
      { name: 'maker', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
  },
  primaryType: 'Order',
  message: {
    maker: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    amount: 1_000_000n,
  },
})
```

## Returns

`Signature`

## Parameters

### domain

- **Type:** `TypedDataDomain`

The TIP-712 domain separator. `chainId` should be TRON's chain id — `728126428`
for mainnet, which you can read off the chain object rather than hard-coding:

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
const signature = await walletClient.signTypedData({
  domain: {
    name: 'Example dApp',
    version: '1',
    chainId: walletClient.chain.id, // [!code focus]
  },
  types: {
    Order: [{ name: 'amount', type: 'uint256' }],
  },
  primaryType: 'Order',
  message: { amount: 1_000_000n },
})
```

### types

- **Type:** `TypedData`

The struct definitions. `EIP712Domain` is derived from `domain` and does not
need declaring.

### primaryType

- **Type:** `string`

Which struct in `types` is being signed. Narrowed to the keys you declared:

```ts twoslash
// @errors: 2322 2353 2561
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
const signature = await walletClient.signTypedData({
  domain: { name: 'Example dApp' },
  types: {
    Order: [{ name: 'amount', type: 'uint256' }],
  },
  primaryType: 'Trade',
  message: { amount: 1_000_000n },
})
```

### message

- **Type:** inferred from `types` and `primaryType`

The value being signed, typed from the struct definition.

Note that `address` fields here are **EVM-form** (`0x…`) — TIP-712 encoding
follows EIP-712's type system, so it uses the 20-byte address form rather than
Base58Check. Convert with [`toEvm`](/docs/utilities/address):

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
import { toEvm } from '@tronweb3/tviem'

const signature = await walletClient.signTypedData({
  domain: { name: 'Example dApp', chainId: walletClient.chain.id },
  types: {
    Order: [
      { name: 'maker', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
  },
  primaryType: 'Order',
  message: {
    maker: toEvm('TSenderAccountDemoxxxxxxxxxxxxxxxx'), // [!code focus]
    amount: 1_000_000n,
  },
})
```

### account (optional)

- **Type:** `TronAccount | AccountKey`

## Related

- [`signMessage`](/docs/actions/wallet/signMessage)
- [Addresses](/docs/guides/addresses) — when each address form applies
