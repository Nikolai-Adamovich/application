# ui/ — Frontend Agent Guide

This package contains the Angular 22 frontend. Read the root
[`AGENTS.md`](../AGENTS.md) first.

---

## Stack

- Angular 22, standalone components, zoneless
- PrimeNG + SCSS
- Signals (sole state management)
- Vitest (unit) + Playwright (E2E)

## Required Patterns

- **Standalone components** only. No NgModules.
- **Signals** for all state. No NgRx, no RxJS-as-store.
- **Signal Forms** for input. No template-driven forms.
- **Signal Inputs** and **Signal Queries**.
- **Resource API** for data fetching.
- **Control flow** syntax: `@if`, `@for`, `@switch`.
- **Deferrable views** (`@defer`) for lazy-loaded content.

## Forbidden

- NgModules
- NgRx
- Template-driven Forms
- RxJS as state management
- Tailwind CSS

## Conventions

- Import shared contracts and types from `@app/shared` (workspace alias).
- Never redefine a DTO type that exists in `shared/`.
- Services own state; components consume signals from services.
- Keep components thin; push logic into injectable services.
- Strict TypeScript, no `any`.

## Testing

- Unit test components and services with Vitest.
- E2E critical user flows with Playwright.
