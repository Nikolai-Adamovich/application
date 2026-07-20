# ui/ — Frontend Agent Guide

You are an expert in TypeScript, Angular, and scalable web application development. You write clean, functional,
maintainable, performant, and accessible code following the latest Angular and TypeScript best practices.

This package contains the **Angular 22** frontend application built from scratch using the most modern features of the
framework.  
Read the root [`AGENTS.md`](../AGENTS.md) first — it defines cross-cutting standards (TypeScript strict mode, no `any`,
ESLint/Prettier, Conventional Commits, Vitest, shared contracts) that this guide does not repeat.

## Stack

- **Angular 22** (standalone components, zoneless change detection)
- **Spartan UI** + **Tailwind CSS** + **SCSS** (using modern Sass `@use` syntax, no global `@import`)
- **Signals** — sole state management solution
- **Vitest** (unit tests, `jsdom` environment) + **Playwright** (E2E tests)

---

## Core Principles

### Required Patterns

- **Standalone components** only
- **Signals** for all state management
- **Signal Inputs**, **Signal Queries**, and **Signal Forms** (`@angular/forms/signals`, using the `form()` function to
  build strongly-typed `FieldTree` models)
- **`httpResource`** as the primary tool for data fetching
- Native control flow: `@if`, `@for`, `@switch`
- Deferrable views (`@defer`) for lazy loading

### Forbidden

- NgModules
- NgRx (use Signal Store or lightweight Signal Services)
- Template-driven forms or Reactive Forms (FormGroup/FormControl)
- RxJS as state management (RxJS is allowed only for complex stream composition/orchestration)
- `@HostBinding` and `@HostListener` decorators (use `host` property in `@Component` metadata)
- Explicit `standalone: true` or `changeDetection: ChangeDetectionStrategy.OnPush` (omit them as they are defaults in
  Angular 22+)

---

## Project Layout

```
ui/src/
├── main.ts              Application bootstrap (bootstrapApplication)
├── index.html           HTML entry point
├── styles.css           Global styles + CSS custom properties
├── test-setup.ts        Vitest setup (imports @angular/compiler)
└── app/
    ├── app.ts           Root standalone component
    ├── app.html         Root template
    ├── app.scss         Root styles
    ├── app.config.ts    Application providers (router, error listeners)
    ├── app.routes.ts    Route definitions
    └── app.spec.ts      Root component test
```

### Naming conventions

Angular 22 generates **suffix-less** component file names. Follow the CLI convention established by the root component
([`app.ts`](src/app/app.ts)):

| Element   | File name            | Example              |
| --------- | -------------------- | -------------------- |
| Component | `<name>.ts`          | `counter.ts`         |
| Service   | `<name>.service.ts`  | `counter.service.ts` |
| Resource  | `<name>.resource.ts` | `health.resource.ts` |
| Test      | `<name>.spec.ts`     | `counter.spec.ts`    |

> Do **not** use the legacy `*.component.ts` suffix for components.

### Component selector prefix

The project prefix is `ui` (enforced by the [`component-selector`](eslint.config.js) ESLint rule and configured in
[`angular.json`](angular.json)). All component selectors MUST use this prefix (e.g. `ui-counter`, not `app-counter`).

---

## Conventions

- Import shared contracts and types **exclusively** from `@app/shared` — this is the only path alias configured in
  [`tsconfig.json`](tsconfig.json). There is no `@shared/` alias.
- Services own and manage state; components consume signals.
- Keep components thin — push logic into injectable services.
- Strict template type checking is enabled (`strictTemplates` in [`tsconfig.json`](tsconfig.json)).
- Relative paths for external templates and styles (relative to the component `.ts` file).

### Application configuration

- All providers live in [`app.config.ts`](src/app/app.config.ts) and are passed to `bootstrapApplication` in
  [`main.ts`](src/main.ts). Do not register providers in `main.ts` directly.
- Routing is configured via `provideRouter(routes)` in `app.config.ts`, not in `main.ts`.
- Use functional providers (`provideRouter`, `provideBrowserGlobalErrorListeners`) rather than importing modules.

---

## Angular Best Practices

