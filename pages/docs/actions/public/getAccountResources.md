---
description: Read an account's bandwidth, energy and TRON power budget.
title: getAccountResources
---

# getAccountResources

Reads an account's bandwidth (net), energy and TRON-power (voting) budget —
both what is available and what has been used.

## Usage

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const resources = await publicClient.getAccountResources({
//    ^?
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
})
```

## Returns

`GetAccountResourcesReturnType`

Every field is a `bigint`, in the resource's own units. TRON omits zero-valued
fields from its response; those come back as `0n`.

| Field                | Meaning                                                    |
| -------------------- | ---------------------------------------------------------- |
| `freeNetLimit`       | Free daily bandwidth allowance                              |
| `freeNetUsed`        | Free bandwidth consumed today                               |
| `netLimit`           | Bandwidth from staking                                      |
| `netUsed`            | Staked bandwidth consumed                                   |
| `energyLimit`        | Energy from staking                                         |
| `energyUsed`         | Energy consumed                                             |
| `tronPowerLimit`     | Total TRON power (voting weight)                            |
| `tronPowerUsed`      | TRON power already cast in votes                            |
| `totalNetLimit`      | Network-wide free bandwidth pool                            |
| `totalNetWeight`     | Network-wide TRX staked for bandwidth                       |
| `totalEnergyLimit`   | Network-wide energy pool                                    |

## Computing what is actually available

Usage counters are subtracted from limits, so the amount you can still spend is
the difference:

```ts twoslash
<!--@include: ../../../../snippets/publicClient.ts-->
// ---cut---
const r = await publicClient.getAccountResources({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
})

const bandwidthAvailable =
  r.freeNetLimit - r.freeNetUsed + (r.netLimit - r.netUsed)

const energyAvailable = r.energyLimit - r.energyUsed
```

Energy you do not have is bought with TRX at execution time, capped by the
`feeLimit` on the call. See
[Resources & Staking](/docs/guides/resources).

## Parameters

### address

- **Type:** `` `T${string}` ``

## Related

- [`freezeBalanceV2`](/docs/actions/wallet/freezeBalanceV2) — stake TRX for
  bandwidth or energy
- [`delegateResource`](/docs/actions/wallet/delegateResource) — lend resources
  to another account
- [`estimateEnergy`](/docs/actions/public/estimateEnergy) — what a call will cost
