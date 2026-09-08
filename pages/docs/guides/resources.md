---
description: Energy, bandwidth, staking and delegation on TRON.
title: Resources & Staking
---

# Resources & Staking

TRON does not charge gas the way Ethereum does. It meters two resources
separately, and you can either burn TRX for them or stake TRX to get them for
free.

Getting this wrong is the most common cause of a transaction that gets packed
and then reverts.

## Bandwidth and energy

| Resource      | Consumed by                         | If you have none                 |
| ------------- | ----------------------------------- | -------------------------------- |
| **Bandwidth** | Every transaction, by byte size     | TRX is burned at the bandwidth price |
| **Energy**    | TVM execution — contract calls only | TRX is burned, capped by `feeLimit` |

A plain TRX transfer consumes bandwidth only. A TRC-20 transfer consumes both,
and the energy is the expensive part.

Every account gets a small **free daily bandwidth allowance**, which is enough
for a few simple transfers a day. There is no free energy.

## Reading what you have

```ts twoslash
<!--@include: ../../../snippets/clients.ts-->
// ---cut---
const r = await publicClient.getAccountResources({ address: account.address })

const bandwidthAvailable =
  r.freeNetLimit - r.freeNetUsed + (r.netLimit - r.netUsed)

const energyAvailable = r.energyLimit - r.energyUsed
```

The response carries limits and usage separately; what you can spend is the
difference. See
[`getAccountResources`](/docs/actions/public/getAccountResources).

## feeLimit: the cap that matters

`feeLimit` is the maximum TRX, in SUN, you will burn buying energy for a
contract call. It is a **cap**, not a fee — you are charged what the call
actually uses, up to that ceiling.

Set it too low and the transaction is packed, runs out of energy mid-execution,
and reverts. The energy consumed up to that point is still burned. You paid for
nothing.

```ts twoslash
<!--@include: ../../../snippets/clients.ts-->
<!--@include: ../../../snippets/trc20Abi.ts-->
// ---cut---
import { getEnergyFee } from '@tronweb3/tviem'

const call = {
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'transfer',
  args: ['TRecipientAccountDemoxxxxxxxxxxxxx', 1_000_000n],
} as const

// 1. What will this call consume?
const energy = await publicClient.estimateEnergy({ account, ...call })

// 2. What does energy cost right now?
const energyFee = getEnergyFee(await publicClient.getChainParameters())

// 3. Cap it, with headroom for state that moved since the estimate.
await walletClient.writeContract({
  ...call,
  feeLimit: (energy * energyFee * 120n) / 100n,
})
```

Estimates are made against current state. A first write to a storage slot costs
more than an update, and someone else may have touched that slot between your
estimate and your send — hence the headroom.

## Staking for resources

Staking locks TRX and gives you a share of the network's resource pool
proportional to your stake. The TRX is not spent, and staking also produces TRON
power for voting.

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
// ---cut---
await walletClient.freezeBalanceV2({
  frozenBalance: 1_000_000_000n, // 1000 TRX
  resource: 'ENERGY',
})
```

Your share is relative: the same stake yields less energy when more TRX is
staked network-wide. `totalEnergyLimit` and `totalNetWeight` from
[`getAccountResources`](/docs/actions/public/getAccountResources) are what move.

### Unstaking takes 14 days

```ts twoslash
// @noErrors
<!--@include: ../../../snippets/walletClient.ts-->
// ---cut---
// 1. Start the clock.
await walletClient.unfreezeBalanceV2({
  unfreezeBalance: 1_000_000_000n,
  resource: 'ENERGY',
})

// 2. Fourteen days later.
await walletClient.withdrawExpireUnfreeze({})
```

The resource is withdrawn immediately; only the TRX waits. `cancelAllUnfreezeV2`
aborts pending unstakes and restakes the TRX.

## Delegating to someone else

You can lend your staked resources to another account without moving the TRX.
This is how a dApp sponsors its users' energy.

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
// ---cut---
await walletClient.delegateResource({
  receiverAddress: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  balance: 1_000_000_000n,
  resource: 'ENERGY',
})
```

`balance` is the amount of **staked TRX** whose share you are delegating, not a
number of energy units.

An unlocked delegation can be reclaimed at any moment, which means the receiver
cannot depend on it. Lock it if they need to:

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
// ---cut---
await walletClient.delegateResource({
  receiverAddress: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  balance: 1_000_000_000n,
  resource: 'ENERGY',
  lock: true,
  lockPeriod: 28_800n, // one day, at 3s blocks
})
```

`lockPeriod` is in **blocks**, not seconds. TRON produces a block every 3
seconds, so a day is 28,800.

## Choosing a strategy

| Situation                                  | Do this                                        |
| ------------------------------------------ | ---------------------------------------------- |
| Occasional transfers                       | Nothing — the free bandwidth allowance covers it |
| Regular contract calls                     | Stake for energy                                |
| Sponsoring users' transactions             | Stake, then delegate                            |
| One-off large call                         | Burn TRX, with a `feeLimit` you sized first     |
| Predictable heavy load                     | Stake for both bandwidth and energy             |

## Related

- [`getAccountResources`](/docs/actions/public/getAccountResources)
- [`estimateEnergy`](/docs/actions/public/estimateEnergy)
- [`freezeBalanceV2`](/docs/actions/wallet/freezeBalanceV2)
- [`delegateResource`](/docs/actions/wallet/delegateResource)
