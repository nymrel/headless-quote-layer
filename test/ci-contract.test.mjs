import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const ci = read('.github/workflows/ci.yml');
const codeql = read('.github/workflows/codeql.yml');
const publish = read('.github/workflows/publish.yml');
const dependabot = read('.github/dependabot.yml');
const workflows = { ci, codeql, publish };

test('all third-party actions are pinned to immutable commits', () => {
  for (const [name, workflow] of Object.entries(workflows)) {
    const actions = [...workflow.matchAll(/^\s*uses:\s*(\S+)\s*(?:#.*)?$/gmu)].map((match) => match[1]);
    assert.ok(actions.length > 0, `${name} must use at least one action`);
    for (const action of actions) {
      if (action.startsWith('./')) continue;
      assert.match(action, /^[^@\s]+@[a-f0-9]{40}$/u, `${name} has a mutable action reference: ${action}`);
    }
  }
});

test('quality gates fail closed and bootstrap npm before strict devEngines', () => {
  assert.doesNotMatch(ci, /continue-on-error|\|\|\s*npm\s+install/u);
  assert.match(ci, /node-version:\s*\[22, 24, 26\]/u);
  assert.match(ci, /runs-on:\s*windows-2025/u);
  assert.equal((ci.match(/package-manager-cache:\s*false/gu) ?? []).length, 3);
  assert.equal((ci.match(/working-directory:\s*\$\{\{ runner\.temp \}\}/gu) ?? []).length, 3);
  assert.equal((ci.match(/npm@12\.0\.2/gu) ?? []).length, 3);
  assert.match(ci, /npm run check/u);
  assert.match(ci, /npm run audit:ci/u);
  assert.match(ci, /npm run audit:prod/u);
  assert.match(ci, /permissions:\s*\{\}/u);
});

test('publication is tag-only, exact-artifact, tokenless, and ancestry-gated', () => {
  assert.doesNotMatch(publish, /workflow_dispatch|pull_request|branches:/u);
  assert.doesNotMatch(publish, /NPM_TOKEN|NODE_AUTH_TOKEN|secrets\./u);
  assert.match(publish, /tags:\s*[\s\S]*- 'v\*'/u);
  assert.match(publish, /git merge-base --is-ancestor/u);
  assert.match(publish, /test "\$\{RELEASE_TAG\}" = "v\$\{version\}"/u);
  assert.match(publish, /actions\/upload-artifact@[a-f0-9]{40}/u);
  assert.match(publish, /actions\/download-artifact@[a-f0-9]{40}/u);
  assert.match(publish, /actions\/attest-build-provenance@[a-f0-9]{40}/u);
  assert.match(publish, /environment:\s*[\s\S]*name:\s*npm/u);
  assert.match(publish, /id-token:\s*write/u);
  assert.match(publish, /npm publish "\$\{packages\[0\]\}" --access public --provenance --ignore-scripts/u);
});

test('CodeQL and dependency update contracts cover the package supply chain', () => {
  assert.match(codeql, /languages:\s*javascript-typescript/u);
  assert.match(codeql, /build-mode:\s*none/u);
  assert.match(codeql, /security-events:\s*write/u);
  assert.match(dependabot, /package-ecosystem:\s*npm/u);
  assert.match(dependabot, /package-ecosystem:\s*github-actions/u);
  assert.equal((dependabot.match(/cooldown:/gu) ?? []).length, 2);
});
