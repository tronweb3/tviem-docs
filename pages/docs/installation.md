---
description: How to install tviem.
title: Installation
---

# Installation

Install tviem from npm.

:::code-group

```bash [npm]
npm i @tronweb3/tviem
```

```bash [pnpm]
pnpm i @tronweb3/tviem
```

```bash [yarn]
yarn add @tronweb3/tviem
```

```bash [bun]
bun i @tronweb3/tviem
```

:::

## Entrypoints

tviem ships four entrypoints. Everything in the sub-entrypoints is also
re-exported from the root, so `@tronweb3/tviem` alone is enough — the subpaths
exist to keep imports legible.

| Import path                | Contents                                              |
| -------------------------- | ----------------------------------------------------- |
| `@tronweb3/tviem`          | Clients, transports, actions, accounts, utils, errors  |
| `@tronweb3/tviem/chains`   | `mainnet`, `nile`, `shasta`, `defineChain`             |
| `@tronweb3/tviem/accounts` | Account constructors and key generation                |
| `@tronweb3/tviem/actions`  | Tree-shakeable standalone actions                      |
| `@tronweb3/tviem/utils`    | Address, unit, encoding and hashing helpers            |

Both ESM and CommonJS builds are published, with declaration files for each.

## TypeScript

TypeScript is an optional peer dependency, declared as **`>=5.4.0`**. Turn on
`strict` mode — without it, ABI inference degrades and contract calls widen to
`unknown`.

```json [tsconfig.json]
{
  "compilerOptions": {
    "strict": true
  }
}
```

## Runtimes

tviem declares **`node >=22`** in its `engines` field. It is written against the
platform `fetch` API and native `BigInt`, so any runtime providing both will
work — modern browsers, Bun and Deno included.

If you need to run against an older runtime, or want to route requests through
your own stack, pass a custom `fetch` implementation to the transport via
[`fetchFn`](/docs/clients/transports/http).
