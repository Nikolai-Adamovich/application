# Architecture Decision Records

> Every major architectural decision is recorded here. Format: ADR-NNNN — Title — Status (Proposed | Accepted |
> Superseded).

---

## ADR-0001 — Monorepo with npm workspaces

**Status:** Accepted

### Context

The project has a frontend (`ui/`), backend (`server/`), and a shared contract layer. DTOs and validation schemas must
not be duplicated across packages.

### Options

1. **npm workspaces monorepo** — single repo, local packages, no extra tooling.
2. **Nx / Turborepo** — richer task graph and caching, but added complexity.
3. **Polyrepo** — separate repos per package, published to a registry.

### Trade-offs

- npm workspaces: zero extra dependencies, built into npm, simplest CI. No caching or advanced task orchestration.
- Nx/Turborepo: powerful caching and generators, but overkill for a 3-package educational project and adds learning
  overhead.
- Polyrepo: clean boundaries, but high overhead for sharing contracts and requires a private registry.

### Decision

Use **npm workspaces**. The project is small and educational; the simplest tool that solves the shared-contract problem
is the right choice. We can migrate to Nx later if task orchestration becomes painful.

---

## ADR-0002 — MongoDB on Cloudflare Workers via nodejs_compat + cloudflare:sockets

**Status:** Accepted

### Context

The backend runs on Cloudflare Workers (V8 isolates) and must use the official MongoDB Node driver to connect to MongoDB
Atlas. Workers do not natively expose raw TCP sockets, which the official driver requires.

### Options

1. **nodejs_compat + cloudflare:sockets** — run the official driver by routing TCP through Cloudflare's socket API with
   Node compatibility enabled.
2. **MongoDB Atlas Data API** — HTTP-based access, no driver needed.
3. **Node.js host instead of Workers** — deploy Hono to Fly.io/Render with the driver over standard TCP.
4. **Hybrid** — Workers for edge logic + a thin Node service for DB access.

### Trade-offs

- **Option 1** keeps the official driver requirement and stays on the edge runtime, but is bleeding-edge and may require
  a fallback if the socket API or driver compatibility regresses.
- **Option 2** is the simplest on Workers but drops the official driver requirement and adds per-request HTTP latency to
  the database.
- **Option 3** keeps the driver and is the most mature, but abandons the Cloudflare Workers deployment target.
- **Option 4** is the most flexible but introduces a second service, more deployment surface, and operational
  complexity.

### Decision

Use **Option 1**: Hono on Cloudflare Workers with the official MongoDB driver via `nodejs_compat` +
`cloudflare:sockets`.

### Fallback strategy

If driver/socket compatibility proves unstable, fall back to **Option 2** (Atlas Data API) behind a thin data-access
service interface so the rest of the backend is unaffected. The service-oriented architecture makes this swap localized
to the data-access layer.

---

## ADR-0003 — Angular Signals as sole state management

**Status:** Accepted

### Context

The frontend must manage state without NgRx or RxJS-as-store patterns.

### Decision

Use **Angular Signals** exclusively for state. Signal Forms, Signal Inputs, and Signal Queries are used throughout. RxJS
may appear only for third-party interop, never as an application state store.

### Rationale

Signals are the modern Angular primitive, integrate with zoneless change detection, and avoid the boilerplate and
learning curve of NgRx for an educational project of this scope.

---

## ADR-0004 — Zod as the single validation source of truth

**Status:** Accepted

### Context

Both frontend and backend need to validate the same data shapes. Hand-written DTO types inevitably drift from runtime
validation.

### Decision

Define **Zod schemas once** in `shared/validation`. Infer TypeScript types with `z.infer` in `shared/types`. Both
packages import these. No hand-written DTO types that duplicate a schema.

### Rationale

One schema → runtime validation + compile-time types → no drift. This is the simplest way to guarantee contract
consistency across the stack.

---

## ADR-0005 — Frontend build and deployment strategy

**Status:** Accepted

### Context

The frontend must be built and deployed efficiently with proper caching and error handling.

### Options

1. **Cloudflare Pages** — Static build deployed to edge, automatic CI/CD from GitHub, built-in SSL and CDN.
2. **Vercel** — Similar static deployment with serverless functions.
3. **Netlify** — Static deployment with deploy previews.

### Trade-offs

- **Cloudflare Pages**: Best integration with Cloudflare Workers backend, unified dashboard, but requires Cloudflare
  account.
- **Vercel**: Excellent developer experience, but separate vendor from backend.
- **Netlify**: Good features, but additional vendor complexity.

### Decision

Use **Cloudflare Pages** for the frontend. It provides:

- Unified Cloudflare dashboard with Workers
- Automatic GitHub integration
- Built-in SSL and global CDN
- Consistent deployment experience with backend

### Build Configuration

- Build command: `npm run build --workspace @app/ui`
- Output directory: `ui/dist`
- Node.js version: `>=24.18.0` (declared in every `package.json` `engines`)

### Deployment

- Deploy on successful CI run to `main` branch
- Preview deployments for pull requests (configured in Cloudflare dashboard)
