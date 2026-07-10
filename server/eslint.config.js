// Server-specific ESLint overrides
import baseConfig from '../eslint.config.js';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      // Server-specific rules
      '@typescript-eslint/no-explicit-any': 'error',
    },
    ignores: [
      'dist/**',
      '.wrangler/**',
      '**/*.test.ts',
    ],
  },
];
