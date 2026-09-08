---
description: Generate a random secp256k1 private key.
title: generatePrivateKey
---

# generatePrivateKey

Generates a random secp256k1 private key using the platform CSPRNG.

## Import

```ts twoslash
import { generatePrivateKey } from '@tronweb3/tviem'
```

## Usage

```ts twoslash
import { generatePrivateKey } from '@tronweb3/tviem'

const privateKey = generatePrivateKey()
//    ^?
```

Turn it into an Account:

```ts twoslash
import { generatePrivateKey, privateKeyToAccount } from '@tronweb3/tviem'

const privateKey = generatePrivateKey()
const account = privateKeyToAccount(privateKey)

account.address
//      ^?
```

## Returns

`Hex`

A `0x`-prefixed 32-byte hex string.

## Parameters

None.

:::warning
A generated key is only as safe as where you put it. This function gives you
randomness, not key management — if the key matters, it belongs in a keystore,
not in a variable that gets logged.
:::
