# ui/ — Frontend Agent Guide

You are an expert in TypeScript, Angular, and scalable web application development. You write clean, functional,
maintainable, performant, and accessible code following the latest Angular and TypeScript best practices.

This package contains the **Angular 22** frontend application built from scratch using the most modern features of the
framework.  
Read the root [`AGENTS.md`](../AGENTS.md) first.

## Stack

- **Angular 22** (standalone components, zoneless)
- **PrimeNG** + **SCSS** (using modern Sass @use syntax, no global @import)
- **Signals** — sole state management solution
- **Vitest** (unit tests) + **Playwright** (E2E tests)

## Core Principles

### Required Patterns

- **Standalone components** only
- **Signals** for all state management
- **Signal Inputs**, **Signal Queries**, and **Signal Forms** (`@angular/forms/signals`, using the `form()` function to
  build strongly-typed `FieldTree` models)
- **httpResource** as the primary tool for data fetching
- Native control flow: `@if`, `@for`, `@switch`
- Deferrable views (`@defer`) for lazy loading

### Forbidden

- NgModules
- NgRx (use Signal Store or lightweight Signal Services)
- Template-driven forms or Reactive Forms (FormGroup/FormControl)
- RxJS as state management (RxJS is allowed only for complex stream composition/orchestration)
- Tailwind CSS (use PrimeNG styling solutions and custom SCSS)
- `any` type (always use precise interfaces or `unknown`)
- `@HostBinding` and `@HostListener` decorators (use `host` property in `@Component` metadata)
- Explicit `standalone: true` or `changeDetection: ChangeDetectionStrategy.OnPush` (omit them as they are defaults in
  Angular 22+)

## Conventions

- Import shared contracts and types exclusively from `@app/shared` (or TypeScript path aliases like `@shared/...`)
- Never redefine DTOs that already exist in `shared/`
- Services own and manage state; components consume signals
- Keep components thin — push logic into injectable services
- Use strict TypeScript and strict template type checking
- Relative paths for external templates and styles (relative to the component `.ts` file)

## TypeScript Best Practices

- Leverage type inference wherever possible
- Prefer interfaces or `unknown` over `any`
- Enable strict type checking
- Keep transformations pure and predictable

## Angular Best Practices

- Use functional `input()`, `output()`, and `model()` instead of decorators
- Use `computed()` for derived state to prevent unnecessary calculations
- Prefer `inject()` function over constructor injection
- Use the new `@Service` decorator for registering singleton services
- Implement lazy loading for feature routes
- Use `NgOptimizedImage` for all static images (provide `width`/`height` or `fill` attribute)
- **SSR Safety:** Do not access browser globals (`window`, `document`, `localStorage`) directly. Use `isPlatformBrowser`
  or inject corresponding tokens

## Data Fetching & Mutations

- Use **`httpResource`** as the **primary** tool for **data fetching** (especially GET requests)
- For **mutations** (POST, PUT, PATCH, DELETE) — prefer direct `HttpClient` calls managed inside services, or integrate
  them into Signal Forms' action submissions
- Use **`rxResource`** only when you need to integrate with existing complex RxJS pipelines (e.g., custom debouncing,
  interval polling)
- Keep data fetching and mutation logic inside services

## Components

- Small, focused on a single responsibility
- Use `[class]` and `[style]` bindings instead of `ngClass` / `ngStyle`
- Manage local UI-state with signals

## State Management

- **Signals only**
- Use `computed()` for derived values
- Prefer `set()` and `update()` over direct state mutation
- Services act as the single source of truth

## Templates

- Keep templates simple, declarative, and readable
- Avoid complex logic, calculations, or method calls inside templates
- Use native control flow syntax (`@if`, `@for` with track expression)
- Do not rely on global objects like `new Date()` directly in templates (wrap in computed signals or pipes)

## Services

- Follow single responsibility principle
- Provide services at root level using `@Service` decorator
- Handle side effects within services using `effect()` only when syncing state with external APIs

## Testing

- Unit test components and services with **Vitest**
- Test critical user flows and accessibility with **Playwright** (E2E)

## Accessibility

- Must pass all **AXE** checks
- Must meet **WCAG 2.1 AA** standards (focus management, color contrast, correct ARIA attributes)
