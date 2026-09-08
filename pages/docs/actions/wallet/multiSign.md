---
description: Co-sign a transaction under a multi-signature permission.
title: multiSign
---

# multiSign

Co-signs a transaction under a specific permission id, for TRON's
multi-signature accounts.

## Background

A TRON account can carry weighted permissions: several keys, each with a weight,
and a threshold that the accumulated weight must reach before a transaction is
valid. `multiSign` adds one signer's contribution.

## Usage

Build under the permission, then collect signatures:

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
// 1. Build under permission 2.
const unsigned = await walletClient.buildSendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
  permissionId: 2,
})

// 2. Each signer adds their signature.
const once = await walletClient.multiSign({
  transaction: unsigned,
  privateKey:
    '0x0000000000000000000000000000000000000000000000000000000000000001',
  permissionId: 2,
})

const twice = await walletClient.multiSign({
  transaction: once,
  privateKey:
    '0x0000000000000000000000000000000000000000000000000000000000000002',
  permissionId: 2,
})

// 3. Broadcast once the threshold is met.
const { txid } = await walletClient.broadcastTransaction({
  signedTransaction: twice,
})
```

Signatures accumulate, so the transaction can travel between signers — each one
passes it through `multiSign` and hands it on.

:::warning
The keys above are counting placeholders (`0x…0001`, `0x…0002`).

`multiSign` is the one action that takes a **raw private key** rather than an
[Account](/docs/accounts/intro), so a real key is live at the call site. Fetch it
from your secret store immediately before the call rather than threading it
through configuration or your own objects.

The sample also shows two signers in one process, which is what a multi-signature
account exists to avoid. In a real setup each key lives with its own holder and
only the partly-signed transaction travels between them.
:::

## Checking whether you have enough

Before broadcasting, ask the node whether the accumulated weight clears the
threshold:

```ts twoslash
// @noErrors
<!--@include: ../../../../snippets/clients.ts-->
declare const signedTransaction: any
// ---cut---
const weight = await publicClient.getSignWeight({
  transaction: signedTransaction,
})

const approved = await publicClient.getApprovedList({
  transaction: signedTransaction,
})
```

`getSignWeight` returns the accumulated weight against the permission's
threshold; `getApprovedList` returns the addresses that have already signed.

## Returns

`SignableTransaction`

The transaction with one more signature attached.

## Parameters

### transaction

- **Type:** `SignableTransaction`

The transaction to co-sign — fresh, or already carrying other signatures.

### privateKey

- **Type:** `Hex | string`

A signer's secp256k1 private key, `0x`-prefixed or bare hex.

Note this takes a **key**, not an Account — multi-signature flows usually
assemble signatures from several separate key holders rather than from one
hoisted account.

### permissionId (optional)

- **Type:** `number`

The permission the signature is made under. It must match the permission the
transaction was built with — a mismatch produces a signature the chain will not
count.

## Setting up permissions

Changing an account's permission structure is its own action:

```ts twoslash
// @noErrors
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
await walletClient.accountPermissionUpdate({
  owner: { /* … */ },
  actives: [ /* … */ ],
})
```

See the [full catalog](/docs/actions/wallet/catalog).

## Related

- [`signTransaction`](/docs/actions/wallet/signTransaction) — single-signature
- [`broadcastTransaction`](/docs/actions/wallet/broadcastTransaction)
- [Building a Wallet](/docs/guides/wallet)
