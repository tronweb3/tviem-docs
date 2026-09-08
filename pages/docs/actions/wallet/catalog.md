---
description: Every wallet action tviem ships.
title: Full Action Catalog
---

# Full Action Catalog

Every write action tviem ships. Each has a `build*` twin that returns the
unsigned transaction instead of broadcasting — see
[Build vs. Send](/docs/guides/build-vs-send).

Actions with a linked name have a reference page. The rest follow the same
shape: pass parameters, get a `{ txID, result, code, message, transaction }`
back, confirm with
[`waitForTransactionReceipt`](/docs/actions/public/waitForTransactionReceipt).

## Transfer

| Action                                          | Does                                    |
| ------------------------------------------------ | --------------------------------------- |
| [`sendTrx`](/docs/actions/wallet/sendTrx)        | Sends native TRX                         |
| [`sendTrc10`](/docs/actions/wallet/sendTrc10)    | Sends a TRC-10 asset                     |

## Contract

| Action                                                    | Does                                |
| ---------------------------------------------------------- | ----------------------------------- |
| [`writeContract`](/docs/actions/wallet/writeContract)      | Calls a state-changing function      |
| [`deployContract`](/docs/actions/wallet/deployContract)    | Deploys a contract                   |
| `updateSetting`                                            | Updates a contract's consume-user-resource percent |
| `updateEnergyLimit`                                        | Updates a contract's origin energy limit |
| `clearAbi`                                                 | Clears a contract's stored ABI       |

## Signing & broadcast

| Action                                                                | Does                              |
| ---------------------------------------------------------------------- | --------------------------------- |
| [`signTransaction`](/docs/actions/wallet/signTransaction)              | Signs a transaction                |
| [`signMessage`](/docs/actions/wallet/signMessage)                      | Signs a message                    |
| [`signTypedData`](/docs/actions/wallet/signTypedData)                  | Signs TIP-712 typed data           |
| [`multiSign`](/docs/actions/wallet/multiSign)                          | Co-signs under a permission        |
| [`broadcastTransaction`](/docs/actions/wallet/broadcastTransaction)    | Broadcasts a signed transaction    |
| `broadcastHex`                                                         | Broadcasts a hex-encoded transaction |

## Staking & resources

| Action                                                        | Does                                          |
| -------------------------------------------------------------- | --------------------------------------------- |
| [`freezeBalanceV2`](/docs/actions/wallet/freezeBalanceV2)      | Stakes TRX for bandwidth or energy             |
| `unfreezeBalanceV2`                                            | Begins unstaking (14-day waiting period)       |
| `withdrawExpireUnfreeze`                                       | Withdraws TRX whose waiting period elapsed     |
| `cancelAllUnfreezeV2`                                          | Cancels pending unstakes, restaking the TRX    |
| `unfreezeBalance`                                              | Stake 1.0 unfreeze — legacy                    |
| [`delegateResource`](/docs/actions/wallet/delegateResource)    | Lends a resource to another account            |
| `undelegateResource`                                           | Reclaims a delegated resource                  |

## Governance

| Action              | Does                                                     |
| ------------------- | -------------------------------------------------------- |
| `voteWitness`       | Casts votes for super representatives                     |
| `withdrawBalance`   | Withdraws accumulated voting rewards                      |
| `applyForSr`        | Applies to become a super representative                  |
| `updateWitness`     | Updates a super representative's URL                      |
| `updateBrokerage`   | Updates a super representative's brokerage percentage     |
| `createProposal`    | Creates a chain-parameter proposal                        |
| `voteProposal`      | Votes on a proposal                                       |
| `deleteProposal`    | Withdraws a proposal                                      |

## TRC-10 assets

| Action           | Does                                        |
| ---------------- | ------------------------------------------- |
| `createToken`    | Issues a TRC-10 asset                        |
| `updateToken`    | Updates an issued asset's parameters         |
| `purchaseToken`  | Participates in an asset's issuance sale     |

## Decentralized exchange

| Action                 | Does                                          |
| ---------------------- | --------------------------------------------- |
| `exchangeCreate`       | Creates a trading pair                         |
| `exchangeInject`       | Adds liquidity to a pair                       |
| `exchangeWithdraw`     | Removes liquidity from a pair                  |
| `exchangeTransaction`  | Trades against a pair                          |

## Account

| Action                     | Does                                            |
| -------------------------- | ----------------------------------------------- |
| `createAccount`            | Creates an account on chain                      |
| `updateAccount`            | Sets an account's name                           |
| `setAccountId`             | Sets an account's id                             |
| `accountPermissionUpdate`  | Rewrites owner, witness and active permissions   |

:::tip
`accountPermissionUpdate` is how multi-signature is configured. Getting it wrong
can lock you out of the account permanently — there is no recovery path. Rehearse
it on [Nile](/docs/chains/intro) before touching mainnet.
:::

## Standalone imports

Every action is importable on its own from `@tronweb3/tviem/actions`, taking the
client as its first argument:

```ts twoslash
<!--@include: ../../../../snippets/walletClient.ts-->
// ---cut---
import { sendTrx } from '@tronweb3/tviem/actions'

const { txID } = await sendTrx(walletClient, {
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})
```

That is what lets you assemble a [custom client](/docs/clients/custom) carrying
only the actions you use.
