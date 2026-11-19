// Builds the hub and the source simulations and assembles everything into dist/ (see README, "Assemble").
//   node scripts/assemble.mjs [--base <dir>] [--skip-source-build]
//   --base <dir>           folder that holds the source checkouts (default: SOURCES_DIR, else the hub's parent folder)
//   --skip-source-build    reuse each source's existing build output (fast local iteration); the hub is still built
// Node only, no dependencies. Loads src/labs.ts and scripts/plan.ts directly (Node strips the types).
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { labs } from '../src/labs.ts'
import { buildKey, isExcluded, planAssembly, resolveBaseDir, setHomeMeta } from './plan.ts'

const hubDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(hubDir, 'dist')
const args = process.argv.slice(2)
const skipSourceBuild = args.includes('--skip-source-build')
const baseDir = resolve(resolveBaseDir(args, process.env, hubDir))

function fail(msg) { console.error(`\nassemble: ${msg}`); process.exit(1) }
function run(cmd, cwd, what) {
  console.log(`\n> ${what}: ${cmd}  (${relative(hubDir, cwd) || '.'})`)
  const r = spawnSync(cmd, { cwd, stdio: 'inherit', shell: true })
  if (r.status !== 0) fail(`${what} failed (exit ${r.status ?? r.signal}).`)
}

const steps = planAssembly(labs, baseDir, distDir)
console.log(`Sources: ${baseDir}`)

// 1. check the checkouts before doing any work
for (const s of steps) {
  if (!existsSync(s.repoDir)) fail(`source repo "${s.repo}" not found at ${s.repoDir}. Clone github.com/kairi99/${s.repo} there, or pass --base <dir>.`)
}

// 2. build the sources
const built = new Set()
for (const s of steps) {
  if (!s.command || skipSourceBuild || built.has(buildKey(s))) continue
  built.add(buildKey(s))
  if (!existsSync(join(s.buildCwd, 'node_modules'))) run('npm ci', s.buildCwd, `${s.repo}: install`)
  run(s.command, s.buildCwd, `${s.repo}: build`)
}
for (const s of steps) {
  if (!existsSync(s.from)) {
    fail(`source repo "${s.repo}" has no site folder at ${s.from}${s.command && skipSourceBuild ? ' (it was not built: run without --skip-source-build)' : ''}.`)
  }
}

// 3. build the hub, then copy the sources next to it
rmSync(distDir, { recursive: true, force: true })
run('npm run build', hubDir, 'hub: build')
for (const s of steps) {
  console.log(`\n> ${s.repo}: ${relative(baseDir, s.from)} -> ${relative(hubDir, s.to)}`)
  try {
    // Copy entry by entry: errorOnExist then makes a source entry that already exists in dist/ (a clash with the hub or
    // with another source) an error instead of a silent overwrite.
    mkdirSync(s.to, { recursive: true })
    for (const name of readdirSync(s.from)) {
      if (isExcluded(name, s.exclude, s.include)) continue
      cpSync(join(s.from, name), join(s.to, name), { recursive: true, force: false, errorOnExist: true })
    }
  } catch (e) {
    fail(`copying "${s.repo}" into ${relative(hubDir, s.to)} failed: ${e.message}`)
  }
}

// 4. every ready experiment must have its page
for (const s of steps) {
  for (const f of s.expect) if (!existsSync(f)) fail(`source repo "${s.repo}": expected page ${relative(hubDir, f)} is missing after the copy.`)
}
// 5. hosted here, the simulations show a link back to their lab page (standalone, the meta tag stays empty).
// Only the copies in dist/ are rewritten, never the source repos.
for (const s of steps) {
  for (const f of s.home) {
    try { writeFileSync(f, setHomeMeta(readFileSync(f, 'utf8'))) }
    catch (e) { fail(`source repo "${s.repo}": ${relative(hubDir, f)}: ${e.message}. Add <meta name="vlabs-home" content=""> to its index.html.`) }
  }
}
console.log(`\nDone: ${relative(process.cwd(), distDir) || distDir}`)
