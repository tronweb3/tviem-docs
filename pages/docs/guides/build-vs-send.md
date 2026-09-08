---
description: When to build a transaction and when to send it.
title: Build vs. Send
---

# Build vs. Send

Every write action in tviem comes in two forms:

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
// ---cut---
// Builds, signs, broadcasts.
const result = await walletClient.sendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})

// Builds. Stops.
const unsigned = await walletClient.buildSendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})
```

Same parameters, same contract assembly, same TaPoS reference. The only
difference is where the pipeline stops.

## The pipeline

A TRON write is three steps that tviem lets you take together or separately:

1. **Build** — assemble the contract, resolve the block reference and
   expiration, produce an unsigned transaction.
2. **Sign** — attach one or more signatures.
3. **Broadcast** — hand it to a node.

`sendTrx` does all three. `buildSendTrx` does the first, and you take it from
there:

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
// ---cut---
const unsigned = await walletClient.buildSendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})

const signed = await walletClient.signTransaction({ transaction: unsigned })

const { txid } = await walletClient.broadcastTransaction({
  signedTransaction: signed,
})
```

## When to use `build*`

### The key is somewhere else

A hardware wallet, an HSM, an air-gapped machine. Build where you have the
node, sign where you have the key.

```ts twoslash
// @noErrors
<!--@include: ../../../snippets/walletClient.ts-->
declare const device: { sign: (tx: unknown) => Promise<any> }
// ---cut---
const unsigned = await walletClient.buildSendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})

// Serialize, transfer, sign, transfer back.
const signed = await device.sign(unsigned)

await walletClient.broadcastTransaction({ signedTransaction: signed })
```

### Several parties must sign

Multi-signature accounts need signatures from several key holders. Build once,
pass it around, broadcast when the threshold is met.

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
// ---cut---
const unsigned = await walletClient.buildSendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
  permissionId: 2, // [!code focus]
})
```

`permissionId` is only available on the `build*` variants — a build-and-send
action signs with the default permission, because there is nowhere to route a
partly-signed transaction to.

See [`multiSign`](/docs/actions/wallet/multiSign).

### The user must approve it

Show the user exactly what they are signing, then broadcast only if they agree.
The unsigned transaction is inspectable data.

### You want to review before it is irreversible

Broadcasting is the point of no return. Building is not — an unsigned
transaction that you throw away costs nothing.

## When not to bother

For a straightforward transfer from a key you hold, the combined action is
fewer moving parts and one fewer place to make a mistake. Use `sendTrx`.

## Expiration

A built transaction is not valid forever. It carries a block reference and an
expiration, and once that elapses the chain will not include it:

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
// ---cut---
const unsigned = await walletClient.buildSendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
  expirationMs: 10 * 60 * 1000, // [!code focus]
})
```

Give a flow with a human in it enough time to finish. A hardware wallet
confirmation, a second signer in another timezone, an approval queue — all of
these can outlast a default expiration, and the failure mode is a transaction
that is signed, valid-looking, and silently unincludable.

## Building offline

`blockHeader` lets you supply the TaPoS reference yourself, so building needs no
node at all:

```ts twoslash
// @noErrors
<!--@include: ../../../snippets/clients.ts-->
// ---cut---
// Online: fetch a reference.
const block = await publicClient.getNowBlock()

// Offline: build against it, any number of times.
const unsigned = await walletClient.buildSendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
  blockHeader: block,
})
```

This is also the efficient path for batching: fetch one reference, build many
transactions against it, rather than a round trip per transaction.

## Every action, both forms

| Action                                                    | Build-only twin           |
| ---------------------------------------------------------- | ------------------------- |
| [`sendTrx`](/docs/actions/wallet/sendTrx)                  | `buildSendTrx`             |
| [`sendTrc10`](/docs/actions/wallet/sendTrc10)              | `buildSendTrc10`           |
| [`writeContract`](/docs/actions/wallet/writeContract)      | `buildWriteContract`       |
| [`deployContract`](/docs/actions/wallet/deployContract)    | `buildDeployContract`      |
| [`freezeBalanceV2`](/docs/actions/wallet/freezeBalanceV2)  | `buildFreezeBalanceV2`     |
| [`delegateResource`](/docs/actions/wallet/delegateResource)| `buildDelegateResource`    |
| …and the rest of the [catalog](/docs/actions/wallet/catalog) | `build` + the action name |
