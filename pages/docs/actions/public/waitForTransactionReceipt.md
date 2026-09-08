---
description: Wait for a transaction's receipt.
title: waitForTransactionReceipt
---

# waitForTransactionReceipt

Polls until a transaction's receipt is available, then returns it.

A broadcast that the node accepted has not executed yet. This is how you learn
what actually happened.

## Usage

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const receipt = await publicClient.waitForTransactionReceipt({
  hash: '5f2b1d4e8c3a9f0b6d7e2c1a4b5f8e9d0c3a6b7f2e1d4c5a8b9f0e3d6c7a2b1f',
})
```

End to end, with a write:

```ts twoslash
<!--@include: ../../../../snippets/clients.ts-->
// ---cut---
const { txID } = await walletClient.sendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})

const receipt = await publicClient.waitForTransactionReceipt({ hash: txID })

if (receipt.status === 'reverted') throw new Error('transfer reverted')
```

## Returns

`TransactionInfo`

The same shape as
[`getTransactionInfo`](/docs/actions/public/getTransactionInfo), but never
`null` — the action waits until it exists.

## Parameters

### hash

- **Type:** `string`

The transaction id to wait on.

### confirmed (optional)

- **Type:** `boolean`
- **Default:** `true`

Wait for a **solidified** (irreversible) receipt, reading both it and the
confirmation head from the SolidityNode.

Pass `false` to resolve as soon as the transaction is packed, reading from the
FullNode. That is enough to learn the execution outcome — `status`, the energy
and fee burned, `contractResult`, `logs` — but the block it landed in can still
be reorganized away.

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
// Return as soon as it is packed — faster, reversible.
const receipt = await publicClient.waitForTransactionReceipt({
  hash: '5f2b1d4e8c3a9f0b6d7e2c1a4b5f8e9d0c3a6b7f2e1d4c5a8b9f0e3d6c7a2b1f',
  confirmed: false, // [!code focus]
})
```

Solidification trails the chain head, so the default waits considerably longer
than packing does — on the order of a minute rather than a few seconds.

### confirmations (optional)

- **Type:** `number`
- **Default:** `1`

Block depth to wait for, where the including block itself counts as the first
confirmation: `head - receipt.blockNumber + 1 >= confirmations`.

`1` returns as soon as the receipt is available. Each further confirmation costs
one block of waiting.

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const receipt = await publicClient.waitForTransactionReceipt({
  hash: '5f2b1d4e8c3a9f0b6d7e2c1a4b5f8e9d0c3a6b7f2e1d4c5a8b9f0e3d6c7a2b1f',
  confirmed: false,
  confirmations: 20, // [!code focus]
})
```

:::warning
Block depth is only a proxy for irreversibility. With `confirmed: false` and
`confirmations > 1`, the inclusion block is read once at packing and the depth
counted from it — a reorg *after* packing is not re-checked while counting. For
real finality use `confirmed: true`, where a SolidityNode receipt cannot reorg.
:::

## Polling interval

Polling uses the Client's `pollingInterval`, which defaults to the chain's
`blockTime` (3000ms on mainnet). Override it on the Client:

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts#imports-->
// ---cut---
const publicClient = createPublicClient({
  chain: mainnet,
  pollingInterval: 1_000, // [!code focus]
  transport: http(),
})
```
