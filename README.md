# tviem docs

Documentation site for [`@tronweb3/tviem`](https://github.com/tronweb3/tviem), built with
[VitePress](https://vitepress.dev).

## Local development

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173.

Read the next section first — tviem is not on npm yet, so `pnpm install`
does not work out of the box.

## The tviem dependency

`package.json` depends on the published package:

```json
"@tronweb3/tviem": "^1.0.0-beta.1"
```

tviem has not been released yet, so that range resolves to nothing and
`pnpm install` fails with a 404. Until the first release lands, point the
dependency at a local tviem checkout instead:

```json
"@tronweb3/tviem": "link:../tron-viem"
```

This expects `tron-viem` to sit next to this repo. The site type-checks every
`twoslash` code block against tviem's real declaration files, so a local
checkout also has to be built before the docs will run:

```bash
# 1. Build tviem's types (once, and after any source change)
cd ../tron-viem && pnpm build:types

# 2. Run the docs
cd ../tviem-docs && pnpm install && pnpm dev
```

Nothing else in the site refers to the package by path, so that one line is
the whole switch in either direction.

## Checking the code samples

Every `ts twoslash` block is compiled by VitePress during `pnpm build`, so a
broken sample fails the build. **`pnpm build` is the authoritative check.**

While writing, `pnpm check:snippets` gives the same answer in a couple of
seconds for most mistakes. It extracts each block, resolves the `<!--@include:`
directives, splits `@filename` blocks into real files, and runs `tsc` over the
lot. It also validates that every `^?` quick-info query sits in the column of
the identifier on the line above — Twoslash rejects a misplaced one, and `tsc`
cannot see the problem.

```bash
pnpm check:snippets
```

Blocks marked `// @noErrors` or `// @errors: <codes>` are skipped, since those
opt out of checking or demonstrate a compile error on purpose.

The fast check is an approximation of Twoslash, not a replacement — run
`pnpm build` before pushing.

## Layout

```
pages/
  index.md               landing page
  public/                logo, favicons
  docs/
    introduction.md      why tviem
    installation.md
    getting-started.md
    guides/              task-oriented guides
    clients/             client + transport reference
    accounts/            account constructors
    actions/public/      read actions
    actions/wallet/      write actions
    contract/            getContract
    utilities/           address & unit helpers
snippets/                shared twoslash fixtures
.vitepress/
  config.ts              site config + sidebar
  theme/                 default theme + brand colors, landing styles
```

## License

[MIT](./LICENSE) — same as [tviem](https://github.com/tronweb3/tviem) itself.
