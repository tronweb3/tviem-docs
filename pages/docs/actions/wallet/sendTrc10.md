---
description: Send a TRC-10 asset.
title: sendTrc10
---

# sendTrc10

Sends a TRC-10 asset. TRC-10 tokens are native to the TRON protocol — they are
not contracts, so transferring one costs no energy.

## Usage

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
const { txID } = await walletClient.sendTrc10({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  assetName: '1000001',
  amount: 100n,
})
```

## Returns

`BuildAndBroadcastReturnType`

## Parameters

### to

- **Type:** `` `T${string}` ``

The recipient's Base58Check address.

### assetName

- **Type:** `FlexInput`

The TRC-10 asset id. On modern TRON this is the numeric id assigned at issuance
(`1000001` and up), which the node accepts as a decimal string.

### amount

- **Type:** `bigint`

Amount to send, in the asset's own smallest unit. TRC-10 precision is set by the
issuer, so this is *not* necessarily 6 decimals like TRX — check the asset.

### account (optional)

- **Type:** `TronAccount | AccountKey`

### memo (optional)

- **Type:** `Hex | ByteArray`

Costs an extra memo fee — see [`sendTrx`](/docs/actions/wallet/sendTrx#memo-optional).

### expirationMs (optional)

- **Type:** `bigint | number`

### blockHeader (optional)

- **Type:** `TransactionHeader`

## Building without sending

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
const unsigned = await walletClient.buildSendTrc10({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  assetName: '1000001',
  amount: 100n,
})
```

## TRC-10 vs. TRC-20

| | TRC-10 | TRC-20 |
| --- | --- | --- |
| Implementation | Native protocol asset | TVM contract |
| Transfer cost | Bandwidth only | Bandwidth **and** energy |
| tviem action | `sendTrc10` | [`writeContract`](/docs/actions/wallet/writeContract) |
| Precision | Set by the issuer | From the contract's `decimals()` |

Most tokens you will meet — USDT included — are TRC-20.

## Related

- [`sendTrx`](/docs/actions/wallet/sendTrx) — native TRX
- [Full catalog](/docs/actions/wallet/catalog) — issuing and updating TRC-10
  assets
