---
description: Set up a Wallet Client to sign and broadcast on TRON.
title: Wallet Client
---

# Wallet Client

A Wallet Client is an interface to TRON's write methods — transfers, contract
calls, signing, staking and broadcasting. It is created with
[`createWalletClient`](#createwalletclient).

## Import

```ts twoslash
import { createWalletClient } from '@tronweb3/tviem'
```

## Usage

Attach an [Account](/docs/accounts/intro) and every write action can omit it:

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
```

Then consume [Wallet Actions](/docs/actions/wallet/introduction):

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
// ---cut---
const { txID } = await walletClient.sendTrx({ // [!code focus:4]
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})
```

## Account hoisting

An `account` on the Client is *hoisted* — every action inherits it, so you pass
it once instead of on every call.

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
// ---cut---
// The hoisted account signs.
await walletClient.sendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})
```

You can still override it per call — useful when one process signs for several
keys:

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
// ---cut---
const other = privateKeyToAccount(
  '0x0000000000000000000000000000000000000000000000000000000000000002',
)

await walletClient.sendTrx({
  account: other, // [!code focus]
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})
```

If you omit `account` on both the Client and the call, the action throws an
`AccountNotFoundError`.

## Parameters

### account (optional)

- **Type:** `TronAccount | AccountKey`

The Account to hoist. Either a built [Account](/docs/accounts/intro), or a
private key — `0x`-prefixed or bare hex — which is resolved to a local account
for you.

```ts twoslash
import { createWalletClient, http } from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'
// ---cut---
const walletClient = createWalletClient({
  account: '0x0000000000000000000000000000000000000000000000000000000000000001', // [!code focus]
  chain: mainnet,
  transport: http(),
})
```

:::warning
`0x…0001` is a counting placeholder. A key written inline like this is a key in
your git history — read it from an environment variable or a secrets manager
instead.

Hoisting also means every write action on this Client can sign without naming the
account. That is the convenience; it is also why a Wallet Client should be
constructed where the signing authority belongs, and never handed to code that
only needs to read. Give that code a
[Public Client](/docs/clients/public) instead.
:::

### chain

- **Type:** `Chain`

The [Chain](/docs/chains/intro) of the Client.

### transport

- **Type:** `Transport`

The [Transport](/docs/clients/transports/http) of the Client.

### key (optional)

- **Type:** `string`
- **Default:** `"wallet"`

### name (optional)

- **Type:** `string`
- **Default:** `"Wallet Client"`

### pollingInterval (optional)

- **Type:** `number`

### cacheTime (optional)

- **Type:** `number`

## Available actions

Every write action listed in the
[full catalog](/docs/actions/wallet/catalog), plus a `build*` twin for each that
stops at the unsigned transaction — see
[Build vs. Send](/docs/guides/build-vs-send).

| Group     | Actions                                                                                    |
| --------- | ------------------------------------------------------------------------------------------ |
| Transfer  | [`sendTrx`](/docs/actions/wallet/sendTrx), [`sendTrc10`](/docs/actions/wallet/sendTrc10)     |
| Contract  | [`writeContract`](/docs/actions/wallet/writeContract), [`deployContract`](/docs/actions/wallet/deployContract) |
| Signing   | [`signTransaction`](/docs/actions/wallet/signTransaction), [`signMessage`](/docs/actions/wallet/signMessage), [`signTypedData`](/docs/actions/wallet/signTypedData), [`multiSign`](/docs/actions/wallet/multiSign) |
| Broadcast | [`broadcastTransaction`](/docs/actions/wallet/broadcastTransaction), [`broadcastHex`](/docs/actions/wallet/broadcastTransaction#broadcasthex) |
| Resources | [`freezeBalanceV2`](/docs/actions/wallet/freezeBalanceV2), [`delegateResource`](/docs/actions/wallet/delegateResource), and the rest of the staking family |
| Governance | Proposals, witnesses, exchanges, TRC-10 assets, account permissions                        |
