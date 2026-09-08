---
description: Create a Local Account from a BIP-39 mnemonic phrase.
title: mnemonicToAccount
---

# mnemonicToAccount

Creates a [Local Account](/docs/accounts/intro) from a BIP-39 mnemonic phrase,
derived along TRON's BIP-44 path.

## Import

```ts twoslash
import { mnemonicToAccount } from '@tronweb3/tviem'
```

## Usage

```ts twoslash
import { mnemonicToAccount } from '@tronweb3/tviem'

const account = mnemonicToAccount(
  'legal winner thank year wave sausage worth useful legal winner thank yellow',
)

account.address
//      ^?
```

The default derivation path is `m/44'/195'/0'/0/0` — coin type 195 is TRON.

:::warning
The phrase above is the published BIP-39 test vector. It is used here precisely
*because* it is public — `mnemonicToAccount` validates against the wordlist, so
an invented phrase would throw rather than illustrate anything.

Anyone can derive its keys. Never send funds to an address derived from it, and
never let a generated phrase reach a log, a commit, or a screenshot.
:::

## Returns

`TronHDAccount`

A Local Account that also carries the derived HD key.

## Parameters

### mnemonic

- **Type:** `string`

A BIP-39 mnemonic phrase. Validated against the English wordlist; an invalid
phrase throws.

### options.accountIndex (optional)

- **Type:** `number`
- **Default:** `0`

The hardened `account'` segment of the path.

```ts twoslash
import { mnemonicToAccount } from '@tronweb3/tviem'
// ---cut---
// m/44'/195'/1'/0/0
const account = mnemonicToAccount(
  'legal winner thank year wave sausage worth useful legal winner thank yellow',
  { accountIndex: 1 },
)
```

### options.changeIndex (optional)

- **Type:** `number`
- **Default:** `0`

The `change` segment.

### options.addressIndex (optional)

- **Type:** `number`
- **Default:** `0`

The final segment. Iterate it to walk a wallet's addresses:

```ts twoslash
import { mnemonicToAccount } from '@tronweb3/tviem'

const mnemonic =
  'legal winner thank year wave sausage worth useful legal winner thank yellow'

const accounts = Array.from({ length: 5 }, (_, addressIndex) =>
  mnemonicToAccount(mnemonic, { addressIndex }),
)
```

### options.path (optional)

- **Type:** `` `m/44'/195'/${string}` ``

The full derivation path, overriding the index options. Constrained by the type
to TRON's coin type.

```ts twoslash
import { mnemonicToAccount } from '@tronweb3/tviem'
// ---cut---
const account = mnemonicToAccount(
  'legal winner thank year wave sausage worth useful legal winner thank yellow',
  { path: "m/44'/195'/0'/0/1" },
)
```

### options.passphrase (optional)

- **Type:** `string`

A BIP-39 passphrase (sometimes called the "25th word"). Changing it produces a
completely different set of accounts from the same phrase.

```ts twoslash
import { mnemonicToAccount } from '@tronweb3/tviem'
// ---cut---
const account = mnemonicToAccount(
  'legal winner thank year wave sausage worth useful legal winner thank yellow',
  { passphrase: 'correct horse battery staple' },
)
```
