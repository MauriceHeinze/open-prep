# OpenPrep 0.1.0 Release README

OpenPrep `0.1.0` is the first open-source preview of the app: a local macOS desktop workflow for TOEFL®-style Writing practice with structured AI feedback.

This release is intentionally narrow. It proves the core loop: choose a prompt, write a response, submit it for evaluation, and review actionable feedback in a focused desktop interface.

![OpenPrep prompt catalog](../product_images/Prompts%20List.png)

## What Is Included

- TOEFL®-style Writing prompt catalog.
- Focused submission screen for reading the task and drafting a response.
- Codex-backed evaluation path for structured writing feedback.
- Feedback overview with score, strengths, improvement areas, and criterion notes.
- Detailed phrase-level feedback view for reviewing specific writing issues.
- Local persistence foundation for saving attempts and evaluation results.
- Electron desktop packaging with a macOS-first preview experience.

## Practice Flow

### Choose a Writing Prompt

OpenPrep starts with a prompt catalog, so practice begins from a concrete exam-style task instead of an empty chat window.

![Prompt catalog](../product_images/Prompts%20List.png)

### Write in a Focused Workspace

The task instructions and writing area sit together in one desktop screen, keeping the writing session structured and direct.

![Writing task detail page](../product_images/Task%20Detail%20Page.png)

### Submit for Evaluation

After submission, OpenPrep runs the configured local AI provider flow and waits for a structured result that the app can render consistently.

![Evaluation loading state](../product_images/Loading%20Screen.png)

### Review the Result

The feedback screen turns the evaluation into a study artifact: score summary, strengths, improvement points, and next-step guidance.

![Feedback overview](../product_images/Feedback%20Page%20-%20With%20back%20to%20prompt%20button.png)

### Study Detailed Feedback

Detailed feedback highlights specific writing issues so learners can understand what to revise before the next attempt.

![Detailed feedback section](../product_images/Detailed%20Feedback%20Section.png)

## Who This Release Is For

OpenPrep `0.1.0` is best for:

- learners who already have ChatGPT or Codex access and want a more structured writing-practice workflow
- early testers who want to try the first complete desktop vertical slice
- contributors who want to build on a local-first exam-prep foundation

## Before You Download

This is an early preview release.

- The current build focuses on Writing only.
- TOEFL®-style prompts are the first supported prompt type.
- AI evaluation depends on a working local Codex CLI setup.
- macOS may warn about opening an unsigned preview app downloaded from the internet.
- History, broader analytics, and non-writing exam sections are planned but not part of this first release.

## Run Locally

Recommended runtime:

- Node.js `22`
- macOS
- Codex CLI installed and authenticated for live AI evaluation

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

## Project Direction

OpenPrep is local-first and desktop-first. The first release focuses on TOEFL®-style Writing, but the architecture is intended to grow toward multiple exams, multiple sections, provider selection, attempt history, and richer review workflows.

OpenPrep is a third-party practice tool, not an official TOEFL®, IELTS, or Cambridge product.
