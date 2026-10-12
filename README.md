# tviem docs

Documentation site for [`@tronweb3/tviem`](https://github.com/tronweb3/tviem), built with
[VitePress](https://vitepress.dev).

The site is published at https://walletadapter.org/tviem/.

## Local development

```bash
pnpm install
pnpm dev
```

## The tviem dependency

`package.json` depends on the published package:

```json
"@tronweb3/tviem": "^1.0.0-beta.1"
```

To document changes that are not released yet, point the dependency at a
local tviem checkout instead:

```json
"@tronweb3/tviem": "link:../tviem"
```

This expects the `tviem` repo to sit next to this one. The site type-checks
every `twoslash` code block against tviem's real declaration files, so the
checkout also has to be built before the docs will run:

```bash
# 1. Build tviem's types (once, and after any source change)
cd ../tviem && pnpm build:types

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
  public/                favicons, wordmark fallback font (Tinos, OFL)
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
.github/workflows/
  deploy.yml             build + publish to GitHub Pages on push to main
```

## License

[MIT](./LICENSE) — same as [tviem](https://github.com/tronweb3/tviem) itself.
