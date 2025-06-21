// eslint.config.js
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default [
  // Archivos a ignorar
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.astro/**',
      '.vercel/**',
      '.netlify/**',
      'pnpm-lock.yaml',
      'package-lock.json',
      'yarn.lock',
    ],
  },
  // Configuración básica de ESLint
  eslint.configs.recommended,
  // Integración con Prettier (debe ir al final)
  eslintConfigPrettier,
];
