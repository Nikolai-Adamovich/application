# Application Monorepo

A greenfield educational full-stack application.

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
