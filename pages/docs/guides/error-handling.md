---
description: How tviem reports failures, and how to handle them.
title: Error Handling
---

# Error Handling

## Two kinds of failure

The distinction that matters on TRON is between a transaction that never got in
and a transaction that got in and failed.

| Failure                            | How it surfaces                                    | Did it cost anything? |
| ---------------------------------- | -------------------------------------------------- | --------------------- |
| Broadcast rejected                 | The action **throws**                               | No                    |
| Packed, then reverted              | The action **resolves**; the receipt says `reverted` | Yes — energy is burned |

A `txID` from [`sendTrx`](/docs/actions/wallet/sendTrx) means the node accepted
the broadcast. It says nothing about execution.

```ts twoslash
<!--@include: ../../../snippets/clients.ts-->
<!--@include: ../../../snippets/trc20Abi.ts-->
// ---cut---
// Throws if the node rejects the broadcast.
const { txID } = await walletClient.writeContract({
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'transfer',
  args: ['TRecipientAccountDemoxxxxxxxxxxxxx', 1_000_000n],
  feeLimit: 100_000_000n,
})

// Does not throw if the call reverted — check for it.
const receipt = await publicClient.waitForTransactionReceipt({ hash: txID })
if (receipt.status === 'reverted') {
  // Energy was burned. The transfer did not happen.
}
```

Treating a resolved promise as success is the most common bug in TRON client
code. Always check `status`.

## Errors are typed

Every action exports an `ErrorType` union naming what it can throw:

```ts twoslash
import type {
  GetBalanceErrorType,
  SendTrxErrorType,
  WriteContractErrorType,
} from '@tronweb3/tviem'
```

These are **types**, not classes — you cannot `instanceof` them. They exist to
let you write exhaustive handling in a wrapper, and to document the failure
surface at the call site.

## Catching

`catch` gives you `unknown` under `strict`, so narrow before using it:

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts-->
<!--@include: ../../../snippets/trc20Abi.ts-->
// ---cut---
import { BaseError } from '@tronweb3/tviem'

try {
  await publicClient.readContract({
    address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
    account: 'TSenderAccountDemoxxxxxxxxxxxxxxxx',
    abi: trc20Abi,
    functionName: 'balanceOf',
    args: ['TSenderAccountDemoxxxxxxxxxxxxxxxx'],
  })
} catch (error) {
  if (error instanceof BaseError) {
    error.message
  } else {
    throw error
  }
}
```

`BaseError` is the root of tviem's error hierarchy, so it catches everything
tviem itself raises while letting genuine programming errors through.

## The cause chain

tviem preserves the underlying failure as `cause` rather than flattening it into
a message. When a node rejects a broadcast, the node's own rejection is still
there:

```ts twoslash
<!--@include: ../../../snippets/walletClient.ts-->
// ---cut---
import { BaseError } from '@tronweb3/tviem'

try {
  await walletClient.sendTrx({
    to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
    amount: 1_000_000n,
  })
} catch (error) {
  if (error instanceof BaseError) {
    // What tviem was doing.
    console.error(error.message)
    // What the node actually said.
    console.error(error.cause)
  }
}
```

Walk `cause` when a message is not specific enough — the useful detail is
usually one or two levels down.

## Common failures

### AccountNotFoundError

No account on the Client and none passed to the action.

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts#imports-->
import { createWalletClient } from '@tronweb3/tviem'
// ---cut---
// No hoisted account.
const walletClient = createWalletClient({ chain: mainnet, transport: http() })

// Throws — nothing to sign with.
await walletClient.sendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})
```

### Out of energy

The call consumed more energy than `feeLimit` would pay for. It is packed and
reverts, so it shows up in the receipt rather than as a throw. Size the limit
from [`estimateEnergy`](/docs/actions/public/estimateEnergy) — see
[Resources & Staking](/docs/guides/resources).

### Expired transaction

A built transaction outlived its expiration before it was broadcast. Rebuild it;
raising `expirationMs` prevents a recurrence. See
[Build vs. Send](/docs/guides/build-vs-send#expiration).

### BlockNotFoundError

Asked for a block the node does not have — usually a recent height read with
`confirmed: true`, which the SolidityNode has not solidified yet.

### InvalidDecimalNumberError

[`parseTrx`](/docs/utilities/units) received something that is not a decimal
number. Validate user input before it reaches the parser.

## Retries

The [HTTP transport](/docs/clients/transports/http) already retries transient
failures — three attempts by default, with exponential backoff. Do not layer
your own retry loop on top of a write action: a broadcast that timed out may
still have landed, and retrying it can send the transfer twice.

If you need to retry a write, check first whether the original transaction id
made it:

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts-->
// ---cut---
declare const txID: string

const existing = await publicClient.getTransaction({ hash: txID })
if (existing === null) {
  // Safe to rebuild and resend.
}
```
