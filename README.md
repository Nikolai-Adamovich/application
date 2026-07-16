# Task Board

> 🌐 **Live application:** [**https://app-board.pages.dev/**](https://app-board.pages.dev/)

**Task Board** is a cloud-based platform for project management, task tracking, and team collaboration.

The platform enables organizations to create dedicated workspaces, manage multiple projects, plan and prioritize work,
assign tasks, and monitor progress through a centralized environment. Each customer operates within an isolated
workspace with configurable users, roles, permissions, and project-level access controls.

**Task Board** provides teams with tools for organizing work using boards and task workflows, collaborating through
comments and discussions, tracking deadlines, and maintaining visibility across ongoing initiatives. Managers and
stakeholders can monitor project health, team workload, task completion rates, and key performance indicators through
dashboards and reporting tools.

Designed for organizations of all sizes, the platform supports multi-project environments where users may have access to
specific projects or entire workspaces depending on their responsibilities. Flexible role-based access control ensures
that each user can view and manage only the information relevant to their role.

**Task Board** is built as a multi-tenant SaaS platform with a modular architecture. The core product focuses on project
and task management, while additional modules can extend the platform with advanced analytics, reporting, knowledge
management, time tracking, integrations, and other business capabilities.

The goal of **Task Board** is to provide organizations with a single, scalable workspace for planning, coordinating, and
delivering work efficiently across teams and projects.

## 📦 Packages

- [`shared/`](shared/): Shared contracts, Zod schemas, and TypeScript types.
- [`ui/`](ui/): Angular frontend.
- [`server/`](server/): Hono backend on Cloudflare Workers.

## 🚀 Getting Started

1.  **Prerequisites:** Node.js v24+ and npm.
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Development:**
    - Run all typechecks: `npm run typecheck`
    - Run all tests: `npm run test`
    - Lint the monorepo: `npm run lint`

See [`docs/`](docs/) for the full architectural documentation and development workflows.

## 🛠️ Tech Stack

### Frontend — [`ui/`](ui/)

| Concern         | Technology                                                    |
| --------------- | ------------------------------------------------------------- |
| Framework       | Angular (standalone components, zoneless)                     |
| Language        | TypeScript (strict mode)                                      |
| UI Library      | PrimeNG                                                       |
| Styling         | SCSS (modern `@use` syntax)                                   |
| State           | Angular Signals (signal inputs, signal queries, signal forms) |
| Data Fetching   | `httpResource`                                                |
| Template Syntax | Native control flow (`@if`, `@for`, `@switch`, `@defer`)      |
| Unit Testing    | Vitest (`jsdom`)                                              |
| E2E Testing     | Playwright                                                    |
| Linting         | ESLint + angular-eslint + Prettier                            |
| Deployment      | Cloudflare Pages (static build)                               |

### Backend — [`server/`](server/)

| Concern       | Technology                                     |
| ------------- | ---------------------------------------------- |
| Runtime       | Cloudflare Workers (V8 isolates, edge runtime) |
| Framework     | Hono                                           |
| Language      | TypeScript (strict mode)                       |
| Database      | MongoDB Atlas                                  |
| Driver        | Official MongoDB Node Driver                   |
| Validation    | Zod (schemas shared from `@app/shared`)        |
| TCP Transport | `cloudflare:sockets` + `nodejs_compat`         |
| Unit Testing  | Vitest (Node environment)                      |
| Linting       | ESLint + Prettier                              |
| Deployment    | Cloudflare Workers (via Wrangler)              |

### Shared — [`shared/`](shared/)

| Concern   | Technology                                     |
| --------- | ---------------------------------------------- |
| Schemas   | Zod (single source of truth)                   |
| Types     | `z.infer` (derived from Zod schemas)           |
| Contracts | API route definitions, request/response shapes |

### Infrastructure & Tooling

| Concern        | Technology                                                                     |
| -------------- | ------------------------------------------------------------------------------ |
| Monorepo       | npm workspaces (`shared`, `ui`, `server`)                                      |
| Language       | TypeScript (strict mode, `verbatimModuleSyntax`, `exactOptionalPropertyTypes`) |
| Source Control | Git + GitHub                                                                   |
| CI             | GitHub Actions (`lint → typecheck → test → build`)                             |
| CD             | GitHub Actions (auto-deploy `main` to Cloudflare Pages + Workers)              |
| Code Quality   | ESLint + Prettier + custom ESLint rules                                        |
| Git Hooks      | Husky + lint-staged (pre-commit) + Commitlint (commit-msg)                     |
| Commits        | Conventional Commits                                                           |
| Testing        | Vitest (all packages) + Playwright (UI E2E)                                    |
| Node.js        | `>=24.18.0`                                                                    |

### Architecture & Methodology

- **Multi-tenant SaaS** — isolated workspaces per customer with RBAC
- **Monorepo** — single repo, shared contracts, no DTO duplication
- **Edge-first backend** — Cloudflare Workers with MongoDB over TCP via `cloudflare:sockets`
- **Signal-based state** — Angular Signals as the sole state management primitive
- **Schema-first contracts** — Zod schemas in `shared/` are the single source of truth; types inferred via `z.infer`
- **Thin edges, rich services** — route handlers and component templates are thin; business logic lives in injectable
  services
- **Service-oriented layering** — `routes → services → data` (backend), `components → services → resources` (frontend)
- **Strict TypeScript everywhere** — `strict`, `noImplicitAny`, `strictNullChecks`, no `any`

## ⚙️ Recommended VS Code Settings

Create `.vscode/settings.json` in the project root with the following content. This file is gitignored — each developer
maintains their own copy.

```jsonc
{
  // ESLint validates JS, TS and Angular HTML templates
  "eslint.validate": ["javascript", "typescript", "html"],

  // ESLint auto-fix runs on every save (includes Prettier rules for TS/JS)
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always",
  },

  // Prettier is the default formatter; formats on save for all file types
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
}
```

**🔧 How it works:**

- **TS/JS files** — Prettier formats on save, then ESLint auto-fix applies @stylistic and code-quality rules (ESLint has
  the last word = priority).
- **HTML/JSON/MD/SCSS/CSS** — Prettier formats on save directly.
- **`npm run lint`** — checks both ESLint rules and Prettier formatting for TS/JS/MD files. This is the single command
  used in CI.

**🧩 Required VS Code extensions:**

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
