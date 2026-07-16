# Server Architecture

Server-specific design notes. For the full monorepo architecture, see
[`docs/architecture.md`](../../docs/architecture.md). For operational rules, see [`server/AGENTS.md`](../AGENTS.md).

## Service-Oriented Module Layout

```
server/src/
├── index.ts         Worker entry point (fetch handler)
├── app.ts           Hono wiring: middleware + routes
├── env.ts           Env bindings + Zod validation schema
├── routes/          Thin HTTP handlers
│   └── index.ts
├── services/        Business logic (pure, testable)
│   └── (service modules)
├── data/            Data access layer (MongoDB driver)
│   └── index.ts
└── middleware/      Cross-cutting concerns
    └── error-handler.ts
```

## MongoDB Connection Setup via `cloudflare:sockets` + `nodejs_compat`

The official MongoDB Node.js driver requires TCP connectivity. Cloudflare Workers natively run on V8 isolates without
TCP socket access. The connection is established using:

1. **`nodejs_compat` flag** — Enables Node.js compatibility layer in Wrangler (set in
   [`wrangler.toml`](../wrangler.toml))
2. **`cloudflare:sockets` API** — Exposes TCP sockets through Workers runtime
3. **Custom connection options** — Routes TCP traffic through the socket API

See ADR-0002 in [`docs/decisions.md`](../../docs/decisions.md) for the full rationale and fallback strategy.

## Data-Access Layer Interface and ADR-0002 Fallback Strategy

The [`data/`](../src/data/index.ts) layer defines interfaces that services depend on:

```typescript
export interface DataStore {
  readonly db: Db;
}

export interface DataStoreFactory {
  create(uri: string): Promise<DataStore>;
}
```

**Dependency direction:** `routes → services → data (DataStore interface)` — see
[`docs/components.md`](../../docs/components.md).

**Fallback Strategy:** If `cloudflare:sockets` + MongoDB driver compatibility proves unstable, the `data/` layer can be
swapped to use MongoDB Atlas Data API (HTTP-based) without affecting services or routes. This isolates the ADR-0002
fallback to a single component.

## Error Handling and Response Envelope Conventions

The global [`error-handler`](../src/middleware/error-handler.ts) middleware returns a consistent JSON shape:

| Case                | Status | Body                                           |
| ------------------- | ------ | ---------------------------------------------- |
| Zod validation fail | `400`  | `{ error: 'validation_error', issues: [...] }` |
| Resource not found  | `404`  | `{ error: 'not_found' }`                       |
| Unhandled error     | `500`  | `{ error: 'internal_error' }`                  |

- Let `schema.parse()` throw `ZodError` — the error handler maps it to `400`.
- Log unexpected errors via `console.error` (Workers observability).

## Environment Variables and Wrangler Secrets

| Variable      | Type   | Source          | Description                     |
| ------------- | ------ | --------------- | ------------------------------- |
| `MONGODB_URI` | string | Secret          | MongoDB Atlas connection string |
| `CORS_ORIGIN` | string | `wrangler.toml` | Allowed CORS origin             |

Both are validated at runtime by [`envSchema`](../src/env.ts) using Zod.

Set secrets via:

```bash
wrangler secret put MONGODB_URI
```

## Vitest Test Inventory

- **Services:** `src/services/*.test.ts` (planned)
- **Routes:** `src/routes/*.test.ts` (planned)
- **Validation:** `../shared/src/validation/*.test.ts`

Tests use Vitest with Node environment. Services are tested in isolation with mocked data-access layer. Route handler
tests use Hono's `app.request()` helper. See [`server/AGENTS.md`](../AGENTS.md#testing) for the full testing guide.
