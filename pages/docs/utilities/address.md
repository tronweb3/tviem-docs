---
description: Convert, validate and compare TRON addresses.
title: Address Utilities
---

# Address Utilities

TRON has three interchangeable address forms, all derived from the same 21-byte
payload. These helpers convert and compare between them.

For the background on why there are three, see
[Addresses](/docs/guides/addresses).

## toBase58

Converts any address form to canonical Base58Check (`T…`).

```ts twoslash
import { toBase58 } from '@tronweb3/tviem'

const address = toBase58('41abcdefabcdefabcdefabcdefabcdefabcdefabcd')
//    ^?
```

Accepts Base58Check, TRON hex (`41…`), EVM hex (`0x…`) or raw bytes.

## addressToHex

Converts to TRON hex form — `41`-prefixed, 21 bytes, no `0x`.

```ts twoslash
import { addressToHex } from '@tronweb3/tviem'

const hex = addressToHex('TSenderAccountDemoxxxxxxxxxxxxxxxx')
//    ^?
```

This is the form TRON's HTTP API uses in request bodies.

## toEvm

Converts to EVM hex form — `0x`-prefixed, 20 bytes, with TRON's `0x41` prefix
byte dropped.

```ts twoslash
import { toEvm } from '@tronweb3/tviem'

const evm = toEvm('TSenderAccountDemoxxxxxxxxxxxxxxxx')
//    ^?
```

This is the form the TVM and ABI encoding use. You need it when writing
[TIP-712 typed data](/docs/actions/wallet/signTypedData) by hand, or comparing
against a value read out of contract storage.

tviem converts for you inside
[`readContract`](/docs/actions/public/readContract) and
[`writeContract`](/docs/actions/wallet/writeContract) — pass Base58Check there
and it does the right thing.

## isAddress

Type guard for a valid Base58Check address.

```ts twoslash
import { isAddress } from '@tronweb3/tviem'

declare const input: string

if (isAddress(input)) {
  input
  //^?
}
```

The guard narrows `string` to `` `T${string}` ``, which is what every action's
`address` parameter wants — so this is the boundary where user input becomes
usable.

### Options

- **`strict`** — `boolean`, default `true`. Verifies the Base58Check checksum.
  With `strict: false` only the shape is checked, which is faster but accepts a
  mistyped address.

```ts twoslash
import { isAddress } from '@tronweb3/tviem'
// ---cut---
isAddress('TSenderAccountDemoxxxxxxxxxxxxxxxx', { strict: false })
```

## isAddressEqual

Compares two addresses by their underlying bytes, so the forms do not have to
match.

```ts twoslash
import { isAddressEqual } from '@tronweb3/tviem'

const same = isAddressEqual(
  'TSenderAccountDemoxxxxxxxxxxxxxxxx',
  '41abcdefabcdefabcdefabcdefabcdefabcdefabcd',
)
```

Never compare addresses with `===` unless you know both sides are in the same
form — the same account has three different string representations.

## publicKeyToAddress

Derives an address from a secp256k1 public key.

```ts twoslash
import { publicKeyToAddress } from '@tronweb3/tviem'

declare const publicKey: `0x${string}`

const address = publicKeyToAddress(publicKey)
//    ^?
```

Accepts the uncompressed (65-byte, `0x04`-prefixed) form or raw bytes.

## privateKeyToAddress

Derives an address from a private key, without building an
[Account](/docs/accounts/intro).

```ts twoslash
import { privateKeyToAddress } from '@tronweb3/tviem'

const address = privateKeyToAddress(
//    ^?
  '0x0000000000000000000000000000000000000000000000000000000000000001',
)
```

:::warning
`0x…0001` is a placeholder. This helper takes a real private key to compute a
public address, so a key reaches wherever you call it — including anywhere the
argument gets logged on the way in.

If you only need the address of an account you already built, read
`account.address` and leave the key out of it.
:::

## getCreate2Address

Computes a `CREATE2` deployment address.

```ts twoslash
// @noErrors
import { getCreate2Address } from '@tronweb3/tviem'

const address = getCreate2Address({
  from: 'TSenderAccountDemoxxxxxxxxxxxxxxxx',
  salt: '0x…',
  bytecodeHash: '0x…',
})
```
