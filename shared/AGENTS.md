# shared/ — Shared Package Agent Guide

This package contains shared contracts, validation schemas, and types reused by both `ui/` and `server/`. Read the root
[`AGENTS.md`](../AGENTS.md) first — it defines cross-cutting standards (TypeScript strict mode, no `any`,
ESLint/Prettier, Conventional Commits, Vitest, shared contracts) that this guide does not repeat.

---

## Stack

- **TypeScript** (strict)
- **Zod** (validation schemas — the single source of truth)
- **Vitest** (tests)

---

## Core Principles

### Required Patterns

- **Define Zod schemas once** in `validation/`. Never duplicate a schema.
- **Infer TypeScript types** from schemas using `z.infer` in `types/`.
- **Export** schemas and types through the barrel `index.ts` so consumers import from `@app/shared`.
- **Document API contracts** (route paths, request/response shapes) in `contracts/`.

### Forbidden

- **Hand-written DTO types** that duplicate a Zod schema — infer instead.
- **Duplicate validation logic** — a schema is defined once and reused.
- **Runtime logic** — this package is contracts and types only, no business logic or side effects.

---

## Architecture

```
shared/src/
├── index.ts           Package barrel exports
├── validation/        Zod schemas (single source of truth)
├── contracts/         API route definitions, request/response shapes
└── types/             TypeScript types inferred from Zod schemas (z.infer)
```

### Export surface

The package exposes subpath exports (see [`package.json`](package.json)):

| Import path              | Contents                       |
| ------------------------ | ------------------------------ |
| `@app/shared`            | Barrel — re-exports everything |
| `@app/shared/validation` | Zod schemas                    |
| `@app/shared/contracts`  | API route definitions          |
| `@app/shared/types`      | Inferred TypeScript types      |

---

## Conventions

- Schemas are the source of truth; types are always derived, never hand-written.
- Use `import type` for type-only exports (`verbatimModuleSyntax` is enabled).
- Keep the package free of runtime dependencies beyond Zod — no HTTP, no DB, no framework code.

---

## Commands

| Command              | Description                         |
| -------------------- | ----------------------------------- |
| `npm run typecheck`  | `tsc --noEmit`                      |
| `npm run test`       | `vitest run` — run tests once       |
| `npm run test:watch` | `vitest` — tests in watch mode      |
| `npm run build`      | `tsc --project tsconfig.build.json` |

---

## Testing

- Test files use the `*.test.ts` suffix and live next to the source.
- Test **both valid and invalid inputs** for every schema.
- Cover edge cases: empty strings, boundary values, extra/unknown keys.

---

## Adding a new contract

1. **Schema** — define the Zod schema in `validation/`.
2. **Type** — infer the TypeScript type with `z.infer` in `types/`.
3. **Contract** — if it defines an API route, document it in `contracts/`.
4. **Export** — re-export from `index.ts` barrels.
5. **Tests** — add `*.test.ts` covering valid and invalid inputs.
6. **Docs** — architectural changes require Architect approval (see root
   [`AGENTS.md`](../AGENTS.md#development-workflow)).
