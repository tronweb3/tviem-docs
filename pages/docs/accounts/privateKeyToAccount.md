---
description: Create a Local Account from a private key.
title: privateKeyToAccount
---

# privateKeyToAccount

Creates a [Local Account](/docs/accounts/intro) from a secp256k1 private key.

## Import

```ts twoslash
import { privateKeyToAccount } from '@tronweb3/tviem'
```

## Usage

```ts twoslash
import { privateKeyToAccount } from '@tronweb3/tviem'

const account = privateKeyToAccount(
  '0x0000000000000000000000000000000000000000000000000000000000000001',
)

account.address
//      ^?
```

Attach it to a [Wallet Client](/docs/clients/wallet):

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
```

:::warning
`0x…0001` is a counting placeholder, not a key anyone should use. Its address is
one of the most-watched on every chain, and anything sent there is gone within
seconds.

Never commit a real key either. Read it from an environment variable or a
secrets manager, or move signing out of your process entirely with
[`toAccount`](/docs/accounts/toAccount).
:::

## Returns

`TronLocalAccount`

A Local Account with `address`, `signTransaction`, `signMessage`,
`signTypedData` and `multiSign`.

## Parameters

### privateKey

- **Type:** `Hex | string`

A secp256k1 private key, `0x`-prefixed or bare hex. Both forms are accepted:

```ts twoslash
import { privateKeyToAccount } from '@tronweb3/tviem'
// ---cut---
// 0x-prefixed
privateKeyToAccount(
  '0x0000000000000000000000000000000000000000000000000000000000000001',
)

// bare hex
privateKeyToAccount(
  '0000000000000000000000000000000000000000000000000000000000000001',
)
```

## Deriving just the address

If you only need the address and not a signer, skip the account:

```ts twoslash
import { privateKeyToAddress } from '@tronweb3/tviem'

const address = privateKeyToAddress(
//    ^?
  '0x0000000000000000000000000000000000000000000000000000000000000001',
)
```
