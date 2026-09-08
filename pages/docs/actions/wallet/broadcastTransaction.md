---
description: Broadcast a signed transaction.
title: broadcastTransaction
---

# broadcastTransaction

Broadcasts an already-signed transaction to the network.

This is the last step of the split flow — build, sign, broadcast. When you do
not need the steps apart, [`sendTrx`](/docs/actions/wallet/sendTrx) and friends
do all three.

## Usage

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

## Returns

`BroadcastTransactionReturnType`

| Field         | Type                  | Meaning                                        |
| ------------- | --------------------- | ---------------------------------------------- |
| `txid`        | `string`              | The transaction id                              |
| `result`      | `boolean`             | The node's acknowledgement — a rejection throws |
| `code`        | `string`              | The node's response code                        |
| `message`     | `string`              | The node's message, hex-decoded when decodable  |
| `transaction` | `SignableTransaction` | The transaction that was sent                   |

:::warning
This action returns **`txid`**, lowercase — matching TRON's broadcast endpoint.
The build-and-broadcast actions like [`sendTrx`](/docs/actions/wallet/sendTrx)
return **`txID`**, matching TRON's transaction model. Both are the same hash;
tviem does not rewrite either spelling.
:::

## Parameters

### signedTransaction

- **Type:** `SignableTransaction`

A transaction carrying at least one signature. Broadcasting an unsigned
transaction is rejected by the node.

## Broadcasting from elsewhere

Because the transaction is just data, the signing step can happen anywhere — a
hardware wallet, an offline machine, a co-signer service:

```ts twoslash
// @noErrors
<!--@include: ../../../../snippets/walletClient.ts-->
declare const device: { sign: (tx: unknown) => Promise<any> }
// ---cut---
const unsigned = await walletClient.buildSendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})

// Serialize, hand off, get it back signed.
const signed = await device.sign(unsigned)

const { txid } = await walletClient.broadcastTransaction({
  signedTransaction: signed,
})
```

## broadcastHex

If what you have is a hex-encoded transaction rather than the object,
`broadcastHex` takes that instead:

```ts twoslash
// @noErrors
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
const result = await walletClient.broadcastHex({
  transaction: '0a02...',
})
```

## Related

- [Build vs. Send](/docs/guides/build-vs-send)
- [`signTransaction`](/docs/actions/wallet/signTransaction)
- [`waitForTransactionReceipt`](/docs/actions/public/waitForTransactionReceipt) —
  what happened after the broadcast