- Use functional `input()`, `output()`, and `model()` instead of decorators
- Use `computed()` for derived state to prevent unnecessary calculations
- Prefer `inject()` function over constructor injection
- Use the new `@Service` decorator for registering singleton services
- Implement lazy loading for feature routes
- Use `NgOptimizedImage` for all static images (provide `width`/`height` or `fill` attribute)
- **Browser-global safety:** The app is client-side rendered (CSR) and deployed as a static build to Cloudflare Pages —
  there is no SSR configured. Still, avoid accessing browser globals (`window`, `document`, `localStorage`) during
  construction or module evaluation. Use `isPlatformBrowser` or inject the corresponding tokens so the code remains
  SSR-ready if introduced later.

---

## Data Fetching & Mutations

- Use **`httpResource`** as the **primary** tool for **data fetching** (especially GET requests)
- For **mutations** (POST, PUT, PATCH, DELETE) — prefer direct `HttpClient` calls managed inside services, or integrate
  them into Signal Forms' action submissions
- Use **`rxResource`** only when you need to integrate with existing complex RxJS pipelines (e.g., custom debouncing,
  interval polling)
- Keep data fetching and mutation logic inside services
- Validate API responses with shared Zod schemas from `@app/shared` before consuming them

---

## Components

- Small, focused on a single responsibility
- Use `[class]` and `[style]` bindings instead of `ngClass` / `ngStyle`
- Manage local UI-state with signals

---

## State Management

- **Signals only**
- Use `computed()` for derived values
- Prefer `set()` and `update()` over direct state mutation
- Services act as the single source of truth

---

## Templates

- Keep templates simple, declarative, and readable
- Avoid complex logic, calculations, or method calls inside templates
- Use native control flow syntax (`@if`, `@for` with track expression)
- Do not rely on global objects like `new Date()` directly in templates (wrap in computed signals or pipes)

---

## Services

- Follow single responsibility principle
- Provide services at root level using `@Service` decorator
- Handle side effects within services using `effect()` only when syncing state with external APIs

---

## Styling

- Global styles live in [`src/styles.css`](src/styles.css).
- Component styles are inline (`styles: [...]`) or external (`styleUrl`).
- Use modern Sass `@use` syntax — never global `@import`.
- **Tailwind CSS v4** is the primary styling approach. Use Tailwind utility classes in templates. SCSS is used for
  complex custom styles that cannot be expressed with utilities.
- **Spartan UI** provides accessible, unstyled component primitives (helm components). Import only the modules you need
  per component (e.g. `import { HlmButtonImports } from '@spartan-ng/helm/button'`). See
  [`docs/architecture.md`](docs/architecture.md#adding-a-spartan-ui-component) for the full guide on adding components.

---

## Commands

| Command              | Description                             |
| -------------------- | --------------------------------------- |
| `npm start`          | `ng serve` — local dev server           |
| `npm run build`      | `ng build` — production build           |
| `npm run watch`      | `ng build --watch` (development config) |
| `npm run test`       | `vitest run` — unit tests once          |
| `npm run test:watch` | `vitest` — unit tests in watch mode     |
| `npm run e2e`        | `playwright test` — E2E tests           |
| `npm run typecheck`  | `tsc --noEmit`                          |
| `npm run lint`       | ESLint                                  |
| `npm run lint:fix`   | ESLint with `--fix`                     |

---

## Testing

- Unit test components and services with **Vitest**
- Test files use the `.spec.ts` suffix and live next to the source file
- Use `TestBed` from `@angular/core/testing` for component tests requiring dependency injection
- Test critical user flows and accessibility with **Playwright** (E2E)

---

## Accessibility

- Must pass all **AXE** checks
- Must meet **WCAG 2.1 AA** standards (focus management, color contrast, correct ARIA attributes)

---

## Adding a new feature

1. **Contract** — define the Zod schema and inferred type in `shared/`.
2. **Service** — create `*.service.ts` with the `@Service` decorator, owning the feature's state as signals.
3. **Resource** — if the feature fetches data, create `*.resource.ts` using `httpResource` and validate responses with
   the shared schema.
4. **Component** — create the standalone component(s), consuming signals from the service. Keep it thin.
5. **Route** — register the route in `app.routes.ts` (lazy-load with `loadComponent` for feature routes).
6. **Tests** — add `*.spec.ts` for the component and service.
7. **Docs** — architectural changes require Architect approval (see root
   [`AGENTS.md`](../AGENTS.md#development-workflow)).
