---
description: Send native TRX.
title: sendTrx
---

# sendTrx

Sends native TRX. Builds, signs and broadcasts in one call.

## Usage

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
const { txID } = await walletClient.sendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})
```

Amounts are in **SUN**. Convert from a human figure with
[`parseTrx`](/docs/utilities/units):

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
import { parseTrx } from '@tronweb3/tviem'

const { txID } = await walletClient.sendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: parseTrx('1.5'), // [!code focus]
})
```

## Returns

`BuildAndBroadcastReturnType`

`txID` means the node accepted the broadcast, not that the transfer completed.
To confirm:

```ts twoslash
<!--@include: ../../../../snippets/clients.ts-->
// ---cut---
const { txID } = await walletClient.sendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})

const receipt = await publicClient.waitForTransactionReceipt({ hash: txID })
```

## Parameters

### to

- **Type:** `` `T${string}` ``

The recipient's Base58Check address.

### amount

- **Type:** `bigint`

Amount to send, in SUN.

### account (optional)

- **Type:** `TronAccount | AccountKey`

The signing account. Falls back to the Client's hoisted account; if neither is
set, throws `AccountNotFoundError`.

### memo (optional)

- **Type:** `Hex | ByteArray`

A memo written to the transaction's `raw_data.data`. It is **hex or raw bytes**,
not a plain string — encode text with `stringToHex`:

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
import { stringToHex } from '@tronweb3/tviem'

const { txID } = await walletClient.sendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
  memo: stringToHex('invoice 4213'), // [!code focus]
})
```

:::warning
A memo is not free. The chain charges a memo fee on top of the transaction's
normal costs — the `getMemoFee` chain parameter, **1 TRX** on mainnet and Nile.

An empty memo is rejected rather than ignored: zero bytes serialize to no field
at all, which would silently build a memo-less transaction.
:::

### expirationMs (optional)

- **Type:** `bigint | number`

Transaction lifetime in milliseconds, applied to the chain-derived timestamp.
After it elapses the transaction can no longer be included.

### blockHeader (optional)

- **Type:** `TransactionHeader`

A pre-derived TaPoS reference and timing header. Supply it to build without a
round trip to the node — useful when signing offline or batching many
transactions against one block reference.

## Building without sending

`buildSendTrx` takes the same parameters and returns the unsigned transaction:

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
const unsigned = await walletClient.buildSendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
  permissionId: 2, // [!code focus]
})
```

See [Build vs. Send](/docs/guides/build-vs-send).

## Related

- [`sendTrc10`](/docs/actions/wallet/sendTrc10) — TRC-10 assets
- [`writeContract`](/docs/actions/wallet/writeContract) — TRC-20 and other
  contract transfers
