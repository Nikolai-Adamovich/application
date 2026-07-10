# server/ — Backend Agent Guide

This package contains the Hono backend on Cloudflare Workers. Read the root
[`AGENTS.md`](../AGENTS.md) first.

---

## Stack

- Hono on Cloudflare Workers
- TypeScript (strict)
- MongoDB Atlas via official driver
- `nodejs_compat` + `cloudflare:sockets` for TCP
- Zod (schemas from `shared/`)
- Vitest

## Architecture

```
routes/      thin handlers: validate input, call service, return response
services/    all business logic; pure, injectable, unit-testable
data/        MongoDB driver access; isolates cloudflare:sockets details
middleware/  error handling, logging, CORS, validation
```

### Rules

- Business logic MUST NOT live in route handlers.
- Services depend on the data-access layer, not on Hono.
- Reuse Zod schemas and types from `shared/`. Never redefine DTOs.
- The data-access layer is the only place that knows about `cloudflare:sockets`.
  This isolates the fallback strategy (ADR-0002).

## Forbidden

- NestJS
- Mongoose
- Prisma

## Conventions

- Strict TypeScript, no `any`.
- Import shared contracts and types from `@app/shared` (workspace alias).
- Services are dependency-injectable so they can be tested without a live DB.

## Testing

- Unit test services and route handlers with Vitest.
- Mock the data-access layer in service tests; do not require a live MongoDB.
