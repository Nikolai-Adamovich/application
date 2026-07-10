import { ChangeDetectionStrategy, Component, signal, type OnInit } from '@angular/core';

/**
 * Root standalone component.
 *
 * Demonstrates the required frontend patterns:
 * - Standalone component (no NgModule)
 * - Signals for state
 * - Zoneless change detection
 */
@Component({
  selector: 'ui-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <h1>{{ title() }}</h1>
    </main>
  `,
})
export class AppComponent implements OnInit {
  readonly title = signal('Application');

  ngOnInit() {
    console.warn('AppComponent initialized');
  }
}
