import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.yarn/**',
      '**/volumes/**',
      '**/jest.config.cjs',   // ← добавили
      '**/*.cjs',            // ← на всякий случай — все CommonJS-файлы
      '**/eslint.config.js', // ← сам конфиг ESLint не нужно линтить
    ],
  },
);