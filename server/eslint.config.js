// Server-specific ESLint overrides
import baseConfig from '../eslint.config.js';
import eslintConfigPrettier from 'eslint-config-prettier';

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
    ignores: ['dist/**', '.wrangler/**', '**/*.test.ts'],
  },
  // Must be last — disables @stylistic rules that conflict with Prettier.
  eslintConfigPrettier,
];
