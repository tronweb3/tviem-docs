---
description: Stake TRX for bandwidth or energy.
title: freezeBalanceV2
---

# freezeBalanceV2

Stakes TRX to obtain bandwidth or energy under Stake 2.0.

Staked TRX is not spent — it is locked, and produces a share of the network's
resource pool proportional to your stake. It also produces TRON power for
voting.

## Usage

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
const { txID } = await walletClient.freezeBalanceV2({
  frozenBalance: 1_000_000_000n,
  resource: 'ENERGY',
})
```

## Returns

`BuildAndBroadcastReturnType`

## Parameters

### frozenBalance

- **Type:** `bigint`

Amount of TRX to stake, in SUN.

### resource

- **Type:** `'BANDWIDTH' | 'ENERGY'`

Which resource the stake produces.

| Resource    | Pays for                                                |
| ----------- | ------------------------------------------------------- |
| `BANDWIDTH` | Transaction size — every transaction consumes some       |
| `ENERGY`    | TVM execution — only contract calls consume it           |

A plain TRX transfer needs bandwidth only. A TRC-20 transfer needs both.

### account (optional)

- **Type:** `TronAccount | AccountKey`

### memo (optional)

- **Type:** `Hex | ByteArray`

### expirationMs (optional)

- **Type:** `bigint | number`

### blockHeader (optional)

- **Type:** `TransactionHeader`

## Unstaking

Unstaking is a two-step process with a mandatory delay:

```ts twoslash
// @noErrors
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
// 1. Begin unstaking. The TRX enters a 14-day waiting period.
await walletClient.unfreezeBalanceV2({
  unfreezeBalance: 1_000_000_000n,
  resource: 'ENERGY',
})

// 2. After the waiting period, withdraw it.
await walletClient.withdrawExpireUnfreeze({})
```

`cancelAllUnfreezeV2` aborts pending unstakes and returns the TRX to staked
state.

## Checking what you have

```ts twoslash
<!--@include: ../../../../snippets/clients.ts-->
// ---cut---
const r = await publicClient.getAccountResources({ address: account.address })

const energyAvailable = r.energyLimit - r.energyUsed
```

## Related

- [`delegateResource`](/docs/actions/wallet/delegateResource) — lend the
  resource to another account
- [`getAccountResources`](/docs/actions/public/getAccountResources)
- [Resources & Staking](/docs/guides/resources)
