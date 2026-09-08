---
description: Delegate bandwidth or energy to another account.
title: delegateResource
---

# delegateResource

Lends bandwidth or energy from your stake to another account, without
transferring the underlying TRX.

This is how a dApp sponsors its users' energy: stake once, delegate to whoever
needs it, reclaim it later.

## Usage

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
const { txID } = await walletClient.delegateResource({
  receiverAddress: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  balance: 1_000_000_000n,
  resource: 'ENERGY',
})
```

## Returns

`BuildAndBroadcastReturnType`

## Parameters

### receiverAddress

- **Type:** `` `T${string}` ``

The account receiving the resource.

### balance

- **Type:** `bigint`

The amount of **staked TRX**, in SUN, whose resource share is delegated — not
the resource units themselves. How much energy that yields depends on the
network-wide pool.

### resource

- **Type:** `'BANDWIDTH' | 'ENERGY'`

### lock (optional)

- **Type:** `boolean`

Lock the delegation, preventing you from reclaiming it before `lockPeriod`
elapses. Without a lock you can undelegate at any time — which also means the
receiver cannot rely on it.

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
const { txID } = await walletClient.delegateResource({
  receiverAddress: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  balance: 1_000_000_000n,
  resource: 'ENERGY',
  lock: true, // [!code focus:2]
  lockPeriod: 86_400n,
})
```

### lockPeriod (optional)

- **Type:** `bigint`

How long the lock lasts, in blocks. With TRON's 3-second blocks, one day is
28,800 blocks.

### account (optional)

- **Type:** `TronAccount | AccountKey`

### blockHeader (optional)

- **Type:** `TransactionHeader`

## Reclaiming

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
await walletClient.undelegateResource({
  receiverAddress: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  balance: 1_000_000_000n,
  resource: 'ENERGY',
})
```

A locked delegation cannot be reclaimed until its lock period has elapsed.

## Related

- [`freezeBalanceV2`](/docs/actions/wallet/freezeBalanceV2) — you must stake
  before you can delegate
- [`getAccountResources`](/docs/actions/public/getAccountResources)
- [Resources & Staking](/docs/guides/resources)
