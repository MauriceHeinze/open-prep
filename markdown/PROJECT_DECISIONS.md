# Project Decisions

This document records the current technical and architectural decisions for `open-prep`.

It should answer: what we have decided, why we decided it, and what tradeoffs come with that decision.

This file is intentionally separate from:

- `PRODUCT.md`, which describes the product direction
- `ENGINEERING.md`, which defines coding and architecture standards

## Status

This project is still in the foundation phase.

The decisions below represent the current intended baseline unless we explicitly revise them.

## Application Platform

Decision:

- Build `open-prep` as a local macOS desktop application.

Why:

- desktop UX is the target
- local execution is part of the product direction
- local file and process access are important for persistence and AI CLI integrations

Tradeoffs:

- more app-shell complexity than a browser-only app
- packaging and desktop lifecycle concerns must be handled carefully

## Desktop Stack

Decision:

- Use `Electron` for the desktop shell.
- Use `React` for the renderer UI.
- Use `TypeScript` across the whole codebase.

Why:

- Electron is well suited for a local desktop app with process access
- React provides a mature UI ecosystem
- TypeScript improves safety and maintainability for a modular, long-lived codebase

Tradeoffs:

- Electron adds platform and process-boundary complexity
- React requires discipline to avoid UI/business-logic mixing

## Initial Product Focus

Decision:

- Build the first implementation around the currently visible writing flow from the provided Figma screens.

Why:

- it gives us a narrow, shippable vertical slice
- it lets us validate architecture and UX without prematurely building every section

Tradeoffs:

- some future-facing abstractions must be introduced before they are fully used
- the first user-facing build will not yet represent the full long-term product scope

## Product Direction Baseline

Decision:

- Design the app as a multi-exam, multi-section platform from the start.

Current long-term targets:

- exams: `TOEFL®`, `IELTS`, `Cambridge`
- sections: `Reading`, `Listening`, `Writing`, `Speaking`

Why:

- this avoids hard-coding writing-only or TOEFL®-only assumptions into the core
- it reduces the need for major refactors later

Tradeoffs:

- requires stronger domain design upfront
- increases architectural planning effort in the foundation phase

## AI Integration Direction

Decision:

- Do not couple the app to Codex alone.
- Build the AI layer as a pluggable provider system for locally callable tools.

Initial provider target:

- `Codex` through the official Codex SDK

Planned future-compatible provider examples:

- `Claude Code`

Why:

- provider flexibility is a product requirement
- provider tools differ in SDK surface, command format, output, and capabilities
- the app should be able to switch or expand providers without redesigning the core

Tradeoffs:

- more abstraction work upfront
- provider contracts and parsers must be designed carefully

## AI Invocation Strategy

Decision:

- Run AI provider calls from the Electron `main` process only.
- Use the official provider SDK where available before introducing app-owned command execution.

Why:

- privileged process execution belongs outside the renderer
- this keeps the renderer simpler and safer
- it aligns with Electron security best practices

Tradeoffs:

- adds IPC and orchestration work
- requires robust timeout, error, and parsing handling

## Initial AI Configuration Direction

Decision:

- The initial writing-evaluation provider flow should target Codex through `@openai/codex-sdk` with `gpt-5.4-mini`.
- Reasoning should be configured toward a low reasoning mode when supported by the provider interface or command surface.

Why:

- this is the current product request
- low reasoning may help keep evaluation flows faster and more predictable for the MVP

Tradeoffs:

- provider SDK and runtime options may evolve over time
- reasoning controls must be isolated from the app core because they are provider-specific

Note:

- Users do not need to install Codex CLI separately for OpenPrep.
- Codex-backed writing evaluation uses a five-minute default timeout and can be overridden with `OPEN_PREP_CODEX_TIMEOUT_MS` for slower local setups.
- Packaged Electron builds must launch the bundled Codex binary from `app.asar.unpacked`. The Codex SDK wraps the npm-provided Codex CLI, and native executables cannot be spawned from Electron's virtual `app.asar` path.

## App Architecture

Decision:

- Keep strict separation between `renderer`, `preload`, `main`, and `shared/domain`.

Why:

- process boundaries are easier to reason about
- business logic can stay testable and reusable
- privileged code remains isolated

Tradeoffs:

- more files and explicit contracts
- slightly more setup work for each new feature

## UI Organization

Decision:

- Use a feature-first organization in the renderer.

Why:

- it scales better than broad shared folders for evolving product areas
- it helps keep section-specific UI logic contained

Tradeoffs:

- shared abstractions must be introduced deliberately rather than by habit

## Domain Modeling Direction

Decision:

- Model stable concepts explicitly: exams, sections, prompts, attempts, evaluations, providers.

