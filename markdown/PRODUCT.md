# Product Overview

This document describes the product vision, scope, and current implementation direction for `open-prep`.

It is intended to keep product decisions aligned while the codebase grows.

## Product Vision

`open-prep` is an open-source, local-first macOS desktop application for standardized English exam preparation.

The long-term goal is to support complete test prep workflows across multiple exams and multiple skill areas, while running locally on the user's machine and integrating with locally callable AI tools for evaluation and guidance.

The product should feel focused, fast, private, and high quality.

## Core Product Goal

Help learners prepare for standardized English exams through structured practice, feedback, and progress tracking.

The current public positioning is narrower and clearer:

- Open-source TOEFL® Writing practice.
- Powered by the user's existing ChatGPT/Codex setup.
- Focused on learners who mainly want to improve their Writing score.
- Designed to avoid paying for another full exam-prep platform when Writing is the main need.
- More structured than opening a generic chatbot because practice starts from curated prompts and ends in saved, studyable feedback.

The product should eventually support:

- multiple exams
- multiple test sections
- AI-assisted evaluation where useful
- local storage of attempts and results
- future progress history and review workflows

## Primary Advantage

OpenPrep turns AI writing feedback into a repeatable study workflow instead of a loose chat thread.

The advantage is the combination of:

- curated TOEFL®-style writing prompts
- a focused desktop writing workspace
- structured rubric-based AI feedback
- scores, criterion notes, strengths, improvement points, and phrase-level feedback
- saved local attempts for later review
- use of AI access the learner may already pay for

This lets learners practice Writing in a product-shaped flow while keeping the app local-first and avoiding the cost or complexity of a full-course prep platform.

## Initial Audience

The first release is best for:

- learners who already use ChatGPT, Codex, or compatible local AI tools
- learners who are mostly comfortable with other exam sections but want focused Writing practice
- early testers who want to try the first complete desktop vertical slice
- contributors who care about calm learning software, typed domain modeling, and structured AI feedback

## Exams in Scope

The architecture and product direction should support:

- TOEFL®
- IELTS
- Cambridge

Additional exams may be added later.

The product must not be modeled around a single exam forever, even if TOEFL® is the first implementation focus.

## Sections in Scope

The long-term product must support all major prep areas:

- Reading
- Listening
- Writing
- Speaking

Each section has different interaction patterns and evaluation needs.

Examples:

- Writing uses text submission and rubric-based evaluation.
- Speaking uses audio capture, transcription, and rubric-based evaluation.
- Reading uses passage-based questions and answer checking.
- Listening uses audio playback with questions and answer checking.

The product should therefore be modular by section, not only by screen.

## AI Direction

The app should support multiple AI tools that can be called locally from the machine.

Examples include:

- Codex
- Claude Code

Other compatible local or CLI-callable tools may be supported later.

The product must not be coupled to one provider at the product-design level.

The current provider path uses Codex CLI first, so live evaluation depends on a working local Codex setup. The product should also support a mock provider for UI development and testing without a live AI call.

AI should be used where it adds clear user value, especially for:

- writing feedback
- speaking feedback
- qualitative explanations
- targeted suggestions for improvement

## Local-First Product Principle

The app is intended to run locally as a desktop application for Mac.

Core expectations:

- local execution
- local storage of results
- direct desktop UX
- privacy-conscious handling of user work

Even when AI tools are used, the product itself should remain desktop-first and local-first in structure and user experience.

## MVP Focus

The first implementation focus is narrow on purpose.

Current MVP focus:

- desktop app for macOS
- Electron + React + TypeScript
- TOEFL®-style writing practice
- prompt selection
- essay submission
- Codex-backed writing evaluation
- structured feedback UI
- local persistence of results
- progress-oriented attempt storage
- typed Electron IPC boundaries
- mock provider for local UI development
- UI based on the provided Figma screens

## MVP Screens

The current visible scope is based on the screens in the local `Figma` folder:

- prompt list screen
- submission screen
- feedback overview screen
- feedback detail screen with highlighted word feedback

Only visible and necessary functionality from those screens should be prioritized for the first build.

## Explicitly Out of Focus for Now

These items are acknowledged but not primary in the initial build:

- full history experience
- PDF export
- non-writing sections
- multi-exam UI switching
- advanced analytics
- cloud sync
- accounts or multi-user support

They should be kept possible by the architecture, but they do not drive the first implementation.

## Writing MVP Experience

The initial user flow should look like this:

1. The user opens the desktop app.
2. The user sees a list of available writing prompts.
3. The user opens a prompt and reads the instructions.
4. The user writes a response in the submission screen.
5. The user submits the response for evaluation.
6. The app runs a local AI provider command in the background.
7. The user receives a structured evaluation with scores and detailed feedback.
8. The result is stored locally for future use.

The first-screen experience should feel like practice, not marketing and not a chatbot shell.

## Writing Evaluation Expectations

The writing feedback should be structured and rubric-driven.

For the first writing flow, the AI evaluation should include:

- overall score
- criterion-based subscores
- concise explanations per criterion
- improvement-oriented feedback
- highlighted phrase or word feedback where visible in the design

The system should produce structured output that the UI can render reliably.

## Current Release Status

OpenPrep is in an early open-source preview.

The current vertical slice includes:

- prompt catalog
- writing submission flow
- Codex-backed writing evaluation
- feedback overview screen
- detailed phrase-level feedback screen
- local persistence foundation
- typed process boundaries between renderer, preload, main, and shared domain code

OpenPrep is a third-party practice tool, not an official TOEFL®, IELTS, or Cambridge product.

## Product Principles

The product should aim for:

- clarity over feature bloat
- focused practice flows
- high trust in evaluation presentation
- strong usability
- room for future expansion without redesigning the core

## User Experience Principles

The app should feel:

- calm
- direct
- readable
- structured
- academically credible

Feedback should be actionable and easy to scan.

The product should avoid feeling like a generic chatbot shell.

## Brand Color Direction

The current app brand uses the logo-led purple and green palette already present in the app UI.

Current core colors:

- Primary purple: `#502b71`
- Logo purple variants: `#5E2F7D`, `#6D3796`
- Brand green: `#30C08B`
- App background: `#f8f8f8`
- White surface: `#ffffff`
- Main text: `#131313`
- Deep foreground: `#17121d`
- Success: `#4db582`
- Warning: `#f5a000`

The deprecated video editor brief is not a current brand-color source.

## Persistence Direction

Attempts and results should be stored locally from the beginning.

This supports future product features such as:

- history
- review
- progress tracking
- repeated attempts
- comparison across attempts

The MVP does not need to expose all of these yet, but the data model should support them.

## Long-Term Product Direction

The long-term product may evolve into a broader prep platform with:

- exam-specific learning tracks
- timed practice
- section dashboards
- speaking workflows
- reading and listening modules
- history and review tools
- provider selection for AI-powered evaluation

The current implementation should be a strong foundation for that direction, not a disposable prototype.
