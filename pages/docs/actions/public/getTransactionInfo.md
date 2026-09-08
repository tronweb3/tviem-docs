---
description: Fetch a transaction's receipt.
title: getTransactionInfo
---

# getTransactionInfo

Fetches a transaction's receipt — what it actually did: status, fees burned,
energy and bandwidth consumed, return data and emitted logs.

## Usage

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const receipt = await publicClient.getTransactionInfo({
  hash: '5f2b1d4e8c3a9f0b6d7e2c1a4b5f8e9d0c3a6b7f2e1d4c5a8b9f0e3d6c7a2b1f',
})
```

## Returns

`TransactionInfo | null`

`null` when the transaction has not executed yet — it is still pending, or (with
`confirmed: true`) has not solidified.

| Field              | Type                        | Meaning                                    |
| ------------------ | --------------------------- | ------------------------------------------ |
| `id`               | `string`                    | Transaction id                              |
| `blockNumber`      | `bigint`                    | Including block's height                    |
| `blockTimeStamp`   | `bigint`                    | Including block's timestamp (ms)            |
| `status`           | `'success' \| 'reverted'`   | Coarse execution status                     |
| `fee`              | `bigint`                    | Total fee burned (SUN)                      |
| `energyUsage`      | `bigint`                    | Energy consumed by the caller               |
| `energyUsageTotal` | `bigint`                    | Total energy (caller + contract origin)     |
| `energyFee`        | `bigint`                    | Energy paid for in TRX (SUN)                |
| `netUsage`         | `bigint`                    | Bandwidth consumed                          |
| `netFee`           | `bigint`                    | Bandwidth paid for in TRX (SUN)             |
| `contractResult`   | `readonly string[]`         | Raw ABI-encoded return values (bare hex)    |
| `contractAddress`  | `` `T${string}` ``          | Contract called or created                  |
| `logs`             | `readonly TransactionLog[]` | Emitted event logs                          |

## Checking whether it worked

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const receipt = await publicClient.getTransactionInfo({
  hash: '5f2b1d4e8c3a9f0b6d7e2c1a4b5f8e9d0c3a6b7f2e1d4c5a8b9f0e3d6c7a2b1f',
})

if (receipt === null) {
  // Not executed yet.
} else if (receipt.status === 'reverted') {
  // Packed, but the call reverted — energy was still burned.
} else {
  receipt.energyUsageTotal
  //      ^?
}
```

A reverted transaction is still a transaction: it occupies a block and burns
what it consumed. `status: 'reverted'` is not an error, and `getTransactionInfo`
does not throw for it.

## Parameters

### hash

- **Type:** `string`

The transaction id — 64 hex characters, no `0x` prefix.

### confirmed (optional)

- **Type:** `boolean`
- **Default:** `false`

Read the receipt from the SolidityNode, which only carries solidified
transactions.

## Related

- [`waitForTransactionReceipt`](/docs/actions/public/waitForTransactionReceipt) —
  poll until this returns non-`null`
- [`getTransaction`](/docs/actions/public/getTransaction) — what was submitted
