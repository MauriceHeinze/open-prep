# Engineering Standards

This document defines the non-negotiable engineering standards for `open-prep`.

The goal is to keep the codebase scalable, readable, and easy to extend as the product grows across exams, sections, and AI providers.

## Core Principles

- Build for long-term maintainability, not short-term convenience.
- Prefer clear boundaries over clever abstractions.
- Keep the codebase modular, typed, and easy to reason about.
- Make changes that are safe to extend later for new exams, new sections, and new AI providers.
- Avoid tech debt by default. If a shortcut is taken, it must be explicit and temporary.

## Product Architecture Direction

The application is a local macOS desktop app built with Electron, React, and TypeScript.

The architecture must be ready for:

- multiple exams, such as TOEFL®, IELTS, and Cambridge
- multiple sections, such as reading, listening, writing, and speaking
- multiple locally callable AI providers, such as Codex and Claude Code

The MVP may be TOEFL®-writing-first, but the architecture must not hard-code that assumption into the app core.

## Layering Rules

The codebase must keep strict boundaries between layers:

- `renderer`
  UI, routing, screen composition, view state
- `preload`
  typed bridge between renderer and Electron main
- `main`
  orchestration, local persistence, shell execution, provider integration
- `shared/domain`
  domain models, contracts, schemas, validation, pure business logic

Rules:

- React components must not contain business logic.
- The renderer must not access Node.js or Electron APIs directly.
- Shell commands may only run in the Electron main process.
- Provider-specific code must stay inside the provider layer.
- Exam-specific and section-specific logic must stay out of generic app services unless intentionally abstracted behind interfaces.

## Folder Design

Favor feature-first organization in the renderer.

Avoid broad dumping-ground folders such as:

- `misc`
- `helpers`
- `common`
- `temp`
- `shared` for unrelated UI code

Allowed pattern:

- `renderer/features/<feature-name>/...`
- `main/services/<service-name>/...`
- `shared/domain/<domain-area>/...`

Every folder should have a clear reason to exist.

## File Size and Modularity

Files should stay small and focused.

Standards:

- target file size: usually `<= 200` lines
- review and split files aggressively around `250` lines
- files over `300` lines require a deliberate reason
- each file should have one clear responsibility

Rules:

- do not create god components
- do not create god services
- do not create giant reducers or giant hooks
- do not accumulate unrelated utility functions in one place

If a file starts handling multiple concerns, split it.

## TypeScript Standards

Type safety is mandatory.

Rules:

- use `strict` TypeScript settings
- do not use `any` unless there is a documented, unavoidable reason
- prefer explicit domain types
- prefer discriminated unions for state machines and variant models
- prefer `type` for data shapes
- use `interface` only when extension or implementation semantics are the better fit

Model these domains explicitly:

- `examType`
- `sectionType`
- `providerType`
- `attemptStatus`
- `evaluationStatus`

## Runtime Validation

Static typing is not enough at system boundaries.

All unsafe boundaries must use runtime validation:

- IPC payloads
- AI provider output
- local persistence reads
- configuration
- imported seed data

Invalid external input must fail clearly and early.

## React Standards

React code must stay predictable and easy to evolve.

Rules:

- keep state as local as possible
- do not introduce global state unless there is a clear need
- separate screen composition from reusable UI pieces
- keep JSX lean; move non-trivial logic out of render bodies
- create custom hooks only when they improve reuse or clarity
- avoid premature memoization
- preserve the existing visual language once the design system is established

Component expectations:

- components should be small and composable
- props should be explicit
- side effects should be isolated and understandable

## Styling Standards

Styling must be systematic, not ad hoc.

Rules:

- use design tokens and shared variables
- avoid one-off magic values where reusable tokens should exist
- keep spacing, typography, radius, and color usage consistent
- prefer reusable layout primitives over repeated custom CSS

The UI should match the approved designs closely while still being implemented as maintainable components.

## Electron Standards

Desktop app safety and separation are mandatory.

Rules:

- `contextIsolation: true`
- `nodeIntegration: false`
- expose only narrow, typed preload APIs
- validate every IPC input and output shape
- keep privileged logic out of the renderer

## AI Provider Standards

AI integrations must be pluggable.

The app core must not depend directly on Codex-specific behavior.

Required design:

- common provider interface
- provider registry or provider selection layer
- provider-specific command builder
- provider-specific response parser
- provider-agnostic evaluation result model

Rules:

- no Codex-specific logic outside the Codex provider
- no Claude-specific logic outside the Claude provider
- prompts, transport, and parsing should be separate concerns
- every provider call must handle timeouts, non-zero exits, malformed output, and unavailable binaries

## Exam and Section Standards

The domain model must support expansion across exams and sections.

Rules:

- do not hard-code TOEFL® into shared models
- do not hard-code writing assumptions into attempt or evaluation models
- keep section-specific evaluation logic isolated
- design shared contracts around stable concepts, not current MVP shortcuts

Preferred thinking:

- shared core where behavior is truly shared
- specialized modules where behavior genuinely differs

## Persistence Standards

Stored data must be structured for future history and analytics features.

Rules:

- every attempt should be persistable as a first-class record
- evaluations should be stored in a structured form, not only as raw blobs
- persistence code must be isolated from UI logic
- migrations must be possible without rewriting the app core

We optimize for future history support even if history is not yet a primary MVP surface.

## Testing Standards

Tests should focus on high-value logic.

Priority areas:

- domain logic
- evaluation parsing
- provider adapters
- persistence repositories
- IPC contracts
- section scoring logic

Testing rules:

- test business logic before testing implementation details
- test parsing and validation heavily
- avoid brittle snapshot-heavy tests as the main strategy
- keep tests close to the module they verify when practical

## Code Quality Standards

General rules:

- follow DRY, but do not over-abstract too early
- prefer composition over duplication only when the abstraction is truly stable
- write code for readability first
- comments should be rare and useful
- naming should be precise and boring rather than clever

Do not introduce:

- hidden side effects
- shared mutable state without strong justification
- broad utility modules that mix unrelated concerns
- architecture shortcuts that make future modules harder to add

## Linting and Formatting

The project should enforce consistent style automatically.

Standards:

- ESLint with Airbnb-style rules as a baseline
- Prettier for formatting
- import ordering must be consistent
- CI or local verification should fail on lint or type errors

Warnings should not be allowed to pile up.

## Decision-Making Rules

When multiple implementations are possible:

- choose the one with clearer boundaries
- choose the one that keeps domain logic isolated
- choose the one that is easier to test
- choose the one that avoids future rewrites for new exams, sections, or providers

If a tradeoff must be made, prefer maintainability over speed unless explicitly agreed otherwise.

## Non-Negotiable Defaults

These rules should be treated as defaults unless we explicitly revise them:

1. No large files by accident.
2. No unsafe boundary without runtime validation.
3. No provider-specific logic outside provider modules.
4. No exam-specific or section-specific shortcuts in the app core.
5. No business logic hidden in React components.
6. No convenience decisions that make future expansion painful.
