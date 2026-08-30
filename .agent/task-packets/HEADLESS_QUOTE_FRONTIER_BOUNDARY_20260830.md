# Headless Quote Frontier Boundary — 2026-08-30

## Mission

Extend existing pull request #1 from canonical base `9d19564456c8f19ac63f0b98f6a6be073c039e9d` with a deterministic, current package toolchain; fail-closed CI and security checks; a verified npm package boundary; and tag-only tokenless npm publication admission.

## Ownership

- Claim: `codex-headless-quote-frontier-20260830-v3`
- Branch: `codex/headless-quote-ox-hardening-20260821`
- Worktree: `C:\Users\johns\Desktop\headless-quote-frontier-20260830`
- Existing PR head at admission: `0304957f281b098258a87d79ed740bab7b8b1a28`

## Adoption decision

Adapt the existing PR's Node/Vitest dependency intent. Replace its still fail-open combined test/publish workflow with current deterministic contracts. Do not create a duplicate PR.

## No-touch boundary

The primary checkout at `C:\Users\johns\Desktop\headless-quote-layer` contains uncommitted lead-delivery product work in `src`, `test`, and generated `dist` bytes. Those bytes are excluded from this lane and must not be copied, restored, committed, or overwritten.

## Acceptance

- Exact Node and npm contract verifies locally.
- Lint, typecheck, tests, build, and audits fail closed.
- Every declared package export exists after a clean build, and both ESM and CJS entrypoints import safely in a DOM-free Node process.
- `npm pack --dry-run` contains only intentional consumer files and no tests or source maps.
- CI and CodeQL use least privilege and immutable action SHAs.
- Publication is tag-only, OIDC-based, validates tag/version/ancestry, and has no long-lived npm token.
- Workflow syntax passes actionlint and focused zizmor review.
- Independent reviewer accepts the exact cumulative candidate commit and tree before push.
- npm publication, trusted-publisher configuration, PR merge, and public release remain external gates; this lane creates none of them.
