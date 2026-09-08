---
description: Fetch a transaction by id.
title: getTransaction
---

# getTransaction

Fetches a transaction by its id — what was *submitted*, not what it did. For the
execution outcome, use
[`getTransactionInfo`](/docs/actions/public/getTransactionInfo).

## Usage

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const transaction = await publicClient.getTransaction({
  hash: '5f2b1d4e8c3a9f0b6d7e2c1a4b5f8e9d0c3a6b7f2e1d4c5a8b9f0e3d6c7a2b1f',
})
```

## Returns

`SignableTransaction & { ret?: readonly TransactionRet[] } | null`

`null` when the node does not know the transaction — it was never broadcast, has
not propagated yet, or (with `confirmed: true`) has not solidified.

The `ret` array carries the coarse result TRON attaches to a transaction, with
`contractRet` such as `'SUCCESS'` or `'REVERT'`.

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const transaction = await publicClient.getTransaction({
  hash: '5f2b1d4e8c3a9f0b6d7e2c1a4b5f8e9d0c3a6b7f2e1d4c5a8b9f0e3d6c7a2b1f',
})

if (transaction === null) {
  // Unknown to this node.
} else {
  transaction.txID
  transaction.ret?.[0]?.contractRet
}
```

## Parameters

### hash

- **Type:** `string`

The transaction id — 64 hex characters, no `0x` prefix. This is the `txID`
returned by write actions like [`sendTrx`](/docs/actions/wallet/sendTrx).

### confirmed (optional)

- **Type:** `boolean`
- **Default:** `false`

Read from the SolidityNode. A just-broadcast transaction reads as `null` there
until it solidifies.

## Related

- [`getTransactionInfo`](/docs/actions/public/getTransactionInfo) — the receipt:
  fees, energy, logs, status
- [`waitForTransactionReceipt`](/docs/actions/public/waitForTransactionReceipt) —
  poll until the receipt exists
