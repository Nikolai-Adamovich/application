# UI Architecture

Frontend-specific design notes. For the full monorepo architecture, see
[`docs/architecture.md`](../../docs/architecture.md). For operational rules, see [`ui/AGENTS.md`](../AGENTS.md).

## Feature Folder Structure and Naming Conventions

```
ui/src/
├── main.ts              Application bootstrap (bootstrapApplication)
├── index.html           HTML entry point
├── styles.css           Global styles + CSS custom properties
├── test-setup.ts        Vitest setup (imports @angular/compiler)
└── app/
    ├── app.ts           Root standalone component
    ├── app.html         Root template
    ├── app.scss         Root styles
    ├── app.config.ts    Application providers (router, error listeners)
    ├── app.routes.ts    Route definitions
    └── app.spec.ts      Root component test
```

**Naming conventions** (Angular 22 suffix-less, matching [`ui/AGENTS.md`](../AGENTS.md#naming-conventions)):

| Element   | File name            | Example              |
| --------- | -------------------- | -------------------- |
| Component | `<name>.ts`          | `counter.ts`         |
| Service   | `<name>.service.ts`  | `counter.service.ts` |
| Resource  | `<name>.resource.ts` | `health.resource.ts` |
| Test      | `<name>.spec.ts`     | `counter.spec.ts`    |

> Do **not** use the legacy `*.component.ts` suffix for components.

## Signal-Based State Management

**State ownership:** Services own state; components consume signals from services.

**Pattern:** Use the `@Service` decorator to register singleton services. Services expose readonly signals and mutation
methods. Components inject services and consume their signals in templates.

> For detailed Signal Forms API, `computed()`, `effect()`, and signal best practices, use the Angular CLI MCP tools
> documented in [`AGENTS.md`](../AGENTS.md#documentation-lookup).

## Data Fetching

Use `httpResource` as the primary data-fetching tool. Validate responses with shared Zod schemas from `@app/shared`.

> For `httpResource` usage patterns and `rxResource` integration, use the Angular CLI MCP tools documented in
> [`AGENTS.md`](../AGENTS.md#documentation-lookup).

## Styling Stack

**Styling stack:** Tailwind CSS v4 is the primary styling approach. Spartan UI provides accessible, unstyled component
primitives (helm components). SCSS is used for component-level styles that cannot be expressed with utilities.

**Styles structure:**

- [`src/styles.css`](../src/styles.css) — Global styles, Tailwind CSS imports, CSS custom properties (plain CSS, not
  SCSS)
- Component styles — inline (`styles: [...]`) or external (`styleUrl`) using SCSS
- Use modern Sass `@use` syntax — never global `@import`

> For Tailwind CSS configuration and advanced styling patterns, use the Context7 MCP tools documented in
> [`AGENTS.md`](../AGENTS.md#documentation-lookup).

## Spartan UI

Spartan UI components are generated into [`libs/ui/`](../libs/ui/) and consumed via path aliases configured in
[`tsconfig.json`](../tsconfig.json).

**Generate a component** (run from the `ui/` directory):

```bash
npx ng g @spartan-ng/cli:ui <component-name>
```

This creates the component source under `libs/ui/<component>/` and registers the path alias
`@spartan-ng/helm/<component>` in `tsconfig.json`.

**Import in your component:**

```typescript
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  imports: [HlmButtonImports],
  // ...
})
```

The import name follows the pattern `Hlm<ComponentName>Imports` (e.g. `HlmButtonImports`, `HlmAlertDialogImports`).

> **Note:** If Tailwind styles are not applied to a new component, ensure that the `libs/` directory is listed in the
> `@source` directive in [`src/styles.css`](../src/styles.css:6). This tells Tailwind to scan the component source files
> for utility classes used by `class-variance-authority` (CVA).

> For Spartan UI component APIs, blocks, theming, dark mode, and accessibility, use the Spartan UI MCP tools documented
> in [`AGENTS.md`](../AGENTS.md#documentation-lookup).

## Routing and Lazy-Loading Strategy

**Routing:** Configured via `provideRouter(routes)` in [`app.config.ts`](../src/app/app.config.ts), not in `main.ts`.

**Lazy loading:** Use `loadComponent` for feature routes in [`app.routes.ts`](../src/app/app.routes.ts):

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
  },
];
```

Use `@defer` for non-critical content within templates:

```html
@defer (on viewport) {
<ui-heavy-component />
}
```

## Vitest Test Inventory

- **Components:** `src/app/*.spec.ts`
- **Resources:** `src/app/data/*.spec.ts` (planned)
- **Services:** `src/app/services/*.spec.ts` (planned)

Tests use Vitest with `jsdom` environment. Use `TestBed` from `@angular/core/testing` for component tests requiring
dependency injection. See [`ui/AGENTS.md`](../AGENTS.md#testing) for the full testing guide.
