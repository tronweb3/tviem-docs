---
description: Create an Account from your own signing functions.
title: toAccount
---

# toAccount

Creates an Account from a signing source you control — a browser wallet, a
hardware device, an HSM, a remote signing service. The private key never enters
your process.

## Import

```ts twoslash
import { toAccount } from '@tronweb3/tviem'
```

## Usage

Supply an address and the signing functions:

```ts twoslash
// @noErrors
import { toAccount } from '@tronweb3/tviem'

const account = toAccount({
  address: 'TSenderAccountDemoxxxxxxxxxxxxxxxx',
  signTransaction(transaction) {
    // Hand off to your wallet / device, return the transaction with your
    // signature appended.
    return wallet.signTransaction(transaction)
  },
  signMessage({ message }) {
    return wallet.signMessage(message)
  },
  signTypedData(typedData) {
    return wallet.signTypedData(typedData)
  },
})
```

Then use it like any other Account:

```ts twoslash
// @noErrors
import { createWalletClient, http, toAccount } from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'

const account = toAccount({ /* … */ })
// ---cut---
const walletClient = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
})

await walletClient.sendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})
```

tviem builds the transaction, calls your `signTransaction`, and broadcasts what
comes back.

## Private key shorthand

`toAccount` also accepts a private key string, in which case it is exactly
[`privateKeyToAccount`](/docs/accounts/privateKeyToAccount):

```ts twoslash
import { toAccount } from '@tronweb3/tviem'

const account = toAccount(
  '0x0000000000000000000000000000000000000000000000000000000000000001',
)
```

:::warning
This overload gives up the reason to reach for `toAccount`. Passing a key puts
it back in your process, exactly like
[`privateKeyToAccount`](/docs/accounts/privateKeyToAccount) — the signing source
form above is the one that keeps the key somewhere you do not control.

`0x…0001` is a placeholder. Never hard-code a real key; read it from an
environment variable or a secrets manager.
:::

## Returns

`TronCustomAccount` when given a source object, `TronLocalAccount` when given a
private key. The overload picks the right one, so the return type reflects what
you actually passed.

## Parameters

### source.address

- **Type:** `` `T${string}` ``

The Base58Check address the signing source controls. tviem uses it as the
transaction's `owner_address`; it does not verify that your signer actually
holds it.

### source.signTransaction

- **Type:** `(transaction: SignableTransaction) => SignableTransaction`

Signs a transaction. Your implementation should **append** to the transaction's
`signature` list rather than replace it, so a partly-signed multi-signature
transaction survives the round trip.

### source.signMessage

- **Type:** `({ message }) => Signature`

Signs a message. `message` is a UTF-8 string or `{ raw }` for raw bytes.

### source.signTypedData

- **Type:** `(parameters) => Signature`

Signs TIP-712 typed structured data.

## Signing stays synchronous

The account interface is synchronous. If your signer is async — most hardware
and remote signers are — do the signing outside tviem and broadcast the result
yourself:

```ts twoslash
// @noErrors
import { walletClient } from './snippets/walletClient.js'
declare const device: { sign: (tx: unknown) => Promise<any> }
// ---cut---
// 1. Build, without signing.
const unsigned = await walletClient.buildSendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})

// 2. Sign wherever the key lives.
const signed = await device.sign(unsigned)

// 3. Broadcast.
const { txid } = await walletClient.broadcastTransaction({
  signedTransaction: signed,
})
```

See [Build vs. Send](/docs/guides/build-vs-send) for the full pattern.
