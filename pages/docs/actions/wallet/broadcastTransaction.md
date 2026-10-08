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

:::warning
A transaction carrying an `int64` past `2^53 − 1` — an `amount`, `call_value`
or staked balance above roughly 9 billion TRX in SUN, or a large TRC-10
amount — is rejected on this path with `CONTRACT_VALIDATE_ERROR`. Broadcast it
with [`broadcastHex`](#broadcasthex) instead. See
[Very large integers](#very-large-integers).
:::

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

The byte-exact counterpart. `broadcastHex` takes the full signed `Transaction`
protobuf as hex, and the node relays those bytes as they are, without
re-parsing any JSON. `toBroadcastHex` produces that hex from a signed
transaction.

### Very large integers

`broadcastTransaction` sends the transaction as JSON, and the node rebuilds the
protobuf from `raw_data` — `raw_data_hex` is ignored server-side. An `int64`
past `2^53 − 1` does not survive that trip: tviem renders it as a decimal
string to keep it exact, but java-tron reads `int64` fields as bare numbers
only, so the node fails to parse the contract and rejects the transaction with
`CONTRACT_VALIDATE_ERROR` — `No contract!`.

The threshold is 9,007,199,254,740,991 SUN, roughly 9 billion TRX. It applies
to every `int64` in the transaction model — the `amount` of a TRX or TRC-10
transfer, `call_value`, a frozen or delegated balance — and is easiest to cross
with a TRC-10 token at high precision. ABI-encoded arguments are not affected:
a `uint256` token amount passed to `writeContract` travels as hex in `data`.

For such a transaction, broadcast the bytes instead. The build-and-broadcast
actions (`sendTrx`, `sendTrc10`, …) take the JSON path too, so split the flow —
build, sign, then `broadcastHex`:

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
import { toBroadcastHex } from '@tronweb3/tviem'

// 10 billion TRX in SUN — past 2^53, so the JSON path cannot carry it.
const unsigned = await walletClient.buildSendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 10_000_000_000_000_000n,
})
const signed = await walletClient.signTransaction({ transaction: unsigned })

const { txid } = await walletClient.broadcastHex({
  transaction: toBroadcastHex(signed),
})
```

### Bytes from elsewhere

The hex can also come from another stack entirely — TronWeb, a hardware
wallet, a co-signer service. Wire fields tviem's JSON model does not represent
survive untouched:

```ts twoslash
// @noErrors
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
const { txid } = await walletClient.broadcastHex({
  transaction: '0a02...',
})
```

### Parameters

#### transaction

- **Type:** `string`

The full signed `Transaction` protobuf as hex — `toBroadcastHex` output, or
bytes serialized elsewhere. Bare or `0x`-prefixed, any case. It must carry
exactly one `raw_data` and at least one signature; anything else is refused
before a request is sent.

### Returns

`BroadcastHexReturnType`

| Field         | Type      | Meaning                                                     |
| ------------- | --------- | ----------------------------------------------------------- |
| `txid`        | `string`  | The transaction id, computed locally from the relayed bytes |
| `result`      | `boolean` | The node's acknowledgement — a rejection throws             |
| `code`        | `string`  | The node's response code                                    |
| `message`     | `string`  | The node's message, hex-decoded when decodable              |
| `transaction` | `unknown` | The node's own decoding of the bytes, when echoed           |

## Related

- [Build vs. Send](/docs/guides/build-vs-send)
- [`signTransaction`](/docs/actions/wallet/signTransaction)
- [`waitForTransactionReceipt`](/docs/actions/public/waitForTransactionReceipt) —
  what happened after the broadcast
