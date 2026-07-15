# AGENTS.md — Project Coordination Guide

This file is the single source of truth for how agents collaborate on this project. All implementation agents MUST read
this file before starting work.

---

## Project Summary

A greenfield educational full-stack application for learning modern development, AI-assisted workflows, and multi-agent
software development.

- **Frontend:** Angular 22 (standalone, signals, zoneless) + PrimeNG + SCSS
- **Backend:** Hono on Cloudflare Workers + MongoDB Atlas (official driver)
- **Shared:** TypeScript contracts, Zod schemas, shared types
- **Monorepo:** npm workspaces (`shared/`, `ui/`, `server/`)

See [`docs/architecture.md`](docs/architecture.md) for the full architecture.

---

## Repository Layout

```
application/
├── AGENTS.md              ← you are here (project-wide rules)
├── docs/                  ← architecture, decisions, tasks, components
├── shared/                ← contracts, validation, types (reused by ui + server)
│   └── AGENTS.md          ← shared-package rules
├── ui/                    ← Angular 22 frontend
│   ├── AGENTS.md          ← frontend-package rules
│   └── docs/
└── server/                ← Hono backend on Cloudflare Workers
    ├── AGENTS.md          ← backend-package rules
    └── docs/
```

Each package has its own `AGENTS.md` with **package-specific** rules. The rules in this root file apply to **all**
packages and are inherited — package files MUST NOT repeat them. Read the relevant package `AGENTS.md` before working in
that package.

---

## Development Workflow

**One task = one branch = one worktree = one agent.**

1. The Architect decomposes features into tasks and records them in [`docs/tasks.md`](docs/tasks.md).
2. Each task is assigned to a single implementation agent.
3. The agent creates a branch and a git worktree for that task.
4. The agent implements, tests, and commits using Conventional Commits.
5. The agent opens a PR; the Architect reviews for architectural consistency.
6. Only the Architect may modify architecture documentation and decisions.

Implementation agents MUST NOT:

- Modify files under [`docs/`](docs/) without Architect approval.
- Introduce new dependencies, frameworks, or patterns without approval.
- Change the architectural boundaries between `shared/`, `ui/`, and `server/`.
- Disable lint rules, type checking, or tests to make code pass.

---

## Architectural Authority

The Architect agent is responsible for:

- Defining and maintaining the system architecture.
- Recording every major decision in [`docs/decisions.md`](docs/decisions.md).
- Decomposing features into tasks in [`docs/tasks.md`](docs/tasks.md).
- Reviewing PRs for architectural drift.
- Preventing scope creep and unnecessary complexity.

Implementation agents are responsible for:

- Implementing assigned tasks within the defined architecture.
- Writing tests for all important business logic.
- Keeping code clean, typed, and lint-compliant (see Shared Standards below).
- Flagging architectural concerns to the Architect rather than acting unilaterally.

---

## Shared Standards

These rules apply to **every** package (`shared/`, `ui/`, `server/`). Package-level `AGENTS.md` files inherit them and
need not repeat them.

### TypeScript

- **Strict mode is mandatory** everywhere. The base config ([`tsconfig.base.json`](tsconfig.base.json)) enables
  `strict`, `noImplicitAny`, `strictNullChecks`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`,
  `noImplicitReturns`, and `exactOptionalPropertyTypes`.
- **`any` is forbidden.** Use `unknown` + narrowing when types are genuinely unknown, or precise interfaces when they
  are known.
- **`exactOptionalPropertyTypes`** is on — optional properties must not be assigned `undefined` explicitly; omit the key
  instead.
- **`verbatimModuleSyntax`** is on — use `import type` for type-only imports and `export type` for type-only exports.
- Leverage type inference where it improves readability; add explicit annotations for public APIs and exported
  functions.

### Shared contracts (ADR-0004)

- **Zod schemas are the single source of truth.** Define a schema once in `shared/validation/`, infer types with
  `z.infer` in `shared/types/`.
- **Never redefine DTOs** that already exist in `shared/`. Both `ui/` and `server/` import from `@app/shared`.
- The `@app/shared` workspace alias is the only configured path alias. There is no `@shared/` alias.

### Code quality

- **ESLint + Prettier** must pass on every commit (enforced by Husky + lint-staged; see
  [`.lintstagedrc.json`](.lintstagedrc.json)).
- **Commits** must follow Conventional Commits (enforced by Commitlint).
- **`console.log` is a lint warning** — only `console.warn` and `console.error` are allowed (see
  [`eslint.config.js`](eslint.config.js)). Use them for observability, not debugging leftovers.
- **No `var`**, prefer `const`/`let`; prefer arrow functions; no param reassignment (enforced by ESLint).

### Testing

- **Vitest** is the unit-test framework across all packages.
- All important business logic must be covered by unit tests.
- Test files live **next to the source** they test.
- Test-file suffixes follow each package's ecosystem convention:
  - `shared/` and `server/` use `*.test.ts`
  - `ui/` uses `*.spec.ts` (Angular CLI convention)
- Services and business logic must be testable without live infrastructure (mock the data-access layer; mock HTTP; no
  live DB).

### Thin edges, rich services

- **Route handlers / component templates are thin.** They validate input and delegate; business logic lives in services.
- **Services are pure and dependency-injectable** so they can be tested in isolation.

---

## Common Commands

Run from the repository root. Each package also has package-specific scripts documented in its own `AGENTS.md`.

| Command             | Scope | Description                       |
| ------------------- | ----- | --------------------------------- |
| `npm run lint`      | root  | ESLint across the monorepo        |
| `npm run lint:fix`  | root  | ESLint with `--fix`               |
| `npm run typecheck` | all   | `tsc --noEmit` in every workspace |
| `npm run test`      | all   | Vitest in every workspace         |
| `npm run build`     | all   | Build in every workspace          |

---

## Environment

- **Node.js `>=24.18.0`** (declared in every `package.json` `engines`).
- **npm workspaces** — `shared`, `ui`, `server` are local packages. The `@app/shared` dependency resolves to the local
  `shared/` package, not a registry.

---

## Communication

When proposing changes, agents must:

1. Explain trade-offs.
2. Explain alternatives.
3. Recommend a preferred option.
4. Keep decisions pragmatic — prefer the simplest solution that scales reasonably.

Do not over-engineer. Avoid unnecessary abstractions, patterns, frameworks, or dependencies. Think like a long-term
maintainer.
