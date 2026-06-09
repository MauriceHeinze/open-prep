<p align="center">
  <img src="public/logo/logo_full.svg" alt="OpenPrep" width="360" />
</p>

<h3 align="center">Open-source TOEFL® Writing practice powered by your existing ChatGPT subscription.</h3>

<p align="center">
  Practice TOEFL®-style writing tasks, get structured AI feedback, and track your progress without paying for another full exam prep platform.
</p>

<p align="center">
  OpenPrep is for learners who already have access to ChatGPT or Codex and mainly want to improve their Writing score. Instead of starting from an empty chat window, you get a focused desktop workflow: pick a prompt, write your response, submit it, review feedback, and improve over time.
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

![OpenPrep writing prompt catalog](product_images/Prompts%20List.png)

## Why OpenPrep?

TOEFL® prep tools can get expensive fast, and not every learner needs a full platform for every section. A lot of people are already comfortable with Reading, Listening, or Speaking, but want focused help with Writing.

OpenPrep is built for that use case:

- **Focus on Writing first.** Start with TOEFL®-style writing prompts instead of paying for a full-course prep app you may not need.
- **Use the AI you already pay for.** The current provider path uses Codex CLI, which lets OpenPrep work with an existing ChatGPT/Codex setup.
- **Practice in a structured flow.** Choose a prompt, write your response, submit it, and review the result in one consistent workflow.
- **Get feedback you can study.** Scores, criterion notes, improvement points, and phrase-level feedback are shown in a structured UI instead of a long chat transcript.
- **See your progress.** Attempts are saved locally so you can review earlier work and track improvement over time.
- **Keep room to grow.** Writing is the first focus, but broader exam sections can be added later if users ask for them.

OpenPrep is more useful than opening ChatGPT alone because it gives you curated tasks, a repeatable workflow, structured output, saved attempts, and a place to compare progress over time.

## The Experience

### Choose a Prompt

OpenPrep starts with a catalog of writing tasks so practice begins with a concrete exam-style assignment, not a blank chat.

![Prompt list](product_images/Prompts%20List.png)

### Write in a Focused Desktop Workspace

The submission screen keeps the task and response area together, so you can stay in the essay instead of managing tabs, timers, or copied prompts.

![Writing task detail](product_images/Task%20Detail%20Page.png)

### Submit and Let the Evaluator Work

Evaluation runs through the configured provider path, then returns a structured result the UI can render consistently.

![Evaluation loading state](product_images/Loading%20Screen.png)

### Review Actionable Feedback

Scores, strengths, improvement points, and detailed writing feedback are presented as a study artifact you can actually use for the next attempt.

![Feedback overview](product_images/Feedback%20Page%20-%20With%20back%20to%20prompt%20button.png)

![Detailed feedback section](product_images/Detailed%20Feedback%20Section.png)

## Current Status

OpenPrep is in an early open-source preview. The current vertical slice focuses on macOS and TOEFL®-style writing practice:

- prompt catalog
- writing submission flow
- Codex-backed writing evaluation
- structured feedback UI
- local persistence foundation
- progress-oriented attempt storage
- typed Electron IPC boundaries
- mock provider for UI development

Planned product direction includes history and review, broader exam support, speaking feedback, reading and listening modules, and provider selection.

OpenPrep is a third-party practice tool, not an official product.

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

OpenPrep keeps the desktop security boundary explicit:

- `renderer` handles React UI, routing, and view state.
- `preload` exposes a narrow typed bridge.
- `main` owns persistence, provider calls, and privileged work.
- `shared/domain` contains contracts, schemas, and pure domain types.

The AI provider layer is deliberately pluggable. Codex is the first implementation target, but provider-specific command building, parsing, and failure handling live behind a common interface so future local tools can be added without rebuilding the app around one vendor.

This architecture matters, but it is supporting infrastructure rather than the headline. The main product idea is still simple: give TOEFL® Writing learners a focused workflow that feels like practice, not a chatbot thread.

## Project Docs

- Product vision: [markdown/PRODUCT.md](markdown/PRODUCT.md)
- Engineering standards: [markdown/ENGINEERING.md](markdown/ENGINEERING.md)
- Technical decisions: [markdown/PROJECT_DECISIONS.md](markdown/PROJECT_DECISIONS.md)
- Prompt catalog notes: [prompts/writing/README.md](prompts/writing/README.md)

## Contributing

OpenPrep is a good project for people who care about calm learning software, focused writing practice, typed domain modeling, and AI feedback that is presented as a real product experience.

Before opening a PR:

```bash
npm run typecheck
npm run lint
npm test
```

Please keep changes aligned with the product and engineering docs. The short version: preserve strict process boundaries, validate unsafe inputs, keep UI logic out of business logic, and avoid coupling the app core to a single exam, section, or AI provider.

## Trademark Notice

TOEFL®, IELTS, and Cambridge are trademarks of their respective owners. OpenPrep is an independent open-source project and is not affiliated with or endorsed by those organizations.
