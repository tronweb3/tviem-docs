---
description: Generate a random BIP-39 mnemonic phrase.
title: generateMnemonic
---

# generateMnemonic

Generates a random BIP-39 mnemonic phrase from the English wordlist.

## Import

```ts twoslash
import { generateMnemonic } from '@tronweb3/tviem'
```

## Usage

```ts twoslash
import { generateMnemonic } from '@tronweb3/tviem'

const mnemonic = generateMnemonic()
//    ^?
```

Turn it into an Account:

```ts twoslash
import { generateMnemonic, mnemonicToAccount } from '@tronweb3/tviem'

const mnemonic = generateMnemonic()
const account = mnemonicToAccount(mnemonic)

account.address
//      ^?
```

:::warning
The returned phrase **is** the wallet. It derives every address below it, and it
cannot be rotated — recovering from a leak means moving the funds, not changing
a password.

Treat the return value as the most sensitive thing in the process: do not log
it, do not write it to disk unencrypted, do not send it anywhere for
"validation", and do not let it reach a crash report or a screenshot. If you are
generating one for a user, hand it to them and forget it.
:::

## Returns

`string`

A space-separated mnemonic phrase.

## Parameters

### strength (optional)

- **Type:** `number`
- **Default:** `128`

Entropy in bits. Determines the phrase length:

| Strength | Words |
| -------- | ----- |
| `128`    | 12    |
| `160`    | 15    |
| `192`    | 18    |
| `224`    | 21    |
| `256`    | 24    |

```ts twoslash
import { generateMnemonic } from '@tronweb3/tviem'
// ---cut---
// A 24-word phrase.
const mnemonic = generateMnemonic(256)
```
