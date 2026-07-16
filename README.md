# Task Board

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

## Packages

- [`shared/`](shared/): Shared contracts, Zod schemas, and TypeScript types.
- [`ui/`](ui/): Angular 22 frontend.
- [`server/`](server/): Hono backend on Cloudflare Workers.

## Getting Started

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

## Recommended VS Code Settings

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

**How it works:**

- **TS/JS files** — Prettier formats on save, then ESLint auto-fix applies @stylistic and code-quality rules (ESLint has
  the last word = priority).
- **HTML/JSON/MD/SCSS/CSS** — Prettier formats on save directly.
- **`npm run lint`** — checks both ESLint rules and Prettier formatting for TS/JS/MD files. This is the single command
  used in CI.

**Required VS Code extensions:**

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
