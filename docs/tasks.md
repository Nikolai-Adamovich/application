# Tasks

> Task backlog for implementation agents. Convention: **one task = one branch = one worktree = one agent.** Status:
> `[ ]` pending · `[-]` in progress · `[x]` done.

---

## Foundation

These tasks establish the repo skeleton. They should be executed in order.

- [x] **T-001** Initialize monorepo root: `package.json` (workspaces), base `tsconfig.json`, `.gitignore`,
      `.editorconfig`, `.prettierrc`, ESLint config.
- [x] **T-002** Configure Husky, lint-staged, Commitlint, and Conventional Commits hooks.
- [x] **T-003** Scaffold `shared/` package: `package.json`, `tsconfig.json`, `validation/`, `contracts/`, `types/`
      directories, and a sample schema with inferred type + Vitest test.
- [x] **T-004** Scaffold `server/` package: Hono on Cloudflare Workers, `wrangler.toml`, `tsconfig.json`,
      `nodejs_compat` + `cloudflare:sockets` config, service-oriented folder structure, sample route + service + Vitest.
- [x] **T-005** Scaffold `ui/` package: Angular 22 standalone, zoneless, Spartan UI, Tailwind CSS, SCSS, Vitest config,
      sample standalone component using signals.
- [x] **T-006** Wire `shared` as a workspace dependency in both `ui/` and `server/`; verify types resolve across
      packages.
- [x] **T-007** Create GitHub Actions CI workflow: lint → typecheck → unit tests → build for all packages.
- [x] **T-008** Create GitHub Actions CD workflow: deploy `ui/` to Cloudflare Pages and `server/` to Cloudflare Workers
      after successful CI on main.

---

## Documentation

- [x] **T-009** Complete `server/docs/architecture.md` with actual documentation
- [x] **T-010** Complete `ui/docs/architecture.md` with actual documentation
- [x] **T-011** Add ADR for frontend build and deployment strategy

---

## Infrastructure

- [x] **T-012** Create `.husky/` directory with commit-msg hook
- [x] **T-013** Create `.vscode/extensions.json` with recommended extensions
- [x] **T-014** Add Spartan UI + Tailwind CSS configuration to `angular.json`
- [x] **T-015** Add favicon.svg to `ui/`

---

## Code Quality

- [x] **T-016** Add package-specific ESLint configs for `server/` and `ui/`
- [x] **T-017** Fix UI Resource API to validate responses with shared schema
- [x] **T-018** Complete server routes folder structure (move routes from app.ts)
- [x] **T-019** Add environment variable validation to server

---

## Notes for Implementation Agents

- Read [`AGENTS.md`](../AGENTS.md) and the relevant package `AGENTS.md` first — they define the workflow, shared
  standards, and package-specific rules.
- Every task must leave the package building, lint-clean, and type-checking.
- Commit using Conventional Commits with a package scope (e.g., `feat(server): add auth route`).
