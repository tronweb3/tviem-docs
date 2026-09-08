---
description: The chains tviem ships, and what a Chain carries.
title: Chains
---

# Chains

A **Chain** describes a TRON network: its id, native currency, node endpoints
and block time. You pass one to every Client.

## Import

```ts twoslash
import { mainnet, nile, shasta } from '@tronweb3/tviem/chains'
```

## Usage

```ts twoslash
<!--@include: ../../../snippets/publicClient.ts#imports-->
// ---cut---
const client = createPublicClient({
  chain: mainnet, // [!code focus]
  transport: http(),
})
```

## Supported chains

| Chain     | Id          | Purpose                                              |
| --------- | ----------- | ---------------------------------------------------- |
| `mainnet` | `728126428` | TRON Mainnet, via TronGrid                            |
| `nile`    | —           | Nile testnet — the one most tooling targets           |
| `shasta`  | —           | Shasta testnet                                        |

Chain id `728126428` is the decimal form of the genesis hash suffix
`0x2b6653dc`, which is what the TVM reports for `chainid()`.

## Anatomy of a Chain

```ts twoslash
import { defineChain } from '@tronweb3/tviem/chains'

export const mainnet = defineChain({
  id: 728126428,
  name: 'Tron Mainnet',
  nativeCurrency: { name: 'TRON', symbol: 'TRX', decimals: 6 },
  rpcUrls: {
    default: {
      full: { http: ['https://api.trongrid.io'] },
      solidity: { http: ['https://api.trongrid.io'] },
      event: { http: ['https://api.trongrid.io'] },
    },
  },
  blockTime: 3000,
})
```

The three endpoint groups map onto TRON's three read surfaces:

- **`full`** — the FullNode, serving the chain head. Every write goes here, and
  every read that does not pass `confirmed: true`.
- **`solidity`** — the SolidityNode, serving solidified (irreversible) state.
  Used by any read with `confirmed: true`.
- **`event`** — the event/log endpoint, used by
  [`getLogs`](/docs/actions/public/getLogs).

On TronGrid all three are the same host. On a self-hosted node they usually are
not — see the transport's
[`solidityUrl`](/docs/clients/transports/http#solidityurl-optional) and
[`eventUrl`](/docs/clients/transports/http#eventurl-optional).

`nativeCurrency.decimals` is `6`, which is why TRX amounts are quoted in SUN:
1 TRX = 1,000,000 SUN.

`blockTime` (3000ms on mainnet) is the default polling interval for actions that
wait, such as
[`waitForTransactionReceipt`](/docs/actions/public/waitForTransactionReceipt).

## Custom chains

For a private network or a chain tviem does not ship, use
[`defineChain`](/docs/chains/defineChain).
