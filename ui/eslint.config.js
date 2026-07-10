// UI-specific ESLint overrides
import baseConfig from '../eslint.config.js';
import angular from 'angular-eslint';

const toFlatConfigArray = (config) => Array.isArray(config) ? config : [config];

/**
 * Returns a copy of each config object with the given `files` pattern applied.
 * Needed because angular-eslint's shared template configs ship without a
 * `files` filter, which would otherwise make the Angular template parser run
 * on `.ts` files and crash.
 */
const withFiles = (configs, files) => toFlatConfigArray(configs).map((config) => ({ ...config, files }));

export default [
  ...baseConfig,
  ...toFlatConfigArray(angular.configs.tsRecommended),
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      // UI-specific rules
      '@angular-eslint/component-max-inline-declarations': ['error', { animations: 15, styles: 5, template: 5 }],
      '@angular-eslint/component-selector': [
        'error',
        { type: ['attribute', 'element'], prefix: 'ui', style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'ui', style: 'camelCase' }],
    },
    ignores: [
      'dist/**',
      '.angular/**',
    ],
  },
  ...withFiles(angular.configs.templateRecommended, ['**/*.html']),
  ...withFiles(angular.configs.templateAccessibility, ['**/*.html']),
];
