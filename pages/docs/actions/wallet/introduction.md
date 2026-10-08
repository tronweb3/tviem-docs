---
description: An introduction to Wallet Actions.
title: Wallet Actions
---

# Wallet Actions

Wallet Actions write to TRON. They are available on a
[Wallet Client](/docs/clients/wallet), and each one needs an
[Account](/docs/accounts/intro) — hoisted onto the Client, or passed per call.

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
const { txID } = await walletClient.sendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})
```

## Every action has a `build*` twin

This is the shape that distinguishes tviem's write layer. For each action there
are two functions with the same parameters:

- `sendTrx` — builds, signs and broadcasts.
- `buildSendTrx` — builds and stops, returning the **unsigned** transaction.

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
// One call, three steps.
const result = await walletClient.sendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})

// Or stop at the transaction and route it elsewhere.
const unsigned = await walletClient.buildSendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})
```

`build*` variants also accept `permissionId`, for building under a specific
multi-signature permission. See [Build vs. Send](/docs/guides/build-vs-send).

## What a write returns

Build-and-broadcast actions return:

| Field         | Type                  | Meaning                                          |
| ------------- | --------------------- | ------------------------------------------------ |
| `txID`        | `string`              | Locally computed transaction id                   |
| `result`      | `boolean`             | The node's acknowledgement — a rejection throws   |
| `code`        | `string`              | The node's response code, when echoed             |
| `message`     | `string`              | The node's message, hex-decoded when decodable    |
| `transaction` | `SignableTransaction` | The signed transaction that was broadcast         |

A returned `txID` means the node **accepted the broadcast**, not that the
transaction executed. For the outcome, wait for the receipt with
[`waitForTransactionReceipt`](/docs/actions/public/waitForTransactionReceipt).

## Actions

### Transfer

| Action                                                | Sends                    |
| ----------------------------------------------------- | ------------------------ |
| [`sendTrx`](/docs/actions/wallet/sendTrx)              | Native TRX               |
| [`sendTrc10`](/docs/actions/wallet/sendTrc10)          | A TRC-10 asset           |

### Contract

| Action                                                        | Does                              |
| ------------------------------------------------------------- | --------------------------------- |
| [`writeContract`](/docs/actions/wallet/writeContract)          | Calls a state-changing function   |
| [`deployContract`](/docs/actions/wallet/deployContract)        | Deploys a contract                |

### Signing

| Action                                                            | Signs                             |
| ----------------------------------------------------------------- | --------------------------------- |
| [`signTransaction`](/docs/actions/wallet/signTransaction)          | A transaction                     |
| [`signMessage`](/docs/actions/wallet/signMessage)                  | A message (TIP-191)               |
| [`signTypedData`](/docs/actions/wallet/signTypedData)              | TIP-712 typed structured data     |
| [`multiSign`](/docs/actions/wallet/multiSign)                      | Co-signs under a permission       |

### Broadcast

| Action                                                                  | Takes                      |
| ------------------------------------------------------------------------ | -------------------------- |
| [`broadcastTransaction`](/docs/actions/wallet/broadcastTransaction)      | A signed transaction       |
| [`broadcastHex`](/docs/actions/wallet/broadcastTransaction#broadcasthex) | A hex-encoded transaction  |

### Resources

| Action                                                          | Does                              |
| ---------------------------------------------------------------- | --------------------------------- |
| [`freezeBalanceV2`](/docs/actions/wallet/freezeBalanceV2)        | Stakes TRX for a resource         |
| [`delegateResource`](/docs/actions/wallet/delegateResource)      | Lends a resource to an account    |

The remaining 30-odd actions — governance, TRC-10 issuance, exchanges, account
permissions — are listed in the
[full catalog](/docs/actions/wallet/catalog).
