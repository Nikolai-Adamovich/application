# UI Architecture

Frontend-specific design notes. For the full monorepo architecture, see
[`docs/architecture.md`](../../docs/architecture.md). For operational rules, see [`ui/AGENTS.md`](../AGENTS.md).

## Feature Folder Structure and Naming Conventions

```
ui/src/
├── main.ts              Application bootstrap (bootstrapApplication)
├── index.html           HTML entry point
├── styles.scss          Global styles + CSS custom properties
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

## Signal-Based State Management Patterns

**State ownership:** Services own state; components consume signals from services.

**Pattern** (using the `@Service` decorator):

```typescript
import { Service } from '@angular/core';

@Service()
export class CounterService {
  private readonly _count = signal(0);
  readonly count = this._count.asReadonly();

  increment(): void {
    this._count.update((n) => n + 1);
  }
}
```

**Component consumption:**

```typescript
import { Component, inject } from '@angular/core';

@Component({
  selector: 'ui-counter',
  template: `Count: {{ count() }}`,
})
export class Counter {
  readonly count = inject(CounterService).count;
}
```

> Note: `standalone: true` and `changeDetection: ChangeDetectionStrategy.OnPush` are omitted — they are defaults in
> Angular 22+.

## Data Fetching with `httpResource`

Use [`httpResource`](../AGENTS.md#data-fetching--mutations) as the primary data-fetching tool. Validate responses with
shared Zod schemas from `@app/shared`:

```typescript
import { httpResource } from '@angular/common/http';
import { healthSchema } from '@app/shared';

export class HealthResource {
  readonly health = httpResource(() => '/api/health', {
    parse: (raw) => healthSchema.parse(raw),
  });
}
```

**Template usage:**

```html
@if (health.value(); as data) {
<p>Status: {{ data.status }}</p>
} @else if (health.isLoading()) {
<p>Loading…</p>
} @else if (health.error(); as error) {
<p>Error: {{ error.message }}</p>
}
```

## PrimeNG Theming and SCSS Organization

**Theme:** Configured at the build level in [`angular.json`](../angular.json).

**SCSS structure:**

- [`src/styles.scss`](../src/styles.scss) — Global styles, CSS custom properties
- Component styles — inline (`styles: [...]`) or external (`styleUrl`)
- Use modern Sass `@use` syntax — never global `@import`

**PrimeNG modules:** Import only needed modules in components:

```typescript
import { ButtonModule } from 'primeng/button';

@Component({
  imports: [ButtonModule],
  // ...
})
```

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
