import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      '@app/shared': new URL('../shared/src/index.ts', import.meta.url).pathname,
    },
  },
});
