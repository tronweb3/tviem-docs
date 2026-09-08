/**
 * Type-checks every `ts twoslash` code block in `pages/`.
 *
 * VitePress compiles these blocks during `vitepress build`, so a broken sample
 * already fails the build — but a full build is slow to run while writing. This
 * script does the same check in a couple of seconds: it extracts each block,
 * resolves the `<!--@include: …-->` directives the way VitePress does, and
 * runs `tsc` over the lot.
 *
 * Blocks marked `// @noErrors` are skipped, since those opt out of checking.
 * So are blocks marked `// @errors: <codes>` — those demonstrate a compile
 * error on purpose, and twoslash itself asserts the listed codes occur.
 */
import { execFileSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pagesDir = path.join(root, 'pages')
const outDir = path.join(root, 'node_modules', '.snippet-check')

/** Every `.md`/`.mdx` file under `pages/`. */
function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else if (/\.mdx?$/.test(entry.name)) out.push(full)
  }
  return out
}

/**
 * Inlines `<!--@include: ../../snippets/foo.ts-->` and its `#region` form,
 * matching VitePress' own resolution (paths are relative to the including
 * file). Recurses, so an included file may include another.
 */
function resolveIncludes(code, fromDir, seen = new Set()) {
  return code.replace(
    /^\s*<!--@include:\s*([^#\s]+?)(?:#([^\s{]+))?\s*-->\s*$/gm,
    (_match, relPath, region) => {
      const full = path.resolve(fromDir, relPath)
      const key = `${full}#${region ?? ''}`
      if (seen.has(key)) return ''
      seen.add(key)
      if (!fs.existsSync(full))
        throw new Error(`include target not found: ${relPath}`)
      let body = fs.readFileSync(full, 'utf8')
      if (region) {
        const re = new RegExp(
          `\\/\\/ #region ${region}\\n([\\s\\S]*?)\\n\\s*\\/\\/ #endregion`,
        )
        const match = body.match(re)
        if (!match) throw new Error(`region "${region}" not found in ${relPath}`)
        body = match[1]
      } else {
        // Drop the region markers themselves when inlining a whole file.
        body = body.replace(/^\s*\/\/ #(?:end)?region\b[^\n]*$/gm, '')
      }
      return resolveIncludes(body, path.dirname(full), seen)
    },
  )
}

/**
 * Twoslash's `^?` quick-info query must sit on the line directly below the
 * identifier it asks about, with the caret in that identifier's column. Point
 * it at whitespace — easy to do when the declaration spans several lines and
 * the caret lands on the closing `)` — and Twoslash fails the build with
 * "the request is in a removal range". `tsc` cannot see this, so check it here.
 */
function checkQueries(file, source) {
  const problems = []
  const lines = source.split('\n')
  for (const [index, line] of lines.entries()) {
    const match = /^(\s*)\/\/(\s*)\^\?\s*$/.exec(line)
    if (!match) continue
    const column = match[1].length + 2 + match[2].length
    const previous = lines[index - 1] ?? ''
    const character = previous[column] ?? ''
    if (!/[A-Za-z0-9_$]/.test(character))
      problems.push(
        `${file}:${index + 1} — \`^?\` points at ${JSON.stringify(character)} ` +
          `in column ${column} of \`${previous.trim()}\``,
      )
  }
  return problems
}

const queryProblems = []
for (const file of walk(pagesDir))
  queryProblems.push(
    ...checkQueries(path.relative(root, file), fs.readFileSync(file, 'utf8')),
  )

if (queryProblems.length > 0) {
  console.error(`✗ ${queryProblems.length} misplaced \`^?\` quick-info query:`)
  for (const problem of queryProblems) console.error(`  ${problem}`)
  process.exit(1)
}

const blocks = []
for (const file of walk(pagesDir)) {
  const source = fs.readFileSync(file, 'utf8')
  const re = /^```ts twoslash\s*\n([\s\S]*?)^```/gm
  let match
  let index = 0
  while ((match = re.exec(source)) !== null) {
    index += 1
    const code = match[1]
    if (/^\s*\/\/\s*@noErrors\s*$/m.test(code)) continue
    if (/^\s*\/\/\s*@errors:/m.test(code)) continue
    const rel = path.relative(pagesDir, file).replace(/[\\/]/g, '_')
    blocks.push({
      file,
      index,
      name: `${rel.replace(/\.mdx?$/, '')}__${index}.ts`,
      code: resolveIncludes(code, path.dirname(file)),
    })
  }
}

/**
 * Splits a block on twoslash's `// @filename: x.ts` directives. Returns one
 * entry per virtual file, mirroring how twoslash itself compiles the block —
 * without this, a multi-file sample gets concatenated and reports bogus
 * duplicate-declaration errors.
 */
function splitVirtualFiles(code) {
  const parts = code.split(/^\s*\/\/\s*@filename:\s*(\S+)\s*$/gm)
  const leading = parts[0]
  const files = []
  if (parts.length === 1) return [{ name: 'index.ts', code: leading }]
  // A non-empty preamble before the first `@filename` is its own module.
  if (leading.trim()) files.push({ name: '_preamble.ts', code: leading })
  for (let i = 1; i < parts.length; i += 2)
    files.push({ name: parts[i], code: parts[i + 1] })
  return files
}

fs.rmSync(outDir, { recursive: true, force: true })
fs.mkdirSync(outDir, { recursive: true })

const tscInputs = []
for (const block of blocks) {
  const dir = path.join(outDir, block.name.replace(/\.ts$/, ''))
  fs.mkdirSync(dir, { recursive: true })
  for (const file of splitVirtualFiles(block.code)) {
    const full = path.join(dir, file.name)
    fs.mkdirSync(path.dirname(full), { recursive: true })
    // `export {}` keeps a file that only calls things a module, so the
    // top-level `await` these samples use stays legal.
    fs.writeFileSync(full, `${file.code}\nexport {}\n`, 'utf8')
    tscInputs.push(full)
  }
}

console.log(`Checking ${blocks.length} twoslash blocks…`)

try {
  execFileSync(
    path.join(root, 'node_modules', '.bin', 'tsc'),
    [
      '--noEmit',
      '--strict',
      '--target',
      'ES2022',
      '--module',
      'NodeNext',
      '--moduleResolution',
      'NodeNext',
      '--skipLibCheck',
      '--lib',
      'ES2022,DOM,DOM.Iterable',
      ...tscInputs,
    ],
    { cwd: root, stdio: 'inherit' },
  )
  console.log(`✓ ${blocks.length} blocks type-check clean`)
} catch {
  console.error(
    '\n✗ Type errors above. File names map to pages as ' +
      '`<page path>__<nth block>.ts`.',
  )
  process.exit(1)
}
