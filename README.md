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
