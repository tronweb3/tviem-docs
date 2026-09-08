---
description: Building a wallet with tviem — signing, multi-sig and offline flows.
title: Building a Wallet
---

# Building a Wallet

The write-heavy path: hold keys, build transactions, collect signatures,
broadcast. This is where tviem's
[build/send split](/docs/guides/build-vs-send) earns its keep.

## Deriving accounts

From a mnemonic, along TRON's BIP-44 path (`m/44'/195'/…`):

```ts twoslash
import { generateMnemonic, mnemonicToAccount } from '@tronweb3/tviem'

const mnemonic = generateMnemonic()

// The first five addresses of account 0.
const accounts = Array.from({ length: 5 }, (_, addressIndex) =>
  mnemonicToAccount(mnemonic, { addressIndex }),
)
```

If you hold an `HDKey` rather than a phrase, use
[`hdKeyToAccount`](/docs/accounts/hdKeyToAccount). For a bare key,
[`privateKeyToAccount`](/docs/accounts/privateKeyToAccount).

To show an address without constructing a signer at all:

```ts twoslash
import { privateKeyToAddress } from '@tronweb3/tviem'

const address = privateKeyToAddress(
  '0x0000000000000000000000000000000000000000000000000000000000000001',
)
```

:::warning
Keys in this guide are counting placeholders (`0x…0001`, `0x…0002`).

You are writing the thing that holds other people's funds, so the handling rules
are the product, not a footnote:

- A generated mnemonic derives every account below it and cannot be rotated.
  Show it to the user, persist it only where you would persist a password
  database, and never let it reach a log, a crash report, or telemetry.
- Derive as late as you can and hold key material for as short as you can. A
  Local Account keeps the key in memory for the process lifetime, reachable from
  a heap dump or a debugger.
- Scrub key material out of anything you serialize. The most common leak is not
  an attacker — it is an error handler that stringifies the whole object.
:::

## Building without broadcasting

A wallet almost never wants build-sign-broadcast in one call — the user has to
approve in between. Stop at the transaction:

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
// ---cut---
const unsigned = await walletClient.buildSendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
  expirationMs: 10 * 60 * 1000,
})

// Show `unsigned` to the user. If they approve:
const signed = await walletClient.signTransaction({ transaction: unsigned })
const { txid } = await walletClient.broadcastTransaction({
  signedTransaction: signed,
})
```

Give the expiration enough headroom for a human to read a screen and press a
button. A default expiration that elapses during confirmation produces a signed
transaction the chain silently will not include.

## Offline signing

`blockHeader` lets you supply the TaPoS reference, so the machine that builds
never has to be the machine that signs — and neither needs to be online at the
same time.

```ts twoslash
// @noErrors
<!--@include: ../../../snippets/clients.ts-->
declare const airgapped: { sign: (tx: unknown) => any }
// ---cut---
// Online machine: fetch a reference.
const block = await publicClient.getNowBlock()

// Air-gapped machine: build and sign against it.
const unsigned = await walletClient.buildSendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
  blockHeader: block,
  expirationMs: 60 * 60 * 1000,
})
const signed = airgapped.sign(unsigned)

// Online machine: broadcast.
await walletClient.broadcastTransaction({ signedTransaction: signed })
```

The same trick makes batching cheap: fetch one reference, build many
transactions against it, instead of a round trip each.

## Multi-signature

TRON accounts carry weighted permissions — several keys, each with a weight, and
a threshold the accumulated weight must reach.

Build under the permission, then collect:

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
// ---cut---
const unsigned = await walletClient.buildSendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
  permissionId: 2, // [!code focus]
})

const once = await walletClient.multiSign({
  transaction: unsigned,
  privateKey:
    '0x0000000000000000000000000000000000000000000000000000000000000001',
  permissionId: 2,
})

const twice = await walletClient.multiSign({
  transaction: once,
  privateKey:
    '0x0000000000000000000000000000000000000000000000000000000000000002',
  permissionId: 2,
})
```

Signatures accumulate on the transaction, so it can travel between signers.

### Knowing when you have enough

Do not guess at the threshold — ask the node:

```ts twoslash
// @noErrors
<!--@include: ../../../snippets/clients.ts-->
declare const partiallySigned: any
// ---cut---
const weight = await publicClient.getSignWeight({
  transaction: partiallySigned,
})

const approved = await publicClient.getApprovedList({
  transaction: partiallySigned,
})
```

`getSignWeight` reports accumulated weight against the permission's threshold;
`getApprovedList` reports who has signed, which is what you need to avoid asking
the same signer twice.

### Configuring permissions

```ts twoslash
// @noErrors
<!--@include: ../../../snippets/walletClient.ts-->
// ---cut---
await walletClient.accountPermissionUpdate({
  owner: { /* … */ },
  actives: [ /* … */ ],
})
```

:::warning
A permission update that sets a threshold no combination of your keys can reach
locks the account permanently. There is no recovery. Rehearse on
[Nile](/docs/chains/intro) first, and verify with `getSignWeight` before
broadcasting on mainnet.
:::

## Signing messages

For off-chain proof of address control:

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
// ---cut---
const signature = await walletClient.signMessage({ message: 'hello world' })
```

Prefer [`signTypedData`](/docs/actions/wallet/signTypedData) when the payload has
structure — the user can see what they are approving instead of a hex blob.

## Reading account state

What a wallet UI needs, in one round:

```ts twoslash
<!--@include: ../../../snippets/clients.ts-->
// ---cut---
import { formatTrx } from '@tronweb3/tviem'

const [state, resources] = await Promise.all([
  publicClient.getAccount({ address: account.address }),
  publicClient.getAccountResources({ address: account.address }),
])

const balance = state === null ? '0' : formatTrx(state.balance)
const energyAvailable = resources.energyLimit - resources.energyUsed
```

`getAccount` returns `null` for an address that has never been funded — TRON
creates accounts lazily. That is a normal state for a freshly derived address,
not an error.

## Checklist

- Build and sign as separate steps, with the user's approval between them
- Set `expirationMs` to outlast human confirmation
- Use `permissionId` on `build*` for multi-sig, and verify with `getSignWeight`
- Handle `getAccount` returning `null` for unfunded addresses
- Never log a private key or a mnemonic
- Rehearse permission changes on Nile
