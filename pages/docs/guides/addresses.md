---
description: TRON's three address forms and when each applies.
title: Addresses
---

# Addresses

TRON has three address forms. They are the same account — the same 21-byte
payload, rendered three ways — but they are not interchangeable strings, and
mixing them up is the most common source of confusion when moving from Ethereum.

## The three forms

| Form            | Looks like                                   | Type              | Where it appears                       |
| --------------- | -------------------------------------------- | ----------------- | -------------------------------------- |
| **Base58Check** | `TSenderAccountDemoxxxxxxxxxxxxxxxx`         | `` `T${string}` `` | User-facing everywhere — explorers, wallets, tviem's API |
| **TRON hex**    | `41abcdefabcdefabcdefabcdefabcdefabcdefabcd` | `` `41${string}` `` | TRON's HTTP API request bodies         |
| **EVM hex**     | `0xabcdefabcdefabcdefabcdefabcdefabcdefabcd` | `` `0x${string}` `` | Inside the TVM, ABI encoding, TIP-712  |

The relationship is mechanical:

```
payload    = 0x41 ++ <20-byte EVM address>
TRON hex   = hex(payload)                 // 42 chars, no 0x
Base58Check = base58(payload ++ checksum) // 34 chars, T-prefixed
EVM hex    = 0x ++ hex(payload[1..])      // drop the 0x41
```

So the EVM form is the TRON form with its `0x41` prefix byte removed. The `T`
prefix on Base58Check is a consequence of every payload starting with `0x41`,
not an added marker.

## Which one tviem wants

**Base58Check, everywhere in the public API.** Every `address` parameter is
typed `` `T${string}` ``, so passing anything else is a compile error:

```ts twoslash
// @errors: 2322
<!--@include: ../../../snippets/publicClient.ts-->
// ---cut---
await publicClient.getBalance({
  address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
})
```

tviem converts to whatever form the node or the TVM needs internally. That
includes contract calls — pass Base58Check for a Solidity `address` argument and
[`readContract`](/docs/actions/public/readContract) handles the conversion:

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts-->
<!--@include: ../../../snippets/trc20Abi.ts-->
// ---cut---
const balance = await publicClient.readContract({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  account: 'TSenderAccountDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'balanceOf',
  args: ['TSenderAccountDemoxxxxxxxxxxxxxxxx'], // [!code focus]
})
```

## Where you still need the other forms

### TIP-712 typed data

TIP-712 follows EIP-712's type system, so an `address` field there is the
20-byte EVM form. Convert explicitly:

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
// ---cut---
import { toEvm } from '@tronweb3/tviem'

await walletClient.signTypedData({
  domain: { name: 'Example', chainId: walletClient.chain.id },
  types: { Order: [{ name: 'maker', type: 'address' }] },
  primaryType: 'Order',
  message: { maker: toEvm('TSenderAccountDemoxxxxxxxxxxxxxxxx') }, // [!code focus]
})
```

### Comparing against contract storage

A value read out of a contract comes back in EVM form. Compare with
[`isAddressEqual`](/docs/utilities/address), which normalizes both sides:

```ts twoslash
import { isAddressEqual } from '@tronweb3/tviem'
// ---cut---
declare const owner: `0x${string}`

const isOwner = isAddressEqual(owner, 'TSenderAccountDemoxxxxxxxxxxxxxxxx')
```

:::warning
Never compare addresses with `===` unless you are certain both sides are in the
same form. `'TJRab…' === '0x52a4…'` is `false` for the same account.
:::

## Validating input

`isAddress` is a type guard, which is what turns a `string` from your UI into
the `` `T${string}` `` every action wants:

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts-->
// ---cut---
import { isAddress } from '@tronweb3/tviem'

declare const input: string

if (!isAddress(input)) throw new Error('not a TRON address')

// `input` is `T${string}` from here on.
const balance = await publicClient.getBalance({ address: input })
```

By default this verifies the Base58Check **checksum**, not just the shape — so a
mistyped character is caught rather than sent to the chain. That check is the
main reason Base58Check exists; do not skip it on user input.

## Converting

```ts twoslash
import { addressToHex, toBase58, toEvm } from '@tronweb3/tviem'

const base58 = toBase58('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')
const tronHex = addressToHex('TSenderAccountDemoxxxxxxxxxxxxxxxx')
const evm = toEvm('TSenderAccountDemoxxxxxxxxxxxxxxxx')
```

All three accept any input form, so they double as normalizers. See
[Address Utilities](/docs/utilities/address).

## Deriving

```ts twoslash
import { privateKeyToAddress, publicKeyToAddress } from '@tronweb3/tviem'

const fromPrivate = privateKeyToAddress(
  '0x0000000000000000000000000000000000000000000000000000000000000001',
)

declare const publicKey: `0x${string}`
const fromPublic = publicKeyToAddress(publicKey)
```

Both return Base58Check.

:::warning
`0x…0001` is a placeholder key. Deriving an address is a one-way step, but it
still requires the key as input — never hard-code a real one, and prefer
`account.address` when you already hold an
[Account](/docs/accounts/intro).

`publicKeyToAddress` needs no secret at all. Use it when you are deriving
addresses for accounts you do not sign for.
:::
