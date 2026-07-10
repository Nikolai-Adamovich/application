# shared/ — Shared Package Agent Guide

This package contains shared contracts, validation schemas, and types. Read the root
[`AGENTS.md`](../AGENTS.md) first.

---

## Stack

- TypeScript (strict)
- Zod (validation schemas)
- Vitest (tests)

## Architecture

```
shared/src/
├── index.ts           Package barrel exports
├── validation/        Zod schemas (single source of truth)
├── contracts/         API route definitions
└── types/             TypeScript types inferred from Zod schemas
```

## Rules

- Define Zod schemas once in `validation/`. Never duplicate a schema.
- Infer TypeScript types from schemas using `z.infer`.
- Export types from `types/` for ergonomic imports.
- Both `ui/` and `server/` import from `@app/shared`.

## Forbidden

- Hand-written DTO types that duplicate a Zod schema.
- Duplicate validation logic.

## Conventions

- Strict TypeScript, no `any`.
- Import from `@app/shared` (workspace alias).
- Tests in `validation/` cover schema validation.

## Testing

- Unit test Zod schemas with Vitest.
- Test both valid and invalid inputs.
