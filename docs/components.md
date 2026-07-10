# Components

> High-level description of the system's logical components and their boundaries.
> For the full architectural context, see [`architecture.md`](architecture.md).

---

## Package: `shared/`

The contract layer shared by `ui/` and `server/`.

### `shared/validation/`

Zod schemas defining every API request and response shape. This is the single
source of truth for validation and types.

### `shared/contracts/`

API route definitions: method, path, request schema, response schema. Used by
the backend to register routes and by the frontend to type API calls.

### `shared/types/`

TypeScript types inferred from Zod schemas via `z.infer`. Re-exported for
ergonomic imports. No hand-written DTO types that duplicate a schema.

---

## Package: `ui/`

The Angular 22 frontend SPA.

### Feature Components

Standalone Angular components organized by feature. Each uses Signal Inputs,
Signal Queries, and the new control flow syntax (`@if`, `@for`, `@switch`).

### Services

Injectable services holding Signals-based state and exposing methods to mutate
it. Services are the state owners; components consume signals from services.

### Resource Layer

Angular Resource API wrappers around `fetch` calls to the backend. Typed
against `shared/contracts`. Used with `@defer` for lazy-loaded views.

### Forms

Signal Forms for all user input. No template-driven or reactive-forms state.

### Styling

SCSS + PrimeNG theme. No Tailwind.

---

## Package: `server/`

The Hono backend on Cloudflare Workers.

### Routes

Thin Hono route handlers. Parse and validate input with shared Zod schemas,
delegate to a service, and return a typed response. No business logic here.

### Services

Service-oriented modules containing all business logic. Pure, injectable, and
unit-testable without a live database. Services depend on the data-access layer,
not on Hono.

### Data Access

A thin data-access layer wrapping the official MongoDB driver. Isolates the
`cloudflare:sockets` + `nodejs_compat` connection details so the fallback
strategy (ADR-0002) can swap implementations without touching services.

### Middleware

Hono middleware for cross-cutting concerns: error handling, request logging,
CORS, and shared validation.

---

## Cross-Cutting

### CI/CD

GitHub Actions pipelines for lint, typecheck, unit tests, and build. Deploy to
Cloudflare Pages (frontend) and Cloudflare Workers (backend) after successful CI.

### Tooling

ESLint, Prettier, Husky, lint-staged, Commitlint. Shared config at the repo
root; package-specific overrides where necessary.

### Testing

Vitest for unit tests across all packages. Playwright for frontend E2E.
