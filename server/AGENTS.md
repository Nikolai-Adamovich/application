# server/ — Backend Agent Guide

You are an expert in TypeScript, Hono, Cloudflare Workers, and scalable backend development. You write clean,
maintainable, well-typed, and well-tested code following modern edge-runtime best practices.

This package contains the Hono backend on Cloudflare Workers. Read the root [`AGENTS.md`](../AGENTS.md) first — it
defines cross-cutting standards (TypeScript strict mode, no `any`, ESLint/Prettier, Conventional Commits, Vitest, shared
contracts) that this guide does not repeat.

---

## Stack

- **Hono** on **Cloudflare Workers** (V8 isolates, edge runtime)
- **TypeScript** (strict)
- **MongoDB Atlas** via the official **MongoDB Node Driver**
- `nodejs_compat` compatibility flag + `cloudflare:sockets` for TCP
- **Zod** (schemas and inferred types imported from `@app/shared`)
- **Vitest** for unit tests

---

## Core Principles

### Required Patterns

- **Thin route handlers** — validate input, call a service, return a response. No business logic in handlers.
- **Service-oriented layering** — `routes → services → data`. Each layer has one responsibility.
- **Services depend on the `DataStore` interface**, never on the MongoDB driver directly. This keeps them pure,
  injectable, and unit-testable.
- **Shared contracts** — import Zod schemas and inferred types from `@app/shared`.
- **Validated environment** — every binding is declared in `Env` and has a matching Zod field in `envSchema` for runtime
  validation.

### Forbidden

- **NestJS** — overkill; Hono is the framework.
- **Mongoose** — use the official driver; no ODM abstraction layer.
- **Prisma** — does not fit the edge runtime + socket transport.
- **Express / Fastify** — Hono is the only HTTP framework.
- **Business logic in route handlers** — push it into services.
- **Direct driver access from services** — go through the data-access layer.

---

## Architecture

```
src/
├── index.ts         Worker entry point (fetch handler)
├── app.ts           Hono wiring: middleware + routes
├── env.ts           Env bindings + Zod validation schema
├── routes/          Thin HTTP handlers (validate → delegate → respond)
├── services/        Business logic (pure, injectable, unit-testable)
├── data/            MongoDB driver access; isolates cloudflare:sockets
└── middleware/      Error handling, logging, CORS, validation
```

### Request flow

```
Request → middleware (logger, CORS) → route handler
  → validate input (shared Zod schema)
  → call service (business logic)
  → service uses DataStore interface
  → return typed response
```

### Layer responsibilities

| Layer         | Knows about                           | Does NOT know about     |
| ------------- | ------------------------------------- | ----------------------- |
| `routes/`     | Hono, Zod, shared contracts           | MongoDB, business logic |
| `services/`   | Business rules, `DataStore` interface | Hono, MongoDB driver    |
| `data/`       | MongoDB driver, `cloudflare:sockets`  | Hono, business logic    |
| `middleware/` | Hono Context, error shapes            | Business logic          |

---

## Conventions

### Imports

- Use **ESM `.js` extensions** in relative imports (e.g. `import { app } from './app.js'`). This is required by the
  Workers bundler and TypeScript `moduleResolution`.
- Import shared contracts and types from `@app/shared` (workspace alias).

### Environment bindings

- Declare every binding in the `Env` interface in `env.ts`.
- Add a matching Zod field to `envSchema` for runtime validation.
- **Secrets** (e.g. `MONGODB_URI`) are set via `wrangler secret put` and are never committed.
- **Vars** (e.g. `CORS_ORIGIN`) go in `wrangler.toml` under `[vars]`.
- Access bindings in handlers via `c.env.*`, typed through `Hono<{ Bindings: Env }>`.

### Hono app typing

- Always type the Hono instance with bindings: `new Hono<{ Bindings: Env }>()`.
- Register cross-cutting middleware (logger, CORS, error handler) in `app.ts`, not in route modules.

### Error & response envelope

The global error handler returns a consistent JSON shape. Follow it for all error responses:

| Case                | Status | Body                                           |
| ------------------- | ------ | ---------------------------------------------- |
| Zod validation fail | `400`  | `{ error: 'validation_error', issues: [...] }` |
| Resource not found  | `404`  | `{ error: 'not_found' }`                       |
| Unhandled error     | `500`  | `{ error: 'internal_error' }`                  |

- Let `schema.parse()` throw `ZodError` — the error handler maps it to `400`.
- Log unexpected errors via `console.error` (Workers observability).

### Data-access layer

- `data/` is the **only** place that imports from `mongodb` or `cloudflare:sockets`. This isolates the ADR-0002 fallback
  strategy.
- Services depend on the `DataStore` / `DataStoreFactory` interfaces defined in `data/`, not on concrete driver types.
- If the socket transport proves unstable, swap the `data/` implementation to the Atlas Data API without touching
  services or routes.

### Dependency injection

- Services accept their dependencies (e.g. a `DataStore`) as constructor or function parameters so they can be tested
  with mocks.
- Do not import the data-access implementation at module top-level inside a service; receive it as a dependency.

---

## Commands

| Command              | Description                                   |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Local Wrangler dev server                     |
| `npm run build`      | `wrangler deploy --dry-run` (validate bundle) |
| `npm run deploy`     | Deploy to Cloudflare Workers                  |
| `npm run typecheck`  | `tsc --noEmit`                                |
| `npm run test`       | Run Vitest once                               |
| `npm run test:watch` | Run Vitest in watch mode                      |
| `npm run lint`       | ESLint                                        |

---

## Testing

- Test files use the `*.test.ts` suffix and live next to the source.
- **Mock the data-access layer** in service tests — never require a live MongoDB connection.
- For route handler tests, use Hono's `app.request()` helper to invoke routes without starting a server.
- Validate shared Zod schemas in `shared/`, not here.

---

## Adding a new feature

1. **Contract** — define the Zod schema and inferred type in `shared/`.
2. **Data access** — add methods to the `DataStore` interface (and its implementation) in `data/`.
3. **Service** — implement business logic in `services/`, depending on the `DataStore` interface.
4. **Route** — add a thin handler in `routes/` that validates input with the shared schema and delegates to the service.
5. **Tests** — unit test the service (mocked data layer) and the route handler (`app.request()`).
6. **Docs** — architectural changes require Architect approval (see root
   [`AGENTS.md`](../AGENTS.md#development-workflow)).
