---
description: Sign a transaction without broadcasting it.
title: signTransaction
---

# signTransaction

Signs a transaction, appending to its signature list. Nothing is broadcast.

## Usage

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
const unsigned = await walletClient.buildSendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})

const signed = await walletClient.signTransaction({ transaction: unsigned })
```

Then broadcast it whenever you are ready:

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
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

## Signatures append

`signTransaction` adds to the transaction's `signature` list rather than
replacing it. That is what makes multi-signature work: pass the same transaction
through several accounts in turn and each signature accumulates.

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
const second = privateKeyToAccount(
  '0x0000000000000000000000000000000000000000000000000000000000000002',
)

const unsigned = await walletClient.buildSendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
  permissionId: 2,
})

const once = await walletClient.signTransaction({ transaction: unsigned })
const twice = await walletClient.signTransaction({
  transaction: once,
  account: second, // [!code focus]
})
```

:::warning
`0x…0002` is a placeholder. Never hard-code a real key — read it from an
environment variable or a secrets manager, or keep it out of your process with
[`toAccount`](/docs/accounts/toAccount).

Holding both signers in one process, as this sample does for brevity, defeats
the point of a multi-signature account. Real co-signers each hold their own key;
only the partly-signed transaction moves between them.
:::

For the permission-aware version, use
[`multiSign`](/docs/actions/wallet/multiSign).

## Returns

`SignableTransaction`

The transaction with one more signature attached.

## Parameters

### transaction

- **Type:** `SignableTransaction`

The transaction to sign — freshly built, or already carrying signatures.

### account (optional)

- **Type:** `TronAccount | AccountKey`

The signing account. Falls back to the Client's hoisted account.

## Related

- [Build vs. Send](/docs/guides/build-vs-send)
- [`multiSign`](/docs/actions/wallet/multiSign)
- [`broadcastTransaction`](/docs/actions/wallet/broadcastTransaction)
