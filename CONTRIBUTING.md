# Contributing to Headless Quote Layer

Thank you for your interest in contributing to `@nymrel/headless-quote`!

## Architectural Guidelines

1. **Zero External Runtime Dependencies**: The core calculation engine, attribution layer, and web component must remain pure TypeScript with zero third-party runtime dependencies.
2. **Nymrel Design Aesthetics**: All UI components must default to Nymrel Warm Paper aesthetics (`#FAF8F2` Warm Cream, `#F4F0E6` Soft Linen, `#2A332E` Cedar Green, `#A8541F` Terracotta).
3. **Dual-Audience Rule**: Features must deliver delightful human UX and verifiable machine trust (`/llms.txt`, clean JSON output).

## Development Workflow

```bash
# 1. Fork and clone the repository
git clone https://github.com/nymrel/headless-quote-layer.git
cd headless-quote-layer

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run tests
npm test

# 5. Build distribution files
npm run build
```

## Pull Request Checklist

- [ ] All Vitest unit tests pass (`npm test`).
- [ ] TypeScript compiles cleanly without errors (`npm run typecheck` or `npm run build`).
- [ ] New features include corresponding test cases in `test/`.
- [ ] Documentation or preset additions are reflected in `README.md` and `llms.txt`.
