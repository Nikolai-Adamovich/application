# UI Architecture

Frontend-specific design notes. For the full monorepo architecture, see
[`docs/architecture.md`](../../docs/architecture.md).

## Feature Folder Structure and Naming Conventions

```
ui/src/
├── main.ts              Application bootstrap
├── index.html           HTML entry point
├── styles.scss          Global styles
├── test-setup.ts        Vitest test setup
└── app/
    ├── app.component.ts Root standalone component
    ├── app.component.test.ts
    └── data/
        └── (data resources) Data fetching resources
```

**Naming conventions:**

- Standalone components: `*.component.ts`
- Services: `*.service.ts`
- Resources: `*.resource.ts`
- Tests: `*.test.ts`

## Signal-Based State Management Patterns

**State ownership:** Services own state; components consume signals from services.

**Pattern:**

```typescript
@Injectable({ providedIn: 'root' })
export class CounterService {
  private _count = signal(0);
  readonly count = this._count.asReadonly();

  increment() {
    this._count.update((n) => n + 1);
  }
}
```

**Component consumption:**

```typescript
@Component({
  template: `Count: {{ count() }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent {
  readonly count = inject(CounterService).count;
}
```

## Resource API Usage and Error Handling

The Resource API provides declarative data fetching with built-in loading/error states:

```typescript
export class HealthResource {
  readonly health = resource<Health>({
    loader: async () => {
      const res = await fetch('/health');
      if (!res.ok) throw new Error('Failed');
      return healthSchema.parse(await res.json());
    },
  });
}
```

**Template usage:**

```html
@if (health.value(); as health) {
<p>Status: {{ health.status }}</p>
} @else if (health.isLoading()) {
<p>Loading…</p>
} @else if (health.error(); as error) {
<p>Error: {{ error.message }}</p>
}
```

## PrimeNG Theming and SCSS Organization

**Theme:** Lara Light Blue (PrimeNG's default light theme)

**SCSS structure:**

- `src/styles.scss` — Global styles, CSS custom properties
- Component styles — Inline in `@Component` decorators

**PrimeNG modules:** Import only needed modules in components:

```typescript
import { ButtonModule } from 'primeng/button';

@Component({
  imports: [ButtonModule],
  // ...
})
```

## Routing and Lazy-Loading Strategy with `@defer`

**Routing:** Standalone components with `provideRouter` in `main.ts`

**Lazy loading:** Use `@defer` for non-critical content:

```html
@defer (viewport) {
<app-heavy-component />
}
```

## Vitest Test Inventory

- **Components:** `src/app/*.test.ts`
- **Resources:** `src/app/data/*.test.ts`
- **Services:** `src/app/services/*.test.ts` (planned)

Tests use Vitest with `jsdom` environment. Use `TestBed` from `@angular/core/testing` for component tests requiring
dependency injection.
