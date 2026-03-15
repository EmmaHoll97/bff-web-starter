import js from '@eslint/js';

export default [
  { ignores: ['dist', 'node_modules'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
    },
    rules: {
      'no-unused-vars': 'warn',
    },
  },
];
