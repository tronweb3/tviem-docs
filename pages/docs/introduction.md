---
description: An introduction to tviem, a TypeScript interface for TRON.
title: Why tviem
---

# Why tviem

tviem is a TypeScript interface for TRON: a set of small, tree-shakeable modules
for talking to FullNodes and SolidityNodes, signing transactions, and calling
TVM contracts.

If you have used [viem](https://viem.sh) on Ethereum, tviem will feel familiar
on purpose — the same client/transport/action decomposition, the same ABI-driven
type inference. What is different is everything TRON does differently, and tviem
models those differences rather than hiding them.

## The problem

The established way to talk to TRON from JavaScript is TronWeb. It works, but it
was designed before TypeScript inference became a practical tool, and it shows:

- **One object does everything.** `tronWeb.trx`, `tronWeb.transactionBuilder`,
  `tronWeb.contract()` all hang off a single stateful instance carrying a private
  key. Reading a balance drags the signing surface along with it.
- **Amounts are loosely typed.** SUN values arrive as `number`, which silently
  loses precision above 2^53, or as decimal strings, which do not add up.
- **Contract calls are untyped.** `contract.methods.transfer(to, value)` accepts
  anything and returns `any`. The compiler cannot tell you the function does not
  exist, or that you passed the arguments in the wrong order.
- **Build and send are entangled.** Producing an unsigned transaction to hand to
  a hardware wallet or a co-signer means reaching for a different, lower-level
  API than the one you use to send.

## The approach

### Read and write are different clients

A [Public Client](/docs/clients/public) reads. A
[Wallet Client](/docs/clients/wallet) signs and writes. They are separate objects
with separate action sets, so a module that only reads cannot accidentally hold
a key.

```ts twoslash
import { createPublicClient, http } from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

// `sendTrx` is not on this client — the compiler stops you here.
const balance = await publicClient.getBalance({
//    ^?
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
})
```

### Amounts are `bigint`

TRX is quoted in SUN, 6 decimals. Every amount in and out of tviem is a
`bigint`, so nothing rounds behind your back.

```ts twoslash
import { formatTrx, parseTrx } from '@tronweb3/tviem'

const sun = parseTrx('1.5')
//    ^?

const trx = formatTrx(1_500_000n)
//    ^?
```

### Contract calls are inferred from the ABI

Pass an ABI with `as const` and the function name, arguments and return type are
all checked.

```ts twoslash
<!--@include: ../../snippets/publicClient.ts-->
<!--@include: ../../snippets/trc20Abi.ts-->
// ---cut---
const balance = await publicClient.readContract({
//    ^?
  address: 'TTokenContractDemoxxxxxxxxxxxxxxxx',
  abi: trc20Abi,
  functionName: 'balanceOf',
  args: ['TSenderAccountDemoxxxxxxxxxxxxxxxx'],
})
```

### Building is separate from sending

Every write action has a `build*` twin. `sendTrx` builds, signs and broadcasts;
`buildSendTrx` stops at the unsigned transaction so you can route it through a
hardware wallet, a co-signer, or a queue. Same parameters, same shape, one
decision.

```ts twoslash
<!--@include: ../../snippets/walletClient.ts-->
// ---cut---
// Build, sign and broadcast in one call.
const { txID } = await walletClient.sendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})

// Or stop at the unsigned transaction.
const unsigned = await walletClient.buildSendTrx({
  to: 'TRecipientAccountDemoxxxxxxxxxxxxx',
  amount: 1_000_000n,
})
```

See [Build vs. Send](/docs/guides/build-vs-send) for when each one is the right
call.

### TRON's own concepts are modelled, not papered over

- **Three address forms.** Base58Check (`T…`), TRON hex (`41…`) and EVM hex
  (`0x…`) are distinct types, with explicit conversions. See
  [Addresses](/docs/guides/addresses).
- **Energy and bandwidth.** Staking, delegation and resource accounting are
  first-class actions, not an afterthought. See
  [Resources & Staking](/docs/guides/resources).
- **FullNode vs. SolidityNode.** Reads that can be served from solidified
  (irreversible) state take a `confirmed` flag, so you choose freshness or
  finality per call rather than per client.
- **Multi-signature permissions.** Permission updates, weighted signing and
  approval inspection are in the [action catalog](/docs/actions/wallet/catalog).

## What tviem is not

- It is not a drop-in replacement for TronWeb. The shapes are different by
  design. See [Migrating from TronWeb](/docs/guides/tronweb-migration).
- It is not a wallet. It signs with keys you give it; it does not manage them.
- It does not ship a node. You point it at a FullNode you trust.
