import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const packageJson = readJson('package.json');
const packageLock = readJson('package-lock.json');

const expectedNodeRange = '>=22.22.2 <27';
const expectedNodeDefault = '24.20.0';
const expectedNpm = '12.0.2';
const expectedNpmEngine = '>=10.9 <13';

function tuple(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)/u.exec(version);
  assert.ok(match, `Expected a semantic version, received ${version}`);
  return match.slice(1).map(Number);
}

function compare(left, right) {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

const nodeVersion = process.versions.node;
const nodeTuple = tuple(nodeVersion);
assert.ok(compare(nodeTuple, tuple('22.22.2')) >= 0, `Node ${nodeVersion} is below 22.22.2`);
assert.ok(nodeTuple[0] < 27, `Node ${nodeVersion} is outside the supported major range`);

const userAgent = process.env.npm_config_user_agent ?? '';
const npmMatch = /(?:^|\s)npm\/([^\s]+)/u.exec(userAgent);
assert.ok(npmMatch, 'Run this contract through npm so the active npm version is observable');
assert.equal(npmMatch[1], expectedNpm, `Expected npm ${expectedNpm}, received ${npmMatch[1]}`);

assert.equal(readFileSync(resolve(root, '.node-version'), 'utf8').trim(), expectedNodeDefault);
assert.equal(packageJson.packageManager, `npm@${expectedNpm}`);
assert.deepEqual(packageJson.engines, { node: expectedNodeRange, npm: expectedNpmEngine });
assert.deepEqual(packageJson.devEngines, {
  runtime: { name: 'node', version: expectedNodeRange, onFail: 'error' },
  packageManager: { name: 'npm', version: expectedNpm, onFail: 'error' }
});

assert.equal(packageLock.lockfileVersion, 3);
const lockRoot = packageLock.packages?.[''];
assert.ok(lockRoot, 'package-lock.json must include its root package contract');
assert.deepEqual(lockRoot.engines, packageJson.engines);

const exactVersion = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u;
for (const [name, version] of Object.entries(packageJson.devDependencies ?? {})) {
  assert.match(version, exactVersion, `${name} must be pinned to an exact version`);
}

for (const lifecycle of ['install', 'postinstall', 'prepare']) {
  assert.equal(packageJson.scripts?.[lifecycle], undefined, `${lifecycle} lifecycle scripts are not allowed`);
}

console.log(`Toolchain contract verified: Node ${nodeVersion}, npm ${npmMatch[1]}, ${Object.keys(packageJson.devDependencies).length} exact development dependencies.`);

if (process.argv[2] === 'npm') {
  const npmCli = process.env.npm_execpath;
  assert.ok(npmCli, 'The active npm CLI path is unavailable');
  const result = spawnSync(process.execPath, [npmCli, ...process.argv.slice(3)], {
    cwd: root,
    stdio: 'inherit'
  });
  process.exit(result.status ?? 1);
}
