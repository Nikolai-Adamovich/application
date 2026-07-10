# Server Architecture

Server-specific design notes. For the full monorepo architecture, see
[`docs/architecture.md`](../../docs/architecture.md).

## Service-Oriented Module Layout

```
server/src/
├── app.ts           Application wiring (routes, middleware)
├── index.ts         Worker entry point
├── env.ts           Environment bindings and validation
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

The official MongoDB Node.js driver requires TCP connectivity. Cloudflare Workers
natively run on V8 isolates without TCP socket access. The connection is established
using:

1. **`nodejs_compat` flag** - Enables Node.js compatibility layer in Wrangler
2. **`cloudflare:sockets` API** - Exposes TCP sockets through Workers runtime
3. **Custom connection options** - Routes TCP traffic through the socket API

See ADR-0002 in [`docs/decisions.md`](../../docs/decisions.md) for the full
rationale and fallback strategy.

## Data-Access Layer Interface and ADR-0002 Fallback Strategy

The `data/` layer defines a `DataStore` interface that services depend on:

```typescript
export interface DataStore {
  readonly db: Db;
}

export interface DataStoreFactory {
  create(uri: string): Promise<DataStore>;
}
```

**Fallback Strategy:** If `cloudflare:sockets` + MongoDB driver compatibility
proves unstable, the data layer can be swapped to use MongoDB Atlas Data API
(HTTP-based) without affecting services or routes.

## Error Handling and Response Envelope Conventions

- **Validation errors** (Zod): Return `400` with `{ error: 'validation_error', issues: [...] }`
- **Not found**: Return `404` with `{ error: 'not_found' }`
- **Internal errors**: Return `500` with `{ error: 'internal_error' }`
- All errors are logged via `console.error` for observability

## Environment Variables and Wrangler Secrets

| Variable      | Type   | Source | Description                     |
| ------------- | ------ | ------ | ------------------------------- |
| `MONGODB_URI` | string | Secret | MongoDB Atlas connection string |
| `CORS_ORIGIN` | string | Var    | Allowed CORS origin             |

Set secrets via:

```bash
wrangler secret put MONGODB_URI
```

## Vitest Test Inventory

- **Services**: `src/services/*.test.ts`
- **Routes**: `src/routes/*.test.ts` (planned)
- **Validation**: `../shared/src/validation/*.test.ts`

Tests use Vitest with Node environment. Services are tested in isolation
with mocked data-access layer.
