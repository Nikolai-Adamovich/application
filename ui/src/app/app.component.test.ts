import { describe, it, expect } from 'vitest';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('has the default title', () => {
    expect(new AppComponent().title()).toBe('Application');
  });
});