Why:

- the app is expected to expand in all of these dimensions
- clear domain models reduce accidental coupling

Tradeoffs:

- requires more up-front design discipline than a simple screen-first build

## Validation Strategy

Decision:

- Use runtime validation at all unsafe boundaries.

Boundaries include:

- IPC payloads
- AI outputs
- config
- persistence reads

Why:

- TypeScript alone does not protect runtime boundaries
- AI output in particular must be treated as untrusted input

Tradeoffs:

- additional schema and validation code
- stronger need to keep contracts centralized

## Validation Library

Decision:

- Use `Valibot` as the runtime validation layer.

Why:

- validation is a first-class need in this project
- it keeps IPC, provider output, and persistence boundaries explicit
- it is lightweight and fits the current contract-first needs well

Tradeoffs:

- if a stronger JSON-Schema-first workflow becomes necessary later, we may revisit this choice

## Persistence Direction

Decision:

- Persist results locally from the beginning.
- Structure persistence so future history features can be added without redesigning the storage model.

Why:

- local result storage is already part of the current scope
- future history and review features depend on clean persisted attempt/evaluation records

Tradeoffs:

- requires persistence modeling before history is a visible feature

## Database Direction

Decision:

- Use `SQLite` as the local database.
- Use `better-sqlite3` for the initial persistence layer.

Why:

- it supports structured queries and future history features well
- it is a strong fit for a local desktop application
- synchronous local access keeps the main-process data layer simple for the MVP

Tradeoffs:

- adds migration and repository concerns
- more setup than dumping JSON files
- native module compatibility must be handled carefully in Electron builds

## Export and History Scope

Decision:

- Do not prioritize PDF export in the first implementation.
- Do not make history a primary user-facing feature yet.
- Still store the data in a way that supports both later.

Why:

- current focus is the visible MVP flow from the designs
- this keeps the first iteration disciplined

Tradeoffs:

- some visible controls may remain unimplemented or partially represented in the early build

## Code Quality Direction

Decision:

- Optimize aggressively for maintainability and small modules.

Standards baseline:

- DRY
- SOLID-oriented boundaries
- Airbnb-style linting baseline
- strict TypeScript
- runtime validation

Why:

- the product has long-term expansion pressure
- poor foundations would compound quickly across exams, sections, and providers

Tradeoffs:

- more up-front discipline
- more deliberate scaffolding before feature speed increases

## Testing Direction

Decision:

- Prioritize testing around domain logic, provider integration boundaries, validation, and persistence.

Why:

- these layers are the highest risk for silent breakage
- UI can evolve safely if the core contracts are stable

Tradeoffs:

- some test work appears before the app feels feature-rich

## Security Direction

Decision:

- Follow safe Electron defaults from the start.

Baseline:

- `contextIsolation: true`
- `nodeIntegration: false`
- narrow preload surface only

Why:

- it is easier to keep the security model strong from day one than to retrofit it later

Tradeoffs:

- more ceremony for renderer-to-main communication

## Current Open Decisions

These decisions are still open and should be finalized in later iterations:

- exact E2E testing strategy
- whether the styling system should stay CSS-first or move toward a component-level abstraction
- when to add a second real AI provider beyond Codex

## Build Tooling

Decision:

- Use `Vite` with `vite-plugin-electron` as the desktop build foundation.

Why:

- it gives fast local iteration
- it keeps the Electron main, preload, and renderer builds in one coherent toolchain

Tradeoffs:

- path resolution between renderer and Electron builds needs discipline

## Testing Tooling

Decision:

- Use `Vitest` for the first testing layer.

Why:

- it integrates cleanly with the Vite-based setup
- it is sufficient for schema and domain-level tests in the foundation phase

Tradeoffs:

- it does not replace later E2E coverage for full desktop workflows

## Styling Direction

Decision:

- Use token-driven CSS for the first implementation layer.
- Use `Radix UI` as the primitive layer for interactive UI controls.

Why:

- it keeps the initial surface simple
- it matches the need to build faithful screen implementations quickly without locking into a heavy styling abstraction too early
- it provides accessible, low-opinion building blocks without forcing a generic visual system

Tradeoffs:

- larger component libraries or theming complexity may justify a stronger abstraction later
- we still need to design and maintain our own visual language on top of the primitives

## Decision Rule

Until revised, new implementation choices should align with these priorities:

1. Keep the app local-first.
2. Keep the architecture multi-exam, multi-section, and multi-provider ready.
3. Keep process and privilege boundaries explicit.
4. Prefer maintainability over short-term speed.
5. Avoid decisions that force a rewrite when future modules arrive.
