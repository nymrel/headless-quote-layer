import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

if (process.argv.includes('--normalize-only')) {
  let normalized = 0;
  for (const absolute of walk(resolve(root, 'dist'))) {
    if (!['.js', '.cjs'].includes(extname(absolute))) continue;
    const source = readFileSync(absolute, 'utf8');
    const clean = source.replace(/[\t ]+(?=\r?\n)/gu, '');
    if (source !== clean) {
      writeFileSync(absolute, clean);
      normalized += 1;
    }
  }
  console.log(`Normalized ${normalized} generated bundle(s).`);
  process.exit(0);
}

assert.equal(packageJson.type, 'module');
assert.equal(packageJson.dependencies, undefined, 'The browser package must retain zero runtime dependencies');
assert.equal(packageJson.optionalDependencies, undefined, 'Optional runtime dependencies are not allowed');
assert.deepEqual(packageJson.peerDependencies, {
  react: '>=17.0.0 <20',
  'react-dom': '>=17.0.0 <20'
});

function collectExportTargets(value, targets = []) {
  if (typeof value === 'string') targets.push(value);
  else if (value && typeof value === 'object') {
    for (const nested of Object.values(value)) collectExportTargets(nested, targets);
  }
  return targets;
}

const declaredTargets = new Set([
  packageJson.main,
  packageJson.module,
  packageJson.types,
  packageJson.unpkg,
  packageJson.jsdelivr,
  ...collectExportTargets(packageJson.exports)
]);

for (const target of declaredTargets) {
  assert.match(target, /^\.\/dist\//u, `Package target must stay within dist: ${target}`);
  assert.ok(existsSync(resolve(root, target.slice(2))), `Missing declared package target: ${target}`);
}

const requiredFiles = [
  'dist/index.cjs',
  'dist/index.js',
  'dist/index.d.ts',
  'dist/react.cjs',
  'dist/react.js',
  'dist/react.d.ts',
  'dist/presets.cjs',
  'dist/presets.js',
  'dist/presets/index.d.ts',
  'dist/quote-layer.min.js',
  'dist/quote-layer.umd.js'
];
for (const path of requiredFiles) assert.ok(existsSync(resolve(root, path)), `Missing build output: ${path}`);

const npmCli = process.env.npm_execpath;
assert.ok(npmCli, 'Run package verification through npm so its pinned CLI is used');
const packOutput = execFileSync(
  process.execPath,
  [npmCli, 'pack', '--dry-run', '--json', '--ignore-scripts'],
  { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }
);
const parsed = JSON.parse(packOutput);
const packRecord = Array.isArray(parsed)
  ? parsed[0]
  : parsed[packageJson.name] ?? Object.values(parsed)[0];
assert.ok(packRecord, 'npm pack did not return a package record');
assert.equal(packRecord.name, packageJson.name);
assert.equal(packRecord.version, packageJson.version);
assert.ok(packRecord.unpackedSize < 500_000, `Package grew beyond the 500 kB unpacked guardrail: ${packRecord.unpackedSize}`);

const packedFiles = new Set(packRecord.files.map(({ path }) => path.replaceAll('\\', '/')));
for (const path of requiredFiles) assert.ok(packedFiles.has(path), `Tarball omitted required file: ${path}`);

const forbidden = [
  /^dist\/(?:src|test)\//u,
  /^dist\/(?:index\.html|_headers|_routes\.json|robots\.txt|llms\.txt)$/u,
  /(?:^|\/)test(?:\/|$)/u,
  /(?:^|\/)src(?:\/|$)/u,
  /\.map$/u,
  /^\.github\//u
];
for (const path of packedFiles) {
  assert.ok(!forbidden.some((pattern) => pattern.test(path)), `Forbidden tarball entry: ${path}`);
  assert.ok(
    path === 'package.json'
      || path === 'README.md'
      || path === 'LICENSE'
      || path === 'llms.txt'
      || path.startsWith('dist/'),
    `Unexpected tarball entry: ${path}`
  );
}

const quoteWidgetChunks = [...packedFiles].filter((path) =>
  /^dist\/QuoteWidget-.*\.(?:js|cjs)$/u.test(path)
);
assert.equal(
  quoteWidgetChunks.filter((path) => path.endsWith('.js')).length,
  1,
  'Package must contain exactly one ESM QuoteWidget chunk'
);
assert.equal(
  quoteWidgetChunks.filter((path) => path.endsWith('.cjs')).length,
  1,
  'Package must contain exactly one CommonJS QuoteWidget chunk'
);

for (const absolute of walk(resolve(root, 'dist'))) {
  const extension = extname(absolute);
  if (!['.js', '.cjs', '.ts'].includes(extension)) continue;
  const relative = absolute.slice(root.length + 1).replaceAll('\\', '/');
  if (relative.endsWith('.d.ts') || extension === '.js' || extension === '.cjs') {
    assert.ok(packedFiles.has(relative), `Build output is required at runtime but missing from tarball: ${relative}`);
  }
}

const nonce = Date.now();
const esm = await import(`${pathToFileURL(resolve(root, 'dist/index.js')).href}?proof=${nonce}`);
assert.equal(typeof esm.calculateQuote, 'function');
const reactEsm = await import(`${pathToFileURL(resolve(root, 'dist/react.js')).href}?proof=${nonce}`);
assert.equal(typeof reactEsm.QuoteWidget, 'function');

const require = createRequire(import.meta.url);
const cjs = require(resolve(root, 'dist/index.cjs'));
assert.equal(typeof cjs.calculateQuote, 'function');
const reactCjs = require(resolve(root, 'dist/react.cjs'));
assert.equal(typeof reactCjs.QuoteWidget, 'function');

// A real installed tarball must work without the repository's React dev dependency.
const tempRoot = resolve(tmpdir());
const consumer = mkdtempSync(resolve(tempRoot, 'nymrel-quote-consumer-'));
assert.ok(consumer.startsWith(tempRoot + sep));
try {
  writeFileSync(resolve(consumer, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
  const packed = JSON.parse(execFileSync(process.execPath,
    [npmCli, 'pack', '--json', '--ignore-scripts', '--pack-destination', consumer],
    { cwd: root, encoding: 'utf8' }));
  const record = Array.isArray(packed) ? packed[0] : packed[packageJson.name] ?? Object.values(packed)[0];
  execFileSync(process.execPath, [npmCli, 'install', '--ignore-scripts', '--omit=peer',
    '--offline', '--no-audit', '--no-fund', '--package-lock=false', resolve(consumer, record.filename)],
    { cwd: consumer, stdio: 'pipe' });
  writeFileSync(resolve(consumer, 'verify.mjs'), `
    import assert from 'node:assert/strict';
    import { createRequire } from 'node:module';
    import { calculateQuote } from '@nymrel/headless-quote';
    const require = createRequire(import.meta.url);
    assert.equal(typeof calculateQuote, 'function');
    assert.equal(typeof require('@nymrel/headless-quote').calculateQuote, 'function');
    assert.throws(() => require.resolve('react'), { code: 'MODULE_NOT_FOUND' });
  `);
  execFileSync(process.execPath, ['verify.mjs'], { cwd: consumer, stdio: 'pipe' });
} finally {
  assert.ok(consumer.startsWith(tempRoot + sep));
  rmSync(consumer, { recursive: true, force: true });
}

console.log(`Package contract verified: ${packRecord.entryCount} files, ${packRecord.unpackedSize} unpacked bytes, ESM/CJS SSR imports pass.`);
