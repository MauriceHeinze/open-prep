# Open Prep

`open-prep` is a local macOS desktop app for exam preparation.

The current foundation focuses on a TOEFL®-style writing flow, but the architecture is intentionally prepared for:

- multiple exams
- multiple sections
- multiple locally callable AI providers

## Current Stack

- `Electron`
- `React`
- `TypeScript`
- `Radix UI`
- `Vite` + `vite-plugin-electron`
- `Valibot`
- `better-sqlite3`

## Commands

Recommended runtime:

- `Node.js 22`

This Electron toolchain is set up for the CommonJS path used by `vite-plugin-electron`, and it currently fails to install correctly on `Node.js 26` in this repo. If you see `Electron failed to install correctly`, switch to Node 22, remove `node_modules`, and run `npm install` again.

If Electron starts but behaves like plain Node.js instead of launching the app, check whether `ELECTRON_RUN_AS_NODE` is set in your shell. The development script clears that variable automatically.

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run typecheck
npm run lint
npm test
```

## AI Provider Notes

The default provider path is `Codex` via `codex exec`.

Current target model:

- `gpt-5.4-mini`

System prompt file:

- `prompts/system/codex/writing-evaluation.md`

The Codex writing evaluation call loads that file at runtime, so you can edit the evaluator behavior without changing application code.

For local UI development without a live provider call, you can switch to the mock provider:

```bash
OPEN_PREP_AI_PROVIDER=mock npm run dev
```

## Project Docs

- Product overview: [markdown/PRODUCT.md](markdown/PRODUCT.md)
- Engineering standards: [markdown/ENGINEERING.md](markdown/ENGINEERING.md)
- Technical decisions: [markdown/PROJECT_DECISIONS.md](markdown/PROJECT_DECISIONS.md)
