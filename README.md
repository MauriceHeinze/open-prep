<p align="center">
  <img src="public/logo/logo_full.svg" alt="Open Prep" width="360" />
</p>

<h3 align="center">Private, local-first exam prep for serious English learners.</h3>

<p align="center">
  Practice TOEFL-style writing, submit essays from your Mac, and get structured rubric feedback without turning your study routine into a chatbot thread.
</p>

<p align="center">
  <a href="https://github.com/MauriceHeinze/open-prep/releases"><strong>Download the latest release</strong></a>
  ·
  <a href="#run-it-locally">Run locally</a>
  ·
  <a href="#contributing">Contribute</a>
</p>

<p align="center">
  <img alt="Built with Electron" src="https://img.shields.io/badge/Electron-30-47848F?logo=electron&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=111" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" />
  <img alt="Local first" src="https://img.shields.io/badge/local--first-macOS-c6005c" />
</p>

![Open Prep prompt catalog](product_images/Prompts%20List.png)

## Why Open Prep?

Most AI study tools feel like a blank chat box with a grade tacked on at the end. Open Prep is different: it is a focused desktop app for deliberate exam practice.

- **Practice from real flows, not loose chats.** Pick a writing prompt, read the task, write your answer, and submit it in one clean workspace.
- **Get rubric-shaped feedback.** Scores, criterion explanations, improvement notes, and phrase-level feedback are rendered as structured study material.
- **Keep your work local.** Attempts and evaluations are stored on your machine, with the app built around local execution and local persistence.
- **Use locally callable AI.** The first provider path uses Codex through `codex exec`; the architecture is ready for more CLI-callable providers.
- **Grow beyond the MVP.** Open Prep starts with TOEFL-style writing, but the domain model is designed for TOEFL, IELTS, Cambridge, and future reading, listening, speaking, and writing workflows.

## The Experience

### Choose a Prompt

Open Prep starts with a catalog of writing tasks so practice begins with a concrete exam-style assignment.

![Prompt list](product_images/Prompts%20List.png)

### Write in a Focused Desktop Workspace

The submission screen keeps the task and response area together, so you can stay in the essay instead of managing tabs, timers, or copied prompts.

![Writing task detail](product_images/Task%20Detail%20Page.png)

### Submit and Let the Evaluator Work

Evaluation runs through the configured local provider path, then returns a structured result the UI can render consistently.

![Evaluation loading state](product_images/Loading%20Screen.png)

### Review Actionable Feedback

Scores, strengths, improvement points, and detailed writing feedback are presented as a study artifact you can actually use for the next attempt.

![Feedback overview](product_images/Feedback%20Page%20-%20With%20back%20to%20prompt%20button.png)

![Detailed feedback section](product_images/Detailed%20Feedback%20Section.png)

## Current Status

Open Prep is in an early open-source preview. The current vertical slice focuses on macOS and TOEFL-style writing practice:

- prompt catalog
- writing submission flow
- Codex-backed writing evaluation
- structured feedback UI
- local persistence foundation
- typed Electron IPC boundaries
- mock provider for UI development

Planned product direction includes history and review, broader exam support, speaking feedback, reading and listening modules, and provider selection.

## Download

Grab the newest app build from the [GitHub releases page](https://github.com/MauriceHeinze/open-prep/releases).

Because this is an early local-first macOS app, your system may ask you to confirm that you want to open software downloaded from the internet. That is expected for unsigned preview builds.

## Run It Locally

Recommended runtime:

- Node.js `22`
- macOS
- Codex CLI installed and authenticated if you want live AI evaluation

```bash
npm install
npm run dev
```

For local UI work without a live AI call:

```bash
OPEN_PREP_AI_PROVIDER=mock npm run dev
```

Useful checks:

```bash
npm run typecheck
npm run lint
npm test
```

Build the desktop app:

```bash
npm run build
```

If Electron fails to install correctly, use Node 22, remove `node_modules`, and run `npm install` again. The current Electron toolchain is tested against the CommonJS path used by `vite-plugin-electron` and is not intended for Node 26.

## How It Works

Open Prep keeps the desktop security boundary explicit:

- `renderer` handles React UI, routing, and view state.
- `preload` exposes a narrow typed bridge.
- `main` owns persistence, provider calls, and privileged work.
- `shared/domain` contains contracts, schemas, and pure domain types.

The AI provider layer is deliberately pluggable. Codex is the first implementation target, but provider-specific command building, parsing, and failure handling live behind a common interface so future local tools can be added without rebuilding the app around one vendor.

## Project Docs

- Product vision: [markdown/PRODUCT.md](markdown/PRODUCT.md)
- Engineering standards: [markdown/ENGINEERING.md](markdown/ENGINEERING.md)
- Technical decisions: [markdown/PROJECT_DECISIONS.md](markdown/PROJECT_DECISIONS.md)
- Prompt catalog notes: [prompts/writing/README.md](prompts/writing/README.md)

## Contributing

Open Prep is a good project for people who care about calm learning software, local-first tools, Electron security, typed domain modeling, and AI feedback that is presented as a real product experience.

Before opening a PR:

```bash
npm run typecheck
npm run lint
npm test
```

Please keep changes aligned with the product and engineering docs. The short version: preserve strict process boundaries, validate unsafe inputs, keep UI logic out of business logic, and avoid coupling the app core to a single exam, section, or AI provider.

## Trademark Notice

TOEFL, IELTS, and Cambridge are trademarks of their respective owners. Open Prep is an independent open-source project and is not affiliated with or endorsed by those organizations.
