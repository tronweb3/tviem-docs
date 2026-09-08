---
description: Accounts in tviem — local signers and custom sources.
title: Accounts
---

# Accounts

An **Account** is whatever can sign. tviem draws one line through the middle:

- A **Local Account** holds a private key in your process and signs in-process.
  Built with [`privateKeyToAccount`](/docs/accounts/privateKeyToAccount),
  [`mnemonicToAccount`](/docs/accounts/mnemonicToAccount) or
  [`hdKeyToAccount`](/docs/accounts/hdKeyToAccount).
- A **Custom Account** holds no key. You supply the signing functions, and the
  key stays in a browser wallet, a hardware device or an HSM. Built with
  [`toAccount`](/docs/accounts/toAccount).

Both satisfy the same interface, so every write action accepts either.

## Usage

Attach an Account to a [Wallet Client](/docs/clients/wallet) and it is hoisted
onto every write:

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
```

Or pass one per call:

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts#imports-->
import { createWalletClient, privateKeyToAccount } from '@tronweb3/tviem'
// ---cut---
const account = privateKeyToAccount(
  '0x0000000000000000000000000000000000000000000000000000000000000001',
)

const walletClient = createWalletClient({
  chain: mainnet,
  transport: http(),
})

await walletClient.sendTrx({
  account, // [!code focus]
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})
```

## Private keys as a shorthand

Anywhere an Account is accepted, a private key string works too — tviem resolves
it to a local account for you. Both `0x`-prefixed and bare hex are accepted.

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts#imports-->
import { createWalletClient } from '@tronweb3/tviem'
// ---cut---
const walletClient = createWalletClient({
  account: '0x0000000000000000000000000000000000000000000000000000000000000001', // [!code focus]
  chain: mainnet,
  transport: http(),
})
```

:::warning
`0x…0001` is a counting placeholder, not a usable key.

The shorthand is convenient, and that is the danger: a key written inline is a
key in your git history. Read it from an environment variable or a secrets
manager — or, when the key should never be in your process at all, use
[`toAccount`](/docs/accounts/toAccount) and leave it in the wallet or HSM.

A Local Account keeps the key in memory for the lifetime of the process, so it
is reachable from a heap dump, a debugger, or a crash report that ships to a
third party.
:::

## What an Account exposes

| Member            | Purpose                                                     |
| ----------------- | ----------------------------------------------------------- |
| `address`         | The Base58Check (`T…`) address                               |
| `signTransaction` | Signs a transaction, appending to its `signature` list       |
| `signMessage`     | Signs a message (TIP-191)                                    |
| `signTypedData`   | Signs TIP-712 typed structured data                          |
| `multiSign`       | Co-signs under a specific permission id                      |

Because `signTransaction` *appends*, the same transaction can be passed through
several accounts in turn — that is how
[`multiSign`](/docs/actions/wallet/multiSign) builds a multi-signature
transaction.

## Key generation

- [`generatePrivateKey`](/docs/accounts/generatePrivateKey) — a random key
- [`generateMnemonic`](/docs/accounts/generateMnemonic) — a random BIP-39 phrase

## Derivation path

TRON's BIP-44 coin type is **195**, so the default path is:

```
m/44'/195'/0'/0/0
```

[`mnemonicToAccount`](/docs/accounts/mnemonicToAccount) and
[`hdKeyToAccount`](/docs/accounts/hdKeyToAccount) let you vary the account,
change and address indices, or supply the whole path.
