# AGENTS.md — Project Coordination Guide

This file is the single source of truth for how agents collaborate on this project.
All implementation agents MUST read this file before starting work.

---

## Project Summary

A greenfield educational full-stack application for learning modern development,
AI-assisted workflows, and multi-agent software development.

- **Frontend:** Angular 22 (standalone, signals, zoneless) + PrimeNG + SCSS
- **Backend:** Hono on Cloudflare Workers + MongoDB Atlas (official driver)
- **Shared:** TypeScript contracts, Zod schemas, shared types
- **Monorepo:** npm workspaces (`shared/`, `ui/`, `server/`)

See [`docs/architecture.md`](docs/architecture.md) for the full architecture.

---

## Development Workflow

**One task = one branch = one worktree = one agent.**

1. The Architect decomposes features into tasks and records them in
   [`docs/tasks.md`](docs/tasks.md).
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

## Repository Layout

```
application/
├── AGENTS.md              ← you are here
├── docs/                  ← architecture, decisions, tasks, components
├── shared/                ← contracts, validation, types (reused by ui + server)
├── ui/                    ← Angular 22 frontend
│   ├── AGENTS.md
│   └── docs/
└── server/                ← Hono backend on Cloudflare Workers
    ├── AGENTS.md
    └── docs/
```

Each package has its own `AGENTS.md` with package-specific rules.
Read the relevant one before working in that package.

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
- Keeping code clean, typed (strict mode, no `any`), and lint-compliant.
- Flagging architectural concerns to the Architect rather than acting unilaterally.

---

## Code Quality Standards

- TypeScript strict mode is mandatory everywhere.
- `any` is forbidden; use `unknown` + narrowing when types are genuinely unknown.
- ESLint + Prettier must pass on every commit (enforced by Husky + lint-staged).
- Commits must follow Conventional Commits (enforced by Commitlint).
- All important business logic must be covered by unit tests (Vitest).

---

## Communication

When proposing changes, agents must:

1. Explain trade-offs.
2. Explain alternatives.
3. Recommend a preferred option.
4. Keep decisions pragmatic — prefer the simplest solution that scales reasonably.

Do not over-engineer. Avoid unnecessary abstractions, patterns, frameworks, or
dependencies. Think like a long-term maintainer.
