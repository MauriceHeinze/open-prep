# Product Overview

This document describes the product vision, scope, and current implementation direction for `open-prep`.

It is intended to keep product decisions aligned while the codebase grows.

## Product Vision

`open-prep` is a local macOS desktop application for exam preparation.

The long-term goal is to support complete test prep workflows across multiple exams and multiple skill areas, while running locally on the user's machine and integrating with locally callable AI tools for evaluation and guidance.

The product should feel focused, fast, private, and high quality.

## Core Product Goal

Help learners prepare for standardized English exams through structured practice, feedback, and progress tracking.

The product should eventually support:

- multiple exams
- multiple test sections
- AI-assisted evaluation where useful
- local storage of attempts and results
- future progress history and review workflows

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
- AI-based writing evaluation
- local persistence of results
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

## Writing Evaluation Expectations

The writing feedback should be structured and rubric-driven.

For the first writing flow, the AI evaluation should include:

- overall score
- criterion-based subscores
- concise explanations per criterion
- improvement-oriented feedback
- highlighted phrase or word feedback where visible in the design

The system should produce structured output that the UI can render reliably.

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
