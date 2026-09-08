---
description: Create a Local Account from a BIP-32 HD key.
title: hdKeyToAccount
---

# hdKeyToAccount

Creates a [Local Account](/docs/accounts/intro) from a BIP-32 HD key. Use this
when you already hold an `HDKey` — from a seed, an extended key, or a key store —
rather than a mnemonic phrase.

## Import

```ts twoslash
import { HDKey, hdKeyToAccount } from '@tronweb3/tviem'
```

## Usage

```ts twoslash
import { HDKey, hdKeyToAccount } from '@tronweb3/tviem'

const hdKey = HDKey.fromMasterSeed(
  Uint8Array.from({ length: 64 }, (_, i) => i),
)

const account = hdKeyToAccount(hdKey)

account.address
//      ^?
```

The `HDKey` class is re-exported from
[`@scure/bip32`](https://github.com/paulmillr/scure-bip32), so an `HDKey` you
built elsewhere works here directly.

:::warning
An HD key leaks wider than a single private key. Whoever holds the master key —
or any extended *private* key above your account — can derive every address
below it in the tree, including ones you have not created yet.

Keep the master key in whatever holds your seed, derive as late as you can, and
never persist an `xprv` where a single-account key would do.
:::

## Returns

`TronHDAccount`

## Parameters

### hdKey

- **Type:** `HDKey`

The BIP-32 HD key to derive from.

### options.accountIndex (optional)

- **Type:** `number`
- **Default:** `0`

### options.changeIndex (optional)

- **Type:** `number`
- **Default:** `0`

### options.addressIndex (optional)

- **Type:** `number`
- **Default:** `0`

Together these produce `m/44'/195'/${accountIndex}'/${changeIndex}/${addressIndex}`.

```ts twoslash
import { HDKey, hdKeyToAccount } from '@tronweb3/tviem'

const hdKey = HDKey.fromMasterSeed(
  Uint8Array.from({ length: 64 }, (_, i) => i),
)
// ---cut---
// m/44'/195'/0'/0/3
const account = hdKeyToAccount(hdKey, { addressIndex: 3 })
```

### options.path (optional)

- **Type:** `` `m/44'/195'/${string}` ``

The full derivation path, overriding the index options.

```ts twoslash
import { HDKey, hdKeyToAccount } from '@tronweb3/tviem'

const hdKey = HDKey.fromMasterSeed(
  Uint8Array.from({ length: 64 }, (_, i) => i),
)
// ---cut---
const account = hdKeyToAccount(hdKey, { path: "m/44'/195'/2'/0/0" })
```

## From an extended key

```ts twoslash
import { HDKey, hdKeyToAccount } from '@tronweb3/tviem'

const hdKey = HDKey.fromExtendedKey(
  'xprvReplaceThisWithYourOwnExtendedKey',
)

const account = hdKeyToAccount(hdKey)
```

:::warning
`xprv…` is a placeholder. A real one is a master **private** key — pasting it
into source, a config file or a support ticket hands over every account it
derives.

If all you need is to watch addresses rather than sign for them, derive from the
extended *public* key (`xpub…`) instead and keep the private half out of the
process entirely.
:::

## When to use which

| You have                | Use                                                              |
| ----------------------- | ---------------------------------------------------------------- |
| A mnemonic phrase       | [`mnemonicToAccount`](/docs/accounts/mnemonicToAccount)           |
| An `HDKey` or seed      | `hdKeyToAccount`                                                  |
| A single private key    | [`privateKeyToAccount`](/docs/accounts/privateKeyToAccount)       |
| A key you cannot export | [`toAccount`](/docs/accounts/toAccount)                           |
