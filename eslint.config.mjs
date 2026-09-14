import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import playwrightPlugin from 'eslint-plugin-playwright';
import globals from 'globals';

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      '*.config.js',
      '*.config.mjs',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    ...playwrightPlugin.configs['flat/recommended'],
    // Teilnehmer-Tests und Musterlösungen (inkl. Page Objects und Fixtures)
    files: ['e2e/**/*.{ts,tsx}', 'solutions/**/*.ts'],
    languageOptions: {
      ...playwrightPlugin.configs['flat/recommended'].languageOptions,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...playwrightPlugin.configs['flat/recommended'].rules,
      // Playwrights Fixture-Funktion `use` ist kein React-Hook
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      // Workshop-Botschaften: User-facing Locators, keine festen Zeitwerte, Skips begründen
      // <html>/<body> haben keine semantische Alternative (Theme-Klasse, Klick auf den Hintergrund)
      'playwright/no-raw-locators': ['warn', { allowed: ['html', 'body'] }],
      'playwright/no-magic-timeouts': 'warn',
      'playwright/require-annotation-reason': 'warn',
      // test.skip(browserName === 'webkit', 'Grund') ist legitim
      'playwright/no-skipped-test': ['warn', { allowConditional: true }],
    },
    settings: {
      playwright: {
        // Eigene test.extend()-Instanzen in der Fixtures-Lösung (Übung 8)
        globalAliases: { test: ['testWithHelpers'] },
      },
    },
  },
];
