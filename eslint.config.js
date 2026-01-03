import js from '@eslint/js';
import globals from 'globals';

const baseRules = js.configs.recommended.rules;

export default [
  {
    ignores: ['artifacts/**', 'node_modules/**']
  },
  {
    files: ['src/**/*.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.es2022,
        ...globals.node
      }
    },
    rules: {
      ...baseRules
    }
  },
  {
    files: ['web/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022
      }
    },
    rules: {
      ...baseRules
    }
  }
];
