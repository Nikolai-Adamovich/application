# Task Board

> 🌐 **Live application:** [**https://app-board.pages.dev/**](https://app-board.pages.dev/)

**Task Board** is a cloud-based project management platform for task tracking and team collaboration. Organizations
create isolated workspaces to manage multiple projects, plan and prioritize work, assign tasks, and track progress.
Teams organize work using boards and task workflows, collaborate via comments, track deadlines, and monitor project
health through dashboards and reporting.

Built as a multi-tenant SaaS with role-based access control, each user sees only what's relevant to their role. The
modular architecture starts with core project and task management, with optional extensions for analytics, reporting,
time tracking, and integrations.

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
| UI Library      | Spartan UI                                                    |
| Styling         | Tailwind CSS + SCSS (modern `@use` syntax)                    |
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

  // Tailwind CSS IntelliSense recognizes these custom class utility functions
  "tailwindCSS.classFunctions": ["hlm", "cva", "classes"],
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
- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

**💡 Recommended VS Code extensions:**

- [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## 🤖 AI Development

When developing with AI coding agents (e.g. Cursor, Roo Code, Cline, GitHub Copilot), it is recommended to configure
three MCP servers that provide up-to-date documentation and tooling for the technologies used in this project.

### MCP Servers

| Server      | Package                 | Purpose                                                              |
| ----------- | ----------------------- | -------------------------------------------------------------------- |
| Angular CLI | `@angular/cli`          | Angular docs, best practices, project discovery, builds, tests       |
| Spartan UI  | `@spartan-ng/mcp`       | Spartan UI component APIs, blocks, theming, accessibility checks     |
| Context7    | `@upstash/context7-mcp` | Hono, MongoDB, TypeScript, Zod, Vitest, Tailwind CSS, and other libs |

### Configuration

Add the following to your MCP configuration:

```jsonc
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"],
    },
    "spartan-ui": {
      "command": "npx",
      "args": ["-y", "@spartan-ng/mcp"],
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
    },
  },
}
```

### What each server provides

- **Angular CLI** — search angular.dev docs, retrieve best practices, discover workspaces/projects, run build/test/lint
  targets, and manage the dev server lifecycle.
- **Spartan UI** — list and inspect components and blocks, fetch official docs (installation, theming, dark mode),
  analyse dependencies, and verify accessibility features.
- **Context7** — resolve any library to a Context7-compatible ID and retrieve current documentation and code snippets.
  Used for Hono, MongoDB, TypeScript, Zod, Vitest, Tailwind CSS, and any other dependency not covered by the two
  specialised servers above.

See [`AGENTS.md`](AGENTS.md) for full details on how AI agents should use these servers during development.
