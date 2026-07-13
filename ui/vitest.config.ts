import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
  },
  resolve: {
    alias: {
      '@app/shared': new URL('../shared/src/index.ts', import.meta.url).pathname,
    },
  },
});
