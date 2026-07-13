import { App } from './app';

describe('App', () => {
  it('should create the app', () => {
    const app = new App();

    expect(app).toBeTruthy();
  });

  it('should expose the default title', () => {
    const app = new App();

    expect((app as App & { title: () => string }).title()).toBe('Application');
  });
});
